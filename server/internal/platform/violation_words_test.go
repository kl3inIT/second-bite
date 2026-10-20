package platform

import (
	"strings"
	"testing"
)

func TestViolationWordsKeepHumasValues(t *testing.T) {
	t.Parallel()

	for _, w := range violationWords {
		verbs := len(formatVerb.FindAllString(w.en, -1))
		for i := verbs + 1; i <= 3; i++ {
			if strings.Contains(w.vi, "{"+string(rune('0'+i))+"}") {
				t.Errorf("%q uses value %d, but huma's %q has %d", w.vi, i, w.en, verbs)
			}
		}
	}
}

func TestViolationDetail(t *testing.T) {
	t.Parallel()

	cases := []struct{ message, lang, want string }{
		{"expected length >= 3", "vi", "Phải có ít nhất 3 ký tự."},
		{"expected required property name to be present", "vi", "Thiếu trường bắt buộc name."},
		{`expected value to be one of "bakery, drinks"`, "vi", `Phải là một trong các giá trị "bakery, drinks".`},
		{"expected string to be RFC 5322 email: mail: no angle-addr", "vi", "Phải là một địa chỉ email."},
		{"something huma says one day", "vi", genericViolation},
		{"expected length >= 3", "en", "expected length >= 3"},
	}

	for _, c := range cases {
		if got := violationDetail(c.message, Language(c.lang)); got != c.want {
			t.Errorf("violationDetail(%q, %s) = %q, want %q", c.message, c.lang, got, c.want)
		}
	}
}

func TestEveryPlatformCodeHasWords(t *testing.T) {
	t.Parallel()

	for status, code := range platformStatusCodes {
		if !platformWords[code].complete() {
			t.Errorf("%s (%d) lacks its words", code, status)
		}
	}

	if !platformWords[CodeRequestRefused].complete() {
		t.Errorf("%s lacks its words", CodeRequestRefused)
	}
}
