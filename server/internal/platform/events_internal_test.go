package platform

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"log/slog"
	"strings"
	"testing"

	"github.com/riverqueue/river"
	"github.com/riverqueue/river/rivertype"
)

// errPersonal stands for an error whose text carries a person's data.
var errPersonal = errors.New("could not forget lan@example.com")

// A listener's failure is a warning while River will try again, and an error on
// the last attempt, when the event is lost to that listener; the error's text
// is never logged (SEC-70).
func TestEventsFailedLogsByAttempt(t *testing.T) {
	t.Parallel()

	failure := NewFailure("TEST_FORGET_FAILED", CategoryConflict, Words{VI: "Chưa xoá được.", EN: "Not forgotten yet."})

	for _, tc := range []struct {
		name               string
		attempt            int
		err                error
		wantLevel, wantKey string
		wantCode           string
	}{
		{"an attempt River will repeat", 3, errPersonal, "WARN", "platform.event.failed", ""},
		{"the last attempt", 25, errPersonal, "ERROR", "platform.event.discarded", ""},
		{"a module's failure, with its code", 1, failure.WithCause(errPersonal), "WARN", "platform.event.failed", "TEST_FORGET_FAILED"},
	} {
		t.Run(tc.name, func(t *testing.T) {
			t.Parallel()

			var out bytes.Buffer

			e := &Events{logger: slog.New(slog.NewJSONHandler(&out, nil))}
			job := &river.Job[eventJob]{
				JobRow: &rivertype.JobRow{Attempt: tc.attempt, MaxAttempts: 25},
				Args:   eventJob{Event: "identity.account_deleted", Listener: "file.forget_uploader"},
			}

			e.failed(context.Background(), job, "platform.event.failed", tc.err)

			if strings.Contains(out.String(), "lan@example.com") {
				t.Fatalf("the log carries the error's text: %s", out.String())
			}

			var record map[string]any
			if err := json.Unmarshal(out.Bytes(), &record); err != nil {
				t.Fatal(err)
			}

			if record["level"] != tc.wantLevel || record["event"] != tc.wantKey {
				t.Errorf("logged %v %v, want %s %s", record["level"], record["event"], tc.wantLevel, tc.wantKey)
			}

			if code, _ := record["error_code"].(string); code != tc.wantCode {
				t.Errorf("error_code %q, want %q", code, tc.wantCode)
			}

			if record["error_type"] != "*errors.errorString" {
				t.Errorf("error_type %v, want the innermost error's type", record["error_type"])
			}
		})
	}
}
