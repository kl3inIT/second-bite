package platform

import (
	"context"
	"io"
	"log/slog"
)

// NewLogger returns the service's logger: JSON for deployed environments,
// readable text for local development. A record logged with a request's
// context carries that request's request_id.
func NewLogger(w io.Writer, cfg Config) *slog.Logger {
	opts := &slog.HandlerOptions{Level: cfg.LogLevel}

	var h slog.Handler = slog.NewJSONHandler(w, opts)
	if cfg.LogFormat == logFormatText {
		h = slog.NewTextHandler(w, opts)
	}

	return slog.New(requestIDHandler{h})
}

type requestIDHandler struct {
	slog.Handler
}

func (h requestIDHandler) Handle(ctx context.Context, r slog.Record) error {
	if id := RequestID(ctx); id != "" {
		r.AddAttrs(slog.String("request_id", id))
	}

	return h.Handler.Handle(ctx, r)
}

func (h requestIDHandler) WithAttrs(attrs []slog.Attr) slog.Handler {
	return requestIDHandler{h.Handler.WithAttrs(attrs)}
}

func (h requestIDHandler) WithGroup(name string) slog.Handler {
	return requestIDHandler{h.Handler.WithGroup(name)}
}
