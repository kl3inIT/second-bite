package file

import (
	"bytes"
	"encoding/base64"
	"encoding/binary"
	"errors"
	"hash/crc32"
	"image"
	"image/color"
	"image/gif"
	"image/jpeg"
	"image/png"
	"testing"
)

// jpegWithExif returns a w×h JPEG carrying an EXIF block with orientation 6
// (taken turned a quarter clockwise) and a GPS latitude reference.
func jpegWithExif(t *testing.T, w, h int) []byte {
	t.Helper()

	var plain bytes.Buffer
	if err := jpeg.Encode(&plain, solid(w, h, color.RGBA{200, 120, 40, 255}), nil); err != nil {
		t.Fatal(err)
	}

	// TIFF, big-endian: IFD0 with Orientation and the GPS IFD's offset, then
	// the GPS IFD with GPSLatitudeRef "N".
	var tiff bytes.Buffer
	tiff.WriteString("MM\x00\x2a")
	_ = binary.Write(&tiff, binary.BigEndian, uint32(8))
	_ = binary.Write(&tiff, binary.BigEndian, uint16(2))
	_ = binary.Write(&tiff, binary.BigEndian, []uint16{0x0112, 3}) // Orientation, SHORT
	_ = binary.Write(&tiff, binary.BigEndian, []uint32{1, 6 << 16})
	_ = binary.Write(&tiff, binary.BigEndian, []uint16{0x8825, 4}) // GPS IFD, LONG
	_ = binary.Write(&tiff, binary.BigEndian, []uint32{1, 38})
	_ = binary.Write(&tiff, binary.BigEndian, uint32(0))
	_ = binary.Write(&tiff, binary.BigEndian, uint16(1))
	_ = binary.Write(&tiff, binary.BigEndian, []uint16{0x0001, 2}) // GPSLatitudeRef, ASCII
	_ = binary.Write(&tiff, binary.BigEndian, []uint32{2, 'N' << 24})
	_ = binary.Write(&tiff, binary.BigEndian, uint32(0))

	segment := append([]byte("Exif\x00\x00"), tiff.Bytes()...)

	var out bytes.Buffer
	out.Write(plain.Bytes()[:2]) // SOI
	out.Write([]byte{0xFF, 0xE1})
	_ = binary.Write(&out, binary.BigEndian, uint16(len(segment)+2)) //nolint:gosec // a few dozen bytes
	out.Write(segment)
	out.Write(plain.Bytes()[2:])

	return out.Bytes()
}

func solid(w, h int, c color.Color) image.Image {
	img := image.NewNRGBA(image.Rect(0, 0, w, h))
	for y := range h {
		for x := range w {
			img.Set(x, y, c)
		}
	}

	return img
}

func encodePNG(t *testing.T, img image.Image) []byte {
	t.Helper()

	var buf bytes.Buffer
	if err := png.Encode(&buf, img); err != nil {
		t.Fatal(err)
	}

	return buf.Bytes()
}

func decodeJPEG(t *testing.T, data []byte) image.Image {
	t.Helper()

	img, err := jpeg.Decode(bytes.NewReader(data))
	if err != nil {
		t.Fatalf("not a JPEG: %v", err)
	}

	return img
}

func TestRenderTurnsThePhotoAndDropsItsMetadata(t *testing.T) {
	t.Parallel()

	src := jpegWithExif(t, 3000, 2000)
	if !bytes.Contains(src, []byte("Exif")) {
		t.Fatal("the source carries no EXIF")
	}

	out, err := render(src)
	if err != nil {
		t.Fatal(err)
	}

	// Turned a quarter: the portrait the phone saw.
	if out.width != 2000 || out.height != 3000 {
		t.Fatalf("rendered %d×%d, want 2000×3000", out.width, out.height)
	}

	for size, want := range map[Size]image.Point{SizeLarge: {1066, 1600}, SizeSmall: {266, 400}} {
		file := out.files[size]
		if bytes.Contains(file, []byte("Exif")) || bytes.Contains(file, []byte{0xFF, 0xE1}) {
			t.Errorf("the %d px photo keeps EXIF", size)
		}

		if got := decodeJPEG(t, file).Bounds().Size(); got != want {
			t.Errorf("the %d px photo is %v, want %v", size, got, want)
		}
	}
}

func TestRenderKeepsASmallPhotoAndWhitensTransparency(t *testing.T) {
	t.Parallel()

	out, err := render(encodePNG(t, solid(300, 200, color.NRGBA{0, 0, 0, 0})))
	if err != nil {
		t.Fatal(err)
	}

	img := decodeJPEG(t, out.files[SizeLarge])
	if got := img.Bounds().Size(); got != (image.Point{300, 200}) {
		t.Fatalf("a small photo became %v", got)
	}

	if r, g, b, _ := img.At(150, 100).RGBA(); r>>8 < 250 || g>>8 < 250 || b>>8 < 250 {
		t.Fatalf("transparency became %d,%d,%d, want white", r>>8, g>>8, b>>8)
	}
}

func TestRenderReadsWebP(t *testing.T) {
	t.Parallel()

	// A lossless 1×1 WebP.
	webp, err := base64.StdEncoding.DecodeString("UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==")
	if err != nil {
		t.Fatal(err)
	}

	if _, err := render(webp); err != nil {
		t.Fatalf("WebP refused: %v", err)
	}
}

// withDeclaredSize rewrites a PNG's header to declare w×h pixels, as a small
// file built to exhaust memory would.
func withDeclaredSize(t *testing.T, data []byte, w, h uint32) []byte {
	t.Helper()

	out := bytes.Clone(data)
	binary.BigEndian.PutUint32(out[16:], w)
	binary.BigEndian.PutUint32(out[20:], h)
	binary.BigEndian.PutUint32(out[29:], crc32.ChecksumIEEE(out[12:29]))

	return out
}

func TestRenderRefusesWhatIsNotAPhoto(t *testing.T) {
	t.Parallel()

	var gifData bytes.Buffer
	if err := gif.Encode(&gifData, solid(10, 10, color.Black), nil); err != nil {
		t.Fatal(err)
	}

	small := encodePNG(t, solid(10, 10, color.Black))

	for name, data := range map[string][]byte{
		"text":                  []byte("not an image"),
		"GIF":                   gifData.Bytes(),
		"a truncated JPEG":      jpegWithExif(t, 50, 50)[:200],
		"too many pixels":       withDeclaredSize(t, small, 6_000, 4_001),
		"a PNG with no picture": withDeclaredSize(t, small, 0, 10),
	} {
		if _, err := render(data); !errors.Is(err, ErrPhotoInvalid) {
			t.Errorf("%s: %v, want FILE_PHOTO_INVALID", name, err)
		}
	}
}

// TestOrientationTurnsAsExifDefines marks the stored top-left pixel and checks
// the corner it lands on for each of the eight EXIF orientations.
func TestOrientationTurnsAsExifDefines(t *testing.T) {
	t.Parallel()

	const w, h = 3, 2

	stored := image.NewRGBA(image.Rect(0, 0, w, h))
	stored.Set(0, 0, color.RGBA{255, 0, 0, 255})

	for o, want := range map[orientation]image.Point{
		1: {0, 0}, 2: {w - 1, 0}, 3: {w - 1, h - 1}, 4: {0, h - 1},
		5: {0, 0}, 6: {h - 1, 0}, 7: {h - 1, w - 1}, 8: {0, w - 1},
	} {
		turned := o.apply(stored)

		ww, wh := o.size(w, h)
		if got := turned.Bounds().Size(); got != (image.Point{ww, wh}) {
			t.Errorf("orientation %d: size %v, want %dx%d", o, got, ww, wh)

			continue
		}

		if r, _, _, _ := turned.At(want.X, want.Y).RGBA(); r>>8 != 255 {
			t.Errorf("orientation %d: the top-left pixel is not at %v", o, want)
		}
	}
}
