import 'package:app_ui/app_ui.dart';
import 'package:second_bite/features/offer/ui/offer_format.dart';
import 'package:second_bite/features/order/domain/cart.dart';
import 'package:second_bite/l10n/l10n.dart';

/// What the person chose on the sold-out sheet.
enum GoneChoice {
  /// Order what is left of the basket.
  orderRest,

  /// Look at the store's other dishes.
  otherDishes,
}

/// {@template gone_sheet}
/// The dishes someone else ordered first (Figma O7), gone or with fewer
/// portions left than the cart held, as the web's `GoneSheet` on a phone:
/// nothing was charged; order what is left in one press, or look at the
/// store's other dishes. Pops the choice; closing pops nothing.
/// {@endtemplate}
class GoneSheet extends StatelessWidget {
  /// {@macro gone_sheet}
  const new({required this.cut, required this.rest, super.key});

  /// The dishes cut, each with its portions left.
  final List<CutLine> cut;

  /// The basket with what is left, or null.
  final Basket? rest;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final gone = cut.where((each) => each.left == 0).toList();
    final title = gone.length == 1
        ? l10n.cartGoneOne(gone.first.line.name)
        : gone.length > 1
        ? l10n.cartGoneMany(gone.length)
        : cut.length == 1
        ? l10n.cartFewerOne(cut.first.line.name, cut.first.left)
        : l10n.cartFewerMany(cut.length);
    final rest = this.rest;
    final restTotals = rest == null ? null : totalsOf(rest.lines);

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(
          SpacingTokens.space4,
          0,
          SpacingTokens.space4,
          SpacingTokens.space6,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          spacing: SpacingTokens.space3,
          children: [
            Semantics(header: true, child: Text(title, style: text.headline)),
            Text(gone.isNotEmpty ? l10n.cartGoneBody : l10n.cartFewerBody),
            const SizedBox(height: SpacingTokens.space1),
            if (rest != null && restTotals != null)
              AppButton(
                onPressed: () =>
                    Navigator.of(context).pop(GoneChoice.orderRest),
                child: Text(
                  l10n.cartOrderRest(
                    rest.lines.length == 1
                        ? l10n.cartLine(
                            rest.lines.first.quantity,
                            rest.lines.first.name,
                          )
                        : l10n.cartRestUnits(restTotals.units),
                    formatPrice(restTotals.priceVnd),
                  ),
                ),
              ),
            AppButton(
              variant: AppButtonVariant.secondary,
              onPressed: () =>
                  Navigator.of(context).pop(GoneChoice.otherDishes),
              child: Text(l10n.cartOtherDishes),
            ),
          ],
        ),
      ),
    );
  }
}
