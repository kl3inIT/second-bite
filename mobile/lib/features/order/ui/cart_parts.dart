import 'package:app_ui/app_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:second_bite/features/offer/domain/offer_summary.dart';
import 'package:second_bite/features/offer/ui/offer_format.dart';
import 'package:second_bite/features/order/data/kept_cart.dart';
import 'package:second_bite/features/order/domain/cart.dart';
import 'package:second_bite/l10n/l10n.dart';

/// {@template cart_stepper}
/// A dish's − and + on its store's page, on the cart: a lone + until the dish
/// is in the cart, then − count +, the + stopping at the portions left or the
/// dish's cap per order, as the web's `QuantityStepper`. Nothing for a dish
/// that cannot be ordered.
/// {@endtemplate}
class CartStepper extends ConsumerWidget {
  /// {@macro cart_stepper}
  const new(this.offer, {super.key});

  /// The dish.
  final OfferSummary offer;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (!offer.isAvailable) return const SizedBox.shrink();
    final l10n = context.l10n;
    final cart = ref.watch(keptCartProvider.notifier);
    final quantity = quantityOf(ref.watch(keptCartProvider).value, offer.id);

    return AppQuantityStepper(
      quantity: quantity,
      addLabel: l10n.cartAdd(offer.name),
      removeLabel: l10n.cartRemove(offer.name),
      quantityLabel: l10n.cartQuantity(quantity, offer.name),
      onAdd: quantity < offer.mostPerOrder ? () => cart.addOne(offer) : null,
      onRemove: () => cart.removeOne(offer.id),
    );
  }
}

/// {@template cart_portions}
/// "còn 3 phần" under a dish, "đã chọn đủ 3 phần" once the cart holds every
/// portion left, or "tối đa 2 phần mỗi đơn" once it holds the most one order
/// may (SEC-158), as the web's `CartPortions`.
/// {@endtemplate}
class CartPortions extends ConsumerWidget {
  /// {@macro cart_portions}
  const new(this.offer, {super.key});

  /// The dish.
  final OfferSummary offer;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = context.l10n;
    final most = offer.mostPerOrder;
    final full =
        quantityOf(ref.watch(keptCartProvider).value, offer.id) >= most;

    return Text(
      !full
          ? l10n.cartPortionsLeft(offer.unitsLeft)
          : offer.cappedPerOrder
          ? l10n.cartPortionsCapped(most)
          : l10n.cartPortionsChosen(most),
      style: context.appTextStyles.label.copyWith(
        color: Theme.of(context).colorScheme.error,
      ),
    );
  }
}

/// {@template cart_bar}
/// The cart's bar at the foot of a page, as the web's `CartBar`: hidden
/// while nothing in the cart can be ordered; a dish whose window has closed
/// is not counted. Its button to the cart arrives with the cart's page.
/// {@endtemplate}
class CartBar extends ConsumerWidget {
  /// {@macro cart_bar}
  const new({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cart = ref.watch(keptCartProvider).value;
    final now = ref.watch(cartNowProvider).value ?? DateTime.now();
    final live = cart == null ? null : orderable(cart, now);
    if (live == null) return const SizedBox.shrink();
    final l10n = context.l10n;
    final (:units, :priceVnd, :originalPriceVnd) = totalsOf(live.lines);
    final original = formatPrice(originalPriceVnd);

    return AppCartBar(
      price: formatPrice(priceVnd),
      originalPrice: original,
      originalPriceLabel: l10n.offerOriginalPrice(original),
      summary: l10n.cartSummary(
        units,
        formatPrice(originalPriceVnd - priceVnd),
      ),
    );
  }
}
