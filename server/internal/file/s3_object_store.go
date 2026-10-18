package file

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
)

// s3Timeout bounds one call to the store.
const s3Timeout = 30 * time.Second

// S3Config reaches an S3-compatible store: AWS S3, Cloudflare R2, Garage,
// SeaweedFS, MinIO. It is configured when Bucket is set.
type S3Config struct {
	// Endpoint is the store's URL; empty for AWS S3 itself.
	Endpoint string
	Region   string
	Bucket   string
	// AccessKeyID and SecretAccessKey sign every request; the secret is read
	// from the secrets directory.
	AccessKeyID     string
	SecretAccessKey string
	// PathStyle addresses the bucket in the path (endpoint/bucket/key), which
	// self-hosted stores need, rather than in the host name.
	PathStyle bool
}

func (c S3Config) configured() bool { return c.Bucket != "" }

var errS3NotConfigured = errors.New("the S3 store is not configured")

// s3ObjectStore keeps files in one bucket of an S3-compatible store, through
// AWS's SDK, as Memos does.
type s3ObjectStore struct {
	client *s3.Client
	bucket string
}

// newS3ObjectStore returns the store, which answers errS3NotConfigured on
// every call when cfg is not configured: photos already kept there stay
// unreadable rather than the service refusing to start.
func newS3ObjectStore(cfg S3Config) s3ObjectStore {
	if !cfg.configured() {
		return s3ObjectStore{}
	}

	client := s3.New(s3.Options{
		Region:      cfg.Region,
		Credentials: credentials.NewStaticCredentialsProvider(cfg.AccessKeyID, cfg.SecretAccessKey, ""),
		HTTPClient:  &http.Client{Timeout: s3Timeout},
		BaseEndpoint: func() *string {
			if cfg.Endpoint == "" {
				return nil
			}

			return aws.String(cfg.Endpoint)
		}(),
		UsePathStyle: cfg.PathStyle,
		// Checksums only where the API requires them: several S3-compatible
		// stores refuse the trailing checksums the SDK otherwise adds.
		RequestChecksumCalculation: aws.RequestChecksumCalculationWhenRequired,
		ResponseChecksumValidation: aws.ResponseChecksumValidationWhenRequired,
	})

	return s3ObjectStore{client: client, bucket: cfg.Bucket}
}

// check tells whether the bucket answers, so a wrong configuration stops the
// service at startup rather than at the first upload.
func (s s3ObjectStore) check(ctx context.Context) error {
	if s.client == nil {
		return errS3NotConfigured
	}

	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	if _, err := s.client.HeadBucket(ctx, &s3.HeadBucketInput{Bucket: &s.bucket}); err != nil {
		return fmt.Errorf("reaching the S3 bucket: %w", err)
	}

	return nil
}

func (s s3ObjectStore) Put(ctx context.Context, key string, o object) error {
	if s.client == nil {
		return errS3NotConfigured
	}

	_, err := s.client.PutObject(ctx, &s3.PutObjectInput{
		Bucket: &s.bucket, Key: &key, Body: bytes.NewReader(o.data),
		ContentType: &o.contentType, ContentLength: aws.Int64(int64(len(o.data))),
	})
	if err != nil {
		return fmt.Errorf("storing %s: %w", key, err)
	}

	return nil
}

func (s s3ObjectStore) Get(ctx context.Context, key string) (object, error) {
	if s.client == nil {
		return object{}, errS3NotConfigured
	}

	out, err := s.client.GetObject(ctx, &s3.GetObjectInput{Bucket: &s.bucket, Key: &key})

	if _, missing := errors.AsType[*types.NoSuchKey](err); missing {
		return object{}, errObjectNotFound
	}

	if err != nil {
		return object{}, fmt.Errorf("reading %s: %w", key, err)
	}

	defer func() { _ = out.Body.Close() }()

	data, err := io.ReadAll(out.Body)
	if err != nil {
		return object{}, fmt.Errorf("reading %s: %w", key, err)
	}

	return object{contentType: aws.ToString(out.ContentType), data: data}, nil
}

func (s s3ObjectStore) Delete(ctx context.Context, key string) error {
	if s.client == nil {
		return errS3NotConfigured
	}

	if _, err := s.client.DeleteObject(ctx, &s3.DeleteObjectInput{Bucket: &s.bucket, Key: &key}); err != nil {
		return fmt.Errorf("deleting %s: %w", key, err)
	}

	return nil
}
