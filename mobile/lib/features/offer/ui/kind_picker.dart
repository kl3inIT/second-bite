import 'package:app_ui/app_ui.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/core/routes.dart';
import 'package:second_bite/features/offer/domain/offer_summary.dart';
import 'package:second_bite/l10n/l10n.dart';

/// {@template kind_picker}
/// The round pictures under the header: "collect now" and one per kind the
/// API filters by. Each opens the home filtered at the web's address; the
/// chosen one opens the whole list again.
/// {@endtemplate}
class KindPicker extends StatelessWidget {
  /// {@macro kind_picker}
  const new({required this.query, super.key});

  /// What the home shows now.
  final HomeQuery query;

  static const Map<Kind, String> _pictures = {
    Kind.bakery: 'assets/kinds/bakery.jpg',
    Kind.preparedFood: 'assets/kinds/prepared-food.jpg',
    Kind.ingredients: 'assets/kinds/ingredients.jpg',
    Kind.drinks: 'assets/kinds/drinks.jpg',
    Kind.mixedBox: 'assets/kinds/mixed-box.jpg',
  };

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;

    return Semantics(
      container: true,
      label: l10n.homeKindsLabel,
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: SpacingTokens.space4),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: SpacingTokens.space2,
          children: [
            _KindItem(
              label: l10n.homeCollectNow,
              icon: Icons.schedule,
              active: query.now,
              onTap: () =>
                  (query.now ? const HomeRoute() : const HomeRoute(now: '1'))
                      .go(context),
            ),
            for (final kind in Kind.$valuesDefined)
              _KindItem(
                label: l10n.offerKind(kind.json!),
                picture: _pictures[kind],
                icon: Icons.restaurant,
                active: query.kind == kind,
                onTap: () =>
                    (query.kind == kind
                            ? const HomeRoute()
                            : HomeRoute(kind: kind.json))
                        .go(context),
              ),
          ],
        ),
      ),
    );
  }
}

class _KindItem extends StatelessWidget {
  const new({
    required this.label,
    required this.icon,
    required this.active,
    required this.onTap,
    this.picture,
  });

  final String label;
  final String? picture;
  final IconData icon;
  final bool active;
  final VoidCallback onTap;

  static const double _width = 64;
  static const double _picture = 60;

  @override
  Widget build(BuildContext context) {
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;
    final asset = picture;
    final circle = ClipOval(
      child: SizedBox.expand(
        child: asset == null
            ? ColoredBox(
                color: scheme.secondary,
                child: Icon(icon, color: scheme.primary),
              )
            : Image.asset(asset, fit: BoxFit.cover, excludeFromSemantics: true),
      ),
    );

    return Semantics(
      button: true,
      selected: active,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(RadiusTokens.md),
        child: SizedBox(
          width: _width,
          child: Column(
            spacing: SpacingTokens.space1,
            children: [
              // The chosen kind wears a Deep Leaf ring with a gap of ground,
              // inside its frame so nothing around it moves.
              DecoratedBox(
                position: DecorationPosition.foreground,
                decoration: ShapeDecoration(
                  shape: CircleBorder(
                    side: active
                        ? BorderSide(color: scheme.primary, width: 3)
                        : BorderSide.none,
                  ),
                ),
                child: SizedBox.square(
                  dimension: _picture,
                  child: Padding(
                    padding: EdgeInsets.all(
                      active ? SpacingTokens.space1 + 1 : 0,
                    ),
                    child: circle,
                  ),
                ),
              ),
              Text(
                label,
                textAlign: TextAlign.center,
                style: active
                    ? text.labelStrong.copyWith(color: scheme.primary)
                    : text.label,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
