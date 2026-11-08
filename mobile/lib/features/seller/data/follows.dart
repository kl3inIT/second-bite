import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/core/preferences.dart';
import 'package:second_bite/features/identity/ui/current_account.dart';

part 'follows.g.dart';

/// Where a guest's follows are kept, under the web's own name.
const followsKey = 'secondbite.follows';

/// {@template followed}
/// The stores a person follows (SEC-109): kept on the phone until someone is
/// signed in ([FollowedHere]), then by their account ([FollowedByAccount]),
/// as the web's `follows.ts`.
/// {@endtemplate}
sealed class Followed {
  const new();

  /// The followed store ids, newest first.
  List<String> get ids;
}

/// {@macro followed} Kept on this phone.
final class FollowedHere extends Followed {
  /// The stores kept on this phone, newest first.
  const new(this.ids);

  @override
  final List<String> ids;
}

/// {@macro followed} Kept by the account.
final class FollowedByAccount extends Followed {
  /// The account's followed stores, newest first, with their profiles.
  const new(this.sellers);

  /// The stores, as `GET /sellers/followed` answers them.
  final List<SellerProfileBody> sellers;

  @override
  List<String> get ids => [for (final seller in sellers) seller.id];
}

/// {@template follows}
/// Who follows what, for the hearts and the Saved tab. It asks the server
/// first; a refusal (no one is signed in) or no answer means the phone keeps
/// them. Once someone is signed in, the stores kept on the phone are
/// followed by the account and the phone forgets them, as on the web. It
/// asks again when someone signs in or out.
/// {@endtemplate}
@Riverpod(keepAlive: true)
class Follows extends _$Follows {
  @override
  Future<Followed> build() async {
    // Signing in or out asks again; the server says who is signed in.
    try {
      await ref.watch(currentAccountProvider.future);
    } on Object {
      // Not known yet: the server's answer below decides.
    }
    final sellers = ref.watch(apiProvider).sellers;
    try {
      var followed = await sellers.listFollowedSellers();
      final kept = await _readKept();
      if (kept.isNotEmpty) {
        // Each store kept here is followed by the account; one that is gone
        // or no longer active is let go.
        await Future.wait(
          kept.map(
            (sellerId) => sellers
                .followSeller(sellerId: sellerId)
                .then<void>((_) {}, onError: (Object _) {}),
          ),
        );
        await _keep(const []);
        followed = await sellers.listFollowedSellers();
      }
      return FollowedByAccount(followed.sellers ?? const []);
    } on DioException {
      return FollowedHere(await _readKept());
    }
  }

  /// Follows the store, or lets it go when followed; answers whether it is
  /// followed now. A failure to save is the caller's to say.
  Future<bool> toggle(String sellerId) async {
    final current = await future;
    final following = !current.ids.contains(sellerId);
    switch (current) {
      case FollowedByAccount():
        final sellers = ref.read(apiProvider).sellers;
        if (following) {
          await sellers.followSeller(sellerId: sellerId);
        } else {
          await sellers.unfollowSeller(sellerId: sellerId);
        }
        final followed = await sellers.listFollowedSellers();
        state = AsyncData(FollowedByAccount(followed.sellers ?? const []));
      case FollowedHere(:final ids):
        final kept = ids.where((id) => id != sellerId);
        final next = following ? [sellerId, ...kept] : kept.toList();
        await _keep(next);
        state = AsyncData(FollowedHere(next));
    }
    return following;
  }

  Future<List<String>> _readKept() async {
    try {
      final kept = await ref.read(preferencesProvider).getString(followsKey);
      final read = kept == null ? null : jsonDecode(kept);
      return read is List ? read.whereType<String>().toList() : const [];
    } on Object {
      return const [];
    }
  }

  Future<void> _keep(List<String> ids) async {
    final preferences = ref.read(preferencesProvider);
    if (ids.isEmpty) {
      await preferences.remove(followsKey);
    } else {
      await preferences.setString(followsKey, jsonEncode(ids));
    }
  }
}

// A store's profile shows at once or not at all.
Duration? _never(int retryCount, Object error) => null;

/// A followed store's profile, for one with no dish tonight, as the web's
/// `useProfiles`: null when the store is gone (`404`) or cannot be read.
@Riverpod(retry: _never)
Future<SellerProfileBody?> sellerProfile(Ref ref, String sellerId) async {
  try {
    return await ref
        .watch(apiProvider)
        .sellers
        .getSellerProfile(sellerId: sellerId);
  } on DioException {
    return null;
  }
}
