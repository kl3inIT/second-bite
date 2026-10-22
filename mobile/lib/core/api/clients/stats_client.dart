// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../models/view_input_body.dart';

part 'stats_client.g.dart';

@RestApi()
abstract class StatsClient {
  factory StatsClient(Dio dio, {String? baseUrl}) = _StatsClient;

  /// Count a page on screen.
  ///
  /// Sent by the web when a page is shown, without a session. A bot or a prefetch is not counted, and is answered the same.
  @POST('/stats/views')
  Future<void> recordView({@Body() required ViewInputBody body});
}
