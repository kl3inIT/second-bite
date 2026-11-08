import 'package:app_ui/app_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/features/offer/ui/offer_format.dart';
import 'package:second_bite/features/order/data/order_repository.dart';
import 'package:second_bite/l10n/l10n.dart';

part 'promotion_notice.g.dart';

// Without an answer the cart shows no notice; the order still takes its
// discount when placed.
Duration? _never(int retryCount, Object error) => null;

/// The promotions running for the stores named in [sellerIds], a comma
/// separated list so the provider is keyed by a plain value.
@Riverpod(retry: _never)
Future<List<RunningPromotionBody>> runningPromotions(
  Ref ref,
  String sellerIds,
) => ref.watch(orderRepositoryProvider).runningPromotions(sellerIds.split(','));

/// {@template promotion_notice}
/// The promotions running for the cart's stores, as a notice in the summary
/// (buyer-discount increment), as the web's `PromotionNotice`: each
/// promotion's name, what each of its rules takes off and from what amount,
/// and how many times a day a phone number gets it. What this customer gets
/// is said on the order once it is placed, never here: answering it for a
/// phone number would tell anyone who typed a number whether that person
/// has bought before.
/// {@endtemplate}
class PromotionNotice extends ConsumerWidget {
  /// {@macro promotion_notice}
  const new({required this.sellerIds, super.key});

  /// The stores of the dishes that can be ordered.
  final List<String> sellerIds;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (sellerIds.isEmpty) return const SizedBox.shrink();
    final key = ([...sellerIds]..sort()).join(',');
    final promotions = ref.watch(runningPromotionsProvider(key)).value;
    if (promotions == null || promotions.isEmpty) {
      return const SizedBox.shrink();
    }
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final colors = context.appColors;
    final body = text.bodySm.copyWith(color: colors.freshForeground);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: SpacingTokens.space2,
      children: [
        for (final promotion in promotions)
          Semantics(
            container: true,
            label: promotion.name,
            child: DecoratedBox(
              decoration: BoxDecoration(
                color: colors.freshMuted,
                borderRadius: BorderRadius.circular(RadiusTokens.lg),
              ),
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: SpacingTokens.space3,
                  vertical: 10,
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  spacing: 10,
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(top: 2),
                      child: Icon(
                        LucideIcons.gift,
                        size: 16,
                        color: colors.freshForeground,
                      ),
                    ),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        spacing: 2,
                        children: [
                          Text(
                            promotion.name,
                            style: text.bodySmStrong.copyWith(
                              color: colors.freshForeground,
                            ),
                          ),
                          for (final rule in promotion.rules.where(
                            (rule) => appliesTo(rule, sellerIds),
                          ))
                            Text(ruleLine(l10n, rule), style: body),
                          if (promotion.perPhonePerDay > 0)
                            Text(
                              l10n.cartPromotionPerDay(
                                promotion.perPhonePerDay,
                              ),
                              style: body,
                            ),
                          Text(l10n.cartPromotionAfter, style: body),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
      ],
    );
  }
}

/// What a rule takes off, and from what amount.
String ruleLine(AppLocalizations l10n, PromotionRuleBody rule) {
  final reward = rule.reward;
  final amount = reward.type == PromotionRewardBodyType.fixed
      ? formatPrice(reward.value)
      : l10n.cartPromotionPercent(
          reward.value,
          formatPrice(reward.maxVnd ?? 0),
        );
  final from = rule.conditions
      .where(
        (condition) =>
            condition.attribute == PromotionConditionBodyAttribute.subtotal &&
            condition.operatorEnum == PromotionConditionBodyOperatorEnum.gte,
      )
      .firstOrNull;
  final minimum = from == null ? null : int.tryParse(from.values.first);
  return minimum == null
      ? l10n.cartPromotionRule(rule.name, amount)
      : l10n.cartPromotionRuleFrom(rule.name, amount, formatPrice(minimum));
}

/// Whether a rule may apply to one of the cart's stores: one it does not
/// name among those it leaves out, as the web's `appliesTo`.
bool appliesTo(PromotionRuleBody rule, List<String> sellerIds) =>
    rule.conditions.every((condition) {
      if (condition.attribute != PromotionConditionBodyAttribute.seller) {
        return true;
      }
      final named = sellerIds.where(condition.values.contains).length;
      return condition.operatorEnum ==
              PromotionConditionBodyOperatorEnum.valueIn
          ? named > 0
          : named < sellerIds.length;
    });
