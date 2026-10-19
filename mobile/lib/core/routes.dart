import 'package:app_ui/app_ui.dart';
import 'package:go_router/go_router.dart';
import 'package:second_bite/features/offer/domain/offer_summary.dart';
import 'package:second_bite/features/offer/ui/home_screen.dart';

part 'routes.g.dart';

/// The customer home at `/`, the root of the route tree. Paths match the
/// web's, so a shared link opens the same place in both apps: `?q=` words,
/// `?kind=` one kind, `?now=1` what can be collected now.
@TypedGoRoute<HomeRoute>(path: '/')
class HomeRoute extends GoRouteData with $HomeRoute {
  /// The route to the home, filtered by what is given.
  const new({this.q, this.kind, this.now});

  /// Words to search for.
  final String? q;

  /// One kind of food, as the API names it (`bakery`, `prepared_food`…).
  final String? kind;

  /// `1` for what can be collected now.
  final String? now;

  @override
  Widget build(BuildContext context, GoRouterState state) => HomeScreen(
    query: readHomeQuery(q: q, kind: kind, now: now),
  );
}
