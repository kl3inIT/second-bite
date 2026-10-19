import 'package:app_ui/app_ui.dart';
import 'package:second_bite/l10n/l10n.dart';

/// {@template intro_card}
/// What Second Bite is, for a first visit (no landing page in the first
/// version, SEC-23). Closing it hides it until the app starts again.
/// {@endtemplate}
class IntroCard extends StatefulWidget {
  /// {@macro intro_card}
  const new({super.key});

  @override
  State<IntroCard> createState() => _IntroCardState();
}

class _IntroCardState extends State<IntroCard> {
  var _dismissed = false;

  @override
  Widget build(BuildContext context) {
    if (_dismissed) return const SizedBox.shrink();
    final l10n = context.l10n;
    final text = context.appTextStyles;

    return Card(
      child: Padding(
        padding: const EdgeInsets.only(
          left: SpacingTokens.space4,
          top: SpacingTokens.space4,
          bottom: SpacingTokens.space4,
          right: SpacingTokens.space1,
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: SpacingTokens.space1,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                spacing: SpacingTokens.space1,
                children: [
                  Semantics(
                    header: true,
                    child: Text(l10n.introTitle, style: text.title),
                  ),
                  Text(
                    l10n.introBody,
                    style: text.bodySm.copyWith(
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),
            Transform.translate(
              offset: const Offset(0, -SpacingTokens.space2),
              child: IconButton(
                tooltip: l10n.introDismiss,
                onPressed: () => setState(() => _dismissed = true),
                icon: const Icon(Icons.close),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
