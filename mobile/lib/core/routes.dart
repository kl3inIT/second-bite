import 'package:app_ui/app_ui.dart';
import 'package:go_router/go_router.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/core/app_shell.dart';
import 'package:second_bite/features/identity/domain/return_to.dart';
import 'package:second_bite/features/identity/ui/account_screen.dart';
import 'package:second_bite/features/identity/ui/account_settings_screen.dart';
import 'package:second_bite/features/identity/ui/delete_account_screen.dart';
import 'package:second_bite/features/identity/ui/register_screen.dart';
import 'package:second_bite/features/identity/ui/sign_in_by_email_screen.dart';
import 'package:second_bite/features/identity/ui/sign_in_screen.dart';
import 'package:second_bite/features/legal/ui/legal_screen.dart';
import 'package:second_bite/features/legal/ui/legal_text.dart';
import 'package:second_bite/features/offer/domain/offer_summary.dart';
import 'package:second_bite/features/offer/domain/search_query.dart';
import 'package:second_bite/features/offer/ui/home_screen.dart';
import 'package:second_bite/features/offer/ui/offer_link_screen.dart';
import 'package:second_bite/features/offer/ui/search_screen.dart';
import 'package:second_bite/features/offer/ui/seller_screen.dart';
import 'package:second_bite/features/order/ui/cart_screen.dart';
import 'package:second_bite/features/order/ui/chat_screen.dart';
import 'package:second_bite/features/order/ui/order_screen.dart';
import 'package:second_bite/features/order/ui/orders_screen.dart';
import 'package:second_bite/features/seller/ui/favourites_screen.dart';

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
    TypedStatefulShellBranch<OrdersBranch>(
      routes: [
        TypedGoRoute<OrdersRoute>(
          path: '/orders',
          routes: [
            TypedGoRoute<OrderRoute>(
              path: ':orderId',
              routes: [TypedGoRoute<OrderChatRoute>(path: 'chat')],
            ),
          ],
        ),
      ],
    ),
    TypedStatefulShellBranch<FavouritesBranch>(
      routes: [TypedGoRoute<FavouritesRoute>(path: '/favourites')],
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

/// The orders tab.
class OrdersBranch extends StatefulShellBranchData {
  /// The orders tab.
  const new();
}

/// The saved stores' tab.
class FavouritesBranch extends StatefulShellBranchData {
  /// The saved stores' tab.
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

/// "Yêu thích" at `/favourites`, as on the web (SEC-204 step 13): the stores
/// this person follows.
class FavouritesRoute extends GoRouteData with $FavouritesRoute {
  /// The route to the saved stores.
  const new();

  @override
  Widget build(BuildContext context, GoRouterState state) =>
      const FavouritesScreen();
}

/// The orders tab at `/orders`, as on the web (SEC-204): the orders still to
/// collect, or with `?state=ended` those that ended.
class OrdersRoute extends GoRouteData with $OrdersRoute {
  /// The route to the orders tab, on [state]'s list.
  const new({this.state});

  /// `ended` for the orders that ended; the others otherwise.
  final String? state;

  @override
  Widget build(BuildContext context, GoRouterState state) =>
      OrdersScreen(ended: this.state == 'ended');
}

/// An order's page at `/orders/:orderId`, as on the web (SEC-204): over the
/// tabs, with its own blue band.
class OrderRoute extends GoRouteData with $OrderRoute {
  /// The route to [orderId]'s page.
  const new({required this.orderId});

  /// The order.
  final String orderId;

  /// Opens over the tabs.
  static final GlobalKey<NavigatorState> $parentNavigatorKey = rootNavigatorKey;

  @override
  Widget build(BuildContext context, GoRouterState state) =>
      OrderScreen(orderId: orderId);
}

/// An order's chat with its store at `/orders/:orderId/chat`, as on the web
/// (SEC-204): over the tabs, from the order's page.
class OrderChatRoute extends GoRouteData with $OrderChatRoute {
  /// The route to [orderId]'s chat.
  const new({required this.orderId});

  /// The order.
  final String orderId;

  /// Opens over the tabs.
  static final GlobalKey<NavigatorState> $parentNavigatorKey = rootNavigatorKey;

  @override
  Widget build(BuildContext context, GoRouterState state) =>
      ChatScreen(orderId: orderId);
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

/// A store's dishes tonight at `/sellers/:id`, as on the web (SEC-204): over
/// the tabs, `?kind=` one tab, `?q=` words among its dishes, `?at=` the dish
/// a link led to.
@TypedGoRoute<SellerRoute>(path: '/sellers/:id')
class SellerRoute extends GoRouteData with $SellerRoute {
  /// The route to a store's page.
  const new({required this.id, this.kind, this.q, this.at});

  /// The store.
  final String id;

  /// One kind, as the API names it; an unknown kind is every kind.
  final String? kind;

  /// Words to look for among its dishes.
  final String? q;

  /// The dish a link led to.
  final String? at;

  @override
  Widget build(BuildContext context, GoRouterState state) => SellerScreen(
    sellerId: id,
    kind: FoundBodyKind.values
        .where((known) => known.json == kind && known != FoundBodyKind.$unknown)
        .firstOrNull,
    q: q,
    at: at,
  );
}

/// One dish at `/offers/:id`, as on the web: its store's page at the dish.
@TypedGoRoute<OfferRoute>(path: '/offers/:id')
class OfferRoute extends GoRouteData with $OfferRoute {
  /// The route to a dish.
  const new({required this.id});

  /// The dish.
  final String id;

  @override
  Widget build(BuildContext context, GoRouterState state) =>
      OfferLinkScreen(offerId: id);
}

/// The search at `/search`, as on the web (SEC-204 step 14): over the tabs,
/// with the web's keys. The place is the one kept on the phone, so `near`
/// and `place` are not in the address.
@TypedGoRoute<SearchRoute>(path: '/search')
class SearchRoute extends GoRouteData with $SearchRoute {
  /// The route to the search, filtered by what is given.
  const new({
    this.q,
    this.kind,
    this.now,
    @TypedQueryParameter(name: 'radiusKm') this.radiusKm,
    @TypedQueryParameter(name: 'minPrice') this.minPrice,
    @TypedQueryParameter(name: 'maxPrice') this.maxPrice,
    this.from,
    this.to,
    this.sort,
  });

  /// The route to [query].
  new of(SearchQuery query)
    : this(
        q: query.q,
        kind: query.kind?.json,
        now: query.now ? '1' : null,
        radiusKm: query.radiusKm?.toString(),
        minPrice: query.minPrice?.toString(),
        maxPrice: query.maxPrice?.toString(),
        from: query.from,
        to: query.to,
        sort: query.sort?.json,
      );

  /// Words searched.
  final String? q;

  /// One kind, as the API names it.
  final String? kind;

  /// `1` for what can be collected now.
  final String? now;

  /// How far around the place, `1`, `2` or `5`.
  final String? radiusKm;

  /// The price of one portion from, in đồng.
  final String? minPrice;

  /// The price of one portion to, in đồng.
  final String? maxPrice;

  /// Collected from tonight, `20:00`.
  final String? from;

  /// Collected until tonight, `21:30`.
  final String? to;

  /// The order, as the API names it.
  final String? sort;

  @override
  Widget build(BuildContext context, GoRouterState state) => SearchScreen(
    params: (
      q: q,
      kind: kind,
      now: now,
      radiusKm: radiusKm,
      minPrice: minPrice,
      maxPrice: maxPrice,
      from: from,
      to: to,
      sort: sort,
    ),
  );
}

/// The cart's confirmation at `/cart`, as on the web (SEC-204): over the
/// tabs, from the cart's bar.
@TypedGoRoute<CartRoute>(path: '/cart')
class CartRoute extends GoRouteData with $CartRoute {
  /// The route to the cart.
  const new();

  @override
  Widget build(BuildContext context, GoRouterState state) => const CartScreen();
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

/// Signing in with the emailed code at `/sign-in/email?returnTo=`, as on the
/// web since SEC-193 (SEC-196); `googleEmail` is the address Google gave when
/// its account needs the code, empty when it gave none.
@TypedGoRoute<SignInByEmailRoute>(path: '/sign-in/email')
class SignInByEmailRoute extends GoRouteData with $SignInByEmailRoute {
  /// The route to sign in by email, then back to [returnTo].
  const new({this.returnTo, this.googleEmail});

  /// Where to go once signed in.
  final String? returnTo;

  /// The address Google gave, when Google opened this screen.
  final String? googleEmail;

  @override
  Widget build(BuildContext context, GoRouterState state) =>
      SignInByEmailScreen(
        returnTo: readReturnTo(returnTo),
        googleEmail: googleEmail,
      );
}

/// Registering with a username and a password at `/register?returnTo=`, as
/// on the web (SEC-196).
@TypedGoRoute<RegisterRoute>(path: '/register')
class RegisterRoute extends GoRouteData with $RegisterRoute {
  /// The route to register, then back to [returnTo].
  const new({this.returnTo});

  /// Where to go once registered.
  final String? returnTo;

  @override
  Widget build(BuildContext context, GoRouterState state) =>
      RegisterScreen(returnTo: readReturnTo(returnTo));
}
