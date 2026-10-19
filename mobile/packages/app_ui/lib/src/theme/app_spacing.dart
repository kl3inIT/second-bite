import 'dart:ui';

import 'package:app_ui/app_ui.dart';
import 'package:app_ui/src/theme/tokens.g.dart';

/// {@template app_spacing}
/// DESIGN.md's spacing steps, named as the web's Tailwind steps: [space4] is
/// the web's `p-4`, 16 logical pixels.
/// {@endtemplate}
class AppSpacing extends ThemeExtension<AppSpacing> {
  /// {@macro app_spacing}
  const new({
    this.space1 = SpacingTokens.space1,
    this.space2 = SpacingTokens.space2,
    this.space3 = SpacingTokens.space3,
    this.space4 = SpacingTokens.space4,
    this.space6 = SpacingTokens.space6,
    this.space8 = SpacingTokens.space8,
  });

  /// 4 logical pixels.
  final double space1;

  /// 8 logical pixels.
  final double space2;

  /// 12 logical pixels.
  final double space3;

  /// 16 logical pixels.
  final double space4;

  /// 24 logical pixels.
  final double space6;

  /// 32 logical pixels.
  final double space8;

  @override
  AppSpacing copyWith({
    double? space1,
    double? space2,
    double? space3,
    double? space4,
    double? space6,
    double? space8,
  }) {
    return AppSpacing(
      space1: space1 ?? this.space1,
      space2: space2 ?? this.space2,
      space3: space3 ?? this.space3,
      space4: space4 ?? this.space4,
      space6: space6 ?? this.space6,
      space8: space8 ?? this.space8,
    );
  }

  @override
  AppSpacing lerp(AppSpacing? other, double t) {
    if (other is! AppSpacing) return this;
    return AppSpacing(
      space1: lerpDouble(space1, other.space1, t)!,
      space2: lerpDouble(space2, other.space2, t)!,
      space3: lerpDouble(space3, other.space3, t)!,
      space4: lerpDouble(space4, other.space4, t)!,
      space6: lerpDouble(space6, other.space6, t)!,
      space8: lerpDouble(space8, other.space8, t)!,
    );
  }
}
