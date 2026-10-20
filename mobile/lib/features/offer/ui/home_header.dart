import 'package:app_ui/app_ui.dart';
import 'package:second_bite/core/routes.dart';
import 'package:second_bite/l10n/l10n.dart';

/// {@template place_heading}
/// The page's title on the header: a lime pin, the place, and its district
/// below in the soft text for Tasco blue. A
/// screen reader hears "Tối nay ở Tasco Mall" as the heading.
/// {@endtemplate}
class PlaceHeading extends StatelessWidget {
  /// {@macro place_heading}
  const new({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final colors = context.appColors;

    return Row(
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
                label: l10n.homeTitle,
                excludeSemantics: true,
                child: Text(
                  l10n.homePlace,
                  style: text.title.copyWith(color: colors.headerForeground),
                ),
              ),
              Text(
                l10n.homeArea,
                style: text.label.copyWith(color: colors.inverseMuted),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

/// {@template search_field}
/// The search field of the header. Sending words opens the home filtered by
/// them, at the same address as on the web (`/?q=`).
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
            color: Theme.of(context).colorScheme.onSurfaceVariant,
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
            borderSide: BorderSide(
              color: Theme.of(context).colorScheme.primary,
              width: 2,
            ),
          ),
          prefixIcon: const Icon(LucideIcons.search, size: 20),
        ),
        onSubmitted: (words) => HomeRoute(q: words).go(context),
      ),
    );
  }
}
