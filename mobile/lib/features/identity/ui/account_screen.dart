import 'package:app_ui/app_ui.dart';
import 'package:second_bite/core/language_button.dart';
import 'package:second_bite/l10n/l10n.dart';
import 'package:url_launcher/url_launcher.dart';

/// The web application, where the legal pages live in both languages.
final Uri _web = Uri.parse('https://secondbite.vadan.app');

/// {@template account_screen}
/// The account tab, as the web's `/account` for someone signed out: who they
/// are, then the terms and the privacy policy (Decree 52/2013, SEC-32), which
/// open on the web. Signing in arrives with SEC-27, so the card offers no
/// action yet.
/// {@endtemplate}
class AccountScreen extends StatelessWidget {
  /// {@macro account_screen}
  const new({super.key});

  /// As the web's `max-w-xl`.
  static const double _maxWidth = 576;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;
    final language = Localizations.localeOf(context).languageCode;

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.accountTitle),
        actions: const [
          LanguageButton(),
          SizedBox(width: SpacingTokens.space3),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(SpacingTokens.space4),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: _maxWidth),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              spacing: SpacingTokens.space6,
              children: [
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(SpacingTokens.space4),
                    child: Row(
                      spacing: SpacingTokens.space3,
                      children: [
                        CircleAvatar(
                          radius: SpacingTokens.space6,
                          backgroundColor: scheme.secondary,
                          foregroundColor: scheme.onSecondary,
                          child: const Icon(LucideIcons.userRound),
                        ),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Semantics(
                                header: true,
                                child: Text(
                                  l10n.accountGuestTitle,
                                  style: text.title,
                                ),
                              ),
                              Text(
                                l10n.accountGuestBody,
                                style: text.bodySm.copyWith(
                                  color: scheme.onSurfaceVariant,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                Semantics(
                  container: true,
                  label: l10n.legalLabel,
                  child: Card(
                    child: Padding(
                      padding: const EdgeInsets.all(SpacingTokens.space1),
                      child: Column(
                        children: [
                          for (final (page, title) in [
                            ('terms', l10n.legalTerms),
                            ('privacy', l10n.legalPrivacy),
                          ])
                            ListTile(
                              minTileHeight: 48,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(
                                  RadiusTokens.xl,
                                ),
                              ),
                              title: Text(title, style: text.body),
                              trailing: Icon(
                                LucideIcons.chevronRight,
                                size: 16,
                                color: scheme.onSurfaceVariant,
                              ),
                              onTap: () => launchUrl(
                                _web.replace(path: '/$language/$page'),
                              ),
                            ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
