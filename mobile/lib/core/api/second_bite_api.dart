// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:dio/dio.dart';

import 'clients/accounts_client.dart';
import 'clients/admin_client.dart';
import 'clients/sign_in_client.dart';
import 'clients/catalog_client.dart';
import 'clients/offers_client.dart';
import 'clients/orders_client.dart';
import 'clients/photos_client.dart';
import 'clients/sellers_client.dart';
import 'clients/stats_client.dart';

/// Second Bite API `v0.1.0`.
///
/// The API of Second Bite, a non-profit marketplace for food surplus.
class SecondBiteApi {
  SecondBiteApi(Dio dio, {String? baseUrl}) : _dio = dio, _baseUrl = baseUrl;

  final Dio _dio;
  final String? _baseUrl;

  static String get version => '0.1.0';

  AccountsClient? _accounts;
  AdminClient? _admin;
  SignInClient? _signIn;
  CatalogClient? _catalog;
  OffersClient? _offers;
  OrdersClient? _orders;
  PhotosClient? _photos;
  SellersClient? _sellers;
  StatsClient? _stats;

  AccountsClient get accounts =>
      _accounts ??= AccountsClient(_dio, baseUrl: _baseUrl);

  AdminClient get admin => _admin ??= AdminClient(_dio, baseUrl: _baseUrl);

  SignInClient get signIn => _signIn ??= SignInClient(_dio, baseUrl: _baseUrl);

  CatalogClient get catalog =>
      _catalog ??= CatalogClient(_dio, baseUrl: _baseUrl);

  OffersClient get offers => _offers ??= OffersClient(_dio, baseUrl: _baseUrl);

  OrdersClient get orders => _orders ??= OrdersClient(_dio, baseUrl: _baseUrl);

  PhotosClient get photos => _photos ??= PhotosClient(_dio, baseUrl: _baseUrl);

  SellersClient get sellers =>
      _sellers ??= SellersClient(_dio, baseUrl: _baseUrl);

  StatsClient get stats => _stats ??= StatsClient(_dio, baseUrl: _baseUrl);
}
