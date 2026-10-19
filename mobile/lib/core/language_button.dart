import 'package:app_ui/app_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:second_bite/core/app_locale.dart';
import 'package:second_bite/l10n/l10n.dart';

/// {@template language_button}
/// The language capsule of the header: one tap shows the app in the other
/// language. The capsule sits in a 44 point target.
/// {@endtemplate}
class LanguageButton extends ConsumerWidget {
  /// {@macro language_button}
  const new({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.appColors;

    return IconButton(
      tooltip: context.l10n.languageSwitch,
      onPressed: () => ref
          .read(appLocaleProvider.notifier)
          .switchFrom(Localizations.localeOf(context)),
      style: IconButton.styleFrom(
        backgroundColor: colors.headerRaised,
        foregroundColor: colors.headerRaisedForeground,
        side: BorderSide(color: colors.headerBorder),
      ),
      icon: const Icon(LucideIcons.languages, size: 16),
    );
  }
}
