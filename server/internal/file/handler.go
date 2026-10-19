package file

import (
	"context"
	"net/http"
	"time"

	"github.com/danielgtaylor/huma/v2"
	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// uploadReadTimeout lets a 10 MB photo arrive over a slow mobile connection;
// the server's own read timeout is shorter.
const uploadReadTimeout = 2 * time.Minute

type photoBody struct {
	ID        uuid.UUID `json:"id"`
	Width     int       `json:"width"     doc:"Of the photo as uploaded, turned the way it was taken"`
	Height    int       `json:"height"`
	LargePath string    `json:"largePath" doc:"The photo at most 1600 px on its longer side"`
	SmallPath string    `json:"smallPath" doc:"The photo at most 400 px on its longer side, for lists"`
}

// RegisterOperations adds the module's operations to api.
func RegisterOperations(api huma.API, s *Service) {
	tags := []string{"Photos"}

	huma.Register(api, huma.Operation{
		OperationID: "uploadPhoto", Method: http.MethodPost, Path: "/photos",
		Summary: "Upload a photo for an offer or a seller",
		Description: "The body is the image itself: JPEG, PNG or WebP, at most 10 MB. It is written again as JPEG " +
			"in two sizes, without its metadata. An unused photo is kept for a day.",
		Tags: tags, Security: platform.SignedIn(),
		DefaultStatus: http.StatusCreated, MaxBodyBytes: MaxUploadBytes, BodyReadTimeout: uploadReadTimeout,
	}, func(ctx context.Context, in *struct {
		RawBody []byte `contentType:"image/*"`
	},
	) (*struct{ Body photoBody }, error) {
		p, err := s.Upload(ctx, in.RawBody)
		if err != nil {
			return nil, err
		}

		return &struct{ Body photoBody }{Body: photoBody{
			ID: p.ID, Width: p.Width, Height: p.Height,
			LargePath: Path(p.ID, SizeLarge), SmallPath: Path(p.ID, SizeSmall),
		}}, nil
	})

	type fileOutput struct {
		ContentType           string `header:"Content-Type"`
		CacheControl          string `header:"Cache-Control"`
		XContentTypeOptions   string `header:"X-Content-Type-Options"`
		ContentSecurityPolicy string `header:"Content-Security-Policy"`
		Body                  []byte
	}

	huma.Register(api, huma.Operation{
		OperationID: "getPhoto", Method: http.MethodGet, Path: "/photos/{photoId}/{file}",
		Summary: "A photo in one of its sizes", Tags: tags,
		Responses: map[string]*huma.Response{
			"200": {Description: "The photo as JPEG", Content: map[string]*huma.MediaType{contentTypeJPEG: {}}},
		},
	}, func(ctx context.Context, in *struct {
		PhotoID uuid.UUID `path:"photoId"`
		File    string    `path:"file"    enum:"1600.jpg,400.jpg"`
	},
	) (*fileOutput, error) {
		size := SizeSmall
		if in.File == fileName(SizeLarge) {
			size = SizeLarge
		}

		data, err := s.File(ctx, in.PhotoID, size)
		if err != nil {
			return nil, err
		}

		// A photo never changes once written.
		return &fileOutput{
			ContentType: contentTypeJPEG, CacheControl: "public, max-age=31536000, immutable",
			XContentTypeOptions: "nosniff", ContentSecurityPolicy: "default-src 'none'", Body: data,
		}, nil
	})
}
