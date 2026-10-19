import 'package:second_bite/core/api.dart';
import 'package:second_bite/features/offer/domain/offer_summary.dart';

/// An offer at Tasco Mall as `GET /offers` answers, tonight in Vietnam time,
/// shaped like the web's stub backend's samples.
OfferSummary sampleOffer({
  String id = 'of-bread',
  String name = 'Túi bánh mì và croissant, 4 chiếc',
  String sellerId = 'se-bakery',
  String sellerName = 'Tiệm bánh Pháp',
  int unitsLeft = 3,
  int discountPercent = 58,
  String from = '2026-10-19T21:00:00+07:00',
  String until = '2026-10-19T21:45:00+07:00',
}) {
  return OfferSummary(
    id: id,
    sellerId: sellerId,
    status: unitsLeft > 0 ? FoundBodyStatus.onSale : FoundBodyStatus.soldOut,
    name: name,
    description: '',
    kind: FoundBodyKind.bakery,
    unit: 'túi',
    units: 5,
    unitsLeft: unitsLeft,
    priceVnd: 39000,
    originalPriceVnd: 95000,
    discountPercent: discountPercent,
    photo: const OfferPhotoBody(
      id: 'ph-bread',
      largePath: '/photos/ph-bread/1600.jpg',
      smallPath: '/photos/ph-bread/400.jpg',
    ),
    windowStart: DateTime.parse(from),
    windowEnd: DateTime.parse(until),
    collectionPoint: const CollectionPointBody(
      latitude: 21.0565,
      longitude: 105.8964,
      address: 'Tầng 1',
    ),
    createdAt: DateTime.parse(from),
    updatedAt: DateTime.parse(from),
    seller: OfferSellerBody(id: sellerId, name: sellerName, address: 'Tầng 1'),
  );
}
