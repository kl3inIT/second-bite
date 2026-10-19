import 'package:app_ui/app_ui.dart';
import 'package:flutter_svg/flutter_svg.dart';

/// {@template app_google_button}
/// "Continue with Google", drawn as Google's sign-in branding guidelines ask
/// of a button an app draws itself (developers.google.com/identity/branding-
/// guidelines): Google's "G" from its branding kit on the left, Google's own
/// wording in [label], white with a 1 px grey edge, as tall and wide as the
/// app's main buttons. Its colours are Google's, not DESIGN.md's, and stay
/// here: the web shows the same button drawn by Google itself.
/// {@endtemplate}
class AppGoogleButton extends StatelessWidget {
  /// {@macro app_google_button}
  const new({required this.label, required this.onPressed, super.key});

  /// Google's wording, "Tiếp tục với Google" or "Continue with Google".
  final String label;

  /// Called when the button is tapped; null disables it.
  final VoidCallback? onPressed;

  // Google's light theme: fill, edge and text.
  static const _fill = Color(0xFFFFFFFF);
  static const _edge = Color(0xFF747775);
  static const _text = Color(0xFF1F1F1F);
  static const _pressed = Color(0xFFF2F2F2);

  @override
  Widget build(BuildContext context) {
    return OutlinedButton.icon(
      onPressed: onPressed,
      style: ButtonStyle(
        backgroundColor: WidgetStateProperty.resolveWith(
          (states) =>
              states.contains(WidgetState.pressed) ||
                  states.contains(WidgetState.hovered)
              ? _pressed
              : _fill,
        ),
        foregroundColor: const WidgetStatePropertyAll(_text),
        side: const WidgetStatePropertyAll(BorderSide(color: _edge)),
        overlayColor: const WidgetStatePropertyAll(Colors.transparent),
        // Google asks for Roboto Medium, which Android draws as its system
        // typeface (14 on 20); elsewhere the platform's own sans-serif stands
        // in.
        textStyle: const WidgetStatePropertyAll(
          TextStyle(
            fontFamily: 'Roboto',
            fontSize: 14,
            height: 20 / 14,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
      icon: SvgPicture.asset(
        'assets/brand/google-g.svg',
        package: 'app_ui',
        width: 18,
        height: 18,
        excludeFromSemantics: true,
      ),
      label: Text(label),
    );
  }
}
