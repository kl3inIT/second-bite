import 'package:app_ui/app_ui.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:second_bite/core/not_found_screen.dart';

import '../helpers/helpers.dart';

void main() {
  group(NotFoundScreen, () {
    testWidgets('answers an unknown address and leads home', (tester) async {
      await tester.pumpRouterApp(
        GoRouter(
          initialLocation: '/khong-co-trang-nay',
          routes: [GoRoute(path: '/', builder: (_, _) => const Text('home'))],
          errorBuilder: (_, _) => const NotFoundScreen(),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Không tìm thấy trang này'), findsOneWidget);

      await tester.tap(find.widgetWithText(OutlinedButton, 'Về trang chủ'));
      await tester.pumpAndSettle();
      expect(find.text('home'), findsOneWidget);
    });
  });
}
