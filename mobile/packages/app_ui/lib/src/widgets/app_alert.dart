import 'package:app_ui/app_ui.dart';

/// {@template app_alert}
/// A warning that asks the person to do something different, as the web's
/// `Alert variant="warning"`: [icon], then [title] and [description] on the
/// warning ground with its edge. A screen reader hears it as one block.
/// {@endtemplate}
class AppAlert extends StatelessWidget {
  /// {@macro app_alert}
  const new({
    required this.icon,
    required this.title,
    required this.description,
    super.key,
  });

  /// The alert's icon, such as Lucide's `mailWarning`.
  final IconData icon;

  /// What happened.
  final String title;

  /// What to do now.
  final String description;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final text = context.appTextStyles;

    return Semantics(
      container: true,
      liveRegion: true,
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: colors.warning,
          border: Border.all(color: colors.warningBorder),
          borderRadius: const BorderRadius.all(
            Radius.circular(RadiusTokens.lg),
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: SpacingTokens.space4,
            vertical: SpacingTokens.space3,
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: SpacingTokens.space3,
            children: [
              Padding(
                padding: const EdgeInsets.only(top: 2),
                child: Icon(icon, size: 16, color: colors.warningForeground),
              ),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  spacing: SpacingTokens.space1,
                  children: [
                    Text(
                      title,
                      style: text.bodySmStrong.copyWith(
                        color: colors.warningForeground,
                      ),
                    ),
                    Text(
                      description,
                      style: text.bodySm.copyWith(
                        color: colors.warningForeground,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
