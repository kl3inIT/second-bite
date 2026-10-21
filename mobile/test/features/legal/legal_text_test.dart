import 'dart:convert';
import 'dart:io';

import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:second_bite/features/legal/ui/legal_text.dart';
import 'package:second_bite/l10n/l10n.dart';

/// The web's catalog in [language], read from the same checkout, since the
/// app keeps a copy of its legal text (SEC-52).
Map<String, dynamic> webCatalog(String language) =>
    jsonDecode(File('../web/messages/$language.json').readAsStringSync())
        as Map<String, dynamic>;

void main() {
  for (final language in ['vi', 'en']) {
    group('the legal text in "$language"', () {
      final l10n = lookupAppLocalizations(Locale(language));
      final web = webCatalog(language);

      for (final (document, namespace) in [
        (LegalDocument.terms, 'Terms'),
        (LegalDocument.privacy, 'Privacy'),
      ]) {
        test("of $document is the web's $namespace, word for word", () {
          final page = web[namespace] as Map<String, dynamic>;
          final sections = (page['sections'] as List)
              .cast<Map<String, dynamic>>();

          expect(document.title(l10n), page['title']);
          expect(document.intro(l10n), page['intro']);
          expect(document.sections(l10n), [
            for (final section in sections)
              (
                title: section['title'] as String,
                body: (section['paragraphs'] as List).join('\n\n'),
              ),
          ]);
        });
      }

      test("around the pages is the web's Legal and NotFound", () {
        final legal = web['Legal'] as Map<String, dynamic>;
        final notFound = web['NotFound'] as Map<String, dynamic>;

        expect(l10n.legalDraft, legal['draft']);
        expect(l10n.legalContents, legal['contents']);
        expect(l10n.notFoundTitle, notFound['title']);
        expect(l10n.notFoundBack, notFound['back']);
      });
    });
  }
}
