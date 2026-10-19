import 'dart:async';

import 'package:app_ui/app_ui.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/core/language_button.dart';
import 'package:second_bite/core/web_pages.dart';
import 'package:second_bite/features/identity/data/auth_repository.dart';
import 'package:second_bite/features/identity/data/google_auth.dart';
import 'package:second_bite/features/identity/ui/current_account.dart';
import 'package:second_bite/features/identity/ui/sign_in_problem.dart';
import 'package:second_bite/l10n/l10n.dart';

/// How many digits the emailed code has.
const codeLength = 6;

/// How long "Gửi lại mã" waits after a code is sent: the server refuses a
/// new code for a minute (server/internal/identity, codeCooldown), so the
/// button never offers what would be refused.
const resendAfterSeconds = 60;

/// {@template sign_in_screen}
/// The sign-in screen (SEC-43), as the web's `/sign-in`: Google's button
/// when the server offers Google, or an address and the six-digit code
/// emailed to it. The session's token is kept, and the person goes back to
/// [returnTo].
/// {@endtemplate}
class SignInScreen extends ConsumerStatefulWidget {
  /// {@macro sign_in_screen}
  const new({required this.returnTo, super.key});

  /// The path to go back to, already checked by `readReturnTo`.
  final String returnTo;

  @override
  ConsumerState<SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends ConsumerState<SignInScreen> {
  final _email = TextEditingController();
  final _code = TextEditingController();
  final _codeFocus = FocusNode();

  /// The challenge of the code step; null on the email step.
  String? _challengeId;

  /// Bumped on each code sent, so the resend wait starts again.
  int _sent = 0;

  /// The address Google gave when its account needs the emailed code; empty
  /// when Google's token named none; null otherwise.
  String? _googleNeedsCode;

  String? _googleClientId;
  SignInProblem? _problem;
  bool _pending = false;

  /// As the web's `max-w-110`.
  static const double _maxWidth = 440;

  @override
  void initState() {
    super.initState();
    unawaited(_readMethods());
    // Already signed in, now or once the kept session is read: nothing to do
    // here.
    ref.listenManual(currentAccountProvider, (_, next) {
      if (next.value == null) return;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) context.go(widget.returnTo);
      });
    }, fireImmediately: true);
  }

  @override
  void dispose() {
    _email.dispose();
    _code.dispose();
    _codeFocus.dispose();
    super.dispose();
  }

  Future<void> _readMethods() async {
    try {
      final clientId = await ref.read(authRepositoryProvider).googleClientId();
      if (mounted) setState(() => _googleClientId = clientId);
    } on Object {
      // Without the methods the emailed code still works.
    }
  }

  void _signedIn(AccountBody account) {
    ref.read(currentAccountProvider.notifier).signedIn(account);
    context.go(widget.returnTo);
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
      if (mounted) _signedIn(account);
    });
    // A refused code is cleared once the field takes input again, and the
    // field keeps the focus for the next try.
    if (!mounted || _problem == null) return;
    _code.clear();
    _codeFocus.requestFocus();
  }

  Future<void> _continueWithGoogle(String clientId) => _run(() async {
    final credential = await ref.read(googleAuthProvider).signIn(clientId);
    if (credential == null) return;
    try {
      final account = await ref
          .read(authRepositoryProvider)
          .signInWithGoogle(
            idToken: credential.idToken,
            nonce: credential.nonce,
          );
      if (mounted) _signedIn(account);
    } on Object catch (error) {
      if (problemCode(error) != 'IDENTITY_GOOGLE_LINK_REQUIRED') rethrow;
      // The address already has an account and Google does not speak for
      // it: the emailed code proves it today (SEC-29 › decision 4).
      final address = emailInToken(credential.idToken) ?? '';
      if (!mounted) return;
      setState(() {
        _email.text = address;
        _googleNeedsCode = address;
      });
    }
  });

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final challengeId = _challengeId;

    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      appBar: AppBar(
        leading: IconButton(
          tooltip: l10n.topBarBack,
          onPressed: () =>
              context.canPop() ? context.pop() : context.go(widget.returnTo),
          icon: const Icon(LucideIcons.chevronLeft, size: 24),
        ),
        title: Text(l10n.signInTitle),
        actions: const [
          LanguageButton(),
          SizedBox(width: SpacingTokens.space3),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(
            horizontal: SpacingTokens.space4,
            vertical: SpacingTokens.space6,
          ),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: _maxWidth),
              child: AutofillGroup(
                child: challengeId == null
                    ? _emailStep(context)
                    : _codeStep(context, challengeId),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _emailStep(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final googleNeedsCode = _googleNeedsCode;
    final clientId = _googleClientId;
    final google = ref.watch(googleAuthProvider);
    final emailInvalid = _problem?.kind == SignInProblemKind.emailInvalid;
    void send() => _sendCode(_email.text.trim());

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: 20,
      children: [
        Semantics(
          header: true,
          child: Text(l10n.signInHeading, style: text.headline),
        ),
        if (googleNeedsCode != null)
          AppAlert(
            icon: LucideIcons.mailWarning,
            title: l10n.signInGoogleNeedsCodeTitle,
            description: googleNeedsCode.isEmpty
                ? l10n.signInGoogleNeedsCodeBodyNoAddress
                : l10n.signInGoogleNeedsCodeBody(googleNeedsCode),
          ),
        if (clientId != null &&
            google.available &&
            googleNeedsCode == null) ...[
          AppGoogleButton(
            label: l10n.signInGoogle,
            onPressed: _pending ? null : () => _continueWithGoogle(clientId),
          ),
          _Separator(label: l10n.signInOr),
        ],
        Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          spacing: SpacingTokens.space2,
          children: [
            Text(l10n.signInEmailLabel, style: text.labelStrong),
            TextField(
              controller: _email,
              enabled: !_pending,
              keyboardType: TextInputType.emailAddress,
              textInputAction: TextInputAction.send,
              autofillHints: const [AutofillHints.email],
              autocorrect: false,
              enableSuggestions: false,
              decoration: InputDecoration(
                hintText: l10n.signInEmailPlaceholder,
                // Red edge only; the words are below, with the icon.
                error: emailInvalid ? const SizedBox.shrink() : null,
              ),
              onSubmitted: (_) => send(),
            ),
            if (_problem case final problem?) _ProblemText(problem: problem),
          ],
        ),
        AppButton(
          onPressed: _pending ? null : send,
          icon: _pending ? const _Spinner() : null,
          child: Text(
            _pending
                ? l10n.signInSending
                : googleNeedsCode != null
                ? l10n.signInSendCodeHere
                : l10n.signInSendCode,
          ),
        ),
        const _LegalLine(),
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
            if (problem != null) _ProblemText(problem: problem),
            Text(
              l10n.signInNotArrived,
              style: text.label.copyWith(color: scheme.onSurfaceVariant),
            ),
            _ResendCode(
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
            icon: _pending ? const _Spinner() : null,
            child: Text(_pending ? l10n.signInConfirming : l10n.signInConfirm),
          ),
        ),
      ],
    );
  }
}

/// "hoặc dùng email" between two rules.
class _Separator extends StatelessWidget {
  const new({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Row(
      spacing: SpacingTokens.space2,
      children: [
        const Expanded(child: Divider()),
        Text(
          label,
          style: context.appTextStyles.label.copyWith(
            color: Theme.of(context).colorScheme.onSurfaceVariant,
          ),
        ),
        const Expanded(child: Divider()),
      ],
    );
  }
}

/// A problem's words under its field, after the alert icon, announced when
/// they appear.
class _ProblemText extends StatelessWidget {
  const new({required this.problem});

  final SignInProblem problem;

  @override
  Widget build(BuildContext context) {
    final error = Theme.of(context).colorScheme.error;

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
              problem.text(context.l10n),
              style: context.appTextStyles.bodySm.copyWith(color: error),
            ),
          ),
        ],
      ),
    );
  }
}

class _Spinner extends StatelessWidget {
  const new();

  @override
  Widget build(BuildContext context) {
    return const SizedBox.square(
      dimension: 16,
      child: CircularProgressIndicator(strokeWidth: 2),
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

/// "Khi tiếp tục, bạn đồng ý với Điều khoản sử dụng và Chính sách quyền
/// riêng tư.", the two pages opening on the web as on the account tab.
class _LegalLine extends StatefulWidget {
  const new();

  @override
  State<_LegalLine> createState() => _LegalLineState();
}

class _LegalLineState extends State<_LegalLine> {
  final Map<LegalPage, TapGestureRecognizer> _links = {
    for (final page in LegalPage.values) page: TapGestureRecognizer(),
  };

  @override
  void dispose() {
    for (final link in _links.values) {
      link.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;
    final language = Localizations.localeOf(context).languageCode;
    const terms = '\u0000';
    const privacy = '\u0001';
    final sentence = l10n.signInLegal(terms, privacy);
    final link = text.label.copyWith(
      color: scheme.onSurfaceVariant,
      decoration: TextDecoration.underline,
    );

    final spans = <InlineSpan>[];
    var rest = sentence;
    while (rest.isNotEmpty) {
      final at = rest.indexOf(RegExp('[$terms$privacy]'));
      if (at < 0) {
        spans.add(TextSpan(text: rest));
        break;
      }
      if (at > 0) spans.add(TextSpan(text: rest.substring(0, at)));
      final page = rest[at] == terms ? LegalPage.terms : LegalPage.privacy;
      spans.add(
        TextSpan(
          text: page == LegalPage.terms ? l10n.legalTerms : l10n.legalPrivacy,
          style: link,
          recognizer: _links[page]!
            ..onTap = () => openLegalPage(page, language),
        ),
      );
      rest = rest.substring(at + 1);
    }

    return Text.rich(
      TextSpan(
        style: text.label.copyWith(color: scheme.onSurfaceVariant),
        children: spans,
      ),
      textAlign: TextAlign.center,
    );
  }
}

/// "Gửi lại mã sau 0:28", then the button itself once the wait is over.
class _ResendCode extends StatefulWidget {
  const new({
    required this.wait,
    required this.enabled,
    required this.onResend,
    super.key,
  });

  /// Seconds to wait before a new code can be asked for.
  final int wait;
  final bool enabled;
  final VoidCallback onResend;

  @override
  State<_ResendCode> createState() => _ResendCodeState();
}

class _ResendCodeState extends State<_ResendCode> {
  late int _left = widget.wait;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _start();
  }

  @override
  void didUpdateWidget(_ResendCode oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.wait == 0 && _left > 0) {
      _timer?.cancel();
      _left = 0;
    }
  }

  void _start() {
    if (_left == 0) return;
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() => _left--);
      if (_left <= 0) timer.cancel();
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    if (_left > 0) {
      final time = '${_left ~/ 60}:${(_left % 60).toString().padLeft(2, '0')}';
      return Text(
        l10n.signInResendIn(time),
        style: context.appTextStyles.label.copyWith(
          color: Theme.of(context).colorScheme.onSurfaceVariant,
        ),
      );
    }
    return TextButton(
      onPressed: widget.enabled ? widget.onResend : null,
      style: TextButton.styleFrom(
        padding: EdgeInsets.zero,
        minimumSize: const Size(0, 44),
        foregroundColor: Theme.of(context).colorScheme.primary,
      ),
      child: Text(l10n.signInResend),
    );
  }
}
