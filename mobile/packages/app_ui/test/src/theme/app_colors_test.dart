import 'package:app_ui/app_ui.dart';
import 'package:app_ui/src/theme/tokens.g.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('AppColors', () {
    const colors = AppColors.light;

    test('light takes the DESIGN.md roles', () {
      expect(colors.fresh, ColorTokens.fresh);
      expect(colors.freshForeground, ColorTokens.freshForeground);
      expect(colors.primaryHover, ColorTokens.primaryHover);
      expect(colors.header, ColorTokens.header);
      expect(colors.deal, ColorTokens.deal);
      expect(colors.dealForeground, ColorTokens.dealForeground);
      expect(colors.link, ColorTokens.link);
      expect(colors.avatarOlive, ColorTokens.avatarOlive);
    });

    test('copyWith replaces only the given colours', () {
      final updated = colors.copyWith(fresh: Colors.black);
      expect(updated.fresh, Colors.black);
      expect(updated.rating, colors.rating);
    });

    test('lerp returns this when other is not AppColors', () {
      expect(colors.lerp(null, 0.5), colors);
    });

    test('lerp interpolates the colours', () {
      final other = colors.copyWith(link: Colors.white);
      expect(
        colors.lerp(other, 0.5).link,
        Color.lerp(colors.link, Colors.white, 0.5),
      );
      expect(colors.lerp(other, 1).link, Colors.white);
    });
  });
}
