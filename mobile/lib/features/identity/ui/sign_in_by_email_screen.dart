import 'dart:async';

import 'package:app_ui/app_ui.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:second_bite/core/routes.dart';
import 'package:second_bite/features/identity/data/auth_repository.dart';
import 'package:second_bite/features/identity/ui/auth_parts.dart';
import 'package:second_bite/features/identity/ui/resend_code.dart';
import 'package:second_bite/features/identity/ui/sign_in_problem.dart';
import 'package:second_bite/l10n/l10n.dart';

/// How many digits the emailed code has.
const codeLength = 6;

/// How long "Gửi lại mã" waits after a code is sent: the server refuses a
/// new code for a minute (server/internal/identity, codeCooldown), so the
/// button never offers what would be refused.
const resendAfterSeconds = 60;

/// {@template sign_in_by_email_screen}
/// Signing in with the emailed code (SEC-43), on a screen of its own since
/// SEC-196 as the web's `/sign-in/email`: an address, then the six digits
/// sent to it. Opened by Google when the address already has an account
/// Google does not speak for, with [googleEmail] filled in and said so.
/// {@endtemplate}
class SignInByEmailScreen extends ConsumerStatefulWidget {
  /// {@macro sign_in_by_email_screen}
  const new({required this.returnTo, this.googleEmail, super.key});

  /// The path to go back to, already checked by `readReturnTo`.
  final String returnTo;

  /// The address Google gave when its account needs the emailed code; empty
  /// when Google's token named none; null when not opened by Google.
  final String? googleEmail;

  @override
  ConsumerState<SignInByEmailScreen> createState() =>
      _SignInByEmailScreenState();
}

class _SignInByEmailScreenState extends ConsumerState<SignInByEmailScreen>
    with LeavesWhenSignedIn {
  late final _email = TextEditingController(text: widget.googleEmail);
  final _code = TextEditingController();
  final _codeFocus = FocusNode();

  /// The challenge of the code step; null on the email step.
  String? _challengeId;

  /// Bumped on each code sent, so the resend wait starts again.
  int _sent = 0;

  SignInProblem? _problem;
  bool _pending = false;

  @override
  String get returnTo => widget.returnTo;

  @override
  void dispose() {
    _email.dispose();
    _code.dispose();
    _codeFocus.dispose();
    super.dispose();
  }

  /// Runs [action] as the screen's one pending step; a failure becomes the
  /// problem shown.
  Future<void> _run(Future<void> Function() action) async {
    setState(() {
      _problem = null;
      _pending = true;
    });
    try {
      await action();
    } on Object catch (error) {
      if (!mounted) return;
      setState(() => _problem = SignInProblem.of(error));
    } finally {
      if (mounted) setState(() => _pending = false);
    }
  }

  Future<void> _sendCode(String email) => _run(() async {
    final challengeId = await ref
        .read(authRepositoryProvider)
        .requestCode(email);
    if (!mounted) return;
    _code.clear();
    setState(() {
      _challengeId = challengeId;
      _sent++;
    });
    _codeFocus.requestFocus();
  });

  Future<void> _confirm(String challengeId, String code) async {
    await _run(() async {
      final account = await ref
          .read(authRepositoryProvider)
          .signIn(challengeId: challengeId, code: code);
      if (mounted) signedIn(account);
    });
    // A refused code is cleared once the field takes input again, and the
    // field keeps the focus for the next try.
    if (!mounted || _problem == null) return;
    _code.clear();
    _codeFocus.requestFocus();
  }

  /// Back to the username and the password: the screen below when it opened
  /// this one, otherwise in this one's place.
  void _usePassword() => context.canPop()
      ? context.pop()
      : SignInRoute(returnTo: widget.returnTo).replace(context);

  @override
  Widget build(BuildContext context) {
    final challengeId = _challengeId;
    return AuthScaffold(
      title: context.l10n.signInEmailHeading,
      returnTo: widget.returnTo,
      child: challengeId == null
          ? _emailStep(context)
          : _codeStep(context, challengeId),
    );
  }

  Widget _emailStep(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final googleEmail = widget.googleEmail;
    final problem = _problem;
    void send() => _sendCode(_email.text.trim());

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: 20,
      children: [
        Semantics(
          header: true,
          child: Text(l10n.signInEmailHeading, style: text.headline),
        ),
        if (googleEmail != null)
          AppAlert(
            icon: LucideIcons.mailWarning,
            title: l10n.signInGoogleNeedsCodeTitle,
            description: googleEmail.isEmpty
                ? l10n.signInGoogleNeedsCodeBodyNoAddress
                : l10n.signInGoogleNeedsCodeBody(googleEmail),
          ),
        AuthField(
          label: l10n.signInEmailLabel,
          controller: _email,
          hint: l10n.signInEmailPlaceholder,
          autofillHints: const [AutofillHints.email],
          keyboardType: TextInputType.emailAddress,
          textInputAction: TextInputAction.send,
          enabled: !_pending,
          error: problem?.text(l10n, failed: l10n.signInFailed),
          invalid: problem?.kind == SignInProblemKind.emailInvalid,
          onSubmitted: (_) => send(),
        ),
        AppButton(
          onPressed: _pending ? null : send,
          icon: _pending ? const AuthSpinner() : null,
          child: Text(
            _pending
                ? l10n.signInSending
                : googleEmail != null
                ? l10n.signInSendCodeHere
                : l10n.signInSendCode,
          ),
        ),
        Center(
          child: TextButton(
            onPressed: _pending ? null : _usePassword,
            child: Text(l10n.signInUsePassword),
          ),
        ),
        const LegalLine(),
      ],
    );
  }

  Widget _codeStep(BuildContext context, String challengeId) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;
    final problem = _problem;
    final invalid =
        problem?.kind == SignInProblemKind.codeIncorrect ||
        problem?.kind == SignInProblemKind.codeGone;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: 20,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          spacing: SpacingTokens.space1,
          children: [
            Semantics(
              header: true,
              child: Text(l10n.signInCodeHeading, style: text.headline),
            ),
            _CodeSent(
              email: _email.text.trim(),
              onChangeEmail: () => setState(() {
                _problem = null;
                _challengeId = null;
              }),
            ),
          ],
        ),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: SpacingTokens.space2,
          children: [
            AppCodeField(
              controller: _code,
              focusNode: _codeFocus,
              semanticLabel: l10n.signInCodeLabel,
              invalid: invalid,
              enabled: !_pending,
              onCompleted: (code) => _confirm(challengeId, code),
            ),
            if (problem != null)
              SignInProblemLine(problem: problem, failed: l10n.signInFailed),
            Text(
              l10n.signInNotArrived,
              style: text.label.copyWith(color: scheme.onSurfaceVariant),
            ),
            ResendCode(
              key: ValueKey(_sent),
              wait: problem?.kind == SignInProblemKind.codeGone
                  ? 0
                  : resendAfterSeconds,
              enabled: !_pending,
              onResend: () => _sendCode(_email.text.trim()),
            ),
          ],
        ),
        ListenableBuilder(
          listenable: _code,
          builder: (context, _) => AppButton(
            onPressed: _pending || _code.text.length < codeLength
                ? null
                : () => _confirm(challengeId, _code.text),
            icon: _pending ? const AuthSpinner() : null,
            child: Text(_pending ? l10n.signInConfirming : l10n.signInConfirm),
          ),
        ),
      ],
    );
  }
}

/// "Mã đăng nhập 6 số đã gửi đến **email**. Đổi email"
class _CodeSent extends StatefulWidget {
  const new({required this.email, required this.onChangeEmail});

  final String email;
  final VoidCallback onChangeEmail;

  @override
  State<_CodeSent> createState() => _CodeSentState();
}

class _CodeSentState extends State<_CodeSent> {
  late final _change = TapGestureRecognizer()
    ..onTap = () => widget.onChangeEmail();

  @override
  void dispose() {
    _change.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;
    // The address is set in bold where the catalog puts it.
    const mark = '\u0000';
    final parts = l10n.signInCodeSent(mark).split(mark);

    return Text.rich(
      TextSpan(
        style: text.bodySm.copyWith(color: scheme.onSurfaceVariant),
        children: [
          TextSpan(text: parts.first),
          TextSpan(
            text: widget.email,
            style: text.bodySmStrong.copyWith(color: scheme.onSurface),
          ),
          if (parts.length > 1) TextSpan(text: parts[1]),
          const TextSpan(text: ' '),
          TextSpan(
            text: l10n.signInChangeEmail,
            style: text.bodySmStrong.copyWith(color: scheme.primary),
            recognizer: _change,
            semanticsLabel: l10n.signInChangeEmail,
          ),
        ],
      ),
    );
  }
}
