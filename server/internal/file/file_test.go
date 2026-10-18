package file_test

import (
	"bytes"
	"context"
	"errors"
	"image"
	"image/color"
	"image/jpeg"
	"image/png"
	"testing"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/file"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
)

// TestFile runs the module's checks in parallel against one PostgreSQL,
// each with accounts of its own.
func TestFile(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)

	photos, err := file.NewService(t.Context(), pool, file.Config{}, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	for name, check := range map[string]func(*testing.T, *file.Service, *pgxpool.Pool){
		"an uploaded photo is served in both sizes":       testUploadedPhotoIsServed,
		"only the uploader claims a photo":                testOnlyTheUploaderClaims,
		"an account holds at most 20 unused files":        testUnusedPhotoLimit,
		"an account uploads at most 100 files a day":      testDailyPhotoLimit,
		"uploads need a caller and an image within 10 MB": testUploadNeedsCallerAndImage,
	} {
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			check(t, photos, pool)
		})
	}
}

func TestUnknownStoreIsRefused(t *testing.T) {
	t.Parallel()

	if _, err := file.NewService(t.Context(), nil, file.Config{Store: "ftp"}, platformtest.Logger()); err == nil {
		t.Fatal("a store without an implementation was accepted")
	}
}

// as returns a context whose caller is a new account.
func as(t *testing.T) (context.Context, uuid.UUID) {
	t.Helper()

	id := uuid.New()

	return platform.WithCaller(t.Context(), platform.Caller{AccountID: id, SessionID: uuid.New(), Role: platform.RoleCustomer}), id
}

func photoData(t *testing.T) []byte {
	t.Helper()

	img := image.NewNRGBA(image.Rect(0, 0, 40, 30))
	for i := range img.Pix {
		img.Pix[i] = 0xC0
	}

	var buf bytes.Buffer
	if err := png.Encode(&buf, img); err != nil {
		t.Fatal(err)
	}

	return buf.Bytes()
}

func testUploadedPhotoIsServed(t *testing.T, photos *file.Service, _ *pgxpool.Pool) {
	t.Helper()

	ctx, _ := as(t)

	p, err := photos.Upload(ctx, photoData(t))
	if err != nil {
		t.Fatal(err)
	}

	if p.Width != 40 || p.Height != 30 {
		t.Fatalf("uploaded %+v", p)
	}

	for _, size := range []file.Size{file.SizeLarge, file.SizeSmall} {
		data, err := photos.File(t.Context(), p.ID, size)
		if err != nil {
			t.Fatal(err)
		}

		img, err := jpeg.Decode(bytes.NewReader(data))
		if err != nil {
			t.Fatalf("the %d px photo is not a JPEG: %v", size, err)
		}

		if c, _ := color.GrayModel.Convert(img.At(20, 15)).(color.Gray); c.Y < 0xB0 || c.Y > 0xD0 {
			t.Fatalf("the photo's colour changed to %v", c)
		}
	}

	if _, err := photos.File(t.Context(), uuid.New(), file.SizeSmall); !errors.Is(err, file.ErrPhotoNotFound) {
		t.Fatalf("an unknown photo: %v", err)
	}

	if got := file.Path(p.ID, file.SizeSmall); got != "/photos/"+p.ID.String()+"/400.jpg" {
		t.Fatalf("path %s", got)
	}
}

func testOnlyTheUploaderClaims(t *testing.T, photos *file.Service, _ *pgxpool.Pool) {
	t.Helper()

	ctx, uploader := as(t)
	_, other := as(t)

	p, err := photos.Upload(ctx, photoData(t))
	if err != nil {
		t.Fatal(err)
	}

	if err := photos.Claim(t.Context(), p.ID, other); !errors.Is(err, file.ErrPhotoNotFound) {
		t.Fatalf("claimed by another account: %v", err)
	}

	for range 2 {
		if err := photos.Claim(t.Context(), p.ID, uploader); err != nil {
			t.Fatalf("claimed by its uploader: %v", err)
		}
	}

	if err := photos.Claim(t.Context(), uuid.New(), uploader); !errors.Is(err, file.ErrPhotoNotFound) {
		t.Fatalf("an unknown photo claimed: %v", err)
	}
}

func testUnusedPhotoLimit(t *testing.T, photos *file.Service, _ *pgxpool.Pool) {
	t.Helper()

	ctx, uploader := as(t)
	data := photoData(t)

	var first file.Photo

	for i := range 20 {
		p, err := photos.Upload(ctx, data)
		if err != nil {
			t.Fatalf("upload %d: %v", i+1, err)
		}

		if i == 0 {
			first = p
		}
	}

	if _, err := photos.Upload(ctx, data); !errors.Is(err, file.ErrUnusedLimit) {
		t.Fatalf("the 21st unused photo: %v", err)
	}

	if err := photos.Claim(t.Context(), first.ID, uploader); err != nil {
		t.Fatal(err)
	}

	if _, err := photos.Upload(ctx, data); err != nil {
		t.Fatalf("after using one: %v", err)
	}
}

func testDailyPhotoLimit(t *testing.T, photos *file.Service, _ *pgxpool.Pool) {
	t.Helper()

	ctx, uploader := as(t)
	data := photoData(t)

	// Each is used at once, as an owner setting photo after photo on a seller.
	for i := range 100 {
		p, err := photos.Upload(ctx, data)
		if err != nil {
			t.Fatalf("upload %d: %v", i+1, err)
		}

		if err := photos.Claim(t.Context(), p.ID, uploader); err != nil {
			t.Fatal(err)
		}
	}

	if _, err := photos.Upload(ctx, data); !errors.Is(err, file.ErrDailyLimit) {
		t.Fatalf("the 101st photo of the day: %v", err)
	}
}

func testUploadNeedsCallerAndImage(t *testing.T, photos *file.Service, _ *pgxpool.Pool) {
	t.Helper()

	if _, err := photos.Upload(t.Context(), photoData(t)); !errors.Is(err, platform.ErrAuthenticationRequired) {
		t.Fatalf("without a caller: %v", err)
	}

	ctx, _ := as(t)

	for name, data := range map[string][]byte{
		"empty":   nil,
		"text":    []byte("hello"),
		"too big": make([]byte, file.MaxUploadBytes+1),
	} {
		if _, err := photos.Upload(ctx, data); !errors.Is(err, file.ErrPhotoInvalid) {
			t.Errorf("%s: %v", name, err)
		}
	}
}
