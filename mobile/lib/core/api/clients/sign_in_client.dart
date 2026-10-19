// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../models/google_sign_in_input_body.dart';
import '../models/methods_output_body.dart';
import '../models/request_code_input_body.dart';
import '../models/request_code_output_body.dart';
import '../models/session_output_body.dart';
import '../models/sign_in_input_body.dart';

part 'sign_in_client.g.dart';

@RestApi()
abstract class SignInClient {
  factory SignInClient(Dio dio, {String? baseUrl}) = _SignInClient;

  /// Sign in with Google's ID token.
  ///
  /// Creates the account on a first sign-in with a verified address, or links an account with the address when Google speaks for it (gmail.com or a Google Workspace account); otherwise the person signs in with an emailed code.
  @POST('/auth/google')
  Future<SessionOutputBody> signInWithGoogle({
    @Body() required GoogleSignInInputBody body,
  });

  /// The ways to sign in besides the emailed code
  @GET('/auth/methods')
  Future<MethodsOutputBody> getSignInMethods();

  /// Sign in with the emailed code.
  ///
  /// Creates the account on its first sign-in. The web asks for the session in a cookie.
  @POST('/auth/sessions')
  Future<SessionOutputBody> signIn({@Body() required SignInInputBody body});

  /// Sign out: end this session and clear its cookie
  @DELETE('/auth/sessions/current')
  Future<void> signOut();

  /// Email a six-digit sign-in code.
  ///
  /// The answer is the same whether or not the address has an account.
  @POST('/auth/sign-in-codes')
  Future<RequestCodeOutputBody> requestSignInCode({
    @Body() required RequestCodeInputBody body,
  });
}
