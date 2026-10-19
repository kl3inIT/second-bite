import 'package:url_launcher/url_launcher.dart';

/// The web application, where the legal pages live in both languages.
final Uri _web = Uri.parse('https://secondbite.vadan.app');

/// The legal pages of the web: the terms and the privacy policy (Decree
/// 52/2013, SEC-32).
enum LegalPage {
  /// The terms of use, `/terms`.
  terms,

  /// The privacy policy, `/privacy`.
  privacy,
}

/// Opens [page] on the web in [language] (`vi` or `en`).
Future<void> openLegalPage(LegalPage page, String language) =>
    launchUrl(_web.replace(path: '/$language/${page.name}'));
