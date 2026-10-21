// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'orders_output_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$OrdersOutputBody {

 List<OrderBody> get orders;
/// Create a copy of OrdersOutputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$OrdersOutputBodyCopyWith<OrdersOutputBody> get copyWith => _$OrdersOutputBodyCopyWithImpl<OrdersOutputBody>(this as OrdersOutputBody, _$identity);

  /// Serializes this OrdersOutputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as OrdersOutputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is OrdersOutputBody&&const DeepCollectionEquality().equals(other.orders, _this.orders));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as OrdersOutputBody;
  return Object.hash(runtimeType,const DeepCollectionEquality().hash(_this.orders));
}

@override
String toString() {
  final _this = this as OrdersOutputBody;
  return 'OrdersOutputBody(orders: ${_this.orders})';
}


}

/// @nodoc
abstract mixin class $OrdersOutputBodyCopyWith<$Res>  {
  factory $OrdersOutputBodyCopyWith(OrdersOutputBody value, $Res Function(OrdersOutputBody) _then) = _$OrdersOutputBodyCopyWithImpl;
@useResult
$Res call({
 List<OrderBody> orders
});




}
/// @nodoc
class _$OrdersOutputBodyCopyWithImpl<$Res>
    implements $OrdersOutputBodyCopyWith<$Res> {
  _$OrdersOutputBodyCopyWithImpl(this._self, this._then);

  final OrdersOutputBody _self;
  final $Res Function(OrdersOutputBody) _then;

/// Create a copy of OrdersOutputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? orders = null,}) {
  return _then(OrdersOutputBody(
orders: null == orders ? _self.orders : orders // ignore: cast_nullable_to_non_nullable
as List<OrderBody>,
  ));
}

}


/// Adds pattern-matching-related methods to [OrdersOutputBody].
extension OrdersOutputBodyPatterns on OrdersOutputBody {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _OrdersOutputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _OrdersOutputBody() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _OrdersOutputBody value)  $default,){
final _that = this;
switch (_that) {
case _OrdersOutputBody():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _OrdersOutputBody value)?  $default,){
final _that = this;
switch (_that) {
case _OrdersOutputBody() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( List<OrderBody> orders)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _OrdersOutputBody() when $default != null:
return $default(_that.orders);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( List<OrderBody> orders)  $default,) {final _that = this;
switch (_that) {
case _OrdersOutputBody():
return $default(_that.orders);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( List<OrderBody> orders)?  $default,) {final _that = this;
switch (_that) {
case _OrdersOutputBody() when $default != null:
return $default(_that.orders);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _OrdersOutputBody implements OrdersOutputBody {
  const _OrdersOutputBody({required  List<OrderBody> orders}): _orders = orders;
  factory _OrdersOutputBody.fromJson(Map<String, dynamic> json) => _$OrdersOutputBodyFromJson(json);

 final  List<OrderBody> _orders;
@override List<OrderBody> get orders {
  if (_orders is EqualUnmodifiableListView) return _orders;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_orders);
}


/// Create a copy of OrdersOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$OrdersOutputBodyCopyWith<_OrdersOutputBody> get copyWith => __$OrdersOutputBodyCopyWithImpl<_OrdersOutputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$OrdersOutputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _OrdersOutputBody&&const DeepCollectionEquality().equals(other.orders, _orders));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,const DeepCollectionEquality().hash(_orders));
}

@override
String toString() {
    return 'OrdersOutputBody(orders: $orders)';
}


}

/// @nodoc
abstract mixin class _$OrdersOutputBodyCopyWith<$Res> implements $OrdersOutputBodyCopyWith<$Res> {
  factory _$OrdersOutputBodyCopyWith(_OrdersOutputBody value, $Res Function(_OrdersOutputBody) _then) = __$OrdersOutputBodyCopyWithImpl;
@override @useResult
$Res call({
 List<OrderBody> orders
});




}
/// @nodoc
class __$OrdersOutputBodyCopyWithImpl<$Res>
    implements _$OrdersOutputBodyCopyWith<$Res> {
  __$OrdersOutputBodyCopyWithImpl(this._self, this._then);

  final _OrdersOutputBody _self;
  final $Res Function(_OrdersOutputBody) _then;

/// Create a copy of OrdersOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? orders = null,}) {
  return _then(_OrdersOutputBody(
orders: null == orders ? _self._orders : orders // ignore: cast_nullable_to_non_nullable
as List<OrderBody>,
  ));
}


}

// dart format on
