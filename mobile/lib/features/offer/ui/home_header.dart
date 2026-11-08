import 'package:app_ui/app_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:second_bite/core/routes.dart';
import 'package:second_bite/features/offer/data/kept_place.dart';
import 'package:second_bite/features/offer/ui/area_sheet.dart';
import 'package:second_bite/l10n/l10n.dart';

/// {@template place_heading}
/// The page's title on the header, as the web's `PlaceHeading`: a lime pin,
/// the place in bold and its area below in the soft text for Tasco blue:
/// every shop, a place chosen by name, or the phone's own place. The whole
/// of it opens the area sheet. A screen reader hears "Tối nay: Tất cả quán"
/// as the heading.
/// {@endtemplate}
class PlaceHeading extends ConsumerWidget {
  /// {@macro place_heading}
  const new({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final colors = context.appColors;
    final place = ref.watch(keptPlaceProvider).value;
    final name = place?.name;
    final (title, heading, area) = switch (place) {
      null => (l10n.homePlaceAll, l10n.homeHeadingAll, l10n.homeArea),
      _ when name != null => (
        name,
        l10n.homeHeadingAround(name),
        l10n.homeAreaPlace,
      ),
      _ => (
        l10n.homePlaceNearby,
        l10n.homeHeadingAround(l10n.homePlaceNearby),
        l10n.homeAreaNearby,
      ),
    };

    return Semantics(
      button: true,
      hint: l10n.areaOpen,
      child: InkWell(
        onTap: () => showAreaSheet(context),
        borderRadius: BorderRadius.circular(RadiusTokens.md),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: SpacingTokens.space2,
          children: [
            Padding(
              padding: const EdgeInsets.only(top: SpacingTokens.space1 / 2),
              child: Icon(LucideIcons.mapPin, size: 18, color: colors.fresh),
            ),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Semantics(
                    header: true,
                    label: heading,
                    excludeSemantics: true,
                    child: Row(
                      spacing: SpacingTokens.space1,
                      children: [
                        Flexible(
                          child: Text(
                            title,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: text.title.copyWith(
                              color: colors.headerForeground,
                            ),
                          ),
                        ),
                        Icon(
                          LucideIcons.chevronDown,
                          size: 16,
                          color: colors.headerForeground,
                        ),
                      ],
                    ),
                  ),
                  Text(
                    area,
                    style: text.label.copyWith(color: colors.inverseMuted),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// {@template search_field}
/// The search field of the header. Sending words opens the search with
/// them, at the web's address (`/search?q=`); its round button opens the
/// search with its filters.
/// {@endtemplate}
class SearchField extends StatefulWidget {
  /// {@macro search_field}
  const new({this.value, super.key});

  /// The words already searched for.
  final String? value;

  @override
  State<SearchField> createState() => _SearchFieldState();
}

class _SearchFieldState extends State<SearchField> {
  late final _controller = TextEditingController(text: widget.value);

  @override
  void didUpdateWidget(SearchField oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.value != oldWidget.value) _controller.text = widget.value ?? '';
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final scheme = Theme.of(context).colorScheme;

    return Semantics(
      label: l10n.homeSearchLabel,
      child: TextField(
        controller: _controller,
        textInputAction: TextInputAction.search,
        style: context.appTextStyles.bodySm,
        decoration: InputDecoration(
          hintText: l10n.homeSearchPlaceholder,
          // The field reads at body-sm, as on the web, placeholder included.
          hintStyle: context.appTextStyles.bodySm.copyWith(
            color: scheme.onSurfaceVariant,
          ),
          // Fully rounded (DESIGN.md › Shape). On the blue header the
          // field's edge is white like the field, as on the web; focus draws
          // the ring.
          enabledBorder: OutlineInputBorder(
            borderRadius: const BorderRadius.all(
              Radius.circular(RadiusTokens.full),
            ),
            borderSide: BorderSide(color: context.appColors.headerRaised),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: const BorderRadius.all(
              Radius.circular(RadiusTokens.full),
            ),
            borderSide: BorderSide(color: scheme.primary, width: 2),
          ),
          prefixIcon: const Icon(LucideIcons.search, size: 20),
          suffixIcon: Padding(
            padding: const EdgeInsets.all(SpacingTokens.space1),
            child: IconButton(
              tooltip: l10n.homeFilters,
              onPressed: () => const SearchRoute().go(context),
              icon: const Icon(LucideIcons.settings2, size: 20),
              style: IconButton.styleFrom(
                backgroundColor: scheme.secondary,
                foregroundColor: scheme.primary,
              ),
            ),
          ),
        ),
        onSubmitted: (words) =>
            SearchRoute(q: words.trim().isEmpty ? null : words.trim())
                .go(context),
      ),
    );
  }
}
