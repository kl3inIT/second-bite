import 'dart:async';

import 'package:app_ui/app_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/features/offer/data/kept_place.dart';
import 'package:second_bite/features/offer/data/locate.dart';
import 'package:second_bite/features/offer/domain/place.dart';
import 'package:second_bite/l10n/l10n.dart';

/// Opens the area sheet over the home, as the web's place heading does.
Future<void> showAreaSheet(BuildContext context) => showModalBottomSheet<void>(
  context: context,
  isScrollControlled: true,
  useSafeArea: true,
  showDragHandle: true,
  builder: (_) => const AreaSheet(),
);

/// How long typing rests before places are asked, as the web's.
const Duration _searchDelay = Duration(milliseconds: 300);

/// Fewer letters than this find too much to help.
const int _minLetters = 3;

/// How long the address of the person's place is waited for before the
/// place is shown without it.
const Duration _addressTimeout = Duration(seconds: 4);

enum _Area { all, mall }

/// {@template area_sheet}
/// Where to look for dishes (Figma K1a "Xem món ở đâu?"), as the web's
/// `AreaSheet`: a place typed, its suggestions chosen with one tap; "Gần
/// tôi", which only then asks for the phone's position and names it by its
/// street; then every shop, the default, or Tasco Mall. The choice is kept
/// on the phone for next time.
/// {@endtemplate}
class AreaSheet extends ConsumerStatefulWidget {
  /// {@macro area_sheet}
  const new({super.key});

  @override
  ConsumerState<AreaSheet> createState() => _AreaSheetState();
}

class _AreaSheetState extends ConsumerState<AreaSheet> {
  final _field = TextEditingController();
  Timer? _timer;
  int _asked = 0;
  List<PlaceBody> _places = const [];
  bool _answered = false;
  bool _locating = false;
  bool? _denied;
  _Area? _area;

  @override
  void initState() {
    super.initState();
    final near = ref.read(keptPlaceProvider).value?.near;
    _area = near == null
        ? _Area.all
        : near == mallNear
        ? _Area.mall
        : null;
  }

  @override
  void dispose() {
    _timer?.cancel();
    _field.dispose();
    super.dispose();
  }

  // Places for the words once typing rests, from three letters, an answer
  // to older words dropped, as the web's `usePlaceSuggestions`.
  void _search(String words) {
    _timer?.cancel();
    final ask = ++_asked;
    setState(() => _answered = false);
    if (words.trim().length < _minLetters) {
      setState(() => _places = const []);
      return;
    }
    _timer = Timer(_searchDelay, () async {
      List<PlaceBody> found;
      try {
        found =
            (await ref
                    .read(apiProvider)
                    .places
                    .searchCustomerPlaces(q: words.trim()))
                .places ??
            const [];
      } on Object {
        found = const [];
      }
      if (!mounted || ask != _asked) return;
      setState(() {
        _places = found;
        _answered = true;
      });
    });
  }

  void _clear() {
    _timer?.cancel();
    _asked++;
    _field.clear();
    setState(() {
      _places = const [];
      _answered = false;
    });
  }

  Future<void> _show(Place? place) async {
    await ref.read(keptPlaceProvider.notifier).choose(place);
    if (mounted) Navigator.of(context).pop();
  }

  Future<void> _locate() async {
    setState(() {
      _denied = null;
      _locating = true;
    });
    final ({double latitude, double longitude}) position;
    try {
      position = await ref.read(locateProvider)();
    } on LocateFailure catch (failure) {
      if (mounted) {
        setState(() {
          _locating = false;
          _denied = failure.denied;
        });
      }
      return;
    }
    final near = nearOf(position.latitude, position.longitude);
    final [latitude, longitude] = near.split(',').map(double.parse).toList();
    // The street the rounded point is on names the place; without an answer
    // in time the place is still shown, as "Vị trí của tôi".
    String? name;
    try {
      final address =
          (await ref
                  .read(apiProvider)
                  .places
                  .customerAddressAt(latitude: latitude, longitude: longitude)
                  .timeout(_addressTimeout))
              .address;
      name = address.isEmpty ? null : partsOfAddress(address).name;
    } on Object {
      name = null;
    }
    if (!mounted) return;
    setState(() => _locating = false);
    await _show((near: near, name: name));
  }

  void _apply() {
    switch (_area) {
      case _Area.all:
        unawaited(_show(null));
      case _Area.mall:
        unawaited(_show((near: mallNear, name: context.l10n.areaMall)));
      case null:
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;
    final muted = text.label.copyWith(color: scheme.onSurfaceVariant);
    final denied = _denied;

    return Padding(
      padding: EdgeInsets.only(bottom: MediaQuery.viewInsetsOf(context).bottom),
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(
          SpacingTokens.space4,
          0,
          SpacingTokens.space4,
          SpacingTokens.space6,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          spacing: SpacingTokens.space3,
          children: [
            Row(
              children: [
                Expanded(
                  child: Semantics(
                    header: true,
                    child: Text(l10n.areaTitle, style: text.headline),
                  ),
                ),
                IconButton(
                  tooltip: l10n.areaClose,
                  icon: const Icon(LucideIcons.x),
                  onPressed: () => Navigator.of(context).pop(),
                ),
              ],
            ),
            Semantics(
              label: l10n.areaField,
              child: TextField(
                controller: _field,
                onChanged: _search,
                textInputAction: TextInputAction.search,
                decoration: InputDecoration(
                  hintText: l10n.areaFieldPlaceholder,
                  prefixIcon: const Icon(LucideIcons.search, size: 20),
                  suffixIcon: _field.text.isEmpty
                      ? null
                      : IconButton(
                          tooltip: l10n.areaClear,
                          icon: const Icon(LucideIcons.x, size: 16),
                          onPressed: _clear,
                        ),
                ),
              ),
            ),
            // How many places were suggested, for a screen reader only.
            Semantics(
              liveRegion: true,
              label: _answered ? l10n.areaSuggestions(_places.length) : '',
              child: const SizedBox.shrink(),
            ),
            if (_places.isNotEmpty)
              Card(
                margin: EdgeInsets.zero,
                child: Column(
                  children: [
                    for (final place in _places)
                      ListTile(
                        leading: Icon(
                          LucideIcons.mapPin,
                          color: scheme.primary,
                        ),
                        title: Text(partsOfAddress(place.address).name),
                        subtitle: switch (partsOfAddress(place.address).rest) {
                          '' => null,
                          final rest => Text(rest, style: muted),
                        },
                        onTap: () => _show((
                          near: nearOf(place.latitude, place.longitude),
                          name: partsOfAddress(place.address).name,
                        )),
                      ),
                  ],
                ),
              ),
            if (_answered && _places.isEmpty)
              Text(l10n.areaNoPlace, style: muted),
            Card(
              margin: EdgeInsets.zero,
              child: ListTile(
                leading: Icon(LucideIcons.locateFixed, color: scheme.primary),
                title: Text(l10n.areaNearby),
                subtitle: Text(
                  _locating ? l10n.areaLocating : l10n.areaNearbyHint,
                  style: muted,
                ),
                trailing: const Icon(LucideIcons.chevronRight),
                enabled: !_locating,
                onTap: _locate,
              ),
            ),
            if (denied != null)
              AppAlert(
                icon: LucideIcons.circleAlert,
                title: l10n.areaNearby,
                description: denied ? l10n.areaDenied : l10n.areaFailed,
              ),
            const Divider(),
            RadioGroup<_Area>(
              groupValue: _area,
              onChanged: (area) => setState(() => _area = area),
              child: Semantics(
                container: true,
                label: l10n.areaAreas,
                child: Column(
                  children: [
                    RadioListTile<_Area>(
                      value: _Area.all,
                      secondary: const Icon(LucideIcons.store),
                      title: Text(l10n.areaAll),
                      subtitle: Text(l10n.areaAllHint, style: muted),
                    ),
                    RadioListTile<_Area>(
                      value: _Area.mall,
                      secondary: const Icon(LucideIcons.mapPin),
                      title: Text(l10n.areaMall),
                      subtitle: Text(l10n.areaMallHint, style: muted),
                    ),
                  ],
                ),
              ),
            ),
            AppButton(
              onPressed: _area == null ? null : _apply,
              child: Text(l10n.areaApply),
            ),
          ],
        ),
      ),
    );
  }
}
