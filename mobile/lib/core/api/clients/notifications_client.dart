// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../models/push_key_output_body.dart';
import '../models/subscribe_push_input_body.dart';
import '../models/unsubscribe_push_input_body.dart';

part 'notifications_client.g.dart';

@RestApi()
abstract class NotificationsClient {
  factory NotificationsClient(Dio dio, {String? baseUrl}) =
      _NotificationsClient;

  /// Read the key a browser subscribes to Web Push with.
  ///
  /// 503 NOTIFICATION_PUSH_NOT_CONFIGURED while Web Push is off; the page then offers no notifications.
  @GET('/push/key')
  Future<PushKeyOutputBody> getPushKey();

  /// Follow orders by Web Push in this browser.
  ///
  /// Keeps the browser's subscription, in the language of Accept-Language, following the topic each live ticket proves for seven days. Subscribing again renews them. Each ticket is spent as the live socket spends it; a ticket spent or expired answers NOTIFICATION_PUSH_TICKET_INVALID.
  @POST('/push/subscriptions')
  Future<void> subscribePush({@Body() required SubscribePushInputBody body});

  /// Stop Web Push to this browser.
  ///
  /// Forgets the subscription and every topic it follows; one not kept changes nothing.
  @POST('/push/subscriptions/remove')
  Future<void> unsubscribePush({
    @Body() required UnsubscribePushInputBody body,
  });
}
