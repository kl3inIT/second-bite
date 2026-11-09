import 'dart:async';

import 'package:app_ui/app_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:second_bite/core/routes.dart';
import 'package:second_bite/features/identity/data/apple_auth.dart';
import 'package:second_bite/features/identity/data/auth_repository.dart';
import 'package:second_bite/features/identity/data/google_auth.dart';
import 'package:second_bite/features/identity/ui/auth_parts.dart';
import 'package:second_bite/features/identity/ui/sign_in_problem.dart';
import 'package:second_bite/l10n/l10n.dart';
import 'package:sign_in_with_apple/sign_in_with_apple.dart';

/// {@template sign_in_screen}
/// The sign-in screen (SEC-43, SEC-196), as the web's `/sign-in`: a username
/// and a password, then the other ways in under the button, the emailed
/// code on a screen of its own, Google and, on iOS, Apple when the server
/// offers them (SEC-38), and the way to register. The session's token is
/// kept, and the person goes back to [returnTo].
/// {@endtemplate}
class SignInScreen extends ConsumerStatefulWidget {
  /// {@macro sign_in_screen}
  const new({required this.returnTo, super.key});

  /// The path to go back to, already checked by `readReturnTo`.
  final String returnTo;

  @override
  ConsumerState<SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends ConsumerState<SignInScreen>
    with LeavesWhenSignedIn {
  final _username = TextEditingController();
  final _password = TextEditingController();
  final _passwordFocus = FocusNode();

  /// Set by the first try, after which the fields are checked as they change,
  /// as the web's `revalidateLogic`.
  bool _tried = false;

  String? _googleClientId;
  bool _appleOffered = false;
  SignInProblem? _problem;
  bool _pending = false;

  @override
  String get returnTo => widget.returnTo;

  @override
  void initState() {
    super.initState();
    unawaited(_readMethods());
    _username.addListener(_changed);
    _password.addListener(_changed);
  }

  @override
  void dispose() {
    _username.dispose();
    _password.dispose();
    _passwordFocus.dispose();
    super.dispose();
  }

  void _changed() {
    if (_tried) setState(() {});
  }

  Future<void> _readMethods() async {
    final auth = ref.read(authRepositoryProvider);
    try {
      final clientId = await auth.googleClientId();
      if (mounted) setState(() => _googleClientId = clientId);
      // Apple is asked about only where it can be shown, the iOS app.
      if (!ref.read(appleAuthProvider).available) return;
      final apple = await auth.appleOffered();
      if (mounted) setState(() => _appleOffered = apple);
    } on Object {
      // Without the methods the password and the emailed code still work.
    }
  }

  String? get _usernameError => _tried && _username.text.trim().isEmpty
      ? context.l10n.signInUsernameRequired
      : null;

  String? get _passwordError => _tried && _password.text.isEmpty
      ? context.l10n.signInPasswordRequired
      : null;

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

  Future<void> _signIn() async {
    setState(() => _tried = true);
    if (_usernameError != null || _passwordError != null) return;
    await _run(() async {
      final account = await ref
          .read(authRepositoryProvider)
          .signInWithPassword(
            username: _username.text.trim(),
            password: _password.text,
          );
      if (mounted) signedIn(account);
    });
    // A password that was refused is not kept in the form.
    if (!mounted || _problem == null) return;
    _password.clear();
    _passwordFocus.requestFocus();
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
      if (mounted) signedIn(account);
    } on Object catch (error) {
      if (problemCode(error) != 'IDENTITY_GOOGLE_LINK_REQUIRED') rethrow;
      // The address already has an account and Google does not speak for
      // it: the emailed code proves it today (SEC-29 › decision 4).
      if (!mounted) return;
      unawaited(
        SignInByEmailRoute(
          returnTo: widget.returnTo,
          googleEmail: emailInToken(credential.idToken) ?? '',
        ).push<void>(context),
      );
    }
  });

  Future<void> _continueWithApple() => _run(() async {
    final credential = await ref.read(appleAuthProvider).signIn();
    if (credential == null) return;
    try {
      final account = await ref
          .read(authRepositoryProvider)
          .signInWithApple(credential);
      if (mounted) signedIn(account);
    } on Object catch (error) {
      if (problemCode(error) != 'IDENTITY_APPLE_LINK_REQUIRED') rethrow;
      // The address already has an account Apple did not issue: the emailed
      // code proves it, as for Google (SEC-38 › 3).
      if (!mounted) return;
      unawaited(
        SignInByEmailRoute(
          returnTo: widget.returnTo,
          googleEmail: emailInToken(credential.idToken) ?? '',
        ).push<void>(context),
      );
    }
  });

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final clientId = _googleClientId;
    final google = ref.watch(googleAuthProvider);
    final problem = _problem;

    return AuthScaffold(
      title: l10n.signInTitle,
      returnTo: widget.returnTo,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: 20,
        children: [
          Semantics(
            header: true,
            child: Text(l10n.signInHeading, style: text.headline),
          ),
          AuthField(
            label: l10n.signInUsernameLabel,
            controller: _username,
            hint: l10n.signInUsernamePlaceholder,
            autofillHints: const [AutofillHints.username],
            enabled: !_pending,
            error: _usernameError,
            onSubmitted: (_) => _passwordFocus.requestFocus(),
          ),
          AuthField(
            label: l10n.signInPasswordLabel,
            controller: _password,
            focusNode: _passwordFocus,
            hint: l10n.signInPasswordPlaceholder,
            autofillHints: const [AutofillHints.password],
            obscure: true,
            textInputAction: TextInputAction.done,
            enabled: !_pending,
            error: _passwordError,
            onSubmitted: (_) => unawaited(_signIn()),
          ),
          if (problem != null)
            SignInProblemLine(problem: problem, failed: l10n.signInFailed),
          AppButton(
            onPressed: _pending ? null : () => unawaited(_signIn()),
            icon: _pending ? const AuthSpinner() : null,
            child: Text(_pending ? l10n.signInSigningIn : l10n.signInSubmit),
          ),
          AuthSeparator(label: l10n.signInOr),
          AppButton(
            variant: AppButtonVariant.outline,
            icon: const Icon(LucideIcons.mail, size: 16),
            onPressed: _pending
                ? null
                : () => unawaited(
                    SignInByEmailRoute(returnTo: widget.returnTo)
                        .push<void>(context),
                  ),
            child: Text(l10n.signInWithEmail),
          ),
          if (clientId != null && google.available)
            AppGoogleButton(
              label: l10n.signInGoogle,
              onPressed: _pending ? null : () => _continueWithGoogle(clientId),
            ),
          // Apple's own button, as tall as the others (Apple's Human Interface
          // Guidelines: no smaller than another sign-in button).
          if (_appleOffered && ref.watch(appleAuthProvider).available)
            IgnorePointer(
              ignoring: _pending,
              child: SignInWithAppleButton(
                text: l10n.signInApple,
                height: 52,
                borderRadius: const BorderRadius.all(
                  Radius.circular(RadiusTokens.xl),
                ),
                onPressed: () => unawaited(_continueWithApple()),
              ),
            ),
          AuthSwitchLine(
            question: l10n.signInNoAccount,
            action: l10n.signInRegister,
            onPressed: _pending
                ? null
                : () => unawaited(
                    RegisterRoute(returnTo: widget.returnTo)
                        .push<void>(context),
                  ),
          ),
          const LegalLine(),
        ],
      ),
    );
  }
}
