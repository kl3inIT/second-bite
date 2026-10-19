import 'package:app_ui/app_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/misc.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:mocktail/mocktail.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/features/identity/data/auth_repository.dart';
import 'package:second_bite/l10n/l10n.dart';

/// An [AuthRepository] that answers nothing until a test says what.
class MockAuthRepository extends Mock implements AuthRepository;

/// An [AuthRepository] for a screen that only shows who is signed in:
/// [account], or no one, and no Google.
AuthRepository signedInAs(AccountBody? account) {
  final auth = MockAuthRepository();
  when(auth.currentAccount).thenAnswer((_) async => account);
  when(auth.googleClientId).thenAnswer((_) async => null);
  return auth;
}

/// A customer account as `GET /accounts/me` answers.
const sampleAccount = AccountBody(
  id: 'ac-1',
  email: 'lan@gmail.com',
  displayName: '',
  role: AccountBodyRole.customer,
);

/// Pumps a screen inside the app's theme and localizations, as the testing
/// skill asks, instead of an inline `MaterialApp` in each test.
extension PumpApp on WidgetTester {
  /// Pumps [widget] with [AppTheme.light], both catalogs and [locale]
  /// (Vietnamese unless given), under a [ProviderScope] with [overrides]
  /// that never retries a failed provider, so a failure shows at once. The
  /// session comes from [auth], signed out unless given.
  Future<void> pumpApp(
    Widget widget, {
    Locale locale = const Locale('vi'),
    List<Override> overrides = const [],
    AuthRepository? auth,
  }) {
    return pumpWidget(
      ProviderScope(
        overrides: [
          authRepositoryProvider.overrideWithValue(auth ?? signedInAs(null)),
          ...overrides,
        ],
        retry: (_, _) => null,
        child: MaterialApp(
          theme: AppTheme.light,
          locale: locale,
          localizationsDelegates: appLocalizationsDelegates,
          supportedLocales: AppLocalizations.supportedLocales,
          home: widget,
        ),
      ),
    );
  }

  /// As [pumpApp], for a screen that navigates: [router] decides what shows.
  Future<void> pumpRouterApp(
    GoRouter router, {
    Locale locale = const Locale('vi'),
    List<Override> overrides = const [],
    AuthRepository? auth,
  }) {
    addTearDown(router.dispose);
    return pumpWidget(
      ProviderScope(
        overrides: [
          authRepositoryProvider.overrideWithValue(auth ?? signedInAs(null)),
          ...overrides,
        ],
        retry: (_, _) => null,
        child: MaterialApp.router(
          theme: AppTheme.light,
          locale: locale,
          localizationsDelegates: appLocalizationsDelegates,
          supportedLocales: AppLocalizations.supportedLocales,
          routerConfig: router,
        ),
      ),
    );
  }
}
