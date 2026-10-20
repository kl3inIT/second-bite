import 'package:app_ui/app_ui.dart';

/// {@template app_home_header}
/// The blue header of the home (DESIGN.md › Blue Header): [title] and
/// [action] on the first line, then [children], under the light sweep and
/// with rounded bottom corners. The blue runs under the status bar; the
/// content stays below it and no wider than [maxContentWidth].
/// {@endtemplate}
class AppHomeHeader extends StatelessWidget {
  /// {@macro app_home_header}
  const new({
    required this.title,
    required this.action,
    this.children = const [],
    this.maxContentWidth = double.infinity,
    super.key,
  });

  /// What the page names itself with, such as the place.
  final Widget title;

  /// The action at the top right, such as the language capsule.
  final Widget action;

  /// What sits under the first line: the search field, the deal card.
  final List<Widget> children;

  /// How wide the content may grow on a large screen.
  final double maxContentWidth;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return ClipRRect(
      borderRadius: const BorderRadius.vertical(
        bottom: Radius.circular(RadiusTokens.radius3xl),
      ),
      child: ColoredBox(
        color: colors.header,
        child: Stack(
          children: [
            // The sweep keeps its drawn size pinned to the right, so a wide
            // header shows more plain blue instead of a stretched sweep.
            Positioned(
              top: 0,
              right: 0,
              child: IgnorePointer(
                child: CustomPaint(
                  size: _SweepPainter.viewBox,
                  painter: _SweepPainter(
                    sweep: colors.sweep,
                    edge: colors.sweepEdge,
                    header: colors.header,
                  ),
                ),
              ),
            ),
            SafeArea(
              bottom: false,
              child: Center(
                child: ConstrainedBox(
                  constraints: BoxConstraints(maxWidth: maxContentWidth),
                  child: Padding(
                    padding: const EdgeInsets.only(
                      left: SpacingTokens.space4,
                      right: SpacingTokens.space4,
                      top: SpacingTokens.space4,
                      bottom: SpacingTokens.space3,
                    ),
                    child: DefaultTextStyle.merge(
                      style: TextStyle(color: colors.headerForeground),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        spacing: SpacingTokens.space3,
                        children: [
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            spacing: SpacingTokens.space4,
                            children: [
                              Expanded(child: title),
                              action,
                            ],
                          ),
                          ...children,
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// The paths of the web's `header-sweep.tsx`, in its 390 by 260 view box:
/// the sweep, the brighter band at its edge, and the header's blue that
/// curves under both.
class _SweepPainter extends CustomPainter {
  new({required this.sweep, required this.edge, required this.header});

  static const viewBox = Size(390, 260);

  final Color sweep;
  final Color edge;
  final Color header;

  @override
  void paint(Canvas canvas, Size size) {
    final band = Path()
      ..moveTo(0, 0)
      ..lineTo(362, 0)
      ..cubicTo(292, 30, 246, 82, 226, 132)
      ..cubicTo(210, 172, 150, 214, 0, 262)
      ..close();
    final plain = Path()
      ..moveTo(0, 0)
      ..lineTo(332, 0)
      ..cubicTo(262, 30, 216, 80, 196, 128)
      ..cubicTo(180, 168, 120, 208, 0, 236)
      ..close();
    canvas
      ..drawRect(Offset.zero & viewBox, Paint()..color = sweep)
      ..drawPath(band, Paint()..color = edge)
      ..drawPath(plain, Paint()..color = header);
  }

  @override
  bool shouldRepaint(_SweepPainter oldDelegate) =>
      oldDelegate.sweep != sweep ||
      oldDelegate.edge != edge ||
      oldDelegate.header != header;
}
