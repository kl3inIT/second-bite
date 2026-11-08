import 'package:second_bite/core/api.dart';

// What an order says about itself, as the web's web/src/features/orders/
// order.ts reads it (SEC-204 › design 1): whether it is still to collect,
// how many portions it holds, what it saved, where it stands against its
// window, and the day a list of ended orders puts it under.

/// Whether [order] is still to be collected: confirmed or ready.
bool isOpen(OrderBody order) =>
    order.status == OrderBodyStatus.confirmed ||
    order.status == OrderBodyStatus.ready;

/// Whether its customer may still cancel [order]: until the store marks it
/// ready (SEC-121).
bool canCancel(OrderBody order) => order.status == OrderBodyStatus.confirmed;

/// Whether [order] ended without being collected, so it shows as a receipt.
bool hasEnded(OrderBody order) => switch (order.status) {
  OrderBodyStatus.cancelled ||
  OrderBodyStatus.refused ||
  OrderBodyStatus.expired => true,
  _ => false,
};

/// The dishes of [order] on one line: "Croissant & bánh mì chà bông".
String dishesOf(OrderBody order) =>
    order.lines.map((line) => line.name).join(' & ');

/// How many portions [order] holds, across its lines.
int unitsOf(OrderBody order) =>
    order.lines.fold(0, (sum, line) => sum + line.units);

/// What [order] would have cost at the original prices, less what its
/// customer pays: the saving, a promotion's discount included.
int savingOf(OrderBody order) {
  final original = order.lines.fold(
    0,
    (sum, line) => sum + line.originalPriceVnd * line.units,
  );
  final saving = original - order.payVnd;
  return saving < 0 ? 0 : saving;
}

/// A span of time as whole hours and minutes, rounded up, for "còn 1 giờ
/// 12 phút"; never below zero.
({int hours, int minutes}) hoursAndMinutes(Duration span) {
  final ms = span.inMilliseconds;
  final minutes = ms <= 0 ? 0 : (ms / 60000).ceil();
  return (hours: minutes ~/ 60, minutes: minutes % 60);
}

/// Where an order stands against its window at a moment.
enum WindowPhase {
  /// Its window has not opened yet.
  before,

  /// Its window is open.
  open,

  /// Its window is over.
  over,
}

/// Where [order] stands against its window at [now].
WindowPhase windowPhaseOf(OrderBody order, DateTime now) {
  if (now.isBefore(order.windowStart)) return WindowPhase.before;
  return now.isBefore(order.windowEnd) ? WindowPhase.open : WindowPhase.over;
}

/// The step of the four on the blue band an order stands at: a confirmed
/// order is being prepared (SEC-97 › decision 5); none for an ended one.
int stepOf(OrderBody order) => switch (order.status) {
  OrderBodyStatus.confirmed => 1,
  OrderBodyStatus.ready => 2,
  OrderBodyStatus.collected => 3,
  _ => 0,
};

/// Orders placed together from one cart, one per store, as one: each group
/// in the order its orders were placed, the groups newest first.
List<List<OrderBody>> byCheckout(Iterable<OrderBody> orders) {
  final groups = <String, List<OrderBody>>{};
  for (final order in orders) {
    (groups[order.checkoutId] ??= []).add(order);
  }
  final sorted = [
    for (final group in groups.values)
      [...group]..sort((a, b) => a.createdAt.compareTo(b.createdAt)),
  ]..sort((a, b) => b.last.createdAt.compareTo(a.last.createdAt));
  return sorted;
}

/// Where a list of ended orders puts one (Figma D4).
enum OrderDay {
  /// The same day as now.
  today,

  /// The six days before.
  week,

  /// Earlier.
  before,
}

// Vietnam keeps UTC+7 all year, the app's time zone whatever the phone's.
int _dayNumber(DateTime moment) {
  final vietnam = moment.toUtc().add(const Duration(hours: 7));
  return DateTime.utc(
        vietnam.year,
        vietnam.month,
        vietnam.day,
      ).millisecondsSinceEpoch ~/
      Duration.millisecondsPerDay;
}

/// The day [at] falls on against [now], counted in Asia/Ho_Chi_Minh.
OrderDay dayOf(DateTime at, DateTime now) {
  final daysAgo = _dayNumber(now) - _dayNumber(at);
  if (daysAgo <= 0) return OrderDay.today;
  return daysAgo < 7 ? OrderDay.week : OrderDay.before;
}

/// "20/10": the day of [moment] in Asia/Ho_Chi_Minh, written one way in
/// both languages.
({int day, int month}) dayMonthOf(DateTime moment) {
  final vietnam = moment.toUtc().add(const Duration(hours: 7));
  return (day: vietnam.day, month: vietnam.month);
}

/// When an ended [order] ended: the moment its status records, or the end
/// of its window.
DateTime endedAt(OrderBody order) => switch (order.status) {
  OrderBodyStatus.cancelled => order.cancelledAt ?? order.windowEnd,
  OrderBodyStatus.refused => order.refusedAt ?? order.windowEnd,
  _ => order.windowEnd,
};
