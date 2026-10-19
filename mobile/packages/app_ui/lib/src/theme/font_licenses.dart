import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

/// The bundled typefaces and the file holding each one's licence.
const _fontLicenses = {
  'Be Vietnam Pro': 'BeVietnamPro-OFL.txt',
  'Bricolage Grotesque': 'BricolageGrotesque-OFL.txt',
};

/// Adds the licences of app_ui's typefaces to the app's licence page, as the
/// SIL Open Font License asks of software that bundles the fonts. Call it once,
/// before `runApp`.
void registerFontLicenses() {
  LicenseRegistry.addLicense(() async* {
    for (final MapEntry(key: family, value: file) in _fontLicenses.entries) {
      final text = await rootBundle.loadString(
        'packages/app_ui/assets/fonts/$file',
      );
      yield LicenseEntryWithLineBreaks([family], text);
    }
  });
}
