/// Where sign-in sends a person back to: a path of the app, with its query,
/// as the web's `readReturnTo`. Anything else, an address on another site
/// among them, goes home (SEC-29 › Web: `returnTo` is accepted only as a
/// path on our own origin).
String readReturnTo(String? value) {
  if (value == null || !value.startsWith('/') || value.startsWith('//')) {
    return '/';
  }
  final Uri uri;
  try {
    uri = Uri.parse(value);
  } on FormatException {
    return '/';
  }
  if (uri.hasScheme || uri.hasAuthority || value.contains(r'\')) return '/';
  return value;
}
