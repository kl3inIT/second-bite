import 'package:app_ui/app_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/misc.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:second_bite/l10n/l10n.dart';

/// Pumps a screen inside the app's theme and localizations, as the testing
/// skill asks, instead of an inline `MaterialApp` in each test.
extension PumpApp on WidgetTester {
  /// Pumps [widget] with [AppTheme.light], both catalogs and [locale]
  /// (Vietnamese unless given), under a [ProviderScope] with [overrides]
  /// that never retries a failed provider, so a failure shows at once.
  Future<void> pumpApp(
    Widget widget, {
    Locale locale = const Locale('vi'),
    List<Override> overrides = const [],
  }) {
    return pumpWidget(
      ProviderScope(
        overrides: overrides,
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
}
