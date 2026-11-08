import 'package:geolocator/geolocator.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'locate.g.dart';

/// {@template locate_failure}
/// The phone's position could not be read: the person refused it
/// ([denied]), or the phone could not find it.
/// {@endtemplate}
class LocateFailure implements Exception {
  /// {@macro locate_failure}
  const new({required this.denied});

  /// Whether location is refused for the app or switched off, rather than
  /// not found.
  final bool denied;
}

/// The phone's position, asked only when "Gần tôi" is pressed, as the web
/// asks the browser (customer place, decision 1); a refusal or a failure is
/// a [LocateFailure].
typedef Locate = Future<({double latitude, double longitude})> Function();

/// [Locate] through `geolocator`: the permission is asked then, once.
@riverpod
Locate locate(Ref ref) => () async {
  if (!await Geolocator.isLocationServiceEnabled()) {
    throw const LocateFailure(denied: true);
  }
  var permission = await Geolocator.checkPermission();
  if (permission == LocationPermission.denied) {
    permission = await Geolocator.requestPermission();
  }
  if (permission == LocationPermission.denied ||
      permission == LocationPermission.deniedForever) {
    throw const LocateFailure(denied: true);
  }
  try {
    final position = await Geolocator.getCurrentPosition(
      locationSettings: const LocationSettings(
        accuracy: LocationAccuracy.medium,
        timeLimit: Duration(seconds: 10),
      ),
    );
    return (latitude: position.latitude, longitude: position.longitude);
  } on Object {
    throw const LocateFailure(denied: false);
  }
};
