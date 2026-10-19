import 'package:app_ui/app_ui.dart';

/// {@template app_bite_corner}
/// The bitten top right corner of a card (DESIGN.md › The Bite Rule): three
/// bites cut in the colour of the ground behind the card. The card places it
/// at its top right and clips it to its own corner.
/// {@endtemplate}
class AppBiteCorner extends StatelessWidget {
  /// {@macro app_bite_corner}
  const new({required this.size, super.key});

  /// The side of the square the bites are drawn in: 56 on an offer card,
  /// 44 on a compact one.
  final double size;

  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      child: CustomPaint(
        size: Size.square(size),
        painter: _BitePainter(Theme.of(context).scaffoldBackgroundColor),
      ),
    );
  }
}

/// The circles of the web's `bite-corner.tsx`, in its 56 by 56 view box.
class _BitePainter extends CustomPainter {
  new(this.color);

  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = color;
    canvas
      ..scale(size.width / 56)
      ..drawCircle(const Offset(51.8, 4.2), 17.36, paint)
      ..drawCircle(const Offset(29.4, -1.4), 11.76, paint)
      ..drawCircle(const Offset(57.4, 26.6), 11.76, paint);
  }

  @override
  bool shouldRepaint(_BitePainter oldDelegate) => oldDelegate.color != color;
}
