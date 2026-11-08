import 'package:app_ui/app_ui.dart';

/// Where a step of an order stands.
enum AppOrderStepState {
  /// Passed.
  done,

  /// The step the order is at.
  now,

  /// Still to come.
  later,
}

/// {@template app_order_step}
/// One step of an order: its icon, its name and where it stands.
/// {@endtemplate}
class AppOrderStep {
  /// {@macro app_order_step}
  const new({required this.icon, required this.label, required this.state});

  /// The step's icon.
  final IconData icon;

  /// The step's name, such as "Chuẩn bị".
  final String label;

  /// Where the step stands.
  final AppOrderStepState state;
}

/// {@template app_order_steps}
/// The steps of an order on the blue band, as the web's phone row (Figma
/// K6, K6b): a round icon per step, lime once passed or at the step, faint
/// to come, joined by bars; the current step ringed in white and its name
/// in lime. A screen reader hears [label] and which step is current.
/// {@endtemplate}
class AppOrderSteps extends StatelessWidget {
  /// {@macro app_order_steps}
  const new({required this.label, required this.steps, super.key});

  /// What the steps are, such as "Các bước của đơn".
  final String label;

  /// The steps, in order.
  final List<AppOrderStep> steps;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;
    final faint = scheme.onPrimary.withValues(alpha: 0.15);

    return Semantics(
      container: true,
      label: label,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          for (final (index, step) in steps.indexed)
            Expanded(
              child: Semantics(
                selected: step.state == AppOrderStepState.now,
                child: Stack(
                  clipBehavior: Clip.none,
                  alignment: Alignment.topCenter,
                  children: [
                    if (index > 0)
                      Positioned(
                        top: 14,
                        right: 0,
                        left: 0,
                        child: FractionalTranslation(
                          translation: const Offset(-0.5, 0),
                          child: Container(
                            height: 3,
                            color: step.state == AppOrderStepState.later
                                ? faint
                                : colors.fresh,
                          ),
                        ),
                      ),
                    Column(
                      spacing: 6,
                      children: [
                        Container(
                          width: 32,
                          height: 32,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: step.state == AppOrderStepState.later
                                ? faint
                                : colors.fresh,
                            border: step.state == AppOrderStepState.now
                                ? Border.all(color: scheme.onPrimary, width: 3)
                                : null,
                          ),
                          child: Icon(
                            step.icon,
                            size: 16,
                            color: step.state == AppOrderStepState.later
                                ? colors.inverseMuted
                                : colors.freshForeground,
                          ),
                        ),
                        Text(
                          step.label,
                          textAlign: TextAlign.center,
                          style: step.state == AppOrderStepState.now
                              ? text.labelStrong.copyWith(color: colors.fresh)
                              : text.label.copyWith(color: colors.inverseMuted),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}
