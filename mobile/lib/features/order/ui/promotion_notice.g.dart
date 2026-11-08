// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'promotion_notice.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// The promotions running for the stores named in [sellerIds], a comma
/// separated list so the provider is keyed by a plain value.

@ProviderFor(runningPromotions)
final runningPromotionsProvider = RunningPromotionsFamily._();

/// The promotions running for the stores named in [sellerIds], a comma
/// separated list so the provider is keyed by a plain value.

final class RunningPromotionsProvider
    extends
        $FunctionalProvider<
          AsyncValue<List<RunningPromotionBody>>,
          List<RunningPromotionBody>,
          FutureOr<List<RunningPromotionBody>>
        >
    with
        $FutureModifier<List<RunningPromotionBody>>,
        $FutureProvider<List<RunningPromotionBody>> {
  /// The promotions running for the stores named in [sellerIds], a comma
  /// separated list so the provider is keyed by a plain value.
  RunningPromotionsProvider._({
    required RunningPromotionsFamily super.from,
    required String super.argument,
  }) : super(
         retry: _never,
         name: r'runningPromotionsProvider',
         isAutoDispose: true,
         dependencies: null,
         $allTransitiveDependencies: null,
       );

  @override
  String debugGetCreateSourceHash() => _$runningPromotionsHash();

  @override
  String toString() {
    return r'runningPromotionsProvider'
        ''
        '($argument)';
  }

  @$internal
  @override
  $FutureProviderElement<List<RunningPromotionBody>> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<List<RunningPromotionBody>> create(Ref ref) {
    final argument = this.argument as String;
    return runningPromotions(ref, argument);
  }

  @override
  bool operator ==(Object other) {
    return other is RunningPromotionsProvider && other.argument == argument;
  }

  @override
  int get hashCode {
    return argument.hashCode;
  }
}

String _$runningPromotionsHash() => r'c10ee1c6d52e2363f2735d6891fcb03bcbbf68a7';

/// The promotions running for the stores named in [sellerIds], a comma
/// separated list so the provider is keyed by a plain value.

final class RunningPromotionsFamily extends $Family
    with
        $FunctionalFamilyOverride<
          FutureOr<List<RunningPromotionBody>>,
          String
        > {
  RunningPromotionsFamily._()
    : super(
        retry: _never,
        name: r'runningPromotionsProvider',
        dependencies: null,
        $allTransitiveDependencies: null,
        isAutoDispose: true,
      );

  /// The promotions running for the stores named in [sellerIds], a comma
  /// separated list so the provider is keyed by a plain value.

  RunningPromotionsProvider call(String sellerIds) =>
      RunningPromotionsProvider._(argument: sellerIds, from: this);

  @override
  String toString() => r'runningPromotionsProvider';
}
