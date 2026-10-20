import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:second_bite/core/api.dart';

part 'seller_repository.g.dart';

/// {@template seller_repository}
/// The sellers of the signed-in person, over the generated client.
/// {@endtemplate}
class SellerRepository {
  /// {@macro seller_repository}
  const new(this._api);

  final SecondBiteApi _api;

  /// The names of the sellers the signed-in person owns, which close with
  /// their account (SEC-37).
  Future<List<String>> ownedSellerNames() async {
    final answer = await _api.sellers.listMySellers();
    return [
      for (final seller in answer.sellers ?? const <SellerBody>[])
        if (seller.myRole == SellerBodyMyRole.owner) seller.name,
    ];
  }
}

/// The [SellerRepository] over the app's one client.
@riverpod
SellerRepository sellerRepository(Ref ref) =>
    SellerRepository(ref.watch(apiProvider));
