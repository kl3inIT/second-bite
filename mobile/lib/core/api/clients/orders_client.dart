// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../models/cancel_order_request.dart';
import '../models/order_body.dart';
import '../models/orders_output_body.dart';
import '../models/orders_state.dart';
import '../models/place_order_body.dart';
import '../models/refuse_order_request.dart';

part 'orders_client.g.dart';

@RestApi()
abstract class OrdersClient {
  factory OrdersClient(Dio dio, {String? baseUrl}) = _OrdersClient;

  /// Your orders, newest first.
  ///
  /// [state] - open: still to collect; ended: every other.
  ///
  /// [checkout] - Only the orders placed together from this cart.
  @GET('/orders')
  Future<OrdersOutputBody> listMyOrders({
    @Query('limit') int? limit = 20,
    @Query('offset') int? offset = 0,
    @Query('state') OrdersState? state,
    @Query('checkout') String? checkout,
  });

  /// Order units of one seller's offers, collected at the counter.
  ///
  /// Confirmed at once, signed in or not; for the account when someone is signed in. Sending the same Idempotency-Key again, without an account with the same phone number, returns the order placed first.
  @POST('/orders')
  Future<OrderBody> placeOrder({
    @Header('Idempotency-Key') required String idempotencyKey,
    @Body() required PlaceOrderBody body,
  });

  /// An order.
  ///
  /// To its customer, signed in or sending its access; to the seller's people and to admins.
  ///
  /// [orderAccess] - The order's access, for its customer who did not sign in.
  @GET('/orders/{orderId}')
  Future<OrderBody> getOrder({
    @Path('orderId') required String orderId,
    @Header('Order-Access') String? orderAccess,
  });

  /// Cancel your order, free of charge until its window opens.
  ///
  /// By its customer, signed in or sending its access. Its units go back on sale.
  ///
  /// [orderAccess] - The order's access, for its customer who did not sign in.
  @POST('/orders/{orderId}/cancel')
  Future<OrderBody> cancelOrder({
    @Path('orderId') required String orderId,
    @Body() required CancelOrderRequest body,
    @Header('Order-Access') String? orderAccess,
  });

  /// Hand an order over.
  ///
  /// Within the window, once staff have matched the collector to the order by its QR code or by the name and phone number on it.
  @POST('/orders/{orderId}/hand-over')
  Future<OrderBody> handOverOrder({@Path('orderId') required String orderId});

  /// Mark an order ready, which tells its customer to come
  @POST('/orders/{orderId}/ready')
  Future<OrderBody> markOrderReady({@Path('orderId') required String orderId});

  /// Refuse to hand an order over, with a reason
  @POST('/orders/{orderId}/refuse')
  Future<OrderBody> refuseOrder({
    @Path('orderId') required String orderId,
    @Body() required RefuseOrderRequest body,
  });

  /// Take a hand-over or a refusal back.
  ///
  /// The order is open again, and the units a refusal had returned are taken again, or it fails when they are gone. An order its customer cancelled, or whose window is over, stays as it is.
  @POST('/orders/{orderId}/reopen')
  Future<OrderBody> reopenOrder({@Path('orderId') required String orderId});

  /// A seller's orders of one day, soonest first, to its people and admins.
  ///
  /// [day] - A day in Vietnam time, YYYY-MM-DD; today when empty.
  @GET('/sellers/{sellerId}/orders')
  Future<OrdersOutputBody> listSellerOrders({
    @Path('sellerId') required String sellerId,
    @Query('day') String? day,
  });
}
