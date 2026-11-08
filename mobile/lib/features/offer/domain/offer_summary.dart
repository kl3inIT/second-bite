import 'dart:math' as math;

import 'package:second_bite/core/api.dart';

/// An offer as `GET /offers` returns it (SEC-11 › Finding offers), with its
/// seller: the generated model, as the web's `OfferSummary` is.
typedef OfferSummary = FoundBody;

/// What the home's address asks for: words, one kind, and whether only what
/// can be collected now, as the web's `HomeQuery`.
typedef HomeQuery = ({String? q, Kind? kind, bool now});

/// The home without a filter.
const HomeQuery everyOffer = (q: null, kind: null, now: false);

/// Reads the address's parameters as the web's `readHomeQuery` does,
/// dropping an unknown kind and empty words instead of sending them to the
/// backend.
HomeQuery readHomeQuery({String? q, String? kind, String? now}) {
  final words = q?.trim();
  return (
    q: words == null || words.isEmpty ? null : words,
    kind: Kind.$valuesDefined.where((known) => known.json == kind).firstOrNull,
    now: now == '1',
  );
}

/// What the home reads from a [HomeQuery].
extension HomeQueryRules on HomeQuery {
  /// Whether anything narrows the list.
  bool get filtered => q != null || kind != null || now;
}

/// What the home reads from an offer.
extension OfferSummaryRules on OfferSummary {
  /// Whether the offer can still be ordered: on sale with units left.
  bool get isAvailable => status == FoundBodyStatus.onSale && unitsLeft > 0;

  /// The most portions one order may hold: the portions left, or fewer
  /// under the dish's cap per order (SEC-158), as the web's `mostPerOrder`.
  int get mostPerOrder => math.min(unitsLeft, perOrderMax);

  /// Whether the dish's cap per order is below its portions left, so the
  /// customer is told why they cannot add more, as the web's
  /// `cappedPerOrder`.
  bool get cappedPerOrder => perOrderMax < unitsLeft;
}

/// The list in the order the home shows it: what can be ordered, then what
/// has sold out, each in the backend's order.
List<OfferSummary> inShowingOrder(List<OfferSummary> offers) => [
  ...offers.where((offer) => offer.isAvailable),
  ...offers.where((offer) => !offer.isAvailable),
];

/// What can still be ordered, the window that closes first at the top: the
/// home's "Sắp hết giờ nhận".
List<OfferSummary> closingFirst(List<OfferSummary> offers) =>
    offers.where((offer) => offer.isAvailable).toList()
      ..sort((a, b) => a.windowEnd.compareTo(b.windowEnd));

/// What can still be ordered, the biggest discount at the top: the tickets
/// of the home's deal card.
List<OfferSummary> biggestDiscountFirst(List<OfferSummary> offers) =>
    offers.where((offer) => offer.isAvailable).toList()
      ..sort((a, b) => b.discountPercent.compareTo(a.discountPercent));

/// The bags still open tonight, as units left across what can be ordered,
/// and the end of the window that closes last; null when nothing can be
/// ordered.
({int bags, DateTime lastWindowEnd})? openBags(List<OfferSummary> offers) {
  final available = offers.where((offer) => offer.isAvailable).toList();
  if (available.isEmpty) return null;
  return (
    bags: available.fold(0, (sum, offer) => sum + offer.unitsLeft),
    lastWindowEnd: available
        .map((offer) => offer.windowEnd)
        .reduce((last, end) => end.isAfter(last) ? end : last),
  );
}

/// The kinds a store sells tonight, the most dishes first, as the web's
/// `kindsByCount`: the tabs of its page.
List<FoundBodyKind> kindsByCount(List<OfferSummary> offers) {
  final counts = <FoundBodyKind, int>{};
  for (final offer in offers.where((offer) => offer.isAvailable)) {
    counts[offer.kind] = (counts[offer.kind] ?? 0) + 1;
  }
  return counts.keys.toList()..sort((a, b) => counts[b]!.compareTo(counts[a]!));
}

/// Lower case without accents, as the web's `plainText`, so "Bánh" is found
/// by "banh" and "Đạt" by "dat".
String plainText(String text) {
  final buffer = StringBuffer();
  for (final rune in text.toLowerCase().runes) {
    final char = String.fromCharCode(rune);
    buffer.write(_unaccented[char] ?? char);
  }
  return buffer.toString();
}

/// Directions to where [point] is collected, in the phone's maps, to the
/// store's pin, as the web's `directionsHref`.
Uri directionsUri(CollectionPointBody point) => Uri.https(
  'www.google.com',
  '/maps/dir/',
  {'api': '1', 'destination': '${point.latitude},${point.longitude}'},
);

// Vietnamese letters with their marks, lowered, mapped to the plain letter.
final Map<String, String> _unaccented = {
  for (final (plain, marked) in const [
    ('a', 'àáạảãâầấậẩẫăằắặẳẵ'),
    ('e', 'èéẹẻẽêềếệểễ'),
    ('i', 'ìíịỉĩ'),
    ('o', 'òóọỏõôồốộổỗơờớợởỡ'),
    ('u', 'ùúụủũưừứựửữ'),
    ('y', 'ỳýỵỷỹ'),
    ('d', 'đ'),
  ])
    for (final char in marked.split('')) char: plain,
};
