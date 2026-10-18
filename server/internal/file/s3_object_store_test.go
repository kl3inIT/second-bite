package file_test

import (
	"bytes"
	"errors"
	"image/jpeg"
	"testing"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/wait"

	"github.com/kl3inIT/second-bite/server/internal/file"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
)

// startS3 starts the S3-compatible store of compose.yaml, VersityGW, an S3
// gateway over a directory standing in for R2, Garage or AWS S3, with one
// bucket, and returns its configuration.
func startS3(t *testing.T) file.S3Config {
	t.Helper()

	cfg := file.S3Config{
		Region: "us-east-1", Bucket: "secondbite-test", AccessKeyID: "test-key", SecretAccessKey: "test-only-secret",
		PathStyle: true,
	}

	gw, err := testcontainers.Run(t.Context(), platformtest.Image(t, "s3"),
		testcontainers.WithExposedPorts("7070/tcp"),
		testcontainers.WithCmd("--access", cfg.AccessKeyID, "--secret", cfg.SecretAccessKey, "--port", ":7070", "posix", "/tmp"),
		testcontainers.WithWaitStrategy(wait.ForListeningPort("7070/tcp")),
	)
	testcontainers.CleanupContainer(t, gw)

	if err != nil {
		t.Fatal(err)
	}

	endpoint, err := gw.PortEndpoint(t.Context(), "7070/tcp", "http")
	if err != nil {
		t.Fatal(err)
	}

	cfg.Endpoint = endpoint

	client := s3.New(s3.Options{
		Region: cfg.Region, BaseEndpoint: aws.String(endpoint), UsePathStyle: true,
		Credentials: credentials.NewStaticCredentialsProvider(cfg.AccessKeyID, cfg.SecretAccessKey, ""),
	})

	if _, err := client.CreateBucket(t.Context(), &s3.CreateBucketInput{Bucket: aws.String(cfg.Bucket)}); err != nil {
		t.Fatal(err)
	}

	return cfg
}

// TestS3Store keeps photos in an S3-compatible store, and reads a photo kept
// in PostgreSQL before the switch from there.
func TestS3Store(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)
	s3cfg := startS3(t)

	before, err := file.NewService(t.Context(), pool, file.Config{}, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	ctx, _ := as(t)

	old, err := before.Upload(ctx, photoData(t))
	if err != nil {
		t.Fatal(err)
	}

	files, err := file.NewService(t.Context(), pool, file.Config{Store: file.StoreS3, S3: s3cfg}, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	p, err := files.Upload(ctx, photoData(t))
	if err != nil {
		t.Fatal(err)
	}

	for _, id := range []struct {
		name string
		p    file.Photo
	}{{"in S3", p}, {"kept in PostgreSQL before the switch", old}} {
		data, err := files.File(t.Context(), id.p.ID, file.SizeSmall)
		if err != nil {
			t.Fatalf("a photo %s: %v", id.name, err)
		}

		if _, err := jpeg.Decode(bytes.NewReader(data)); err != nil {
			t.Fatalf("a photo %s is not a JPEG: %v", id.name, err)
		}
	}

	// Only the S3 store holds the new photo: PostgreSQL alone cannot read it.
	if _, err := before.File(t.Context(), p.ID, file.SizeSmall); err == nil {
		t.Fatal("a photo kept in S3 was read without it")
	}
}

func TestS3StoreMustAnswer(t *testing.T) {
	t.Parallel()

	for name, cfg := range map[string]file.Config{
		"s3 without a bucket": {Store: file.StoreS3},
		"a bucket that does not answer": {Store: file.StoreS3, S3: file.S3Config{
			Endpoint: "http://127.0.0.1:1", Region: "us-east-1", Bucket: "b", AccessKeyID: "k", SecretAccessKey: "s", PathStyle: true,
		}},
	} {
		if _, err := file.NewService(t.Context(), nil, cfg, platformtest.Logger()); err == nil {
			t.Errorf("%s: the service started", name)
		} else if errors.Is(err, file.ErrPhotoInvalid) {
			t.Errorf("%s: %v", name, err)
		}
	}
}
