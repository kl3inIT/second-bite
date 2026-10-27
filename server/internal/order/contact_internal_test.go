package order

import "testing"

// A customer's consent to Zalo survives the clean-up of the name and phone,
// which once dropped it, so no order recorded it (SEC-165).
func TestNormalizedKeepsZaloConsent(t *testing.T) {
	t.Parallel()

	for _, byZalo := range []bool{true, false} {
		c, err := Contact{Name: " Lan ", Phone: "+84 905 111 222", ByZalo: byZalo}.normalized()
		if err != nil || c != (Contact{Name: "Lan", Phone: "0905111222", ByZalo: byZalo}) {
			t.Errorf("normalized with byZalo %v = %+v, %v", byZalo, c, err)
		}
	}
}
