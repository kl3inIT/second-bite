import 'dart:ui';

import 'package:app_ui/app_ui.dart';
import 'package:app_ui/src/theme/tokens.g.dart';

/// {@template app_bottom_bar}
/// The glass the bottom bar sits on (DESIGN.md › Bottom bar, Figma Bottom
/// nav 105:2515), as the web's `bottom-nav.tsx` on a phone: a capsule
/// floating 16 points from the sides and the bottom, no wider than the
/// web's `max-w-md`, white at 45% over a 24 point blur, a hairline of white
/// at 60% and `elevation.nav`. [child] is the [NavigationBar], whose look is
/// the theme's `navigationBarTheme`.
///
/// Put it in a [Scaffold] with `extendBody: true`, so the page runs under the
/// glass and its scroll views keep their end clear of it.
/// {@endtemplate}
class AppBottomBar extends StatelessWidget {
  /// {@macro app_bottom_bar}
  const new({required this.child, super.key});

  /// The tabs.
  final Widget child;

  /// As the web's `max-w-md`.
  static const double maxWidth = 448;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      minimum: const EdgeInsets.fromLTRB(
        SpacingTokens.space4,
        0,
        SpacingTokens.space4,
        SpacingTokens.space4,
      ),
      child: Center(
        heightFactor: 1,
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: maxWidth),
          child: DecoratedBox(
            decoration: const ShapeDecoration(
              shape: StadiumBorder(),
              shadows: ShadowTokens.nav,
            ),
            child: ClipPath(
              clipper: const ShapeBorderClipper(shape: StadiumBorder()),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 24, sigmaY: 24),
                child: DecoratedBox(
                  decoration: ShapeDecoration(
                    color: ColorTokens.card.withValues(alpha: 0.45),
                    shape: StadiumBorder(
                      side: BorderSide(
                        color: ColorTokens.card.withValues(alpha: 0.6),
                      ),
                    ),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(5),
                    child: child,
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
