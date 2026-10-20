import 'dart:async';

import 'package:app_ui/app_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:second_bite/core/app_locale.dart';
import 'package:second_bite/core/routes.dart';
import 'package:second_bite/features/identity/ui/current_account.dart';
import 'package:second_bite/features/identity/ui/sign_in_problem.dart';
import 'package:second_bite/features/seller/data/seller_repository.dart';
import 'package:second_bite/l10n/l10n.dart';

part 'account_settings_screen.g.dart';

/// The sellers the signed-in person owns or works for.
@riverpod
Future<List<MySeller>> mySellers(Ref ref) =>
    ref.watch(sellerRepositoryProvider).mySellers();

/// {@template account_settings_screen}
/// Account settings (SEC-37, Figma Q2a), as the web's `/account/settings`:
/// the account's own data, read-only, then at its foot the way to delete it,
/// which is not offered beside sign-out.
/// {@endtemplate}
class AccountSettingsScreen extends ConsumerWidget {
  /// {@macro account_settings_screen}
  const new({super.key});

  /// As the web's `max-w-xl`.
  static const double _maxWidth = 576;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;
    final account = ref.watch(currentAccountProvider).value;

    return Scaffold(
      appBar: AppBar(title: Text(l10n.accountSettingsTitle)),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(SpacingTokens.space4),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: _maxWidth),
            child: account == null
                ? const _SignedOut()
                : Column(
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
                                        account.displayName.isEmpty
                                            ? account.email
                                            : account.displayName,
                                        style: text.title,
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                    if (account.displayName.isNotEmpty)
                                      Text(
                                        account.email,
                                        style: text.bodySm.copyWith(
                                          color: scheme.onSurfaceVariant,
                                        ),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
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
                        label: l10n.accountSettingsDetails,
                        child: Card(
                          child: Padding(
                            padding: const EdgeInsets.all(SpacingTokens.space1),
                            child: Column(
                              children: [
                                _Row(
                                  label: l10n.accountSettingsEmail,
                                  value: account.email,
                                ),
                                _Row(
                                  label: l10n.accountSettingsDisplayName,
                                  value: account.displayName.isEmpty
                                      ? l10n.accountSettingsNoDisplayName
                                      : account.displayName,
                                  tooltip: l10n.accountSettingsEditName,
                                  onTap: () => showModalBottomSheet<void>(
                                    context: context,
                                    isScrollControlled: true,
                                    showDragHandle: true,
                                    builder: (_) => _DisplayNameSheet(
                                      name: account.displayName,
                                    ),
                                  ),
                                ),
                                const _Sellers(),
                                _Row(
                                  label: l10n.accountSettingsLanguage,
                                  value: l10n.accountSettingsLanguageName,
                                  tooltip: l10n.languageSwitch,
                                  onTap: () => ref
                                      .read(appLocaleProvider.notifier)
                                      .switchFrom(
                                        Localizations.localeOf(context),
                                      ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      Card(
                        child: Padding(
                          padding: const EdgeInsets.all(SpacingTokens.space4),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            spacing: SpacingTokens.space3,
                            children: [
                              Semantics(
                                header: true,
                                child: Text(
                                  l10n.accountSettingsDeleteTitle,
                                  style: text.title,
                                ),
                              ),
                              Text(
                                l10n.accountSettingsDeleteBody,
                                style: text.bodySm.copyWith(
                                  color: scheme.onSurfaceVariant,
                                ),
                              ),
                              AppButton(
                                variant: AppButtonVariant.destructiveOutline,
                                onPressed: () => unawaited(
                                  const DeleteAccountRoute().push<void>(
                                    context,
                                  ),
                                ),
                                child: Text(l10n.accountSettingsDeleteAction),
                              ),
                            ],
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

/// The sellers row; nothing while they load, when they fail or when the
/// person has none.
class _Sellers extends ConsumerWidget {
  const new();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = context.l10n;
    final sellers = ref.watch(mySellersProvider).value ?? const [];
    if (sellers.isEmpty) return const SizedBox.shrink();
    String role(MySeller seller) =>
        seller.owner ? l10n.accountSettingsOwner : l10n.accountSettingsStaff;
    return _Row(
      label: l10n.accountSettingsSellers,
      value: [for (final seller in sellers) '${seller.name} · ${role(seller)}']
          .join(', '),
    );
  }
}

/// A label and its value; with [onTap], a chevron after the value.
class _Row extends StatelessWidget {
  const new({
    required this.label,
    required this.value,
    this.onTap,
    this.tooltip,
  });

  final String label;
  final String value;
  final VoidCallback? onTap;
  final String? tooltip;

  @override
  Widget build(BuildContext context) {
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;
    final muted = text.body.copyWith(color: scheme.onSurfaceVariant);

    return ListTile(
      minTileHeight: 48,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(RadiusTokens.xl),
      ),
      title: Text(label, style: text.body),
      trailing: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 220),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          spacing: SpacingTokens.space1,
          children: [
            Flexible(
              child: Text(
                value,
                style: muted,
                textAlign: TextAlign.end,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            if (onTap != null)
              Icon(
                LucideIcons.chevronRight,
                size: 16,
                color: scheme.onSurfaceVariant,
                semanticLabel: tooltip,
              ),
          ],
        ),
      ),
      onTap: onTap,
    );
  }
}

/// The display name in a field (SEC-61): the server trims it and says in its
/// own words when it refuses one (SEC-28); the sheet closes once it is saved.
class _DisplayNameSheet extends ConsumerStatefulWidget {
  const new({required this.name});

  final String name;

  @override
  ConsumerState<_DisplayNameSheet> createState() => _DisplayNameSheetState();
}

class _DisplayNameSheetState extends ConsumerState<_DisplayNameSheet> {
  /// As the server keeps it (server/internal/identity, maxDisplayNameLength).
  static const _maxLength = 50;

  late final _name = TextEditingController(text: widget.name);
  String? _problem;
  bool _pending = false;

  @override
  void dispose() {
    _name.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    setState(() {
      _pending = true;
      _problem = null;
    });
    try {
      await ref
          .read(currentAccountProvider.notifier)
          .setDisplayName(_name.text);
      if (mounted) Navigator.of(context).pop();
    } on Object catch (error) {
      if (!mounted) return;
      setState(
        () => _problem = SignInProblem.of(error)
            .text(context.l10n, failed: context.l10n.accountSettingsNameFailed),
      );
    } finally {
      if (mounted) setState(() => _pending = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    return Padding(
      padding: EdgeInsets.fromLTRB(
        SpacingTokens.space4,
        0,
        SpacingTokens.space4,
        SpacingTokens.space4 + MediaQuery.viewInsetsOf(context).bottom,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: SpacingTokens.space3,
        children: [
          Semantics(
            header: true,
            child: Text(
              l10n.accountSettingsEditName,
              style: context.appTextStyles.title,
            ),
          ),
          TextField(
            controller: _name,
            autofocus: true,
            enabled: !_pending,
            maxLength: _maxLength,
            textCapitalization: TextCapitalization.words,
            autofillHints: const [AutofillHints.name],
            textInputAction: TextInputAction.done,
            onSubmitted: (_) => unawaited(_save()),
            decoration: InputDecoration(
              labelText: l10n.accountSettingsDisplayName,
              errorText: _problem,
              errorMaxLines: 3,
            ),
          ),
          AppButton(
            onPressed: _pending ? null : () => unawaited(_save()),
            child: Text(
              _pending ? l10n.accountSettingsSaving : l10n.accountSettingsSave,
            ),
          ),
          AppButton(
            variant: AppButtonVariant.outline,
            onPressed: _pending ? null : () => Navigator.of(context).pop(),
            child: Text(l10n.accountSettingsCancel),
          ),
        ],
      ),
    );
  }
}

/// Someone signed out in the meantime: the way to sign in, back here.
class _SignedOut extends StatelessWidget {
  const new();

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(SpacingTokens.space4),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          spacing: SpacingTokens.space3,
          children: [
            Semantics(
              header: true,
              child: Text(l10n.accountGuestTitle, style: text.title),
            ),
            Text(l10n.accountGuestBody, style: text.bodySm),
            AppButton(
              onPressed: () => unawaited(
                const SignInRoute(returnTo: '/account-settings')
                    .push<void>(context),
              ),
              child: Text(l10n.accountSignIn),
            ),
          ],
        ),
      ),
    );
  }
}
