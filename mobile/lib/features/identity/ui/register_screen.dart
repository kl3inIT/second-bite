import 'dart:async';

import 'package:app_ui/app_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:second_bite/core/routes.dart';
import 'package:second_bite/features/identity/data/auth_repository.dart';
import 'package:second_bite/features/identity/ui/auth_parts.dart';
import 'package:second_bite/features/identity/ui/sign_in_problem.dart';
import 'package:second_bite/l10n/l10n.dart';

/// A username as the server's rule reads it (server/internal/identity,
/// usernamePattern): 3 to 30 letters without marks, digits, `.`, `_` and
/// `-`, the first and the last a letter or a digit. Capitals count: Lan and
/// lan are two names, and the server keeps what was typed.
final RegExp _username = RegExp(
  r'^[A-Za-z0-9][A-Za-z0-9._-]{1,28}[A-Za-z0-9]$',
);

/// The fewest and the most characters a password has, counted as the server
/// counts them (minPasswordLength, maxPasswordLength).
const ({int min, int max}) _passwordLength = (min: 8, max: 128);

/// {@template register_screen}
/// Registering with a username and a password (SEC-196), as the web's
/// `/register`: the username, the password and the password again, nothing
/// else. The account has no email; it is made and signed in at once, and
/// the person goes back to [returnTo].
/// {@endtemplate}
class RegisterScreen extends ConsumerStatefulWidget {
  /// {@macro register_screen}
  const new({required this.returnTo, super.key});

  /// The path to go back to, already checked by `readReturnTo`.
  final String returnTo;

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen>
    with LeavesWhenSignedIn {
  final _name = TextEditingController();
  final _password = TextEditingController();
  final _confirm = TextEditingController();
  final _passwordFocus = FocusNode();
  final _confirmFocus = FocusNode();

  /// Set by the first try, after which the fields are checked as they change,
  /// as the web's `revalidateLogic`.
  bool _tried = false;

  SignInProblem? _problem;
  bool _pending = false;

  @override
  String get returnTo => widget.returnTo;

  @override
  void initState() {
    super.initState();
    for (final field in [_name, _password, _confirm]) {
      field.addListener(_changed);
    }
  }

  @override
  void dispose() {
    _name.dispose();
    _password.dispose();
    _confirm.dispose();
    _passwordFocus.dispose();
    _confirmFocus.dispose();
    super.dispose();
  }

  /// Checks the fields again once tried; a refusal of what was typed goes as
  /// soon as it changes.
  void _changed() {
    if (_tried || _problem != null) setState(() => _problem = null);
  }

  String? get _nameError {
    final problem = _problem;
    if (problem?.kind == SignInProblemKind.usernameInvalid ||
        problem?.kind == SignInProblemKind.usernameTaken) {
      return problem!.text(context.l10n, failed: context.l10n.registerFailed);
    }
    return _tried && !_username.hasMatch(_name.text.trim())
        ? context.l10n.registerUsernameInvalid
        : null;
  }

  String? get _passwordError {
    final problem = _problem;
    if (problem?.kind == SignInProblemKind.passwordInvalid) {
      return problem!.text(context.l10n, failed: context.l10n.registerFailed);
    }
    final length = _password.text.runes.length;
    return _tried &&
            (length < _passwordLength.min || length > _passwordLength.max)
        ? context.l10n.registerPasswordInvalid
        : null;
  }

  String? get _confirmError => _tried && _confirm.text != _password.text
      ? context.l10n.registerMismatch
      : null;

  /// A refusal that no field owns, shown above the button.
  SignInProblem? get _formProblem => switch (_problem?.kind) {
    SignInProblemKind.usernameInvalid ||
    SignInProblemKind.usernameTaken ||
    SignInProblemKind.passwordInvalid => null,
    _ => _problem,
  };

  Future<void> _register() async {
    setState(() {
      _tried = true;
      _problem = null;
    });
    if (_nameError != null || _passwordError != null || _confirmError != null) {
      return;
    }
    setState(() => _pending = true);
    try {
      final account = await ref
          .read(authRepositoryProvider)
          .register(username: _name.text.trim(), password: _password.text);
      if (mounted) signedIn(account);
    } on Object catch (error) {
      if (mounted) setState(() => _problem = SignInProblem.of(error));
    } finally {
      if (mounted) setState(() => _pending = false);
    }
  }

  /// Back to sign-in: the screen below when it opened this one, otherwise in
  /// this one's place.
  void _signIn() => context.canPop()
      ? context.pop()
      : SignInRoute(returnTo: widget.returnTo).replace(context);

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final formProblem = _formProblem;

    return AuthScaffold(
      title: l10n.registerTitle,
      returnTo: widget.returnTo,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: 20,
        children: [
          Semantics(
            header: true,
            child: Text(l10n.registerTitle, style: text.headline),
          ),
          AuthField(
            label: l10n.registerUsernameLabel,
            controller: _name,
            hint: l10n.registerUsernamePlaceholder,
            autofillHints: const [AutofillHints.newUsername],
            enabled: !_pending,
            error: _nameError,
            onSubmitted: (_) => _passwordFocus.requestFocus(),
          ),
          AuthField(
            label: l10n.registerPasswordLabel,
            controller: _password,
            focusNode: _passwordFocus,
            hint: l10n.registerPasswordPlaceholder,
            autofillHints: const [AutofillHints.newPassword],
            obscure: true,
            enabled: !_pending,
            error: _passwordError,
            onSubmitted: (_) => _confirmFocus.requestFocus(),
          ),
          AuthField(
            label: l10n.registerConfirmLabel,
            controller: _confirm,
            focusNode: _confirmFocus,
            hint: l10n.registerConfirmPlaceholder,
            autofillHints: const [AutofillHints.newPassword],
            obscure: true,
            textInputAction: TextInputAction.done,
            enabled: !_pending,
            error: _confirmError,
            onSubmitted: (_) => unawaited(_register()),
          ),
          if (formProblem != null)
            SignInProblemLine(
              problem: formProblem,
              failed: l10n.registerFailed,
            ),
          AppButton(
            onPressed: _pending ? null : () => unawaited(_register()),
            icon: _pending ? const AuthSpinner() : null,
            child: Text(
              _pending ? l10n.registerSubmitting : l10n.registerSubmit,
            ),
          ),
          AuthSwitchLine(
            question: l10n.registerHaveAccount,
            action: l10n.registerSignIn,
            onPressed: _pending ? null : _signIn,
          ),
          const LegalLine(),
        ],
      ),
    );
  }
}
