import 'package:app_ui/app_ui.dart';

/// {@template app_header_capsule}
/// A white capsule on the blue header (DESIGN.md › Raised), as the web's
/// header capsules: 32 points high with a hairline edge, an [icon] and an
/// optional [label] (`label-strong`), inside a 44 point target. A [tooltip]
/// names it for a screen reader too.
/// {@endtemplate}
class AppHeaderCapsule extends StatelessWidget {
  /// {@macro app_header_capsule}
  const new({
    required this.icon,
    required this.onPressed,
    this.label,
    this.tooltip,
    super.key,
  });

  /// The Lucide icon at its start.
  final IconData icon;

  /// What it does when tapped.
  final VoidCallback onPressed;

  /// The words beside the icon, cut with "…" when long.
  final String? label;

  /// What a screen reader hears, and a long press shows, when the capsule
  /// has no [label].
  final String? tooltip;

  /// The capsule's height, as the web's `h-8`.
  static const double height = 32;

  /// The target around it, as the web's `min-h-11`.
  static const double target = 44;

  /// How wide a label may grow before it is cut, as the web's `max-w-28`.
  static const double maxLabelWidth = 112;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final label = this.label;

    Widget capsule = ConstrainedBox(
      constraints: const BoxConstraints(minHeight: target, minWidth: target),
      child: Center(
        widthFactor: 1,
        heightFactor: 1,
        child: DecoratedBox(
          decoration: BoxDecoration(
            color: colors.headerRaised,
            border: Border.all(color: colors.headerBorder),
            borderRadius: const BorderRadius.all(
              Radius.circular(RadiusTokens.full),
            ),
          ),
          child: SizedBox(
            height: height,
            child: Padding(
              padding: EdgeInsets.symmetric(
                horizontal: label == null
                    ? SpacingTokens.space2 + 2
                    : SpacingTokens.space3,
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                spacing: 6,
                children: [
                  Icon(icon, size: 16, color: colors.headerRaisedForeground),
                  if (label != null)
                    ConstrainedBox(
                      constraints: const BoxConstraints(
                        maxWidth: maxLabelWidth,
                      ),
                      child: Text(
                        label,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: context.appTextStyles.labelStrong.copyWith(
                          color: colors.headerRaisedForeground,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
    );

    capsule = InkWell(
      onTap: onPressed,
      customBorder: const StadiumBorder(),
      child: capsule,
    );

    // A tooltip also names the capsule for a screen reader, as the web's
    // `aria-label`.
    final tooltip = this.tooltip;
    return Semantics(
      button: true,
      child: tooltip == null
          ? capsule
          : Tooltip(message: tooltip, child: capsule),
    );
  }
}
