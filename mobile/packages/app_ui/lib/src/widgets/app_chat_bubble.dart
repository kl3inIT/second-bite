import 'package:app_ui/app_ui.dart';

/// {@template app_chat_bubble}
/// A message in an order's chat (Figma K7, WK8): the reader's on the right
/// in the primary colour, the other side's on the left on the card, at most
/// three quarters of the width, with the corner nearest its side squared.
/// Under it, [caption]: the time, "· Đã xem" once read, or what failed.
/// A screen reader hears [ownLabel] before the reader's own words.
/// {@endtemplate}
class AppChatBubble extends StatelessWidget {
  /// {@macro app_chat_bubble}
  const new({
    required this.text,
    required this.own,
    this.ownLabel,
    this.caption,
    super.key,
  });

  /// The message.
  final String text;

  /// Whether the reader wrote it.
  final bool own;

  /// Said before the reader's own message, such as "Bạn".
  final String? ownLabel;

  /// Under the message: its time, or a failure with the way to try again.
  final Widget? caption;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    const round = Radius.circular(RadiusTokens.xl);
    const square = Radius.circular(RadiusTokens.xs);

    return Column(
      crossAxisAlignment: own
          ? CrossAxisAlignment.end
          : CrossAxisAlignment.start,
      spacing: SpacingTokens.space1,
      children: [
        FractionallySizedBox(
          widthFactor: 0.75,
          alignment: own
              ? AlignmentDirectional.centerEnd
              : AlignmentDirectional.centerStart,
          child: Align(
            alignment: own
                ? AlignmentDirectional.centerEnd
                : AlignmentDirectional.centerStart,
            child: DecoratedBox(
              decoration: BoxDecoration(
                color: own ? scheme.primary : scheme.surface,
                borderRadius: BorderRadiusDirectional.only(
                  topStart: round,
                  topEnd: round,
                  bottomStart: own ? round : square,
                  bottomEnd: own ? square : round,
                ),
              ),
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 14,
                  vertical: 10,
                ),
                child: Semantics(
                  label: own && ownLabel != null ? '$ownLabel: $text' : null,
                  excludeSemantics: own && ownLabel != null,
                  child: Text(
                    text,
                    style: context.appTextStyles.bodySm.copyWith(
                      color: own ? scheme.onPrimary : scheme.onSurface,
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
        ?caption,
      ],
    );
  }
}
