// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'delete_account_screen.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// The names of the sellers the signed-in person owns, for the warning that
/// they close with the account. The code is not sent until they are read
/// (SEC-69).

@ProviderFor(ownedSellerNames)
final ownedSellerNamesProvider = OwnedSellerNamesProvider._();

/// The names of the sellers the signed-in person owns, for the warning that
/// they close with the account. The code is not sent until they are read
/// (SEC-69).

final class OwnedSellerNamesProvider
    extends
        $FunctionalProvider<
          AsyncValue<List<String>>,
          List<String>,
          FutureOr<List<String>>
        >
    with $FutureModifier<List<String>>, $FutureProvider<List<String>> {
  /// The names of the sellers the signed-in person owns, for the warning that
  /// they close with the account. The code is not sent until they are read
  /// (SEC-69).
  OwnedSellerNamesProvider._()
    : super(
        from: null,
        argument: null,
        retry: _never,
        name: r'ownedSellerNamesProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$ownedSellerNamesHash();

  @$internal
  @override
  $FutureProviderElement<List<String>> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<List<String>> create(Ref ref) {
    return ownedSellerNames(ref);
  }
}

String _$ownedSellerNamesHash() => r'776017ccf718d35121c1a7ca9595e8144806b529';
