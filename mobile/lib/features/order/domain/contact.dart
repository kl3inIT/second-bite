// Who collects an order: the name the store calls and a Vietnamese phone
// number, given with every order (SEC-76 › decision 7). The rules are the
// web's (web/src/features/cart/contact.ts), which mirror the server's
// (server/internal/order/contact.go), which decides.

/// Who collects an order.
typedef Contact = ({String name, String phone});

/// As the server keeps a name, the same as an account's display name.
const maxNameLength = 50;

final _phone = RegExp(r'^0[0-9]{9}$');
final _separators = RegExp(r'[\s.-]');

/// The number as stored: spaces, dots and dashes taken out, +84 written as
/// 0.
String normalizedPhone(String value) {
  final phone = value.trim().replaceAll(_separators, '');
  return phone.startsWith('+84') ? '0${phone.substring(3)}' : phone;
}

/// Whether [name] cannot be sent: empty, or longer than [maxNameLength]
/// counted in code points, as the server counts runes.
bool nameInvalid(String name) {
  final length = name.trim().runes.length;
  return length < 1 || length > maxNameLength;
}

/// Whether [phone] is not a Vietnamese number once normalized.
bool phoneInvalid(String phone) => !_phone.hasMatch(normalizedPhone(phone));

/// A stored number grouped to be read back at a glance: 0900 000 000.
String groupedPhone(String phone) => phone.length < 7
    ? phone
    : '${phone.substring(0, 4)} ${phone.substring(4, 7)} '
          '${phone.substring(7)}';
