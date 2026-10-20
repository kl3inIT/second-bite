import 'dart:async';

import 'package:app_ui/app_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:second_bite/core/language_button.dart';
import 'package:second_bite/core/routes.dart';
import 'package:second_bite/features/identity/ui/current_account.dart';
import 'package:second_bite/l10n/l10n.dart';

/// {@template account_screen}
/// The account tab, as the web's `/account`: who is signed in and sign-out,
/// or a way to sign in; then the terms and the privacy policy (Decree
/// 52/2013, SEC-32), which open inside the app (SEC-52).
/// {@endtemplate}
class AccountScreen extends ConsumerStatefulWidget {
  /// {@macro account_screen}
  const new({super.key});

  @override
  ConsumerState<AccountScreen> createState() => _AccountScreenState();
}

class _AccountScreenState extends ConsumerState<AccountScreen> {
  bool _signingOut = false;

  Future<void> _signOut() async {
    setState(() => _signingOut = true);
    try {
      await ref.read(currentAccountProvider.notifier).signOut();
    } finally {
      if (mounted) setState(() => _signingOut = false);
    }
  }

  /// As the web's `max-w-xl`.
  static const double _maxWidth = 576;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;
    final account = ref.watch(currentAccountProvider).value;
    final name = account?.displayName ?? '';

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
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      spacing: SpacingTokens.space4,
                      children: [
                        Row(
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
                                      account == null
                                          ? l10n.accountGuestTitle
                                          : name.isEmpty
                                          ? account.email
                                          : name,
                                      style: text.title,
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                  Text(
                                    account == null
                                        ? l10n.accountGuestBody
                                        : name.isEmpty
                                        ? l10n.accountSignedIn
                                        : account.email,
                                    style: text.bodySm.copyWith(
                                      color: scheme.onSurfaceVariant,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        if (account == null)
                          AppButton(
                            onPressed: () => unawaited(
                              const SignInRoute(returnTo: '/account')
                                  .push(context),
                            ),
                            child: Text(l10n.accountSignIn),
                          )
                        else
                          AppButton(
                            variant: AppButtonVariant.outline,
                            onPressed: _signingOut ? null : _signOut,
                            icon: _signingOut
                                ? const SizedBox.square(
                                    dimension: 16,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                    ),
                                  )
                                : const Icon(LucideIcons.logOut, size: 16),
                            child: Text(l10n.accountSignOut),
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
                          for (final (route, title) in [
                            (const TermsRoute(), l10n.legalTerms),
                            (const PrivacyRoute(), l10n.legalPrivacy),
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
                              onTap: () => unawaited(route.push<void>(context)),
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
