// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'preferences.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// What the app remembers on the phone that is no secret, as the web keeps
/// it in `localStorage`: the cart, the last contact, the follows, the recent
/// searches and the chosen place (SEC-204 › design 2). A session's token is
/// never here; it is in the secure store (SEC-43).

@ProviderFor(preferences)
final preferencesProvider = PreferencesProvider._();

/// What the app remembers on the phone that is no secret, as the web keeps
/// it in `localStorage`: the cart, the last contact, the follows, the recent
/// searches and the chosen place (SEC-204 › design 2). A session's token is
/// never here; it is in the secure store (SEC-43).

final class PreferencesProvider
    extends
        $FunctionalProvider<
          SharedPreferencesAsync,
          SharedPreferencesAsync,
          SharedPreferencesAsync
        >
    with $Provider<SharedPreferencesAsync> {
  /// What the app remembers on the phone that is no secret, as the web keeps
  /// it in `localStorage`: the cart, the last contact, the follows, the recent
  /// searches and the chosen place (SEC-204 › design 2). A session's token is
  /// never here; it is in the secure store (SEC-43).
  PreferencesProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'preferencesProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$preferencesHash();

  @$internal
  @override
  $ProviderElement<SharedPreferencesAsync> $createElement(
    $ProviderPointer pointer,
  ) => $ProviderElement(pointer);

  @override
  SharedPreferencesAsync create(Ref ref) {
    return preferences(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(SharedPreferencesAsync value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<SharedPreferencesAsync>(value),
    );
  }
}

String _$preferencesHash() => r'ce1b270fad38181583bfdeab2f508c8c25328b3f';
