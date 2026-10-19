import 'package:app_ui/app_ui.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../helpers/helpers.dart';

void main() {
  group(AppGoogleButton, () {
    testWidgets("renders Google's G and the wording it is given", (
      tester,
    ) async {
      await tester.pumpApp(
        AppGoogleButton(label: 'Tiếp tục với Google', onPressed: () {}),
      );

      expect(find.text('Tiếp tục với Google'), findsOneWidget);
      expect(find.byType(SvgPicture), findsOneWidget);
    });

    testWidgets('calls onPressed when tapped', (tester) async {
      var tapped = false;
      await tester.pumpApp(
        AppGoogleButton(
          label: 'Continue with Google',
          onPressed: () => tapped = true,
        ),
      );

      await tester.tap(find.byType(AppGoogleButton));

      expect(tapped, isTrue);
    });
  });
}
