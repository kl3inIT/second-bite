import 'package:flutter/foundation.dart';
import 'package:second_bite/core/api.dart';

/// The radii the search's distance chip offers, in kilometres.
const List<int> radiusChoices = [1, 2, 5];

/// The orders the search offers, each one `GET /offers` takes.
const List<Sort3> sortChoices = [
  Sort3.relevance,
  Sort3.distance,
  Sort3.endingSoon,
  Sort3.price,
  Sort3.discount,
];

/// No surplus dish costs more than this; a larger figure is ignored.
const int _priceLimit = 10000000;

// A time of day on the 24-hour clock, "20:30".
final RegExp _timeOfDay = RegExp(r'^([01]\d|2[0-3]):[0-5]\d$');

/// {@template search_query}
/// What the search at `/search` asks for, as the web's `SearchQuery`: the
/// home's words, kind and collect-now, and the chips' radius, price range,
/// collection times and order. The place is the one kept on the phone, so
/// it is not in the address; [radiusKm] means something only with one.
/// {@endtemplate}
@immutable
class SearchQuery {
  /// {@macro search_query}
  const new({
    this.q,
    this.kind,
    this.now = false,
    this.radiusKm,
    this.minPrice,
    this.maxPrice,
    this.from,
    this.to,
    this.sort,
  });

  /// Words searched.
  final String? q;

  /// One kind of food.
  final Kind? kind;

  /// Only what can be collected now.
  final bool now;

  /// How far around the place, 1, 2 or 5 km.
  final int? radiusKm;

  /// The price of one portion from, in đồng.
  final int? minPrice;

  /// The price of one portion to, in đồng.
  final int? maxPrice;

  /// Collected from tonight, "20:00".
  final String? from;

  /// Collected until tonight, "21:30".
  final String? to;

  /// The order; the backend's own when null.
  final Sort3? sort;

  /// Whether a chip narrows the results, so the summary offers a reset.
  bool get filtered =>
      kind != null ||
      now ||
      radiusKm != null ||
      minPrice != null ||
      maxPrice != null ||
      from != null ||
      to != null;

  /// The backend's own order for this query: best match with words, nearest
  /// with a place, closing soonest otherwise.
  Sort3 naturalSort({required bool near}) => q != null
      ? Sort3.relevance
      : near
      ? Sort3.distance
      : Sort3.endingSoon;

  /// This query with the changes applied, as the web's `searchHref`: each
  /// function returns the new value, null to drop it.
  SearchQuery copyWith({
    String? Function()? q,
    Kind? Function()? kind,
    bool? now,
    int? Function()? radiusKm,
    int? Function()? minPrice,
    int? Function()? maxPrice,
    String? Function()? from,
    String? Function()? to,
    Sort3? Function()? sort,
  }) => SearchQuery(
    q: q == null ? this.q : q(),
    kind: kind == null ? this.kind : kind(),
    now: now ?? this.now,
    radiusKm: radiusKm == null ? this.radiusKm : radiusKm(),
    minPrice: minPrice == null ? this.minPrice : minPrice(),
    maxPrice: maxPrice == null ? this.maxPrice : maxPrice(),
    from: from == null ? this.from : from(),
    to: to == null ? this.to : to(),
    sort: sort == null ? this.sort : sort(),
  );

  @override
  bool operator ==(Object other) =>
      other is SearchQuery &&
      other.q == q &&
      other.kind == kind &&
      other.now == now &&
      other.radiusKm == radiusKm &&
      other.minPrice == minPrice &&
      other.maxPrice == maxPrice &&
      other.from == from &&
      other.to == to &&
      other.sort == sort;

  @override
  int get hashCode =>
      Object.hash(q, kind, now, radiusKm, minPrice, maxPrice, from, to, sort);
}

/// The search's query from its address's parameters, as the web's
/// `readSearchQuery`: each key read on its own, then the rules across keys.
/// A range out of order is dropped, a radius needs a place ([near]), and a
/// range of times replaces collecting now.
SearchQuery readSearchQuery({
  required bool near,
  String? q,
  String? kind,
  String? now,
  String? radiusKm,
  String? minPrice,
  String? maxPrice,
  String? from,
  String? to,
  String? sort,
}) {
  final words = q?.trim();
  final radius = int.tryParse(radiusKm ?? '');
  final price = _inOrder(_price(minPrice), _price(maxPrice));
  final time = _inOrder(_time(from), _time(to));
  return SearchQuery(
    q: words == null || words.isEmpty ? null : words,
    kind: Kind.$valuesDefined.where((known) => known.json == kind).firstOrNull,
    now: time.from == null && time.to == null && now == '1',
    radiusKm: near && radiusChoices.contains(radius) ? radius : null,
    minPrice: price.from,
    maxPrice: price.to,
    from: time.from,
    to: time.to,
    sort: sortChoices.where((known) => known.json == sort).firstOrNull,
  );
}

int? _price(String? value) {
  final price = int.tryParse(value ?? '');
  return price != null && price > 0 && price <= _priceLimit ? price : null;
}

String? _time(String? value) =>
    value != null && _timeOfDay.hasMatch(value) ? value : null;

/// Both ends when they are in order, otherwise neither; one end alone is
/// kept.
({T? from, T? to}) _inOrder<T extends Comparable<dynamic>>(T? from, T? to) =>
    from != null && to != null && from.compareTo(to) > 0
    ? (from: null, to: null)
    : (from: from, to: to);

/// Today's date in Vietnam at a time of day, "20:30", as the API takes a
/// moment, as the web's `tonightAt`; null without one. Vietnam keeps one
/// offset all year, +07:00.
DateTime? tonightAt(String? time, {DateTime? now}) {
  if (time == null) return null;
  final vietnam = (now ?? DateTime.now()).toUtc().add(const Duration(hours: 7));
  final [hour, minute] = time.split(':').map(int.parse).toList();
  return DateTime.utc(
    vietnam.year,
    vietnam.month,
    vietnam.day,
    hour,
    minute,
  ).subtract(const Duration(hours: 7));
}
