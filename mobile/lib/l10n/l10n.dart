import 'package:app_ui/app_ui.dart';
import 'package:second_bite/l10n/gen/app_localizations.dart';

export 'package:second_bite/l10n/gen/app_localizations.dart';

/// The app's strings, then Flutter's, Material's and Cupertino's in the same
/// language. `GlobalMaterialLocalizations` is material_ui's: the
/// `flutter_localizations` one that gen-l10n lists serves the framework's
/// frozen Material, whose widgets the app does not use.
const appLocalizationsDelegates = <LocalizationsDelegate<dynamic>>[
  AppLocalizations.delegate,
  ...GlobalMaterialLocalizations.delegates,
];

/// Reads the app's strings as `context.l10n`, as the internationalization
/// skill asks, instead of `AppLocalizations.of(context)`.
extension AppLocalizationsX on BuildContext {
  /// The [AppLocalizations] of the nearest locale.
  AppLocalizations get l10n => AppLocalizations.of(this);
}
