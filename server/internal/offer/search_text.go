package offer

import (
	"maps"
	"slices"
	"strconv"
	"strings"
	"unicode"
	"unicode/utf8"

	"golang.org/x/text/unicode/norm"
)

// Vietnamese words as search finds them. PostgreSQL has no Vietnamese
// configuration and no extension handles its spelling, so each syllable is
// indexed under two lexemes at one position, as the Vietnamese analyzer of
// Elasticsearch keeps both forms (duydo/elasticsearch-analysis-vietnamese,
// asciifolding with preserve_original):
//
//   - its loose form, without any mark: "bánh" is "banh", "đậu" is "dau";
//   - its exact form, its letters with their marks and its tone as a digit:
//     "bánh" is "banh~2". The tone is taken off the vowel it sits on, so
//     "hòa" and "hoà", or "bảo" and the misplaced "baỏ", are one word, as
//     underthesea and VietnameseTextNormalizer normalize tone placement.
//
// A word typed without marks is looked up by its loose form, so "ca" finds
// "cá" and "cà"; a word typed with marks by its exact form, so "cá" does not
// find "cà phê". Text is put in NFC first and stripped of format characters
// such as the zero-width space copied from web pages
// (VietnameseTextNormalizer), and a lone "y" after h, k, l, m, s or t is read
// as "i", the two spellings of words such as "mì" and "mỳ" or "kĩ" and "kỹ".

// The tones, as the digit of an exact form; 0 is the level tone.
var tones = map[rune]byte{
	'̀': '1', // huyền
	'́': '2', // sắc
	'̉': '3', // hỏi
	'̃': '4', // ngã
	'̣': '5', // nặng
}

const (
	// maxWordRunes skips what is not a word, well below PostgreSQL's 2 KB per
	// lexeme.
	maxWordRunes = 40
	// maxPosition is the last position a tsvector keeps.
	maxPosition = 16383
	// fieldGap keeps the words of two fields apart, so ranking by proximity
	// does not join the end of a name to a seller's name.
	fieldGap = 10
	// maxQueryWords bounds what one search asks for.
	maxQueryWords = 10
)

// term is one syllable in its two forms; exact is empty for a number.
type term struct {
	loose, exact string
	marked       bool
}

// words splits text into its syllables.
func words(text string) []string {
	text = strings.Map(func(r rune) rune {
		if unicode.Is(unicode.Cf, r) {
			return -1
		}

		return r
	}, text)

	text = strings.ToLower(norm.NFC.String(text))

	return strings.FieldsFunc(text, func(r rune) bool {
		return !unicode.IsLetter(r) && !unicode.IsDigit(r) && !unicode.Is(unicode.Mn, r)
	})
}

// toTerm returns a syllable's loose and exact forms.
func toTerm(word string) term {
	tone := byte('0')
	marked := false

	var base, loose strings.Builder

	for _, r := range norm.NFD.String(word) {
		if t, ok := tones[r]; ok {
			tone, marked = t, true

			continue
		}

		base.WriteRune(r)

		switch {
		case unicode.Is(unicode.Mn, r):
			marked = true
		case r == 'đ':
			marked = true

			loose.WriteRune('d')
		default:
			loose.WriteRune(r)
		}
	}

	exact := norm.NFC.String(base.String())
	l := loose.String()

	if isShortY(l) {
		l = l[:1] + "i"
		exact = exact[:1] + "i"
	}

	if !strings.ContainsFunc(l, unicode.IsLetter) {
		return term{loose: l}
	}

	return term{loose: l, exact: exact + "~" + string(tone), marked: marked}
}

// isShortY tells whether a syllable is a lone "y" after h, k, l, m, s or t,
// where it is spelled "i" as well.
func isShortY(loose string) bool {
	return len(loose) == 2 && loose[1] == 'y' && strings.ContainsRune("hklmst", rune(loose[0]))
}

// field is text indexed at one weight: A for an offer's name, B for its
// seller's name, C for its description.
type field struct {
	text   string
	weight byte
}

// searchVector returns the fields as a tsvector literal, each syllable under
// its two forms at one position.
func searchVector(fields ...field) string {
	positions := map[string][]string{}
	pos := 0

	for _, f := range fields {
		for _, w := range words(f.text) {
			if utf8.RuneCountInString(w) > maxWordRunes {
				continue
			}

			pos++
			if pos > maxPosition {
				break
			}

			at := strconv.Itoa(pos) + string(f.weight)
			t := toTerm(w)
			positions[t.loose] = append(positions[t.loose], at)

			if t.exact != "" {
				positions[t.exact] = append(positions[t.exact], at)
			}
		}

		pos += fieldGap
	}

	var b strings.Builder

	for _, lexeme := range slices.Sorted(maps.Keys(positions)) {
		if b.Len() > 0 {
			b.WriteByte(' ')
		}

		b.WriteString(quoteLexeme(lexeme))
		b.WriteByte(':')
		b.WriteString(strings.Join(positions[lexeme], ","))
	}

	return b.String()
}

// searchQuery returns what a customer typed as a tsquery literal that holds
// every word, or "" when it holds none. A word with marks is looked up by its
// exact form; one without by its loose form, and the last such word as a
// prefix, being typed.
func searchQuery(q string) string {
	ws := words(q)
	if len(ws) > maxQueryWords {
		ws = ws[:maxQueryWords]
	}

	parts := make([]string, 0, len(ws))

	for i, w := range ws {
		if utf8.RuneCountInString(w) > maxWordRunes {
			continue
		}

		t := toTerm(w)

		switch {
		case t.marked:
			parts = append(parts, quoteLexeme(t.exact))
		case i == len(ws)-1:
			parts = append(parts, quoteLexeme(t.loose)+":*")
		default:
			parts = append(parts, quoteLexeme(t.loose))
		}
	}

	return strings.Join(parts, " & ")
}

// quoteLexeme quotes a lexeme for a tsvector or tsquery literal.
func quoteLexeme(s string) string {
	return "'" + strings.NewReplacer(`\`, `\\`, `'`, `''`).Replace(s) + "'"
}
