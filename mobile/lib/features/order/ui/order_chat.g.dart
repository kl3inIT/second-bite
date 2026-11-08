// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'order_chat.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// [orderId]'s chat as its page reads it, with the order's [access] when it
/// was placed without an account.

@ProviderFor(orderChat)
final orderChatProvider = OrderChatFamily._();

/// [orderId]'s chat as its page reads it, with the order's [access] when it
/// was placed without an account.

final class OrderChatProvider
    extends
        $FunctionalProvider<
          AsyncValue<MessagesOutputBody>,
          MessagesOutputBody,
          FutureOr<MessagesOutputBody>
        >
    with
        $FutureModifier<MessagesOutputBody>,
        $FutureProvider<MessagesOutputBody> {
  /// [orderId]'s chat as its page reads it, with the order's [access] when it
  /// was placed without an account.
  OrderChatProvider._({
    required OrderChatFamily super.from,
    required (String, String?) super.argument,
  }) : super(
         retry: _never,
         name: r'orderChatProvider',
         isAutoDispose: true,
         dependencies: null,
         $allTransitiveDependencies: null,
       );

  @override
  String debugGetCreateSourceHash() => _$orderChatHash();

  @override
  String toString() {
    return r'orderChatProvider'
        ''
        '$argument';
  }

  @$internal
  @override
  $FutureProviderElement<MessagesOutputBody> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<MessagesOutputBody> create(Ref ref) {
    final argument = this.argument as (String, String?);
    return orderChat(ref, argument.$1, argument.$2);
  }

  @override
  bool operator ==(Object other) {
    return other is OrderChatProvider && other.argument == argument;
  }

  @override
  int get hashCode {
    return argument.hashCode;
  }
}

String _$orderChatHash() => r'd561f346e6705e375578592c116e17f19a1f1907';

/// [orderId]'s chat as its page reads it, with the order's [access] when it
/// was placed without an account.

final class OrderChatFamily extends $Family
    with
        $FunctionalFamilyOverride<
          FutureOr<MessagesOutputBody>,
          (String, String?)
        > {
  OrderChatFamily._()
    : super(
        retry: _never,
        name: r'orderChatProvider',
        dependencies: null,
        $allTransitiveDependencies: null,
        isAutoDispose: true,
      );

  /// [orderId]'s chat as its page reads it, with the order's [access] when it
  /// was placed without an account.

  OrderChatProvider call(String orderId, String? access) =>
      OrderChatProvider._(argument: (orderId, access), from: this);

  @override
  String toString() => r'orderChatProvider';
}
