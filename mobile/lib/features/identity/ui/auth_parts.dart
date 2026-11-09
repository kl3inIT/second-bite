import 'dart:async';

import 'package:app_ui/app_ui.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/core/language_button.dart';
import 'package:second_bite/core/routes.dart';
import 'package:second_bite/features/identity/ui/current_account.dart';
import 'package:second_bite/features/identity/ui/sign_in_problem.dart';
import 'package:second_bite/features/legal/ui/legal_text.dart';
import 'package:second_bite/l10n/l10n.dart';

/// What the sign-in, sign-in by email and register screens share (SEC-43,
/// SEC-196): they leave as soon as someone is signed in, back to the screen
/// that opened them, or to `returnTo` when opened on their own.
mixin LeavesWhenSignedIn<T extends ConsumerStatefulWidget> on ConsumerState<T> {
  /// The path to go back to, already checked by `readReturnTo`.
  String get returnTo;

  /// Set once the screen has left, as both a sign-in and the account it
  /// records ask it to.
  bool _left = false;

  @override
  void initState() {
    super.initState();
    // Already signed in, now, once the kept session is read, or on a screen
    // opened above this one: nothing to do here.
    ref.listenManual(currentAccountProvider, (_, next) {
      if (next.value == null) return;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) leave();
      });
    }, fireImmediately: true);
  }

  /// Records [account], just signed in, lets a password manager keep what
  /// was typed, and leaves.
  void signedIn(AccountBody account) {
    TextInput.finishAutofillContext();
    ref.read(currentAccountProvider.notifier).signedIn(account);
    leave();
  }

  /// Back to the screen that opened sign-in, which follows the account and
  /// keeps its own way back (SEC-69); opened on its own, to [returnTo]. Once
  /// only: a second pop would close that screen too.
  void leave() {
    if (_left) return;
    _left = true;
    context.canPop() ? context.pop() : context.go(returnTo);
  }
}

/// {@template auth_scaffold}
/// The frame of the sign-in screens: the bar with back, its [title] and the
/// language, then [child] in a column as wide as the web's `max-w-110`, in
/// one autofill group so a password manager fills and keeps it.
/// {@endtemplate}
class AuthScaffold extends StatelessWidget {
  /// {@macro auth_scaffold}
  const new({
    required this.title,
    required this.returnTo,
    required this.child,
    super.key,
  });

  /// The bar's title.
  final String title;

  /// Where back goes when nothing opened this screen.
  final String returnTo;

  /// The form.
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      appBar: AppBar(
        leading: IconButton(
          tooltip: context.l10n.topBarBack,
          onPressed: () =>
              context.canPop() ? context.pop() : context.go(returnTo),
          icon: const BackButtonIcon(),
        ),
        title: Text(title),
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
              constraints: const BoxConstraints(maxWidth: 440),
              child: AutofillGroup(child: child),
            ),
          ),
        ),
      ),
    );
  }
}

/// {@template auth_field}
/// A field of the sign-in screens: its label above, a red edge and [error]
/// under it, after the alert icon, when it is refused.
/// {@endtemplate}
class AuthField extends StatelessWidget {
  /// {@macro auth_field}
  const new({
    required this.label,
    required this.controller,
    required this.hint,
    required this.autofillHints,
    this.error,
    this.invalid,
    this.enabled = true,
    this.obscure = false,
    this.keyboardType,
    this.textInputAction = TextInputAction.next,
    this.onSubmitted,
    this.focusNode,
    super.key,
  });

  /// The label above the field.
  final String label;

  /// What was typed.
  final TextEditingController controller;

  /// The placeholder.
  final String hint;

  /// What a password manager fills it with.
  final List<String> autofillHints;

  /// Why it is refused, or null.
  final String? error;

  /// Whether the field itself is refused, its edge red; by default whenever
  /// there is an [error]. A failure that is not about what was typed shows
  /// under it with the edge unchanged.
  final bool? invalid;

  /// Whether it takes input; not while a step is pending.
  final bool enabled;

  /// Whether what is typed is hidden, for a password.
  final bool obscure;

  /// The keyboard; text when null.
  final TextInputType? keyboardType;

  /// The keyboard's action key.
  final TextInputAction textInputAction;

  /// Called by the action key.
  final ValueChanged<String>? onSubmitted;

  /// The field's focus.
  final FocusNode? focusNode;

  @override
  Widget build(BuildContext context) {
    final error = this.error;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: SpacingTokens.space2,
      children: [
        Text(label, style: context.appTextStyles.labelStrong),
        TextField(
          controller: controller,
          focusNode: focusNode,
          enabled: enabled,
          obscureText: obscure,
          keyboardType: keyboardType,
          textInputAction: textInputAction,
          autofillHints: autofillHints,
          autocorrect: false,
          enableSuggestions: false,
          decoration: InputDecoration(
            hintText: hint,
            // Red edge only; the words are below, with the icon.
            error: (invalid ?? error != null) ? const SizedBox.shrink() : null,
          ),
          onSubmitted: onSubmitted,
        ),
        if (error != null) ProblemLine(text: error),
      ],
    );
  }
}

/// {@template problem_line}
/// A refusal's words after the alert icon, announced when they appear.
/// {@endtemplate}
class ProblemLine extends StatelessWidget {
  /// {@macro problem_line}
  const new({required this.text, super.key});

  /// The words.
  final String text;

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
              text,
              style: context.appTextStyles.bodySm.copyWith(color: error),
            ),
          ),
        ],
      ),
    );
  }
}

/// {@template sign_in_problem_line}
/// A sign-in [problem] in the server's words, or the screen's own [failed]
/// words without an answer.
/// {@endtemplate}
class SignInProblemLine extends StatelessWidget {
  /// {@macro sign_in_problem_line}
  const new({required this.problem, required this.failed, super.key});

  /// What went wrong.
  final SignInProblem problem;

  /// The screen's words when the server gave none.
  final String failed;

  @override
  Widget build(BuildContext context) =>
      ProblemLine(text: problem.text(context.l10n, failed: failed));
}

/// {@template auth_spinner}
/// The small spinner of a pending button.
/// {@endtemplate}
class AuthSpinner extends StatelessWidget {
  /// {@macro auth_spinner}
  const new({super.key});

  @override
  Widget build(BuildContext context) {
    return const SizedBox.square(
      dimension: 16,
      child: CircularProgressIndicator(strokeWidth: 2),
    );
  }
}

/// {@template auth_separator}
/// "hoặc" between two rules.
/// {@endtemplate}
class AuthSeparator extends StatelessWidget {
  /// {@macro auth_separator}
  const new({required this.label, super.key});

  /// The word between the rules.
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

/// {@template auth_switch_line}
/// "Chưa có tài khoản? Đăng ký": a [question] and the [action] that answers
/// it, centred.
/// {@endtemplate}
class AuthSwitchLine extends StatelessWidget {
  /// {@macro auth_switch_line}
  const new({
    required this.question,
    required this.action,
    required this.onPressed,
    super.key,
  });

  /// The question.
  final String question;

  /// The link's words.
  final String action;

  /// What the link does.
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    final text = context.appTextStyles;
    return Wrap(
      alignment: WrapAlignment.center,
      crossAxisAlignment: WrapCrossAlignment.center,
      children: [
        Text(
          question,
          style: text.bodySm.copyWith(
            color: Theme.of(context).colorScheme.onSurfaceVariant,
          ),
        ),
        TextButton(onPressed: onPressed, child: Text(action)),
      ],
    );
  }
}

/// {@template legal_line}
/// "Khi tiếp tục, bạn đồng ý với Điều khoản sử dụng và Chính sách quyền
/// riêng tư.", the two pages opening inside the app as on the account tab.
/// {@endtemplate}
class LegalLine extends StatefulWidget {
  /// {@macro legal_line}
  const new({super.key});

  @override
  State<LegalLine> createState() => _LegalLineState();
}

class _LegalLineState extends State<LegalLine> {
  final Map<LegalDocument, TapGestureRecognizer> _links = {
    for (final page in LegalDocument.values) page: TapGestureRecognizer(),
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
      final page = rest[at] == terms
          ? LegalDocument.terms
          : LegalDocument.privacy;
      spans.add(
        TextSpan(
          text: page.title(l10n),
          style: link,
          recognizer: _links[page]!
            ..onTap = () => unawaited(switch (page) {
              LegalDocument.terms => const TermsRoute().push<void>(context),
              LegalDocument.privacy => const PrivacyRoute().push<void>(context),
            }),
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
