// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'delete_account_screen.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// The names of the sellers the signed-in person owns, for the warning that
/// they close with the account.

@ProviderFor(ownedSellerNames)
final ownedSellerNamesProvider = OwnedSellerNamesProvider._();

/// The names of the sellers the signed-in person owns, for the warning that
/// they close with the account.

final class OwnedSellerNamesProvider
    extends
        $FunctionalProvider<
          AsyncValue<List<String>>,
          List<String>,
          FutureOr<List<String>>
        >
    with $FutureModifier<List<String>>, $FutureProvider<List<String>> {
  /// The names of the sellers the signed-in person owns, for the warning that
  /// they close with the account.
  OwnedSellerNamesProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
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

String _$ownedSellerNamesHash() => r'd02f1484f3d53c0ea1edfd126b08af8bb4266b9a';
