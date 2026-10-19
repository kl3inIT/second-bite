import 'package:app_ui/app_ui.dart';
import 'package:app_ui/src/theme/tokens.g.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('AppTextStyles', () {
    const styles = AppTextStyles();

    test('defaults to the DESIGN.md type roles', () {
      expect(styles.label, TypeTokens.label);
      expect(styles.bodySm, TypeTokens.bodySm);
      expect(styles.price, TypeTokens.price);
      expect(styles.display, TypeTokens.display);
    });

    test('copyWith replaces only the given styles', () {
      const replacement = TextStyle(fontSize: 30);
      final updated = styles.copyWith(price: replacement);
      expect(updated.price, replacement);
      expect(updated.priceLg, styles.priceLg);
    });

    test('lerp returns this when other is not AppTextStyles', () {
      expect(styles.lerp(null, 0.5), styles);
    });

    test('lerp interpolates the styles', () {
      final other = styles.copyWith(
        body: TypeTokens.body.copyWith(fontSize: 20),
      );
      expect(styles.lerp(other, 0.5).body.fontSize, 18);
    });
  });
}
