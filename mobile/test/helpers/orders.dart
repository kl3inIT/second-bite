import 'package:second_bite/core/api.dart';

/// An order as `POST /orders` answers it to a customer who did not sign in,
/// with its access.
OrderBody sampleOrder({
  String id = '00000000-0000-4000-8000-000000000001',
  String number = 'SB-1001',
  String sellerId = 'se-bakery',
  String sellerName = 'Tiệm bánh Pháp',
  String? access = 'abcdefghijklmnopqrstuv',
}) {
  return OrderBody(
    id: id,
    number: number,
    access: access,
    canReportProblem: false,
    canReview: false,
    checkoutId: 'checkout-1',
    createdAt: DateTime.parse('2026-10-19T20:00:00+07:00'),
    customerName: 'Minh Anh',
    customerPhone: '0900000000',
    discountVnd: 0,
    lines: const [],
    payVnd: 39000,
    totalVnd: 39000,
    seller: OrderSellerBody(
      id: sellerId,
      name: sellerName,
      address: 'Tầng 1',
      latitude: 21.0565,
      longitude: 105.8964,
    ),
    status: OrderBodyStatus.confirmed,
    windowStart: DateTime.parse('2026-10-19T21:00:00+07:00'),
    windowEnd: DateTime.parse('2026-10-19T21:45:00+07:00'),
  );
}

/// A line of an order: [units] of a dish at 15.000đ, 39.000đ before.
OrderLineBody sampleOrderLine({
  String name = 'Bánh mì bơ tỏi',
  int units = 2,
  String offerId = 'of-bread',
}) {
  return OrderLineBody(
    name: name,
    offerId: offerId,
    originalPriceVnd: 39000,
    priceVnd: 15000,
    unit: 'cái',
    units: units,
    photo: const OrderLinePhotoBody(
      id: 'ph-bread',
      largePath: '/photos/ph-bread/1200.jpg',
      smallPath: '/photos/ph-bread/400.jpg',
    ),
  );
}
