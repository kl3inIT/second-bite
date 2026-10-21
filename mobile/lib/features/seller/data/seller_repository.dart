import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:second_bite/core/api.dart';

part 'seller_repository.g.dart';

/// A seller the signed-in person owns or works for.
typedef MySeller = ({String name, bool owner});

/// {@template seller_repository}
/// The sellers of the signed-in person, over the generated client.
/// {@endtemplate}
class SellerRepository {
  /// {@macro seller_repository}
  const new(this._api);

  final SecondBiteApi _api;

  /// The sellers the signed-in person owns or works for: account settings
  /// lists them, and the deletion warns an owner that theirs close (SEC-37).
  Future<List<MySeller>> mySellers() async {
    final answer = await _api.sellers.listMySellers();
    return [
      for (final seller in answer.sellers ?? const <SellerBody>[])
        (name: seller.name, owner: seller.myRole == SellerBodyMyRole.owner),
    ];
  }

  /// The names of the sellers the signed-in person owns, which close with
  /// their account.
  Future<List<String>> ownedSellerNames() async => [
    for (final seller in await mySellers())
      if (seller.owner) seller.name,
  ];
}

/// The [SellerRepository] over the app's one client.
@riverpod
SellerRepository sellerRepository(Ref ref) =>
    SellerRepository(ref.watch(apiProvider));
