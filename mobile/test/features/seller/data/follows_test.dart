import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/features/identity/data/auth_repository.dart';
import 'package:second_bite/features/seller/data/follows.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:shared_preferences_platform_interface/in_memory_shared_preferences_async.dart';
import 'package:shared_preferences_platform_interface/shared_preferences_async_platform_interface.dart';

import '../../../helpers/helpers.dart';

void main() {
  group(Follows, () {
    late SellersClient sellers;

    setUp(() {
      SharedPreferencesAsyncPlatform.instance =
          InMemorySharedPreferencesAsync.empty();
      sellers = MockSellersClient();
    });

    ProviderContainer containerFor({AccountBody? account}) =>
        ProviderContainer.test(
          overrides: [
            apiProvider.overrideWithValue(testApi(sellers: sellers)),
            authRepositoryProvider.overrideWithValue(signedInAs(account)),
          ],
        );

    group('build', () {
      test('keeps the stores on the phone while no one is signed in', () async {
        when(sellers.listFollowedSellers).thenThrow(unauthorized());
        await SharedPreferencesAsync().setString(followsKey, '["se-2","se-1"]');

        final followed = await containerFor().read(followsProvider.future);

        expect(followed, isA<FollowedHere>());
        expect(followed.ids, ['se-2', 'se-1']);
      });

      test('follows the stores kept on the phone by the account, then '
          'forgets them', () async {
        await SharedPreferencesAsync().setString(followsKey, '["se-2"]');
        var listed = 0;
        when(sellers.listFollowedSellers).thenAnswer(
          (_) async => FollowedOutputBody(
            sellers: [
              if (listed++ > 0) sampleProfile(id: 'se-2'),
              sampleProfile(id: 'se-1'),
            ],
          ),
        );
        when(() => sellers.followSeller(sellerId: any(named: 'sellerId')))
            .thenAnswer((_) async {});

        final followed = await containerFor(account: sampleAccount)
            .read(followsProvider.future);

        verify(() => sellers.followSeller(sellerId: 'se-2')).called(1);
        expect(followed, isA<FollowedByAccount>());
        expect(followed.ids, ['se-2', 'se-1']);
        expect(await SharedPreferencesAsync().getString(followsKey), isNull);
      });

      test('lets go of a kept store the account cannot follow', () async {
        await SharedPreferencesAsync().setString(followsKey, '["se-gone"]');
        when(sellers.listFollowedSellers).thenAnswer(
          (_) async => FollowedOutputBody(sellers: [sampleProfile()]),
        );
        when(() => sellers.followSeller(sellerId: 'se-gone'))
            .thenAnswer((_) async => throw unauthorized());

        final followed = await containerFor(account: sampleAccount)
            .read(followsProvider.future);

        expect(followed.ids, ['se-bakery']);
        expect(await SharedPreferencesAsync().getString(followsKey), isNull);
      });
    });

    group('toggle', () {
      test('keeps a new store first on the phone, and lets it go', () async {
        when(sellers.listFollowedSellers).thenThrow(unauthorized());
        await SharedPreferencesAsync().setString(followsKey, '["se-1"]');
        final container = containerFor();
        final follows = container.read(followsProvider.notifier);
        await container.read(followsProvider.future);

        expect(await follows.toggle('se-2'), isTrue);
        expect(container.read(followsProvider).value?.ids, ['se-2', 'se-1']);
        expect(
          await SharedPreferencesAsync().getString(followsKey),
          '["se-2","se-1"]',
        );

        expect(await follows.toggle('se-2'), isFalse);
        expect(container.read(followsProvider).value?.ids, ['se-1']);
      });

      test('follows by the account while someone is signed in', () async {
        var followed = <SellerProfileBody>[];
        when(sellers.listFollowedSellers)
            .thenAnswer((_) async => FollowedOutputBody(sellers: followed));
        when(() => sellers.followSeller(sellerId: 'se-bakery'))
            .thenAnswer((_) async {
              followed = [sampleProfile()];
            });
        final container = containerFor(account: sampleAccount);
        await container.read(followsProvider.future);

        expect(
          await container.read(followsProvider.notifier).toggle('se-bakery'),
          isTrue,
        );
        expect(container.read(followsProvider).value?.ids, ['se-bakery']);
        expect(await SharedPreferencesAsync().getString(followsKey), isNull);
      });
    });
  });
}
