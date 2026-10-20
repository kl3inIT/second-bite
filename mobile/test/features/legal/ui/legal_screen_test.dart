import 'package:app_ui/app_ui.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:second_bite/features/legal/ui/legal_screen.dart';
import 'package:second_bite/features/legal/ui/legal_text.dart';

import '../../../helpers/helpers.dart';

void main() {
  group(LegalScreen, () {
    group('renders', () {
      testWidgets('the terms under their name, the draft notice and the date', (
        tester,
      ) async {
        await tester.pumpApp(const LegalScreen(document: LegalDocument.terms));

        expect(
          find.descendant(
            of: find.byType(AppBar),
            matching: find.text('Điều khoản sử dụng'),
          ),
          findsOneWidget,
        );
        expect(find.textContaining('Bản nháp'), findsOneWidget);
        expect(find.textContaining('Cập nhật lần cuối'), findsOneWidget);
        expect(find.text('Các mục'), findsOneWidget);
      });

      testWidgets('the privacy policy in English', (tester) async {
        await tester.pumpApp(
          const LegalScreen(document: LegalDocument.privacy),
          locale: const Locale('en'),
        );

        expect(find.text('Privacy policy'), findsOneWidget);
        expect(find.textContaining('Draft'), findsOneWidget);
      });
    });

    testWidgets('scrolls to a section from the list of sections', (
      tester,
    ) async {
      await tester.pumpApp(const LegalScreen(document: LegalDocument.terms));
      const title = '1. Second Bite là gì';
      // The heading of the section, not its entry in the list.
      final heading = find.text(title).last;
      final before = tester.getTopLeft(heading).dy;

      await tester.tap(find.text(title).first);
      await tester.pumpAndSettle();

      expect(tester.getTopLeft(heading).dy, lessThan(before));
    });
  });
}
