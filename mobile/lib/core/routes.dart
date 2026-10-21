import 'package:app_ui/app_ui.dart';
import 'package:go_router/go_router.dart';
import 'package:second_bite/core/app_shell.dart';
import 'package:second_bite/features/identity/domain/return_to.dart';
import 'package:second_bite/features/identity/ui/account_screen.dart';
import 'package:second_bite/features/identity/ui/account_settings_screen.dart';
import 'package:second_bite/features/identity/ui/delete_account_screen.dart';
import 'package:second_bite/features/identity/ui/sign_in_screen.dart';
import 'package:second_bite/features/legal/ui/legal_screen.dart';
import 'package:second_bite/features/legal/ui/legal_text.dart';
import 'package:second_bite/features/offer/domain/offer_summary.dart';
import 'package:second_bite/features/offer/ui/home_screen.dart';

part 'routes.g.dart';

/// The navigator over the tabs: a screen that names it opens full screen,
/// above the bottom bar, while its path stays under a tab's.
final rootNavigatorKey = GlobalKey<NavigatorState>();

/// The customer screens under the bottom bar, one branch per tab that has a
/// screen, so each tab keeps its place when another is opened. Paths match
/// the web's, so a shared link opens the same place in both apps.
@TypedStatefulShellRoute<AppShellRoute>(
  branches: [
    TypedStatefulShellBranch<HomeBranch>(
      routes: [TypedGoRoute<HomeRoute>(path: '/')],
    ),
    TypedStatefulShellBranch<AccountBranch>(
      routes: [
        TypedGoRoute<AccountRoute>(
          path: '/account',
          routes: [TypedGoRoute<AccountSettingsRoute>(path: 'settings')],
        ),
      ],
    ),
  ],
)
class AppShellRoute extends StatefulShellRouteData {
  /// The shell of the customer screens.
  const new();

  @override
  Widget builder(
    BuildContext context,
    GoRouterState state,
    StatefulNavigationShell navigationShell,
  ) => AppShell(navigationShell: navigationShell);
}

/// The home tab.
class HomeBranch extends StatefulShellBranchData {
  /// The home tab.
  const new();
}

/// The account tab.
class AccountBranch extends StatefulShellBranchData {
  /// The account tab.
  const new();
}

/// The customer home at `/`: `?q=` words, `?kind=` one kind, `?now=1` what
/// can be collected now, as on the web.
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

/// The account tab at `/account`, as on the web.
class AccountRoute extends GoRouteData with $AccountRoute {
  /// The route to the account tab.
  const new();

  @override
  Widget build(BuildContext context, GoRouterState state) =>
      const AccountScreen();
}

/// Account settings at `/account/settings`, as on the web (SEC-37): over
/// the tabs, from the account tab. Under `/account`, so going there from
/// anywhere, as sign-in does, keeps the account tab to go back to (SEC-69).
class AccountSettingsRoute extends GoRouteData with $AccountSettingsRoute {
  /// The route to account settings.
  const new();

  /// Opens over the tabs.
  static final GlobalKey<NavigatorState> $parentNavigatorKey = rootNavigatorKey;

  @override
  Widget build(BuildContext context, GoRouterState state) =>
      const AccountSettingsScreen();
}

/// Deleting the account at `/delete-account`, as on the web (SEC-37): over
/// the tabs, from the foot of account settings.
@TypedGoRoute<DeleteAccountRoute>(path: '/delete-account')
class DeleteAccountRoute extends GoRouteData with $DeleteAccountRoute {
  /// The route to delete the account.
  const new();

  @override
  Widget build(BuildContext context, GoRouterState state) =>
      const DeleteAccountScreen();
}

/// The terms of use at `/terms`, as on the web: over the tabs, read inside
/// the app (SEC-52).
@TypedGoRoute<TermsRoute>(path: '/terms')
class TermsRoute extends GoRouteData with $TermsRoute {
  /// The route to the terms of use.
  const new();

  @override
  Widget build(BuildContext context, GoRouterState state) =>
      const LegalScreen(document: LegalDocument.terms);
}

/// The privacy policy at `/privacy`, as on the web: over the tabs, read
/// inside the app (SEC-52).
@TypedGoRoute<PrivacyRoute>(path: '/privacy')
class PrivacyRoute extends GoRouteData with $PrivacyRoute {
  /// The route to the privacy policy.
  const new();

  @override
  Widget build(BuildContext context, GoRouterState state) =>
      const LegalScreen(document: LegalDocument.privacy);
}

/// The sign-in screen at `/sign-in?returnTo=`, as on the web: over the
/// tabs, and back to `returnTo` afterwards, kept only when it is a path of
/// the app.
@TypedGoRoute<SignInRoute>(path: '/sign-in')
class SignInRoute extends GoRouteData with $SignInRoute {
  /// The route to sign in, then back to [returnTo].
  const new({this.returnTo});

  /// Where to go once signed in.
  final String? returnTo;

  @override
  Widget build(BuildContext context, GoRouterState state) =>
      SignInScreen(returnTo: readReturnTo(returnTo));
}
