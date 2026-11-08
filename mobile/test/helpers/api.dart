import 'package:dio/dio.dart';
import 'package:mocktail/mocktail.dart';
import 'package:second_bite/core/api.dart';

/// The generated client, answering only what a test says.
class MockSecondBiteApi extends Mock implements SecondBiteApi;

/// The stores' part of the client.
class MockSellersClient extends Mock implements SellersClient;

/// The places' part of the client.
class MockPlacesClient extends Mock implements PlacesClient;

/// What the server answers when no one is signed in.
DioException unauthorized() => DioException(
  requestOptions: RequestOptions(),
  response: Response(requestOptions: RequestOptions(), statusCode: 401),
);

/// The client of a screen that does not talk to it beyond the follows:
/// [sellers] and [places] when given, and otherwise the followed stores
/// refused, as for someone signed out.
SecondBiteApi testApi({SellersClient? sellers, PlacesClient? places}) {
  final api = MockSecondBiteApi();
  final guest = MockSellersClient();
  when(guest.listFollowedSellers).thenThrow(unauthorized());
  when(() => api.sellers).thenReturn(sellers ?? guest);
  when(() => api.places).thenReturn(places ?? MockPlacesClient());
  return api;
}

/// A store's profile as `GET /sellers/{sellerId}/profile` answers.
SellerProfileBody sampleProfile({
  String id = 'se-bakery',
  String name = 'Tiệm bánh Pháp',
}) => SellerProfileBody(
  id: id,
  name: name,
  address: 'Tầng 1',
  latitude: 21.0565,
  longitude: 105.8964,
);
