// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'google_auth.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// The app's one [GoogleAuth].

@ProviderFor(googleAuth)
final googleAuthProvider = GoogleAuthProvider._();

/// The app's one [GoogleAuth].

final class GoogleAuthProvider
    extends $FunctionalProvider<GoogleAuth, GoogleAuth, GoogleAuth>
    with $Provider<GoogleAuth> {
  /// The app's one [GoogleAuth].
  GoogleAuthProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'googleAuthProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$googleAuthHash();

  @$internal
  @override
  $ProviderElement<GoogleAuth> $createElement($ProviderPointer pointer) =>
      $ProviderElement(pointer);

  @override
  GoogleAuth create(Ref ref) {
    return googleAuth(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(GoogleAuth value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<GoogleAuth>(value),
    );
  }
}

String _$googleAuthHash() => r'f714910b4a58b2f3c17445662145d26f4d06c8af';
