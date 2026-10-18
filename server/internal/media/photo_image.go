package media

import (
	"bytes"
	"fmt"
	"image"
	"image/color"
	"image/jpeg"

	"github.com/disintegration/imaging"
	// WebP is read, never written: every photo is served as JPEG.
	_ "golang.org/x/image/webp"
)

const (
	// maxPixels refuses an image that would take too much memory to decode,
	// such as a small file that declares an enormous size. Decoding and
	// turning a photo hold two copies of 4 bytes a pixel, about 200 MB at
	// this bound; phones save 12-megapixel photos unless told otherwise.
	maxPixels = 24_000_000
	// jpegQuality keeps a photo of food sharp at a fraction of its size.
	jpegQuality = 82
)

// Size is one of the sizes a photo is served in: the longer side in pixels.
type Size int

// The sizes of every photo, as Open Food Network serves each image in fixed
// sizes: one for an offer's page, one for lists.
const (
	SizeLarge Size = 1600
	SizeSmall Size = 400
)

var sizes = []Size{SizeLarge, SizeSmall}

// acceptedFormats are the formats a photo may arrive in, as image.DecodeConfig
// names them. iPhone browsers send HEIC photos as JPEG.
var acceptedFormats = map[string]bool{"jpeg": true, "png": true, "webp": true}

// rendered is an uploaded image written again as JPEG in every size.
type rendered struct {
	width, height int
	files         map[Size][]byte
}

// render decodes an uploaded image, turns it the way it was taken, and writes
// it again as JPEG in every size. Writing it again leaves out its metadata,
// such as where it was taken and with which phone.
func render(data []byte) (rendered, error) {
	cfg, format, err := image.DecodeConfig(bytes.NewReader(data))
	if err != nil || !acceptedFormats[format] {
		return rendered{}, ErrPhotoInvalid
	}

	if cfg.Width <= 0 || cfg.Height <= 0 || cfg.Width*cfg.Height > maxPixels {
		return rendered{}, ErrPhotoInvalid
	}

	// The orientation a phone records in EXIF is applied before the
	// metadata is dropped, as PocketBase and Memos do.
	img, err := imaging.Decode(bytes.NewReader(data), imaging.AutoOrientation(true))
	if err != nil {
		return rendered{}, ErrPhotoInvalid
	}

	bounds := img.Bounds()
	out := rendered{width: bounds.Dx(), height: bounds.Dy(), files: make(map[Size][]byte, len(sizes))}

	for _, size := range sizes {
		// Fit only shrinks: a small image keeps its size.
		resized := flattened(imaging.Fit(img, int(size), int(size), imaging.Lanczos))

		var buf bytes.Buffer
		if err := jpeg.Encode(&buf, resized, &jpeg.Options{Quality: jpegQuality}); err != nil {
			return rendered{}, fmt.Errorf("writing the %d px photo: %w", size, err)
		}

		out.files[size] = buf.Bytes()
	}

	return out, nil
}

// flattened lays a transparent image on white, since JPEG has no
// transparency. It runs on the resized image, so it copies little.
func flattened(img *image.NRGBA) image.Image {
	if img.Opaque() {
		return img
	}

	b := img.Bounds()

	return imaging.Overlay(imaging.New(b.Dx(), b.Dy(), color.White), img, image.Point{}, 1)
}
