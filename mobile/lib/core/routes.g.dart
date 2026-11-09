// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'routes.dart';

// **************************************************************************
// GoRouterGenerator
// **************************************************************************

List<RouteBase> get $appRoutes => [
  $appShellRoute,
  $deleteAccountRoute,
  $sellerRoute,
  $offerRoute,
  $searchRoute,
  $cartRoute,
  $termsRoute,
  $privacyRoute,
  $signInRoute,
  $signInByEmailRoute,
  $registerRoute,
];

RouteBase get $appShellRoute => StatefulShellRouteData.$route(
  factory: $AppShellRouteExtension._fromState,
  branches: [
    StatefulShellBranchData.$branch(
      routes: [
        GoRouteData.$route(
          path: '/',
          hasOverriddenOnExit: false,
          factory: $HomeRoute._fromState,
        ),
      ],
    ),
    StatefulShellBranchData.$branch(
      routes: [
        GoRouteData.$route(
          path: '/orders',
          hasOverriddenOnExit: false,
          factory: $OrdersRoute._fromState,
          routes: [
            GoRouteData.$route(
              path: ':orderId',
              hasOverriddenOnExit: false,
              parentNavigatorKey: OrderRoute.$parentNavigatorKey,
              factory: $OrderRoute._fromState,
              routes: [
                GoRouteData.$route(
                  path: 'chat',
                  hasOverriddenOnExit: false,
                  parentNavigatorKey: OrderChatRoute.$parentNavigatorKey,
                  factory: $OrderChatRoute._fromState,
                ),
              ],
            ),
          ],
        ),
      ],
    ),
    StatefulShellBranchData.$branch(
      routes: [
        GoRouteData.$route(
          path: '/favourites',
          hasOverriddenOnExit: false,
          factory: $FavouritesRoute._fromState,
        ),
      ],
    ),
    StatefulShellBranchData.$branch(
      routes: [
        GoRouteData.$route(
          path: '/account',
          hasOverriddenOnExit: false,
          factory: $AccountRoute._fromState,
          routes: [
            GoRouteData.$route(
              path: 'settings',
              hasOverriddenOnExit: false,
              parentNavigatorKey: AccountSettingsRoute.$parentNavigatorKey,
              factory: $AccountSettingsRoute._fromState,
            ),
          ],
        ),
      ],
    ),
  ],
);

extension $AppShellRouteExtension on AppShellRoute {
  static AppShellRoute _fromState(GoRouterState state) => const AppShellRoute();
}

mixin $HomeRoute on GoRouteData {
  static HomeRoute _fromState(GoRouterState state) => HomeRoute(
    q: state.uri.queryParameters['q'],
    kind: state.uri.queryParameters['kind'],
    now: state.uri.queryParameters['now'],
  );

  HomeRoute get _self => this as HomeRoute;

  @override
  String get location => GoRouteData.$location(
    '/',
    queryParams: {
      if (_self.q != null) 'q': _self.q,
      if (_self.kind != null) 'kind': _self.kind,
      if (_self.now != null) 'now': _self.now,
    },
  );

  @override
  void go(BuildContext context) => context.go(location);

  @override
  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  @override
  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  @override
  void replace(BuildContext context) => context.replace(location);
}

mixin $OrdersRoute on GoRouteData {
  static OrdersRoute _fromState(GoRouterState state) =>
      OrdersRoute(state: state.uri.queryParameters['state']);

  OrdersRoute get _self => this as OrdersRoute;

  @override
  String get location => GoRouteData.$location(
    '/orders',
    queryParams: {if (_self.state != null) 'state': _self.state},
  );

  @override
  void go(BuildContext context) => context.go(location);

  @override
  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  @override
  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  @override
  void replace(BuildContext context) => context.replace(location);
}

mixin $OrderRoute on GoRouteData {
  static OrderRoute _fromState(GoRouterState state) =>
      OrderRoute(orderId: state.pathParameters['orderId']!);

  OrderRoute get _self => this as OrderRoute;

  @override
  String get location =>
      GoRouteData.$location('/orders/${Uri.encodeComponent(_self.orderId)}');

  @override
  void go(BuildContext context) => context.go(location);

  @override
  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  @override
  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  @override
  void replace(BuildContext context) => context.replace(location);
}

mixin $OrderChatRoute on GoRouteData {
  static OrderChatRoute _fromState(GoRouterState state) =>
      OrderChatRoute(orderId: state.pathParameters['orderId']!);

  OrderChatRoute get _self => this as OrderChatRoute;

  @override
  String get location => GoRouteData.$location(
    '/orders/${Uri.encodeComponent(_self.orderId)}/chat',
  );

  @override
  void go(BuildContext context) => context.go(location);

  @override
  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  @override
  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  @override
  void replace(BuildContext context) => context.replace(location);
}

mixin $FavouritesRoute on GoRouteData {
  static FavouritesRoute _fromState(GoRouterState state) =>
      const FavouritesRoute();

  @override
  String get location => GoRouteData.$location('/favourites');

  @override
  void go(BuildContext context) => context.go(location);

  @override
  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  @override
  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  @override
  void replace(BuildContext context) => context.replace(location);
}

mixin $AccountRoute on GoRouteData {
  static AccountRoute _fromState(GoRouterState state) => const AccountRoute();

  @override
  String get location => GoRouteData.$location('/account');

  @override
  void go(BuildContext context) => context.go(location);

  @override
  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  @override
  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  @override
  void replace(BuildContext context) => context.replace(location);
}

mixin $AccountSettingsRoute on GoRouteData {
  static AccountSettingsRoute _fromState(GoRouterState state) =>
      const AccountSettingsRoute();

  @override
  String get location => GoRouteData.$location('/account/settings');

  @override
  void go(BuildContext context) => context.go(location);

  @override
  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  @override
  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  @override
  void replace(BuildContext context) => context.replace(location);
}

RouteBase get $deleteAccountRoute => GoRouteData.$route(
  path: '/delete-account',
  hasOverriddenOnExit: false,
  factory: $DeleteAccountRoute._fromState,
);

mixin $DeleteAccountRoute on GoRouteData {
  static DeleteAccountRoute _fromState(GoRouterState state) =>
      const DeleteAccountRoute();

  @override
  String get location => GoRouteData.$location('/delete-account');

  @override
  void go(BuildContext context) => context.go(location);

  @override
  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  @override
  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  @override
  void replace(BuildContext context) => context.replace(location);
}

RouteBase get $sellerRoute => GoRouteData.$route(
  path: '/sellers/:id',
  hasOverriddenOnExit: false,
  factory: $SellerRoute._fromState,
);

mixin $SellerRoute on GoRouteData {
  static SellerRoute _fromState(GoRouterState state) => SellerRoute(
    id: state.pathParameters['id']!,
    kind: state.uri.queryParameters['kind'],
    q: state.uri.queryParameters['q'],
    at: state.uri.queryParameters['at'],
  );

  SellerRoute get _self => this as SellerRoute;

  @override
  String get location => GoRouteData.$location(
    '/sellers/${Uri.encodeComponent(_self.id)}',
    queryParams: {
      if (_self.kind != null) 'kind': _self.kind,
      if (_self.q != null) 'q': _self.q,
      if (_self.at != null) 'at': _self.at,
    },
  );

  @override
  void go(BuildContext context) => context.go(location);

  @override
  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  @override
  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  @override
  void replace(BuildContext context) => context.replace(location);
}

RouteBase get $offerRoute => GoRouteData.$route(
  path: '/offers/:id',
  hasOverriddenOnExit: false,
  factory: $OfferRoute._fromState,
);

mixin $OfferRoute on GoRouteData {
  static OfferRoute _fromState(GoRouterState state) =>
      OfferRoute(id: state.pathParameters['id']!);

  OfferRoute get _self => this as OfferRoute;

  @override
  String get location =>
      GoRouteData.$location('/offers/${Uri.encodeComponent(_self.id)}');

  @override
  void go(BuildContext context) => context.go(location);

  @override
  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  @override
  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  @override
  void replace(BuildContext context) => context.replace(location);
}

RouteBase get $searchRoute => GoRouteData.$route(
  path: '/search',
  hasOverriddenOnExit: false,
  factory: $SearchRoute._fromState,
);

mixin $SearchRoute on GoRouteData {
  static SearchRoute _fromState(GoRouterState state) => SearchRoute(
    q: state.uri.queryParameters['q'],
    kind: state.uri.queryParameters['kind'],
    now: state.uri.queryParameters['now'],
    radiusKm: state.uri.queryParameters['radiusKm'],
    minPrice: state.uri.queryParameters['minPrice'],
    maxPrice: state.uri.queryParameters['maxPrice'],
    from: state.uri.queryParameters['from'],
    to: state.uri.queryParameters['to'],
    sort: state.uri.queryParameters['sort'],
  );

  SearchRoute get _self => this as SearchRoute;

  @override
  String get location => GoRouteData.$location(
    '/search',
    queryParams: {
      if (_self.q != null) 'q': _self.q,
      if (_self.kind != null) 'kind': _self.kind,
      if (_self.now != null) 'now': _self.now,
      if (_self.radiusKm != null) 'radiusKm': _self.radiusKm,
      if (_self.minPrice != null) 'minPrice': _self.minPrice,
      if (_self.maxPrice != null) 'maxPrice': _self.maxPrice,
      if (_self.from != null) 'from': _self.from,
      if (_self.to != null) 'to': _self.to,
      if (_self.sort != null) 'sort': _self.sort,
    },
  );

  @override
  void go(BuildContext context) => context.go(location);

  @override
  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  @override
  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  @override
  void replace(BuildContext context) => context.replace(location);
}

RouteBase get $cartRoute => GoRouteData.$route(
  path: '/cart',
  hasOverriddenOnExit: false,
  factory: $CartRoute._fromState,
);

mixin $CartRoute on GoRouteData {
  static CartRoute _fromState(GoRouterState state) => const CartRoute();

  @override
  String get location => GoRouteData.$location('/cart');

  @override
  void go(BuildContext context) => context.go(location);

  @override
  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  @override
  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  @override
  void replace(BuildContext context) => context.replace(location);
}

RouteBase get $termsRoute => GoRouteData.$route(
  path: '/terms',
  hasOverriddenOnExit: false,
  factory: $TermsRoute._fromState,
);

mixin $TermsRoute on GoRouteData {
  static TermsRoute _fromState(GoRouterState state) => const TermsRoute();

  @override
  String get location => GoRouteData.$location('/terms');

  @override
  void go(BuildContext context) => context.go(location);

  @override
  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  @override
  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  @override
  void replace(BuildContext context) => context.replace(location);
}

RouteBase get $privacyRoute => GoRouteData.$route(
  path: '/privacy',
  hasOverriddenOnExit: false,
  factory: $PrivacyRoute._fromState,
);

mixin $PrivacyRoute on GoRouteData {
  static PrivacyRoute _fromState(GoRouterState state) => const PrivacyRoute();

  @override
  String get location => GoRouteData.$location('/privacy');

  @override
  void go(BuildContext context) => context.go(location);

  @override
  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  @override
  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  @override
  void replace(BuildContext context) => context.replace(location);
}

RouteBase get $signInRoute => GoRouteData.$route(
  path: '/sign-in',
  hasOverriddenOnExit: false,
  factory: $SignInRoute._fromState,
);

mixin $SignInRoute on GoRouteData {
  static SignInRoute _fromState(GoRouterState state) =>
      SignInRoute(returnTo: state.uri.queryParameters['return-to']);

  SignInRoute get _self => this as SignInRoute;

  @override
  String get location => GoRouteData.$location(
    '/sign-in',
    queryParams: {if (_self.returnTo != null) 'return-to': _self.returnTo},
  );

  @override
  void go(BuildContext context) => context.go(location);

  @override
  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  @override
  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  @override
  void replace(BuildContext context) => context.replace(location);
}

RouteBase get $signInByEmailRoute => GoRouteData.$route(
  path: '/sign-in/email',
  hasOverriddenOnExit: false,
  factory: $SignInByEmailRoute._fromState,
);

mixin $SignInByEmailRoute on GoRouteData {
  static SignInByEmailRoute _fromState(GoRouterState state) =>
      SignInByEmailRoute(
        returnTo: state.uri.queryParameters['return-to'],
        googleEmail: state.uri.queryParameters['google-email'],
      );

  SignInByEmailRoute get _self => this as SignInByEmailRoute;

  @override
  String get location => GoRouteData.$location(
    '/sign-in/email',
    queryParams: {
      if (_self.returnTo != null) 'return-to': _self.returnTo,
      if (_self.googleEmail != null) 'google-email': _self.googleEmail,
    },
  );

  @override
  void go(BuildContext context) => context.go(location);

  @override
  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  @override
  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  @override
  void replace(BuildContext context) => context.replace(location);
}

RouteBase get $registerRoute => GoRouteData.$route(
  path: '/register',
  hasOverriddenOnExit: false,
  factory: $RegisterRoute._fromState,
);

mixin $RegisterRoute on GoRouteData {
  static RegisterRoute _fromState(GoRouterState state) =>
      RegisterRoute(returnTo: state.uri.queryParameters['return-to']);

  RegisterRoute get _self => this as RegisterRoute;

  @override
  String get location => GoRouteData.$location(
    '/register',
    queryParams: {if (_self.returnTo != null) 'return-to': _self.returnTo},
  );

  @override
  void go(BuildContext context) => context.go(location);

  @override
  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  @override
  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  @override
  void replace(BuildContext context) => context.replace(location);
}
