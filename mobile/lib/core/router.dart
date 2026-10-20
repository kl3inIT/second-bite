import 'package:go_router/go_router.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:second_bite/core/not_found_screen.dart';
import 'package:second_bite/core/routes.dart';

part 'router.g.dart';

/// The app's [GoRouter], built once and kept for the app's life. An address
/// it does not know shows the not-found screen, as the web's.
@Riverpod(keepAlive: true)
GoRouter router(Ref ref) {
  final router = GoRouter(
    routes: $appRoutes,
    errorBuilder: (context, state) => const NotFoundScreen(),
  );
  ref.onDispose(router.dispose);
  return router;
}
