// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'current_account.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// {@template current_account}
/// Who is signed in, for every screen: null for no one. It reads the kept
/// session when the app starts, follows sign-in and sign-out, and turns to
/// null when the server refuses the token.
/// {@endtemplate}

@ProviderFor(CurrentAccount)
final currentAccountProvider = CurrentAccountProvider._();

/// {@template current_account}
/// Who is signed in, for every screen: null for no one. It reads the kept
/// session when the app starts, follows sign-in and sign-out, and turns to
/// null when the server refuses the token.
/// {@endtemplate}
final class CurrentAccountProvider
    extends $AsyncNotifierProvider<CurrentAccount, AccountBody?> {
  /// {@template current_account}
  /// Who is signed in, for every screen: null for no one. It reads the kept
  /// session when the app starts, follows sign-in and sign-out, and turns to
  /// null when the server refuses the token.
  /// {@endtemplate}
  CurrentAccountProvider._()
    : super(
        from: null,
        argument: null,
        retry: _never,
        name: r'currentAccountProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$currentAccountHash();

  @$internal
  @override
  CurrentAccount create() => CurrentAccount();
}

String _$currentAccountHash() => r'84f429d32acecb55eb2834c5fc67653292faf43a';

/// {@template current_account}
/// Who is signed in, for every screen: null for no one. It reads the kept
/// session when the app starts, follows sign-in and sign-out, and turns to
/// null when the server refuses the token.
/// {@endtemplate}

abstract class _$CurrentAccount extends $AsyncNotifier<AccountBody?> {
  FutureOr<AccountBody?> build();
  @$mustCallSuper
  @override
  WhenComplete runBuild() {
    final ref = this.ref as $Ref<AsyncValue<AccountBody?>, AccountBody?>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<AsyncValue<AccountBody?>, AccountBody?>,
              AsyncValue<AccountBody?>,
              Object?,
              Object?
            >;
    return element.handleCreate(ref, build);
  }
}
