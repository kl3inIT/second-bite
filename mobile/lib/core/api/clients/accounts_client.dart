// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../models/account_body.dart';
import '../models/delete_account_input_body.dart';
import '../models/request_code_output_body.dart';
import '../models/set_display_name_input_body.dart';

part 'accounts_client.g.dart';

@RestApi()
abstract class AccountsClient {
  factory AccountsClient(Dio dio, {String? baseUrl}) = _AccountsClient;

  /// The signed-in account
  @GET('/accounts/me')
  Future<AccountBody> getMyAccount();

  /// Set the signed-in account's display name.
  ///
  /// Trimmed, it holds 1 to 50 characters and no control character. Google's sign-in fills a name only while it is empty, so the chosen one stays.
  @PUT('/accounts/me')
  Future<AccountBody> setMyDisplayName({
    @Body() required SetDisplayNameInputBody body,
  });

  /// Delete the signed-in account with the emailed code.
  ///
  /// Deletes the account, its sessions, its Google link and the codes and emails sent to its address at once; its memberships of sellers and the photos it uploaded that nothing uses follow within minutes. A seller the account owned is blocked. The session cookie is cleared.
  @POST('/accounts/me/deletion')
  Future<void> deleteMyAccount({@Body() required DeleteAccountInputBody body});

  /// Email the signed-in account's address a code that confirms its deletion.
  ///
  /// The code confirms the deletion only; it cannot sign in. It shares the address's limits with the sign-in codes.
  @POST('/accounts/me/deletion-codes')
  Future<RequestCodeOutputBody> requestAccountDeletionCode();
}
