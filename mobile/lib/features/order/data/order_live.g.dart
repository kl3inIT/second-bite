// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'order_live.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// The app's one [LiveClient] (SEC-204 › design 5): it mints with the
/// app's client and the kept accesses, and is paused while the app is in
/// the background and resumed when it comes back.

@ProviderFor(liveClient)
final liveClientProvider = LiveClientProvider._();

/// The app's one [LiveClient] (SEC-204 › design 5): it mints with the
/// app's client and the kept accesses, and is paused while the app is in
/// the background and resumed when it comes back.

final class LiveClientProvider
    extends $FunctionalProvider<LiveClient, LiveClient, LiveClient>
    with $Provider<LiveClient> {
  /// The app's one [LiveClient] (SEC-204 › design 5): it mints with the
  /// app's client and the kept accesses, and is paused while the app is in
  /// the background and resumed when it comes back.
  LiveClientProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'liveClientProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$liveClientHash();

  @$internal
  @override
  $ProviderElement<LiveClient> $createElement($ProviderPointer pointer) =>
      $ProviderElement(pointer);

  @override
  LiveClient create(Ref ref) {
    return liveClient(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(LiveClient value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<LiveClient>(value),
    );
  }
}

String _$liveClientHash() => r'8307c6f3c66bcc166fa5ed89edd024950e8ad6d1';
