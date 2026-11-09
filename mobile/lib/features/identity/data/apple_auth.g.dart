// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'apple_auth.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// The app's one [AppleAuth].

@ProviderFor(appleAuth)
final appleAuthProvider = AppleAuthProvider._();

/// The app's one [AppleAuth].

final class AppleAuthProvider
    extends $FunctionalProvider<AppleAuth, AppleAuth, AppleAuth>
    with $Provider<AppleAuth> {
  /// The app's one [AppleAuth].
  AppleAuthProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'appleAuthProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$appleAuthHash();

  @$internal
  @override
  $ProviderElement<AppleAuth> $createElement($ProviderPointer pointer) =>
      $ProviderElement(pointer);

  @override
  AppleAuth create(Ref ref) {
    return appleAuth(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(AppleAuth value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<AppleAuth>(value),
    );
  }
}

String _$appleAuthHash() => r'ffefa26d45fe4c4795c407e1d854ee163148c02b';
