import 'package:app_ui/app_ui.dart';
import 'package:flutter/services.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/core/routes.dart';
import 'package:second_bite/features/offer/domain/search_query.dart';
import 'package:second_bite/features/offer/ui/offer_format.dart';
import 'package:second_bite/l10n/l10n.dart';

/// {@template search_filters}
/// The search's chips (Figma K2 chip lọc), as the web's `SearchFilters`:
/// the order first when there is more than one result, how far around the
/// place (only with one), the price from and to, the time to collect from
/// and to (or now), and the kind. Each opens its options in a sheet;
/// choosing one opens the search with it, keeping the others.
/// {@endtemplate}
class SearchFilters extends StatelessWidget {
  /// {@macro search_filters}
  const new({
    required this.query,
    required this.near,
    required this.sortable,
    super.key,
  });

  /// What the search shows now.
  final SearchQuery query;

  /// Whether a place is chosen.
  final bool near;

  /// Whether the order chip is shown.
  final bool sortable;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    void show(SearchQuery next) => SearchRoute.of(next).go(context);
    String? range(String? from, String? to) => from != null && to != null
        ? l10n.searchRange(from, to)
        : from != null
        ? l10n.searchRangeFrom(from)
        : to != null
        ? l10n.searchRangeTo(to)
        : null;
    String? price(int? amount) => amount == null ? null : formatPrice(amount);
    final priceKeep = query.copyWith(
      minPrice: () => null,
      maxPrice: () => null,
    );
    final timeKeep = query.copyWith(
      from: () => null,
      to: () => null,
      now: false,
    );
    final natural = query.naturalSort(near: near);
    final otherSorts = sortChoices.where(
      (sort) =>
          sort != natural &&
          (sort != Sort3.relevance || query.q != null) &&
          (sort != Sort3.distance || near),
    );
    _Option pricePreset(int? from, int? to) => (
      label: range(price(from), price(to)) ?? '',
      query: priceKeep.copyWith(minPrice: () => from, maxPrice: () => to),
      current: query.minPrice == from && query.maxPrice == to,
    );
    _Option timePreset(String? from, String? to) => (
      label: range(from, to) ?? '',
      query: timeKeep.copyWith(from: () => from, to: () => to),
      current: query.from == from && query.to == to,
    );

    return Semantics(
      container: true,
      label: l10n.searchFilters,
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(
          horizontal: SpacingTokens.space4,
          vertical: 5,
        ),
        child: Row(
          spacing: SpacingTokens.space2,
          children: [
            if (sortable)
              _MenuChip(
                name: l10n.searchSortBy,
                onChosen: show,
                options: [
                  (
                    label: l10n.searchSort(natural.json!),
                    query: query.copyWith(sort: () => null),
                    current: query.sort == null,
                  ),
                  for (final sort in otherSorts)
                    (
                      label: l10n.searchSort(sort.json!),
                      query: query.copyWith(sort: () => sort),
                      current: query.sort == sort,
                    ),
                ],
              ),
            if (near)
              _MenuChip(
                name: l10n.searchDistance,
                onChosen: show,
                options: [
                  (
                    label: l10n.searchAnyDistance,
                    query: query.copyWith(radiusKm: () => null),
                    current: query.radiusKm == null,
                  ),
                  for (final km in radiusChoices)
                    (
                      label: l10n.searchWithin('$km km'),
                      query: query.copyWith(radiusKm: () => km),
                      current: query.radiusKm == km,
                    ),
                ],
              ),
            _RangeChip(
              type: _RangeType.price,
              name: l10n.searchPrice,
              chosen: range(price(query.minPrice), price(query.maxPrice)),
              from: query.minPrice?.toString(),
              to: query.maxPrice?.toString(),
              presets: [
                pricePreset(null, 20000),
                pricePreset(20000, 40000),
                pricePreset(40000, null),
              ],
              onApply: (from, to) => show(
                priceKeep.copyWith(
                  minPrice: () => int.tryParse(from ?? ''),
                  maxPrice: () => int.tryParse(to ?? ''),
                ),
              ),
              onChosen: show,
            ),
            _RangeChip(
              type: _RangeType.time,
              name: l10n.searchWhen,
              chosen: query.now ? l10n.searchNow : range(query.from, query.to),
              from: query.from,
              to: query.to,
              presets: [
                (
                  label: l10n.searchNow,
                  query: timeKeep.copyWith(now: true),
                  current: query.now,
                ),
                timePreset(null, '21:00'),
                timePreset('21:00', '22:00'),
                timePreset('22:00', null),
              ],
              onApply: (from, to) =>
                  show(timeKeep.copyWith(from: () => from, to: () => to)),
              onChosen: show,
            ),
            _MenuChip(
              name: l10n.searchKind,
              onChosen: show,
              options: [
                (
                  label: l10n.searchAnyKind,
                  query: query.copyWith(kind: () => null),
                  current: query.kind == null,
                ),
                for (final kind in Kind.$valuesDefined)
                  (
                    label: l10n.offerKind(kind.json!),
                    query: query.copyWith(kind: () => kind),
                    current: query.kind == kind,
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

/// One choice of a chip: what it says, the search once chosen, and whether
/// it is the current one.
typedef _Option = ({String label, SearchQuery query, bool current});

/// A chip that shows its choice once one other than the first is made, as
/// the web's chip trigger; it still says what it filters by.
class _Chip extends StatelessWidget {
  const new({required this.name, required this.onPressed, this.chosen});

  final String name;
  final String? chosen;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final active = chosen != null;
    return Semantics(
      label: active ? '$name: $chosen' : null,
      button: true,
      excludeSemantics: active,
      child: ActionChip(
        onPressed: onPressed,
        backgroundColor: active ? scheme.secondary : scheme.surface,
        side: BorderSide(color: active ? scheme.primary : scheme.outline),
        label: Row(
          mainAxisSize: MainAxisSize.min,
          spacing: SpacingTokens.space1,
          children: [
            Text(chosen ?? name),
            const Icon(LucideIcons.chevronDown, size: 14),
          ],
        ),
      ),
    );
  }
}

/// A chip whose options are a list, each opening the search with it.
class _MenuChip extends StatelessWidget {
  const new({
    required this.name,
    required this.options,
    required this.onChosen,
  });

  final String name;

  /// The first option is the one without a filter.
  final List<_Option> options;
  final ValueChanged<SearchQuery> onChosen;

  @override
  Widget build(BuildContext context) {
    final chosen = options.skip(1).where((option) => option.current);
    return _Chip(
      name: name,
      chosen: chosen.firstOrNull?.label,
      onPressed: () async {
        final picked = await showModalBottomSheet<SearchQuery>(
          context: context,
          showDragHandle: true,
          useSafeArea: true,
          isScrollControlled: true,
          builder: (sheet) => SafeArea(
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Padding(
                    padding: const EdgeInsets.fromLTRB(
                      SpacingTokens.space4,
                      0,
                      SpacingTokens.space4,
                      SpacingTokens.space2,
                    ),
                    child: Semantics(
                      header: true,
                      child: Text(name, style: sheet.appTextStyles.headline),
                    ),
                  ),
                  for (final option in options)
                    ListTile(
                      title: Text(option.label),
                      selected: option.current,
                      trailing: option.current
                          ? const Icon(LucideIcons.check)
                          : null,
                      onTap: () => Navigator.of(sheet).pop(option.query),
                    ),
                ],
              ),
            ),
          ),
        );
        if (picked != null) onChosen(picked);
      },
    );
  }
}

enum _RangeType { price, time }

// Every half hour of the day, "00:00" to "23:30", for the times to collect.
final List<String> _times = [
  for (var minutes = 0; minutes < 24 * 60; minutes += 30)
    [
      (minutes ~/ 60).toString().padLeft(2, '0'),
      (minutes % 60).toString().padLeft(2, '0'),
    ].join(':'),
];

/// A chip over a range, the price or the time to collect, as the web's
/// `RangeFilter`: quick choices first, then the two ends, either of which
/// may stay empty. An end after the other is refused with the web's words.
class _RangeChip extends StatelessWidget {
  const new({
    required this.type,
    required this.name,
    required this.presets,
    required this.onApply,
    required this.onChosen,
    this.chosen,
    this.from,
    this.to,
  });

  final _RangeType type;
  final String name;
  final String? chosen;
  final String? from;
  final String? to;
  final List<_Option> presets;
  final void Function(String? from, String? to) onApply;
  final ValueChanged<SearchQuery> onChosen;

  @override
  Widget build(BuildContext context) {
    return _Chip(
      name: name,
      chosen: chosen,
      onPressed: () async {
        final picked = await showModalBottomSheet<Object>(
          context: context,
          showDragHandle: true,
          useSafeArea: true,
          isScrollControlled: true,
          builder: (_) => RangeSheet(
            title: name,
            time: type == _RangeType.time,
            from: from,
            to: to,
            presets: [
              for (final preset in presets)
                (label: preset.label, current: preset.current),
            ],
          ),
        );
        switch (picked) {
          case final int index:
            onChosen(presets[index].query);
          case (final String? from, final String? to):
            onApply(from, to);
        }
      },
    );
  }
}

/// {@template range_sheet}
/// The sheet of a range chip: the quick choices, each popping its index,
/// then the two ends, popping `(from, to)` once in order.
/// {@endtemplate}
class RangeSheet extends StatefulWidget {
  /// {@macro range_sheet}
  const new({
    required this.title,
    required this.time,
    required this.presets,
    this.from,
    this.to,
    super.key,
  });

  /// What the chip filters by.
  final String title;

  /// Whether the ends are times of day, rather than prices.
  final bool time;

  /// The quick choices.
  final List<({String label, bool current})> presets;

  /// The start chosen now.
  final String? from;

  /// The end chosen now.
  final String? to;

  @override
  State<RangeSheet> createState() => _RangeSheetState();
}

class _RangeSheetState extends State<RangeSheet> {
  late final _fromField = TextEditingController(text: widget.from);
  late final _toField = TextEditingController(text: widget.to);
  late String? _fromTime = widget.from;
  late String? _toTime = widget.to;
  bool _invalid = false;

  @override
  void dispose() {
    _fromField.dispose();
    _toField.dispose();
    super.dispose();
  }

  void _apply() {
    String? end(String text) {
      final digits = text.replaceAll(RegExp(r'\D'), '');
      return digits.isEmpty ? null : digits;
    }

    final from = widget.time ? _fromTime : end(_fromField.text);
    final to = widget.time ? _toTime : end(_toField.text);
    final outOfOrder =
        from != null &&
        to != null &&
        (widget.time
            ? from.compareTo(to) > 0
            : int.parse(from) > int.parse(to));
    setState(() => _invalid = outOfOrder);
    if (!outOfOrder) Navigator.of(context).pop((from, to));
  }

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final error = _invalid
        ? (widget.time ? l10n.searchTimeOrder : l10n.searchPriceOrder)
        : null;

    Widget end({required bool start}) {
      final label = start ? l10n.searchFrom : l10n.searchTo;
      if (widget.time) {
        return DropdownButtonFormField<String?>(
          initialValue: start ? _fromTime : _toTime,
          decoration: InputDecoration(labelText: label, errorText: error),
          items: [
            DropdownMenuItem(child: Text(l10n.searchAnyTime)),
            for (final time in _times)
              DropdownMenuItem(value: time, child: Text(time)),
          ],
          onChanged: (value) => setState(() {
            if (start) {
              _fromTime = value;
            } else {
              _toTime = value;
            }
          }),
        );
      }
      return TextField(
        controller: start ? _fromField : _toField,
        keyboardType: TextInputType.number,
        inputFormatters: [FilteringTextInputFormatter.digitsOnly],
        decoration: InputDecoration(
          labelText: label,
          hintText: start ? l10n.searchLowest : l10n.searchHighest,
          suffixText: 'đ',
          errorText: error,
        ),
      );
    }

    return SafeArea(
      child: Padding(
        padding: EdgeInsets.fromLTRB(
          SpacingTokens.space4,
          0,
          SpacingTokens.space4,
          SpacingTokens.space4 + MediaQuery.viewInsetsOf(context).bottom,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          spacing: SpacingTokens.space3,
          children: [
            Semantics(
              header: true,
              child: Text(widget.title, style: text.headline),
            ),
            Semantics(
              container: true,
              label: l10n.searchQuick,
              child: Wrap(
                spacing: 6,
                runSpacing: 6,
                children: [
                  for (final (index, preset) in widget.presets.indexed)
                    ChoiceChip(
                      label: Text(preset.label),
                      selected: preset.current,
                      onSelected: (_) => Navigator.of(context).pop(index),
                    ),
                ],
              ),
            ),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: SpacingTokens.space2,
              children: [
                Expanded(child: end(start: true)),
                Expanded(child: end(start: false)),
              ],
            ),
            Row(
              spacing: SpacingTokens.space2,
              children: [
                Expanded(
                  child: AppButton(
                    variant: AppButtonVariant.outline,
                    onPressed: () => Navigator.of(context).pop((null, null)),
                    child: Text(l10n.searchClearFilter),
                  ),
                ),
                Expanded(
                  child: AppButton(
                    onPressed: _apply,
                    child: Text(l10n.searchApply),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
