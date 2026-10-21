import 'package:dio/dio.dart';
import 'package:second_bite/l10n/l10n.dart';

/// What the sign-in screen does differently after a failure.
enum SignInProblemKind {
  /// The address is not one: the field turns red.
  emailInvalid,

  /// Too many codes for the address.
  codeLimit,

  /// A wrong code: the code is cleared.
  codeIncorrect,

  /// An expired or used code: a new one is offered at once.
  codeGone,

  /// Google has not verified the address.
  googleUnverified,

  /// Anything else, with the request's reference when there is one.
  failed,
}

/// {@template sign_in_problem}
/// A failure as the sign-in and deletion screens show it, as the web's
/// `problemOf`: the server's code decides only where the screen does
/// something different (mobile guideline › Data, session and language), and
/// its words are the server's, in the app's language (SEC-28).
/// {@endtemplate}
class SignInProblem {
  /// {@macro sign_in_problem}
  const new(this.kind, {this.detail, this.reference});

  /// Reads [error], a `DioException` from the client or anything else.
  factory of(Object error) {
    final kind = switch (problemCode(error)) {
      'IDENTITY_EMAIL_INVALID' => SignInProblemKind.emailInvalid,
      'IDENTITY_CODE_LIMIT_EXCEEDED' => SignInProblemKind.codeLimit,
      'IDENTITY_CODE_INCORRECT' => SignInProblemKind.codeIncorrect,
      'IDENTITY_CHALLENGE_GONE' ||
      'IDENTITY_CODE_ATTEMPTS_EXHAUSTED' => SignInProblemKind.codeGone,
      'IDENTITY_EMAIL_NOT_VERIFIED' => SignInProblemKind.googleUnverified,
      _ => SignInProblemKind.failed,
    };
    final reference = error is DioException
        ? _field(error, 'requestId') ??
              error.response?.headers.value('x-request-id')
        : null;
    return SignInProblem(
      kind,
      detail: error is DioException ? _field(error, 'detail') : null,
      reference: kind == SignInProblemKind.failed ? reference : null,
    );
  }

  /// What the screen does.
  final SignInProblemKind kind;

  /// The server's sentence for people, missing when no answer came.
  final String? detail;

  /// The request's reference, for "failed".
  final String? reference;

  /// The words shown for it: the server's, with the reference of a failure
  /// the screen does not expect; [failed], the screen's own, without an
  /// answer.
  String text(AppLocalizations l10n, {required String failed}) {
    final detail = this.detail;
    if (detail == null || detail.isEmpty) return failed;
    final reference = this.reference;
    return reference == null
        ? detail
        : '$detail ${l10n.problemReference(reference)}';
  }
}

/// The `code` of the problem the server answered with (RFC 9457, SEC-28),
/// read alone, so a problem missing another member still names its code.
String? problemCode(Object error) =>
    error is DioException ? _field(error, 'code') : null;

String? _field(DioException error, String name) {
  final body = error.response?.data;
  return body is Map && body[name] is String ? body[name] as String : null;
}
