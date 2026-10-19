import 'package:app_ui/src/theme/tokens.g.dart';
import 'package:flutter/painting.dart';
import 'package:flutter_test/flutter_test.dart';

// The conversions web/scripts/generate-tokens.mjs makes from DESIGN.md.
void main() {
  group('tokens.g.dart', () {
    test('writes an #RRGGBBAA colour as 0xAARRGGBB', () {
      expect(ShadowTokens.sheet.single.color, const Color(0x1F0E1D19));
      expect(ShadowTokens.sheet.single.offset, const Offset(0, -4));
    });

    test('writes a px line height as a multiple of the size, split evenly', () {
      expect(TypeTokens.label.fontSize, 12);
      expect(TypeTokens.label.height, 17 / 12);
      expect(
        TypeTokens.label.leadingDistribution,
        TextLeadingDistribution.even,
      );
    });

    test('writes em letter spacing in logical pixels', () {
      expect(TypeTokens.display.letterSpacing, closeTo(-0.36, 1e-9));
    });

    test('sets the weight axis of the variable figure face', () {
      expect(TypeTokens.price.fontWeight, FontWeight.w700);
      expect(TypeTokens.price.fontVariations, const [
        FontVariation('wght', 700),
      ]);
    });

    test('names radii and steps that start with a digit by their group', () {
      expect(RadiusTokens.radius2xl, 20);
      expect(SpacingTokens.space4, 16);
    });
  });
}
