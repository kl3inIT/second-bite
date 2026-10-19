import 'package:app_ui/app_ui.dart';
import 'package:flutter_svg/flutter_svg.dart';

/// {@template app_wordmark}
/// The wordmark, "second bite" with the bitten "o", in one colour: Tasco blue
/// unless [color] is given, as white on Tasco blue while the app loads. A
/// screen reader hears [semanticLabel], the product's name.
/// {@endtemplate}
class AppWordmark extends StatelessWidget {
  /// {@macro app_wordmark}
  const new({
    required this.semanticLabel,
    this.height = 24,
    this.color,
    super.key,
  });

  /// The product's name as read aloud.
  final String semanticLabel;

  /// How tall the wordmark is drawn; its width follows.
  final double height;

  /// The wordmark's colour.
  final Color? color;

  @override
  Widget build(BuildContext context) {
    return SvgPicture.asset(
      'assets/brand/wordmark.svg',
      package: 'app_ui',
      height: height,
      semanticsLabel: semanticLabel,
      colorFilter: ColorFilter.mode(
        color ?? Theme.of(context).colorScheme.primary,
        BlendMode.srcIn,
      ),
    );
  }
}
