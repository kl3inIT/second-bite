// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'follows.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// {@template follows}
/// Who follows what, for the hearts and the Saved tab. It asks the server
/// first; a refusal (no one is signed in) or no answer means the phone keeps
/// them. Once someone is signed in, the stores kept on the phone are
/// followed by the account and the phone forgets them, as on the web. It
/// asks again when someone signs in or out.
/// {@endtemplate}

@ProviderFor(Follows)
final followsProvider = FollowsProvider._();

/// {@template follows}
/// Who follows what, for the hearts and the Saved tab. It asks the server
/// first; a refusal (no one is signed in) or no answer means the phone keeps
/// them. Once someone is signed in, the stores kept on the phone are
/// followed by the account and the phone forgets them, as on the web. It
/// asks again when someone signs in or out.
/// {@endtemplate}
final class FollowsProvider extends $AsyncNotifierProvider<Follows, Followed> {
  /// {@template follows}
  /// Who follows what, for the hearts and the Saved tab. It asks the server
  /// first; a refusal (no one is signed in) or no answer means the phone keeps
  /// them. Once someone is signed in, the stores kept on the phone are
  /// followed by the account and the phone forgets them, as on the web. It
  /// asks again when someone signs in or out.
  /// {@endtemplate}
  FollowsProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'followsProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$followsHash();

  @$internal
  @override
  Follows create() => Follows();
}

String _$followsHash() => r'10ae41e3e4ba16664eab6fe02cbe3aa48a3e9d5b';

/// {@template follows}
/// Who follows what, for the hearts and the Saved tab. It asks the server
/// first; a refusal (no one is signed in) or no answer means the phone keeps
/// them. Once someone is signed in, the stores kept on the phone are
/// followed by the account and the phone forgets them, as on the web. It
/// asks again when someone signs in or out.
/// {@endtemplate}

abstract class _$Follows extends $AsyncNotifier<Followed> {
  FutureOr<Followed> build();
  @$mustCallSuper
  @override
  WhenComplete runBuild() {
    final ref = this.ref as $Ref<AsyncValue<Followed>, Followed>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<AsyncValue<Followed>, Followed>,
              AsyncValue<Followed>,
              Object?,
              Object?
            >;
    return element.handleCreate(ref, build);
  }
}

/// A followed store's profile, for one with no dish tonight, as the web's
/// `useProfiles`: null when the store is gone (`404`) or cannot be read.

@ProviderFor(sellerProfile)
final sellerProfileProvider = SellerProfileFamily._();

/// A followed store's profile, for one with no dish tonight, as the web's
/// `useProfiles`: null when the store is gone (`404`) or cannot be read.

final class SellerProfileProvider
    extends
        $FunctionalProvider<
          AsyncValue<SellerProfileBody?>,
          SellerProfileBody?,
          FutureOr<SellerProfileBody?>
        >
    with
        $FutureModifier<SellerProfileBody?>,
        $FutureProvider<SellerProfileBody?> {
  /// A followed store's profile, for one with no dish tonight, as the web's
  /// `useProfiles`: null when the store is gone (`404`) or cannot be read.
  SellerProfileProvider._({
    required SellerProfileFamily super.from,
    required String super.argument,
  }) : super(
         retry: _never,
         name: r'sellerProfileProvider',
         isAutoDispose: true,
         dependencies: null,
         $allTransitiveDependencies: null,
       );

  @override
  String debugGetCreateSourceHash() => _$sellerProfileHash();

  @override
  String toString() {
    return r'sellerProfileProvider'
        ''
        '($argument)';
  }

  @$internal
  @override
  $FutureProviderElement<SellerProfileBody?> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<SellerProfileBody?> create(Ref ref) {
    final argument = this.argument as String;
    return sellerProfile(ref, argument);
  }

  @override
  bool operator ==(Object other) {
    return other is SellerProfileProvider && other.argument == argument;
  }

  @override
  int get hashCode {
    return argument.hashCode;
  }
}

String _$sellerProfileHash() => r'c0cb866f4fee6306120e8ba9afd49ed5d472dab4';

/// A followed store's profile, for one with no dish tonight, as the web's
/// `useProfiles`: null when the store is gone (`404`) or cannot be read.

final class SellerProfileFamily extends $Family
    with $FunctionalFamilyOverride<FutureOr<SellerProfileBody?>, String> {
  SellerProfileFamily._()
    : super(
        retry: _never,
        name: r'sellerProfileProvider',
        dependencies: null,
        $allTransitiveDependencies: null,
        isAutoDispose: true,
      );

  /// A followed store's profile, for one with no dish tonight, as the web's
  /// `useProfiles`: null when the store is gone (`404`) or cannot be read.

  SellerProfileProvider call(String sellerId) =>
      SellerProfileProvider._(argument: sellerId, from: this);

  @override
  String toString() => r'sellerProfileProvider';
}
