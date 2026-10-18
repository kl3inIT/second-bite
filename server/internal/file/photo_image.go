package file

import (
	"bytes"
	"errors"
	"fmt"
	"image"
	"image/draw"
	"image/jpeg"
	_ "image/png" // PNG is read, never written: every photo is served as JPEG

	"github.com/bep/imagemeta"
	xdraw "golang.org/x/image/draw"
	_ "golang.org/x/image/webp" // so is WebP
)

const (
	// maxPixels refuses an image that would take too much memory to decode,
	// such as a small file that declares an enormous size. Decoding holds the
	// whole image, 4 bytes a pixel for a PNG, about 100 MB at this bound;
	// phones save 12-megapixel photos unless told otherwise.
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
// names them, with the format imagemeta reads their EXIF in. iPhone browsers
// send HEIC photos as JPEG.
var acceptedFormats = map[string]imagemeta.ImageFormat{
	"jpeg": imagemeta.JPEG, "png": imagemeta.PNG, "webp": imagemeta.WebP,
}

// rendered is an uploaded image written again as JPEG in every size.
type rendered struct {
	width, height int
	files         map[Size][]byte
}

// render decodes an uploaded image and writes it again as JPEG in every size,
// turned the way it was taken. Writing it again leaves out its metadata, such
// as where it was taken and with which phone. Resizing uses golang.org/x/image
// as PhotoPrism, Gitea and Miniflux do; the orientation is read with
// imagemeta, as Mattermost reads it.
func render(data []byte) (rendered, error) {
	cfg, format, err := image.DecodeConfig(bytes.NewReader(data))
	metaFormat, accepted := acceptedFormats[format]

	if err != nil || !accepted || cfg.Width <= 0 || cfg.Height <= 0 || cfg.Width*cfg.Height > maxPixels {
		return rendered{}, ErrPhotoInvalid
	}

	src, _, err := image.Decode(bytes.NewReader(data))
	if err != nil {
		return rendered{}, ErrPhotoInvalid
	}

	o := orientationOf(data, metaFormat)
	w, h := o.size(src.Bounds().Dx(), src.Bounds().Dy())
	out := rendered{width: w, height: h, files: make(map[Size][]byte, len(sizes))}

	for _, size := range sizes {
		// Resized first and turned after, so turning copies a small image.
		fw, fh := fit(w, h, int(size))
		sw, sh := o.size(fw, fh)

		// Drawn over white: JPEG has no transparency.
		scaled := image.NewRGBA(image.Rect(0, 0, sw, sh))
		draw.Draw(scaled, scaled.Bounds(), image.White, image.Point{}, draw.Src)
		xdraw.CatmullRom.Scale(scaled, scaled.Bounds(), src, src.Bounds(), draw.Over, nil)

		var buf bytes.Buffer
		if err := jpeg.Encode(&buf, o.apply(scaled), &jpeg.Options{Quality: jpegQuality}); err != nil {
			return rendered{}, fmt.Errorf("writing the %d px photo: %w", size, err)
		}

		out.files[size] = buf.Bytes()
	}

	return out, nil
}

// fit returns w×h shrunk to fit within a square of side, never enlarged.
func fit(w, h, side int) (int, int) {
	if w <= side && h <= side {
		return w, h
	}

	if w >= h {
		return side, max(1, h*side/w)
	}

	return max(1, w*side/h), side
}

// orientation is the EXIF orientation: how the stored pixels must be turned
// to show the photo the way it was taken (1 to 8).
type orientation int

// orientationOf reads the EXIF orientation of data; a photo without one, or
// with one that cannot be read, is shown as stored.
func orientationOf(data []byte, format imagemeta.ImageFormat) orientation {
	o := orientation(1)

	_, err := imagemeta.Decode(imagemeta.Options{
		R: bytes.NewReader(data), ImageFormat: format, Sources: imagemeta.EXIF,
		HandleTag: func(ti imagemeta.TagInfo) error {
			if ti.Tag != "Orientation" {
				return nil
			}

			if v, ok := ti.Value.(uint16); ok && v >= 1 && v <= 8 {
				o = orientation(v)
			}

			return imagemeta.ErrStopWalking
		},
		Warnf: func(string, ...any) {},
	})
	if err != nil && !errors.Is(err, imagemeta.ErrStopWalking) {
		return 1
	}

	return o
}

// swapsSides tells whether the orientation turns the photo a quarter, so its
// width and height trade places.
func (o orientation) swapsSides() bool { return o >= 5 }

// size returns the size of a w×h image once turned.
func (o orientation) size(w, h int) (int, int) {
	if o.swapsSides() {
		return h, w
	}

	return w, h
}

// apply turns img the way the orientation asks.
func (o orientation) apply(img *image.RGBA) *image.RGBA {
	if o <= 1 {
		return img
	}

	w, h := img.Bounds().Dx(), img.Bounds().Dy()
	dw, dh := o.size(w, h)
	dst := image.NewRGBA(image.Rect(0, 0, dw, dh))

	for y := range dh {
		for x := range dw {
			sx, sy := o.source(x, y, w, h)
			si, di := img.PixOffset(sx, sy), dst.PixOffset(x, y)
			copy(dst.Pix[di:di+4], img.Pix[si:si+4])
		}
	}

	return dst
}

// source returns the pixel of a w×h stored image that lands on x, y once
// turned.
func (o orientation) source(x, y, w, h int) (int, int) {
	switch o {
	case 2: // mirrored
		return w - 1 - x, y
	case 3: // upside down
		return w - 1 - x, h - 1 - y
	case 4: // upside down, mirrored
		return x, h - 1 - y
	case 5: // transposed
		return y, x
	case 6: // turned a quarter clockwise
		return y, h - 1 - x
	case 7: // transversed
		return w - 1 - y, h - 1 - x
	case 8: // turned a quarter anticlockwise
		return w - 1 - y, x
	default:
		return x, y
	}
}
