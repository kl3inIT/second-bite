// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'kept_place.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// {@template kept_place}
/// The place the customer chose in the area sheet, kept so the app opens on
/// it next time, as the web keeps it in a cookie (customer place, step 3).
/// Null for every shop, the default.
/// {@endtemplate}

@ProviderFor(KeptPlace)
final keptPlaceProvider = KeptPlaceProvider._();

/// {@template kept_place}
/// The place the customer chose in the area sheet, kept so the app opens on
/// it next time, as the web keeps it in a cookie (customer place, step 3).
/// Null for every shop, the default.
/// {@endtemplate}
final class KeptPlaceProvider
    extends $AsyncNotifierProvider<KeptPlace, Place?> {
  /// {@template kept_place}
  /// The place the customer chose in the area sheet, kept so the app opens on
  /// it next time, as the web keeps it in a cookie (customer place, step 3).
  /// Null for every shop, the default.
  /// {@endtemplate}
  KeptPlaceProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'keptPlaceProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$keptPlaceHash();

  @$internal
  @override
  KeptPlace create() => KeptPlace();
}

String _$keptPlaceHash() => r'02a0e81cb0485e6e7d3fccbd6e6fe6915b87bed8';

/// {@template kept_place}
/// The place the customer chose in the area sheet, kept so the app opens on
/// it next time, as the web keeps it in a cookie (customer place, step 3).
/// Null for every shop, the default.
/// {@endtemplate}

abstract class _$KeptPlace extends $AsyncNotifier<Place?> {
  FutureOr<Place?> build();
  @$mustCallSuper
  @override
  WhenComplete runBuild() {
    final ref = this.ref as $Ref<AsyncValue<Place?>, Place?>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<AsyncValue<Place?>, Place?>,
              AsyncValue<Place?>,
              Object?,
              Object?
            >;
    return element.handleCreate(ref, build);
  }
}
