import 'package:app_ui/app_ui.dart';

/// {@template app_status_pill}
/// A short status on a pale pill, such as "Sẵn sàng · đến 21:45" on an
/// order ready to collect (Figma K8 › active).
/// {@endtemplate}
class AppStatusPill extends StatelessWidget {
  /// {@macro app_status_pill}
  const new({required this.label, super.key});

  /// The status, such as "Sẵn sàng · đến 21:45".
  final String label;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return DecoratedBox(
      decoration: ShapeDecoration(
        color: scheme.secondaryContainer,
        shape: const StadiumBorder(),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: SpacingTokens.space2,
          vertical: 3,
        ),
        child: Text(
          label,
          maxLines: 1,
          style: context.appTextStyles.labelStrong.copyWith(
            color: scheme.primary,
          ),
        ),
      ),
    );
  }
}
