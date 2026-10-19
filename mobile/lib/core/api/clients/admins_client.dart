// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../models/email_settings_body.dart';
import '../models/save_email_settings_input_body.dart';

part 'admins_client.g.dart';

@RestApi()
abstract class AdminsClient {
  factory AdminsClient(Dio dio, {String? baseUrl}) = _AdminsClient;

  /// Read who delivers email
  @GET('/admin/email-settings')
  Future<EmailSettingsBody> getEmailSettings();

  /// Choose who delivers email; the next email uses it
  @PUT('/admin/email-settings')
  Future<void> saveEmailSettings({
    @Body() required SaveEmailSettingsInputBody body,
  });
}
