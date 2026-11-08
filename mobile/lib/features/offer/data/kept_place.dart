import 'dart:convert';

import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:second_bite/core/preferences.dart';
import 'package:second_bite/features/offer/domain/place.dart';

part 'kept_place.g.dart';

/// Where the chosen place is kept, under the web's own name for it.
const placeKey = 'secondbite.place';

/// {@template kept_place}
/// The place the customer chose in the area sheet, kept so the app opens on
/// it next time, as the web keeps it in a cookie (customer place, step 3).
/// Null for every shop, the default.
/// {@endtemplate}
@Riverpod(keepAlive: true)
class KeptPlace extends _$KeptPlace {
  @override
  Future<Place?> build() async {
    // A convenience: storage that cannot be read shows every shop.
    try {
      final kept = await ref.watch(preferencesProvider).getString(placeKey);
      return kept == null ? null : readPlace(jsonDecode(kept));
    } on Object {
      return null;
    }
  }

  /// Shows dishes around [place], or at every shop when null, and keeps the
  /// choice.
  Future<void> choose(Place? place) async {
    state = AsyncData(place);
    final preferences = ref.read(preferencesProvider);
    try {
      if (place == null) {
        await preferences.remove(placeKey);
      } else {
        await preferences.setString(placeKey, writePlace(place));
      }
    } on Object {
      // Kept for this run only.
    }
  }
}
