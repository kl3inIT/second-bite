import 'dart:convert';

/// A place the customer chose to look around (customer place increment):
/// `near` as `GET /offers` takes it, `latitude,longitude`, and the name it
/// is shown under when it has one, "Phố Hoa Lâm". Without a place the app
/// shows every shop, as the web does.
typedef Place = ({String near, String? name});

/// Three decimals of a degree, about 110 m: enough for "350 m" on a card,
/// without the exact spot, as the web's `nearOf`.
String nearOf(double latitude, double longitude) =>
    '${latitude.toStringAsFixed(3)},${longitude.toStringAsFixed(3)}';

/// Tasco Mall Long Biên, the area sheet's suggestion, as the web's
/// `TASCO_MALL`.
const ({double latitude, double longitude}) tascoMall = (
  latitude: 21.0565,
  longitude: 105.8964,
);

/// Tasco Mall as `near`.
final String mallNear = nearOf(tascoMall.latitude, tascoMall.longitude);

// "latitude,longitude" in decimal degrees, as the web's `point`.
final RegExp _point = RegExp(r'^-?\d{1,2}(\.\d{1,6})?,-?\d{1,3}(\.\d{1,6})?$');

/// A place's name is at most this long, as on the web.
const int _placeNameLimit = 80;

/// An address's first part, "Phố Hoa Lâm" of "Phố Hoa Lâm, Phường Việt
/// Hưng, Hà Nội", over the rest, as the web's `partsOfAddress`.
({String name, String rest}) partsOfAddress(String address) {
  final parts = address.split(',').map((part) => part.trim()).toList();
  return (name: parts.first, rest: parts.skip(1).join(', '));
}

/// A kept place, read by the web's rules: a point it understands and a
/// trimmed name of at most 80 characters; null when it is not one.
Place? readPlace(Object? json) {
  if (json is! Map<String, Object?>) return null;
  final near = json['near'];
  if (near is! String || !_point.hasMatch(near)) return null;
  final name = json['place'];
  final trimmed = name is String ? name.trim() : '';
  return (
    near: near,
    name: trimmed.isEmpty || trimmed.length > _placeNameLimit ? null : trimmed,
  );
}

/// [place] as it is kept, under the web's own keys.
String writePlace(Place place) =>
    jsonEncode({'near': place.near, 'place': ?place.name});
