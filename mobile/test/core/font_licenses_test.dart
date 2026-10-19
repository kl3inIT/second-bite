import 'package:app_ui/app_ui.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test("app_ui's typefaces reach the licence page", () async {
    registerFontLicenses();

    final entries = await LicenseRegistry.licenses.toList();
    final packages = entries.expand((entry) => entry.packages).toSet();
    expect(packages, containsAll(['Be Vietnam Pro', 'Bricolage Grotesque']));

    final bricolage = entries.firstWhere(
      (entry) => entry.packages.contains('Bricolage Grotesque'),
    );
    final text = bricolage.paragraphs.map((p) => p.text).join(' ');
    expect(text, contains('SIL Open Font License'));
  });
}
