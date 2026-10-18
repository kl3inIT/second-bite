package main

import (
	"bytes"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"maps"
	"net/http"
	"testing"
)

// checkPhotoFlow has a seller's owner upload a photo as the clients will,
// set it as the seller's photo, and anyone read it back.
func checkPhotoFlow(t *testing.T, svc service) {
	t.Helper()

	owner := bearer(signIn(t, svc, "photo.owner@example.com").Token)

	var buf bytes.Buffer
	if err := png.Encode(&buf, image.NewGray(image.Rect(0, 0, 64, 48))); err != nil {
		t.Fatal(err)
	}

	var photo struct {
		ID        string `json:"id"`
		Width     int    `json:"width"`
		SmallPath string `json:"smallPath"`
	}

	sendRaw(t, http.MethodPost, svc.base+"/photos", owner, "image/png", buf.Bytes()).decode(t, http.StatusCreated, &photo)

	if photo.Width != 64 || photo.SmallPath != "/photos/"+photo.ID+"/400.jpg" {
		t.Fatalf("uploaded %+v", photo)
	}

	var opened sellerResponse

	send(t, http.MethodPost, svc.base+"/sellers", owner, map[string]any{
		"name": "Bánh ngọt Tasco", "address": "Tasco Mall, Việt Hưng", "latitude": 21.0565, "longitude": 105.8964, "phone": "0912 345 679",
	}).decode(t, http.StatusCreated, &opened)

	var withPhoto struct {
		PhotoID string `json:"photoId"`
	}

	send(t, http.MethodPut, svc.base+"/sellers/"+opened.ID+"/photo", owner, map[string]any{"photoId": photo.ID}).
		decode(t, http.StatusOK, &withPhoto)

	if withPhoto.PhotoID != photo.ID {
		t.Fatalf("the seller's photo is %q", withPhoto.PhotoID)
	}

	// Anyone reads a photo, without signing in.
	got := send(t, http.MethodGet, svc.base+photo.SmallPath, nil, nil)
	if got.status != http.StatusOK || got.header.Get("Content-Type") != "image/jpeg" ||
		got.header.Get("X-Content-Type-Options") != "nosniff" || got.header.Get("Cache-Control") == "" {
		t.Fatalf("reading the photo: %d %v", got.status, got.header)
	}

	if _, err := jpeg.Decode(bytes.NewReader(got.body)); err != nil {
		t.Fatalf("the photo served is not a JPEG: %v", err)
	}

	if p := sendRaw(t, http.MethodPost, svc.base+"/photos", owner, "image/jpeg", []byte("not an image")).
		problem(t, http.StatusBadRequest); p.Code != "MEDIA_PHOTO_INVALID" {
		t.Errorf("text as a photo: %q", p.Code)
	}

	if p := sendRaw(t, http.MethodPost, svc.base+"/photos", owner, "image/jpeg", make([]byte, 10<<20+1)).
		problem(t, http.StatusRequestEntityTooLarge); p.Code != "PLATFORM_BODY_TOO_LARGE" {
		t.Errorf("a photo over 10 MB: %q", p.Code)
	}

	if p := sendRaw(t, http.MethodPost, svc.base+"/photos", nil, "image/png", buf.Bytes()).
		problem(t, http.StatusUnauthorized); p.Code != "PLATFORM_AUTHENTICATION_REQUIRED" {
		t.Errorf("uploading without signing in: %q", p.Code)
	}
}

// sendRaw sends body as it is, with its content type.
func sendRaw(t *testing.T, method, url string, header http.Header, contentType string, body []byte) response {
	t.Helper()

	req, err := http.NewRequestWithContext(t.Context(), method, url, bytes.NewReader(body))
	if err != nil {
		t.Fatal(err)
	}

	maps.Copy(req.Header, header)
	req.Header.Set("Content-Type", contentType)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatal(err)
	}

	defer func() {
		if err := resp.Body.Close(); err != nil {
			t.Error(err)
		}
	}()

	raw, err := io.ReadAll(resp.Body)
	if err != nil {
		t.Fatal(err)
	}

	return response{status: resp.StatusCode, header: resp.Header, body: raw}
}
