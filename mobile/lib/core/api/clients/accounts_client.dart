// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../models/account_body.dart';

part 'accounts_client.g.dart';

@RestApi()
abstract class AccountsClient {
  factory AccountsClient(Dio dio, {String? baseUrl}) = _AccountsClient;

  /// The signed-in account
  @GET('/accounts/me')
  Future<AccountBody> getMyAccount();
}
