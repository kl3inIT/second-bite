import 'package:app_ui/app_ui.dart';

/// {@template app_unread_pill}
/// The count of messages not read yet (SEC-117; Figma D2b "Nhắn quán 2"): a
/// round pill in the error colour, 18 px high, after the words on a button
/// or at the top corner of a photo. It shows nothing for none. Screen
/// readers hear [label], such as "2 tin nhắn chưa đọc".
/// {@endtemplate}
class AppUnreadPill extends StatelessWidget {
  /// {@macro app_unread_pill}
  const new({required this.count, required this.label, super.key});

  /// The messages not read yet.
  final int count;

  /// What a screen reader says, with the count in words.
  final String label;

  @override
  Widget build(BuildContext context) {
    if (count <= 0) return const SizedBox.shrink();
    final scheme = Theme.of(context).colorScheme;

    return Semantics(
      label: label,
      excludeSemantics: true,
      child: ConstrainedBox(
        constraints: const BoxConstraints(minWidth: 18, minHeight: 18),
        child: DecoratedBox(
          decoration: ShapeDecoration(
            color: scheme.error,
            shape: const StadiumBorder(),
          ),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 5),
            child: Center(
              widthFactor: 1,
              heightFactor: 1,
              child: Text(
                '$count',
                style: context.appTextStyles.figureSm.copyWith(
                  color: scheme.onError,
                  height: 18 / 12,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
