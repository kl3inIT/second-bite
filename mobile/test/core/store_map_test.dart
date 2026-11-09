import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:second_bite/core/store_map.dart';

import '../helpers/helpers.dart';

void main() {
  group('mapStyleUri', () {
    test("is on the site's origin when the API sits under /api", () {
      expect(
        mapStyleUri('https://preview.secondbite.vadan.app/api').toString(),
        'https://preview.secondbite.vadan.app/map-style.json',
      );
      expect(
        mapStyleUri('https://secondbite.vadan.app/api/').toString(),
        'https://secondbite.vadan.app/map-style.json',
      );
    });

    test('is on the origin itself when the API answers at its root', () {
      expect(
        mapStyleUri('http://localhost:3190').toString(),
        'http://localhost:3190/map-style.json',
      );
    });
  });

  group(StoreMap, () {
    testWidgets('draws the map with the pin and names it', (tester) async {
      await tester.pumpApp(
        Scaffold(
          body: StoreMap(
            point: (latitude: 21.0565, longitude: 105.8964),
            label: 'Vị trí Tiệm bánh Pháp trên bản đồ',
            directions: Uri.parse('https://www.google.com/maps/dir/'),
          ),
        ),
      );

      expect(find.byKey(testStoreMapKey), findsOneWidget);
      expect(
        find.bySemanticsLabel('Vị trí Tiệm bánh Pháp trên bản đồ'),
        findsOneWidget,
      );
    });

    testWidgets('takes no room where no map can be drawn', (tester) async {
      await tester.pumpApp(
        Scaffold(
          // A scope of its own, as pumpApp already draws a stand-in.
          body: ProviderScope(
            overrides: [storeMapDrawProvider.overrideWithValue((_, _) => null)],
            child: StoreMap(
              point: (latitude: 21.0565, longitude: 105.8964),
              label: 'Vị trí',
              directions: Uri.parse('https://www.google.com/maps/dir/'),
            ),
          ),
        ),
      );

      expect(find.byKey(testStoreMapKey), findsNothing);
      expect(find.bySemanticsLabel('Vị trí'), findsNothing);
    });
  });
}
