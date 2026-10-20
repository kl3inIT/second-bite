// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'account_settings_screen.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// The sellers the signed-in person owns or works for.

@ProviderFor(mySellers)
final mySellersProvider = MySellersProvider._();

/// The sellers the signed-in person owns or works for.

final class MySellersProvider
    extends
        $FunctionalProvider<
          AsyncValue<List<MySeller>>,
          List<MySeller>,
          FutureOr<List<MySeller>>
        >
    with $FutureModifier<List<MySeller>>, $FutureProvider<List<MySeller>> {
  /// The sellers the signed-in person owns or works for.
  MySellersProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'mySellersProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$mySellersHash();

  @$internal
  @override
  $FutureProviderElement<List<MySeller>> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<List<MySeller>> create(Ref ref) {
    return mySellers(ref);
  }
}

String _$mySellersHash() => r'c475dbc3556b091c761948c97430af370df3b3d0';
