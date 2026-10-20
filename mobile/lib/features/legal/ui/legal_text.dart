import 'package:second_bite/l10n/l10n.dart';

/// One section of a legal page: its heading and its paragraphs, one blank
/// line apart.
typedef LegalSection = ({String title, String body});

/// The terms of use and the privacy policy (SEC-32), read in the app as on
/// the web's `/terms` and `/privacy`. Their text is in the catalogs, a copy of
/// the web's, which a test keeps the same (test/features/legal).
enum LegalDocument {
  /// The terms of use, `/terms`.
  terms,

  /// The privacy policy, `/privacy`.
  privacy;

  /// The page's name, as the top bar and the account tab show it.
  String title(AppLocalizations l10n) => switch (this) {
    terms => l10n.legalTerms,
    privacy => l10n.legalPrivacy,
  };

  /// The paragraph before the sections.
  String intro(AppLocalizations l10n) => switch (this) {
    terms => l10n.legalTermsIntro,
    privacy => l10n.legalPrivacyIntro,
  };

  /// The sections, in order.
  List<LegalSection> sections(AppLocalizations l10n) => switch (this) {
    terms => [
      (title: l10n.legalTermsSection1Title, body: l10n.legalTermsSection1Body),
      (title: l10n.legalTermsSection2Title, body: l10n.legalTermsSection2Body),
      (title: l10n.legalTermsSection3Title, body: l10n.legalTermsSection3Body),
      (title: l10n.legalTermsSection4Title, body: l10n.legalTermsSection4Body),
      (title: l10n.legalTermsSection5Title, body: l10n.legalTermsSection5Body),
      (title: l10n.legalTermsSection6Title, body: l10n.legalTermsSection6Body),
      (title: l10n.legalTermsSection7Title, body: l10n.legalTermsSection7Body),
      (title: l10n.legalTermsSection8Title, body: l10n.legalTermsSection8Body),
    ],
    privacy => [
      (
        title: l10n.legalPrivacySection1Title,
        body: l10n.legalPrivacySection1Body,
      ),
      (
        title: l10n.legalPrivacySection2Title,
        body: l10n.legalPrivacySection2Body,
      ),
      (
        title: l10n.legalPrivacySection3Title,
        body: l10n.legalPrivacySection3Body,
      ),
      (
        title: l10n.legalPrivacySection4Title,
        body: l10n.legalPrivacySection4Body,
      ),
      (
        title: l10n.legalPrivacySection5Title,
        body: l10n.legalPrivacySection5Body,
      ),
      (
        title: l10n.legalPrivacySection6Title,
        body: l10n.legalPrivacySection6Body,
      ),
      (
        title: l10n.legalPrivacySection7Title,
        body: l10n.legalPrivacySection7Body,
      ),
      (
        title: l10n.legalPrivacySection8Title,
        body: l10n.legalPrivacySection8Body,
      ),
      (
        title: l10n.legalPrivacySection9Title,
        body: l10n.legalPrivacySection9Body,
      ),
    ],
  };
}

/// The day the drafts last changed, as the web's `legalUpdated`.
final legalUpdated = DateTime(2026, 10, 18);
