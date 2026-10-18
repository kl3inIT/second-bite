import 'package:app_ui/app_ui.dart';
import 'package:go_router/go_router.dart';
import 'package:second_bite/features/offer/ui/home_screen.dart';

part 'routes.g.dart';

/// The customer home at `/`, the root of the route tree. Paths match the
/// web's, so a shared link opens the same place in both apps.
@TypedGoRoute<HomeRoute>(path: '/')
class HomeRoute extends GoRouteData with $HomeRoute {
  /// The route to the home.
  const new();

  @override
  Widget build(BuildContext context, GoRouterState state) => const HomeScreen();
}
