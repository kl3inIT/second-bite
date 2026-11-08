import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:second_bite/core/preferences.dart';
import 'package:second_bite/features/offer/data/kept_place.dart';
import 'package:second_bite/features/offer/data/recent_searches.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:shared_preferences_platform_interface/in_memory_shared_preferences_async.dart';
import 'package:shared_preferences_platform_interface/shared_preferences_async_platform_interface.dart';

void main() {
  group('kept on the phone', () {
    late ProviderContainer container;

    setUp(() {
      SharedPreferencesAsyncPlatform.instance =
          InMemorySharedPreferencesAsync.empty();
      container = ProviderContainer.test();
    });

    group(RecentSearches, () {
      test('keeps the newest first, once each, at most five', () async {
        final recent = container.read(recentSearchesProvider.notifier);
        await container.read(recentSearchesProvider.future);

        for (final words in ['a', 'b', 'c', 'd', 'e', 'f', 'c']) {
          await recent.remember(words);
        }

        expect(container.read(recentSearchesProvider).value, [
          'c',
          'f',
          'e',
          'd',
          'b',
        ]);
        expect(
          await SharedPreferencesAsync().getString(recentSearchesKey),
          '["c","f","e","d","b"]',
        );
      });

      test('forgets one search and then every one', () async {
        await SharedPreferencesAsync().setString(
          recentSearchesKey,
          '["gà rán","pizza"]',
        );
        final recent = container.read(recentSearchesProvider.notifier);
        expect(await container.read(recentSearchesProvider.future), [
          'gà rán',
          'pizza',
        ]);

        await recent.forget('gà rán');
        expect(container.read(recentSearchesProvider).value, ['pizza']);

        await recent.clear();
        expect(container.read(recentSearchesProvider).value, isEmpty);
      });

      test('reads nothing from what it did not write', () async {
        await SharedPreferencesAsync().setString(recentSearchesKey, '{"a":1}');

        expect(await container.read(recentSearchesProvider.future), isEmpty);
      });
    });

    group(KeptPlace, () {
      test('keeps the place under the web key and forgets it', () async {
        final kept = container.read(keptPlaceProvider.notifier);
        expect(await container.read(keptPlaceProvider.future), isNull);

        await kept.choose((near: '21.040,105.880', name: 'Phố Hoa Lâm'));
        expect(
          await container.read(preferencesProvider).getString(placeKey),
          '{"near":"21.040,105.880","place":"Phố Hoa Lâm"}',
        );

        await kept.choose(null);
        expect(
          await container.read(preferencesProvider).getString(placeKey),
          isNull,
        );
      });

      test('reads the kept place on the next run', () async {
        await SharedPreferencesAsync().setString(
          placeKey,
          '{"near":"21.040,105.880"}',
        );

        expect(await container.read(keptPlaceProvider.future), (
          near: '21.040,105.880',
          name: null,
        ));
      });
    });
  });
}
