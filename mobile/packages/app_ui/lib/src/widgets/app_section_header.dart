import 'package:app_ui/app_ui.dart';
import 'package:app_ui/src/theme/tokens.g.dart';

/// {@template app_section_header}
/// A section's title, announced as a heading, with an optional short action
/// on the right such as "Xem tất cả".
/// {@endtemplate}
class AppSectionHeader extends StatelessWidget {
  /// {@macro app_section_header}
  const new({required this.title, this.action, super.key});

  /// The section's title.
  final String title;

  /// A short action, usually a [TextButton].
  final Widget? action;

  @override
  Widget build(BuildContext context) {
    final trailing = action;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: SpacingTokens.space4),
      child: Row(
        children: [
          Expanded(
            child: Semantics(
              header: true,
              child: Text(title, style: context.appTextStyles.headline),
            ),
          ),
          if (trailing != null) ...[
            const SizedBox(width: SpacingTokens.space4),
            trailing,
          ],
        ],
      ),
    );
  }
}
