import 'package:app_ui/app_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:second_bite/core/app_locale.dart';
import 'package:second_bite/core/router.dart';
import 'package:second_bite/l10n/l10n.dart';

/// {@template app}
/// The app shell: the theme from app_ui, Vietnamese and English with the
/// device's language first unless the person chose one, and the typed
/// routes.
/// {@endtemplate}
class App extends ConsumerWidget {
  /// {@macro app}
  const new({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp.router(
      onGenerateTitle: (context) => context.l10n.appTitle,
      theme: AppTheme.light,
      locale: ref.watch(appLocaleProvider),
      localizationsDelegates: appLocalizationsDelegates,
      supportedLocales: AppLocalizations.supportedLocales,
      routerConfig: ref.watch(routerProvider),
    );
  }
}
