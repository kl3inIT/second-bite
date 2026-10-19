import 'package:app_ui/app_ui.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('AppSpacing', () {
    const spacing = AppSpacing();

    test('defaults to the DESIGN.md steps', () {
      expect(
        [
          spacing.space1,
          spacing.space2,
          spacing.space3,
          spacing.space4,
          spacing.space6,
          spacing.space8,
        ],
        [4, 8, 12, 16, 24, 32],
      );
    });

    test('copyWith replaces only the given steps', () {
      final updated = spacing.copyWith(space1: 2, space4: 20);
      expect(updated.space1, 2);
      expect(updated.space2, spacing.space2);
      expect(updated.space4, 20);
      expect(updated.space8, spacing.space8);
    });

    test('lerp returns this when other is not AppSpacing', () {
      expect(spacing.lerp(null, 0.5), spacing);
    });

    test('lerp interpolates every step', () {
      const other = AppSpacing(
        space1: 8,
        space2: 16,
        space3: 24,
        space4: 32,
        space6: 48,
        space8: 64,
      );

      final result = spacing.lerp(other, 0.5);
      expect(result.space1, 6);
      expect(result.space3, 18);
      expect(result.space8, 48);
    });
  });
}
