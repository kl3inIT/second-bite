import 'package:app_ui/app_ui.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:maplibre_gl/maplibre_gl.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:second_bite/core/api.dart';
import 'package:url_launcher/url_launcher.dart';

part 'store_map.g.dart';

/// Hanoi's box, the server's served area, as the web's `HANOI_BOUNDS`: the
/// map cannot leave it.
final hanoiBounds = LatLngBounds(
  southwest: const LatLng(20.53, 105.25),
  northeast: const LatLng(21.42, 106.06),
);

/// The zoom a pin is shown at, street level, as the web's `STREET_ZOOM`.
const streetZoom = 16.0;

/// The style of the map, which the site answers from the same `hanoiStyle`
/// its own maps build (SEC-206): the site's origin is the API's without its
/// `/api` path, as the host's proxy serves both.
Uri mapStyleUri([String origin = apiOrigin]) {
  final api = Uri.parse(origin);
  final path = api.path.replaceFirst(RegExp(r'/?(api/?)?$'), '');
  return api.replace(path: '$path/map-style.json');
}

/// A point on the map.
typedef MapPoint = ({double latitude, double longitude});

/// Draws the map centred on a point, or nothing where it cannot be drawn.
typedef StoreMapDraw = Widget? Function(BuildContext context, MapPoint point);

/// How the store's map is drawn: MapLibre on Android and iOS. The browser
/// preview draws none, since MapLibre there needs the PMTiles protocol set up
/// by the page, and the preview changes no code for the web; a widget test
/// overrides it, as a platform view cannot be drawn there.
@riverpod
StoreMapDraw storeMapDraw(Ref ref) => kIsWeb ? (_, _) => null : _mapLibre;

Widget _mapLibre(BuildContext context, MapPoint point) => MapLibreMap(
  styleString: mapStyleUri().toString(),
  initialCameraPosition: CameraPosition(
    target: LatLng(point.latitude, point.longitude),
    zoom: streetZoom,
  ),
  cameraTargetBounds: CameraTargetBounds(hanoiBounds),
  minMaxZoomPreference: const MinMaxZoomPreference(9, 19),
  rotateGesturesEnabled: false,
  scrollGesturesEnabled: false,
  tiltGesturesEnabled: false,
  zoomGesturesEnabled: false,
  doubleClickZoomEnabled: false,
  dragEnabled: false,
  compassEnabled: false,
);

/// {@template store_map}
/// A picture of where a store's counter is (SEC-206), as the web's
/// `StoreMap`: a street map that does not move, the pin at its centre, and
/// a tap opening the way there in the phone's maps. Named for a screen
/// reader whether or not the map could be drawn.
/// {@endtemplate}
class StoreMap extends ConsumerWidget {
  /// {@macro store_map}
  const new({
    required this.point,
    required this.label,
    required this.directions,
    super.key,
  });

  /// Where the counter is.
  final MapPoint point;

  /// What the map shows, for a screen reader.
  final String label;

  /// The way there in the phone's maps.
  final Uri directions;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final map = ref.watch(storeMapDrawProvider)(context, point);
    if (map == null) return const SizedBox.shrink();
    final scheme = Theme.of(context).colorScheme;

    return Semantics(
      label: label,
      button: true,
      onTap: _open,
      excludeSemantics: true,
      child: Container(
        height: 160,
        clipBehavior: Clip.antiAlias,
        decoration: BoxDecoration(
          color: scheme.surfaceContainerHighest,
          border: Border.all(color: scheme.outlineVariant),
          borderRadius: BorderRadius.circular(RadiusTokens.xl),
        ),
        child: Stack(
          fit: StackFit.expand,
          children: [
            // The map takes no gesture: the page scrolls over it, and a tap
            // anywhere opens the way, as the web's figure does.
            IgnorePointer(child: map),
            // The pin's point sits on the counter, at the map's centre.
            Center(
              child: Transform.translate(
                offset: const Offset(0, -16),
                child: Icon(
                  LucideIcons.mapPin,
                  size: 32,
                  color: scheme.primary,
                ),
              ),
            ),
            Material(
              type: MaterialType.transparency,
              child: InkWell(onTap: _open),
            ),
          ],
        ),
      ),
    );
  }

  void _open() => launchUrl(directions, mode: LaunchMode.externalApplication);
}
