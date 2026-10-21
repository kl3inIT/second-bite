package platform

import (
	"context"

	"golang.org/x/text/language"
)

// Language is a language the service answers people in.
type Language string

// The languages of Second Bite (SEC-28); Vietnamese first, as the service's
// own and the answer when the caller asks for neither.
const (
	LanguageVietnamese Language = "vi"
	LanguageEnglish    Language = "en"
)

// Words is one sentence for people in every language of the service: the
// detail of a failure, written beside the failure it describes.
type Words struct {
	VI string
	EN string
}

// In returns the sentence in lang, Vietnamese for a language it does not know.
func (w Words) In(lang Language) string {
	if lang == LanguageEnglish {
		return w.EN
	}

	return w.VI
}

func (w Words) complete() bool { return w.VI != "" && w.EN != "" }

var languageMatcher = language.NewMatcher([]language.Tag{language.Vietnamese, language.English})

// languageOfHeader picks the language of an Accept-Language header: the best
// match among Vietnamese and English, honouring quality values, and
// Vietnamese when the caller asks for neither or sends nothing readable.
func languageOfHeader(header string) Language {
	tags, _, err := language.ParseAcceptLanguage(header)
	if err != nil || len(tags) == 0 {
		return LanguageVietnamese
	}

	_, index, confidence := languageMatcher.Match(tags...)
	if confidence == language.No || index != 1 {
		return LanguageVietnamese
	}

	return LanguageEnglish
}

// LanguageOf returns the language the request ctx belongs to asked for,
// Vietnamese outside a request.
func LanguageOf(ctx context.Context) Language {
	if info, ok := ctx.Value(requestKey{}).(*requestInfo); ok && info.language != "" {
		return info.language
	}

	return LanguageVietnamese
}
