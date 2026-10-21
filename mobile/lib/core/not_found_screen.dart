import 'package:app_ui/app_ui.dart';
import 'package:second_bite/core/routes.dart';
import 'package:second_bite/l10n/l10n.dart';

/// {@template not_found_screen}
/// An address the app does not know, such as an old shared link (SEC-52):
/// as the web's not-found page, one card with what happened and the way home.
/// {@endtemplate}
class NotFoundScreen extends StatelessWidget {
  /// {@macro not_found_screen}
  const new({super.key});

  /// As the web's card, `max-w-136`.
  static const double _maxWidth = 544;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;

    return Scaffold(
      appBar: AppBar(title: Text(l10n.appTitle)),
      body: Align(
        alignment: Alignment.topCenter,
        child: Padding(
          padding: const EdgeInsets.all(SpacingTokens.space4),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: _maxWidth),
            child: Card(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: SpacingTokens.space6,
                  vertical: SpacingTokens.space8,
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  spacing: SpacingTokens.space4,
                  children: [
                    Semantics(
                      header: true,
                      child: Text(
                        l10n.notFoundTitle,
                        style: text.headline,
                        textAlign: TextAlign.center,
                      ),
                    ),
                    AppButton(
                      variant: AppButtonVariant.outline,
                      onPressed: () => const HomeRoute().go(context),
                      child: Text(l10n.notFoundBack),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
