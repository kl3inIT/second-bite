import 'dart:async';

import 'package:app_ui/app_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:second_bite/core/routes.dart';
import 'package:second_bite/features/identity/data/auth_repository.dart';
import 'package:second_bite/features/identity/ui/current_account.dart';
import 'package:second_bite/features/identity/ui/resend_code.dart';
import 'package:second_bite/features/identity/ui/sign_in_problem.dart';
import 'package:second_bite/features/identity/ui/sign_in_screen.dart';
import 'package:second_bite/features/seller/data/seller_repository.dart';
import 'package:second_bite/l10n/l10n.dart';

part 'delete_account_screen.g.dart';

// A failure shows at once, with its retry, rather than behind retries.
Duration? _never(int retryCount, Object error) => null;

/// The names of the sellers the signed-in person owns, for the warning that
/// they close with the account. The code is not sent until they are read
/// (SEC-69).
@Riverpod(retry: _never)
Future<List<String>> ownedSellerNames(Ref ref) =>
    ref.watch(sellerRepositoryProvider).ownedSellerNames();

/// Where the deletion stands.
enum _Step { confirm, code, done }

/// {@template delete_account_screen}
/// Deleting the account (SEC-37), as the web's `/delete-account`: what goes at
/// once, what follows within minutes and what is kept; then, signed in, a code
/// emailed to the account's address, the code, and the confirmation. The
/// owner of a seller is warned first that it closes.
/// {@endtemplate}
class DeleteAccountScreen extends ConsumerStatefulWidget {
  /// {@macro delete_account_screen}
  const new({super.key});

  @override
  ConsumerState<DeleteAccountScreen> createState() =>
      _DeleteAccountScreenState();
}

class _DeleteAccountScreenState extends ConsumerState<DeleteAccountScreen> {
  final _code = TextEditingController();
  final _codeFocus = FocusNode();

  _Step _step = _Step.confirm;
  String? _challengeId;

  /// Bumped on each code sent, so the resend wait starts again.
  int _sent = 0;

  SignInProblem? _problem;
  bool _pending = false;

  /// As the web's `max-w-xl`.
  static const double _maxWidth = 576;

  @override
  void initState() {
    super.initState();
    _code.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _code.dispose();
    _codeFocus.dispose();
    super.dispose();
  }

  Future<void> _sendCode() async {
    setState(() {
      _pending = true;
      _problem = null;
    });
    try {
      final challengeId = await ref
          .read(authRepositoryProvider)
          .requestDeletionCode();
      if (!mounted) return;
      setState(() {
        _challengeId = challengeId;
        _step = _Step.code;
        _sent++;
        _code.clear();
      });
      _codeFocus.requestFocus();
    } on Object catch (error) {
      if (mounted) setState(() => _problem = SignInProblem.of(error));
    } finally {
      if (mounted) setState(() => _pending = false);
    }
  }

  Future<void> _delete() async {
    final challengeId = _challengeId;
    if (challengeId == null) return;
    setState(() {
      _pending = true;
      _problem = null;
    });
    try {
      await ref
          .read(currentAccountProvider.notifier)
          .deleteAccount(challengeId: challengeId, code: _code.text);
      if (mounted) setState(() => _step = _Step.done);
    } on Object catch (error) {
      if (!mounted) return;
      setState(() => _problem = SignInProblem.of(error));
      _code.clear();
    } finally {
      if (mounted) setState(() => _pending = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final account = ref.watch(currentAccountProvider).value;

    // Once deleted, back leaves for the home, not for the settings of an
    // account that is gone (SEC-69).
    return PopScope(
      canPop: _step != _Step.done,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop) const HomeRoute().go(context);
      },
      child: Scaffold(
        appBar: AppBar(title: Text(l10n.deleteAccountTitle)),
        body: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(
            SpacingTokens.space4,
            SpacingTokens.space4,
            SpacingTokens.space4,
            SpacingTokens.space8,
          ),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: _maxWidth),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                spacing: SpacingTokens.space4,
                children: [
                  Text(l10n.deleteAccountIntro, style: text.bodySm),
                  const _WhatGoes(),
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(SpacingTokens.space4),
                      child: switch ((_step, account)) {
                        (_Step.done, _) => const _Done(),
                        (_, null) => const _SignedOut(),
                        (_, final account?) => Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          spacing: SpacingTokens.space4,
                          children: [
                            const _OwnerWarning(),
                            if (_step == _Step.code)
                              ..._codeStep(context, account.email)
                            else
                              ..._confirmStep(context, account.email),
                          ],
                        ),
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  List<Widget> _confirmStep(BuildContext context, String email) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    // The code waits for the person's sellers: an owner is told which close
    // before anything is sent, and a failure to read them is not "none"
    // (SEC-69).
    final owned = ref.watch(ownedSellerNamesProvider);
    return [
      Text(l10n.deleteAccountConfirmBody(email), style: text.bodySm),
      Text(l10n.deleteAccountFinal, style: text.bodySmStrong),
      if (owned is AsyncError) const _OwnedFailed(),
      if (_problem case final problem?) _ProblemText(problem: problem),
      AppButton(
        variant: AppButtonVariant.destructive,
        onPressed: _pending || owned is! AsyncData ? null : _sendCode,
        child: Text(
          _pending ? l10n.deleteAccountSending : l10n.deleteAccountSendCode,
        ),
      ),
      AppButton(
        variant: AppButtonVariant.outline,
        onPressed: () => _keep(context),
        child: Text(l10n.deleteAccountCancel),
      ),
    ];
  }

  /// Back to account settings, which led here.
  void _keep(BuildContext context) => context.canPop()
      ? context.pop()
      : const AccountSettingsRoute().go(context);

  List<Widget> _codeStep(BuildContext context, String email) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;
    final problem = _problem;
    final invalid =
        problem?.kind == SignInProblemKind.codeIncorrect ||
        problem?.kind == SignInProblemKind.codeGone;

    return [
      Semantics(
        header: true,
        child: Text(l10n.deleteAccountCodeHeading, style: text.title),
      ),
      Text(
        l10n.deleteAccountCodeSent(email),
        style: text.bodySm.copyWith(color: scheme.onSurfaceVariant),
      ),
      // The deletion is final, so it waits for the button, not the sixth
      // digit.
      AppCodeField(
        controller: _code,
        focusNode: _codeFocus,
        semanticLabel: l10n.deleteAccountCodeLabel,
        invalid: invalid,
        enabled: !_pending,
      ),
      if (problem != null) _ProblemText(problem: problem),
      ResendCode(
        key: ValueKey(_sent),
        wait: problem?.kind == SignInProblemKind.codeGone
            ? 0
            : resendAfterSeconds,
        enabled: !_pending,
        onResend: () => unawaited(_sendCode()),
      ),
      AppButton(
        variant: AppButtonVariant.destructive,
        onPressed: _pending || _code.text.length < codeLength
            ? null
            : () => unawaited(_delete()),
        icon: const Icon(LucideIcons.trash2, size: 16),
        child: Text(
          _pending ? l10n.deleteAccountDeleting : l10n.deleteAccountConfirm,
        ),
      ),
      AppButton(
        variant: AppButtonVariant.outline,
        onPressed: () => _keep(context),
        child: Text(l10n.deleteAccountCancel),
      ),
    ];
  }
}

/// What goes at once, what follows within minutes and what is kept.
class _WhatGoes extends StatelessWidget {
  const new();

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(SpacingTokens.space4),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: SpacingTokens.space4,
          children: [
            _What(
              title: l10n.deleteAccountDeletedTitle,
              items: [
                l10n.deleteAccountDeleted1,
                l10n.deleteAccountDeleted2,
                l10n.deleteAccountDeleted3,
              ],
            ),
            _What(
              title: l10n.deleteAccountLaterTitle,
              items: [l10n.deleteAccountLater1, l10n.deleteAccountLater2],
            ),
            _What(
              title: l10n.deleteAccountKeptTitle,
              items: [l10n.deleteAccountKept1, l10n.deleteAccountKept2],
            ),
          ],
        ),
      ),
    );
  }
}

class _What extends StatelessWidget {
  const new({required this.title, required this.items});

  final String title;
  final List<String> items;

  @override
  Widget build(BuildContext context) {
    final text = context.appTextStyles;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: SpacingTokens.space2,
      children: [
        Semantics(header: true, child: Text(title, style: text.title)),
        for (final item in items)
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: SpacingTokens.space2,
            children: [
              Text('•', style: text.bodySm),
              Expanded(child: Text(item, style: text.bodySm)),
            ],
          ),
      ],
    );
  }
}

/// The warning to the owner of a seller; nothing while their sellers load,
/// when they could not be read (the confirm step says so) or when they own
/// none.
class _OwnerWarning extends ConsumerWidget {
  const new();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final owned = ref.watch(ownedSellerNamesProvider).value ?? const [];
    if (owned.isEmpty) return const SizedBox.shrink();
    final l10n = context.l10n;
    return AppAlert(
      icon: LucideIcons.triangleAlert,
      title: l10n.deleteAccountOwnerTitle,
      description: l10n.deleteAccountOwnerBody(owned.join(', ')),
    );
  }
}

/// The person's sellers could not be read: the code waits, and they are read
/// again on request.
class _OwnedFailed extends ConsumerWidget {
  const new();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = context.l10n;
    final error = Theme.of(context).colorScheme.error;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: SpacingTokens.space2,
      children: [
        Semantics(
          liveRegion: true,
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: 6,
            children: [
              Padding(
                padding: const EdgeInsets.only(top: 2),
                child: Icon(LucideIcons.circleAlert, size: 16, color: error),
              ),
              Expanded(
                child: Text(
                  l10n.deleteAccountOwnedFailed,
                  style: context.appTextStyles.bodySm.copyWith(color: error),
                ),
              ),
            ],
          ),
        ),
        AppButton(
          variant: AppButtonVariant.outline,
          onPressed: () => ref.invalidate(ownedSellerNamesProvider),
          icon: const Icon(LucideIcons.refreshCw, size: 16),
          child: Text(l10n.deleteAccountRetry),
        ),
      ],
    );
  }
}

class _SignedOut extends StatelessWidget {
  const new();

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: SpacingTokens.space3,
      children: [
        Semantics(
          header: true,
          child: Text(l10n.deleteAccountSignedOutTitle, style: text.title),
        ),
        Text(l10n.deleteAccountSignedOutBody, style: text.bodySm),
        AppButton(
          onPressed: () => unawaited(
            const SignInRoute(returnTo: '/delete-account').push<void>(context),
          ),
          child: Text(l10n.accountSignIn),
        ),
      ],
    );
  }
}

class _Done extends StatelessWidget {
  const new();

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final colors = context.appColors;
    return Semantics(
      liveRegion: true,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: SpacingTokens.space3,
        children: [
          Row(
            spacing: SpacingTokens.space2,
            children: [
              Icon(LucideIcons.circleCheck, size: 20, color: colors.success),
              Expanded(
                child: Semantics(
                  header: true,
                  child: Text(l10n.deleteAccountDoneTitle, style: text.title),
                ),
              ),
            ],
          ),
          Text(l10n.deleteAccountDoneBody, style: text.bodySm),
          AppButton(
            variant: AppButtonVariant.outline,
            onPressed: () => const HomeRoute().go(context),
            child: Text(l10n.deleteAccountHome),
          ),
        ],
      ),
    );
  }
}

class _ProblemText extends StatelessWidget {
  const new({required this.problem});

  final SignInProblem problem;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final error = Theme.of(context).colorScheme.error;
    final message = problem.text(l10n, failed: l10n.deleteAccountFailed);

    return Semantics(
      liveRegion: true,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: 6,
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 2),
            child: Icon(LucideIcons.circleAlert, size: 16, color: error),
          ),
          Expanded(
            child: Text(
              message,
              style: context.appTextStyles.bodySm.copyWith(color: error),
            ),
          ),
        ],
      ),
    );
  }
}
