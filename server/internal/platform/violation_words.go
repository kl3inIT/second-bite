package platform

import (
	"regexp"
	"strings"

	"github.com/danielgtaylor/huma/v2/validation"
)

// violationWord pairs one of huma's validation sentences, a format template
// shared by the whole process, with its Vietnamese. {1}, {2} in the Vietnamese
// stand for the values huma put in its sentence, in order; a Vietnamese
// sentence may leave out a value written for developers, such as a parser's
// own message.
type violationWord struct {
	en string
	vi string
}

// violationWords refers to huma's variables, so a renamed or removed one
// stops the build instead of answering English to a Vietnamese reader.
var violationWords = []violationWord{
	{validation.MsgUnexpectedProperty, "Trường này không được nhận."},
	{validation.MsgExpectedRFC3339DateTime, "Phải là ngày giờ theo RFC 3339, ví dụ 2026-10-20T18:00:00+07:00."},
	{validation.MsgExpectedRFC1123DateTime, "Phải là ngày giờ theo RFC 1123."},
	{validation.MsgExpectedRFC3339Date, "Phải là ngày theo RFC 3339, ví dụ 2026-10-20."},
	{validation.MsgExpectedRFC3339Time, "Phải là giờ theo RFC 3339, ví dụ 18:00:00+07:00."},
	{validation.MsgExpectedRFC5322Email, "Phải là một địa chỉ email."},
	{validation.MsgExpectedRFC5322EmailBare, "Phải là một địa chỉ email, không kèm tên."},
	{validation.MsgExpectedRFC5890Hostname, "Phải là một tên máy chủ."},
	{validation.MsgExpectedRFC2673IPv4, "Phải là một địa chỉ IPv4."},
	{validation.MsgExpectedRFC2373IPv6, "Phải là một địa chỉ IPv6."},
	{validation.MsgExpectedRFCIPAddr, "Phải là một địa chỉ IPv4 hoặc IPv6."},
	{validation.MsgExpectedRFC3986URI, "Phải là một địa chỉ URI."},
	{validation.MsgExpectedRFC3986AbsoluteURI, "Phải là một địa chỉ URI đầy đủ, có giao thức."},
	{validation.MsgExpectedRFC4122UUID, "Phải là một mã UUID."},
	{validation.MsgExpectedRFC6570URITemplate, "Phải là một mẫu URI."},
	{validation.MsgExpectedRFC6901JSONPointer, "Phải là một JSON Pointer."},
	{validation.MsgExpectedRFC6901RelativeJSONPointer, "Phải là một JSON Pointer tương đối."},
	{validation.MsgExpectedRegexp, "Phải là một biểu thức chính quy."},
	{validation.MsgExpectedMatchAtLeastOneSchema, "Giá trị không khớp với dạng nào được nhận."},
	{validation.MsgExpectedMatchExactlyOneSchema, "Giá trị phải khớp đúng một dạng được nhận."},
	{validation.MsgExpectedNotMatchSchema, "Giá trị này không được nhận."},
	{validation.MsgExpectedPropertyNameInObject, "Thiếu một trường bắt buộc."},
	{validation.MsgExpectedBoolean, "Phải là true hoặc false."},
	{validation.MsgExpectedDuration, "Phải là một khoảng thời gian."},
	{validation.MsgExpectedNumber, "Phải là một số."},
	{validation.MsgExpectedInteger, "Phải là một số nguyên."},
	{validation.MsgExpectedString, "Phải là một chuỗi ký tự."},
	{validation.MsgExpectedBase64String, "Phải được mã hoá base64."},
	{validation.MsgExpectedArray, "Phải là một danh sách."},
	{validation.MsgExpectedObject, "Phải là một đối tượng."},
	{validation.MsgExpectedArrayItemsUnique, "Các phần tử trong danh sách không được trùng nhau."},
	{validation.MsgExpectedOneOf, `Phải là một trong các giá trị "{1}".`},
	{validation.MsgExpectedConst, "Phải là {1}."},
	{validation.MsgExpectedMinimumNumber, "Phải từ {1} trở lên."},
	{validation.MsgExpectedExclusiveMinimumNumber, "Phải lớn hơn {1}."},
	{validation.MsgExpectedMaximumNumber, "Phải từ {1} trở xuống."},
	{validation.MsgExpectedExclusiveMaximumNumber, "Phải nhỏ hơn {1}."},
	{validation.MsgExpectedNumberBeMultipleOf, "Phải là bội số của {1}."},
	{validation.MsgExpectedMinLength, "Phải có ít nhất {1} ký tự."},
	{validation.MsgExpectedMaxLength, "Chỉ được tối đa {1} ký tự."},
	{validation.MsgExpectedBePattern, "Chưa đúng định dạng."},
	{validation.MsgExpectedMatchPattern, "Chưa đúng định dạng."},
	{validation.MsgExpectedMinItems, "Phải có ít nhất {1} phần tử."},
	{validation.MsgExpectedMaxItems, "Chỉ được tối đa {1} phần tử."},
	{validation.MsgExpectedMinProperties, "Phải có ít nhất {1} trường."},
	{validation.MsgExpectedMaxProperties, "Chỉ được tối đa {1} trường."},
	{validation.MsgExpectedRequiredProperty, "Thiếu trường bắt buộc {1}."},
	{validation.MsgExpectedDependentRequiredProperty, "Cần có trường {1} khi đã có trường {2}."},
	{validation.MsgExpectedResolvableSchemaRef, "Không đọc được lược đồ {1}."},
}

// genericViolation answers a sentence of huma no template matches, so a
// reader never meets English in a Vietnamese answer.
const genericViolation = "Giá trị không hợp lệ."

var (
	formatVerb       = regexp.MustCompile(`%[vds]`)
	violationMatches = compileViolationWords()
)

type violationMatch struct {
	pattern *regexp.Regexp
	vi      string
}

// compileViolationWords turns each template into a pattern capturing the values
// huma put into it.
func compileViolationWords() []violationMatch {
	out := make([]violationMatch, 0, len(violationWords))

	for _, w := range violationWords {
		parts := formatVerb.Split(w.en, -1)
		for i, p := range parts {
			parts[i] = regexp.QuoteMeta(p)
		}

		out = append(out, violationMatch{
			pattern: regexp.MustCompile("^" + strings.Join(parts, "(.*?)") + "$"),
			vi:      w.vi,
		})
	}

	return out
}

// violationDetail returns huma's sentence in lang: as huma wrote it in
// English, translated otherwise.
func violationDetail(message string, lang Language) string {
	if lang == LanguageEnglish {
		return message
	}

	for _, m := range violationMatches {
		values := m.pattern.FindStringSubmatch(message)
		if values == nil {
			continue
		}

		vi := m.vi
		for i, v := range values[1:] {
			vi = strings.ReplaceAll(vi, "{"+string(rune('1'+i))+"}", v)
		}

		return vi
	}

	return genericViolation
}
