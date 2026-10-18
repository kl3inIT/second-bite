package offer

import (
	"testing"

	"golang.org/x/text/unicode/norm"
)

const banh = "banh"

func TestTermsReadVietnameseSpelling(t *testing.T) {
	t.Parallel()

	for word, want := range map[string]term{
		"bánh":  {loose: banh, exact: "banh~2", marked: true},
		"Bánh":  {loose: banh, exact: "banh~2", marked: true},
		"mì":    {loose: "mi", exact: "mi~1", marked: true},
		"mỳ":    {loose: "mi", exact: "mi~1", marked: true},
		"kỹ":    {loose: "ki", exact: "ki~4", marked: true},
		"đậu":   {loose: "dau", exact: "đâu~5", marked: true},
		"bơ":    {loose: "bo", exact: "bơ~0", marked: true},
		"bò":    {loose: "bo", exact: "bo~1", marked: true},
		banh:    {loose: banh, exact: "banh~0"},
		"pizza": {loose: "pizza", exact: "pizza~0"},
		"2024":  {loose: "2024"},
		// "y" stays where it is not a lone vowel after h, k, l, m, s or t.
		"yến": {loose: "yen", exact: "yên~2", marked: true},
		"quý": {loose: "quy", exact: "quy~2", marked: true},
	} {
		if got := toTerm(words(word)[0]); got != want {
			t.Errorf("%q: %+v, want %+v", word, got, want)
		}
	}
}

func TestOneWordWhereverItsToneSits(t *testing.T) {
	t.Parallel()

	for _, pair := range [][2]string{
		{"hòa", "hoà"},   // the two placements in use
		{"thúy", "thuý"}, // likewise
		{"bảo", "baỏ"},   // a tone typed on the wrong vowel
		{"lượng", "lựơng"},
		{"bánh", norm.NFD.String("bánh")}, // decomposed, as some keyboards type
	} {
		a, b := toTerm(words(pair[0])[0]), toTerm(words(pair[1])[0])
		if a != b {
			t.Errorf("%q is %+v but %q is %+v", pair[0], a, pair[1], b)
		}
	}
}

func TestWordsDropFormatCharacters(t *testing.T) {
	t.Parallel()

	got := words("Bánh\u200b mì, thập-cẩm!")
	want := []string{"bánh", "mì", "thập", "cẩm"}

	if len(got) != len(want) {
		t.Fatalf("%q, want %q", got, want)
	}

	for i := range want {
		if got[i] != want[i] {
			t.Errorf("%q, want %q", got, want)
		}
	}
}

func TestSearchVectorKeepsBothFormsAtOnePosition(t *testing.T) {
	t.Parallel()

	got := searchVector(field{"Bánh mì", 'A'}, field{"Tasco", 'B'})
	want := "'banh':1A 'banh~2':1A 'mi':2A 'mi~1':2A 'tasco':13B 'tasco~0':13B"

	if got != want {
		t.Errorf("%s\nwant %s", got, want)
	}
}

func TestSearchQueryFollowsWhatWasTyped(t *testing.T) {
	t.Parallel()

	for q, want := range map[string]string{
		"cá":                         "'ca~2'",
		"ca":                         "'ca':*",
		"banh m":                     "'banh' & 'm':*",
		"bánh m":                     "'banh~2' & 'm':*",
		"banh mì":                    "'banh' & 'mi~1'",
		"BÁNH MỲ":                    "'banh~2' & 'mi~1'",
		"  ":                         "",
		"!!! ?":                      "",
		"o'clock":                    "'o' & 'clock':*",
		`a\b`:                        "'a' & 'b':*",
		"1 2 3 4 5 6 7 8 9 10 11 12": "'1' & '2' & '3' & '4' & '5' & '6' & '7' & '8' & '9' & '10':*",
	} {
		if got := searchQuery(q); got != want {
			t.Errorf("%q: %s, want %s", q, got, want)
		}
	}
}
