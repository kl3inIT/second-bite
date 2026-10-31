// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'payout_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$PayoutBody {

/// Discounts of its orders handed over in the week
 int get amountVnd; int get newCustomers; int get orders; String get sellerId; String get sellerName;/// When an admin marked the week paid; absent until then
 DateTime? get paidAt;/// The amount marked paid then
 int? get paidVnd;
/// Create a copy of PayoutBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$PayoutBodyCopyWith<PayoutBody> get copyWith => _$PayoutBodyCopyWithImpl<PayoutBody>(this as PayoutBody, _$identity);

  /// Serializes this PayoutBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as PayoutBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is PayoutBody&&(identical(other.amountVnd, _this.amountVnd) || other.amountVnd == _this.amountVnd)&&(identical(other.newCustomers, _this.newCustomers) || other.newCustomers == _this.newCustomers)&&(identical(other.orders, _this.orders) || other.orders == _this.orders)&&(identical(other.sellerId, _this.sellerId) || other.sellerId == _this.sellerId)&&(identical(other.sellerName, _this.sellerName) || other.sellerName == _this.sellerName)&&(identical(other.paidAt, _this.paidAt) || other.paidAt == _this.paidAt)&&(identical(other.paidVnd, _this.paidVnd) || other.paidVnd == _this.paidVnd));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as PayoutBody;
  return Object.hash(runtimeType,_this.amountVnd,_this.newCustomers,_this.orders,_this.sellerId,_this.sellerName,_this.paidAt,_this.paidVnd);
}

@override
String toString() {
  final _this = this as PayoutBody;
  return 'PayoutBody(amountVnd: ${_this.amountVnd}, newCustomers: ${_this.newCustomers}, orders: ${_this.orders}, sellerId: ${_this.sellerId}, sellerName: ${_this.sellerName}, paidAt: ${_this.paidAt}, paidVnd: ${_this.paidVnd})';
}


}

/// @nodoc
abstract mixin class $PayoutBodyCopyWith<$Res>  {
  factory $PayoutBodyCopyWith(PayoutBody value, $Res Function(PayoutBody) _then) = _$PayoutBodyCopyWithImpl;
@useResult
$Res call({
 int amountVnd, int newCustomers, int orders, String sellerId, String sellerName, DateTime? paidAt, int? paidVnd
});




}
/// @nodoc
class _$PayoutBodyCopyWithImpl<$Res>
    implements $PayoutBodyCopyWith<$Res> {
  _$PayoutBodyCopyWithImpl(this._self, this._then);

  final PayoutBody _self;
  final $Res Function(PayoutBody) _then;

/// Create a copy of PayoutBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? amountVnd = null,Object? newCustomers = null,Object? orders = null,Object? sellerId = null,Object? sellerName = null,Object? paidAt = freezed,Object? paidVnd = freezed,}) {
  return _then(PayoutBody(
amountVnd: null == amountVnd ? _self.amountVnd : amountVnd // ignore: cast_nullable_to_non_nullable
as int,newCustomers: null == newCustomers ? _self.newCustomers : newCustomers // ignore: cast_nullable_to_non_nullable
as int,orders: null == orders ? _self.orders : orders // ignore: cast_nullable_to_non_nullable
as int,sellerId: null == sellerId ? _self.sellerId : sellerId // ignore: cast_nullable_to_non_nullable
as String,sellerName: null == sellerName ? _self.sellerName : sellerName // ignore: cast_nullable_to_non_nullable
as String,paidAt: freezed == paidAt ? _self.paidAt : paidAt // ignore: cast_nullable_to_non_nullable
as DateTime?,paidVnd: freezed == paidVnd ? _self.paidVnd : paidVnd // ignore: cast_nullable_to_non_nullable
as int?,
  ));
}

}


/// Adds pattern-matching-related methods to [PayoutBody].
extension PayoutBodyPatterns on PayoutBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _PayoutBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _PayoutBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _PayoutBody value)  $default,){
final _that = this;
switch (_that) {
case _PayoutBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _PayoutBody value)?  $default,){
final _that = this;
switch (_that) {
case _PayoutBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int amountVnd,  int newCustomers,  int orders,  String sellerId,  String sellerName,  DateTime? paidAt,  int? paidVnd)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _PayoutBody() when $default != null:
return $default(_that.amountVnd,_that.newCustomers,_that.orders,_that.sellerId,_that.sellerName,_that.paidAt,_that.paidVnd);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int amountVnd,  int newCustomers,  int orders,  String sellerId,  String sellerName,  DateTime? paidAt,  int? paidVnd)  $default,) {final _that = this;
switch (_that) {
case _PayoutBody():
return $default(_that.amountVnd,_that.newCustomers,_that.orders,_that.sellerId,_that.sellerName,_that.paidAt,_that.paidVnd);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int amountVnd,  int newCustomers,  int orders,  String sellerId,  String sellerName,  DateTime? paidAt,  int? paidVnd)?  $default,) {final _that = this;
switch (_that) {
case _PayoutBody() when $default != null:
return $default(_that.amountVnd,_that.newCustomers,_that.orders,_that.sellerId,_that.sellerName,_that.paidAt,_that.paidVnd);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _PayoutBody implements PayoutBody {
  const _PayoutBody({required this.amountVnd, required this.newCustomers, required this.orders, required this.sellerId, required this.sellerName, this.paidAt, this.paidVnd});
  factory _PayoutBody.fromJson(Map<String, dynamic> json) => _$PayoutBodyFromJson(json);

/// Discounts of its orders handed over in the week
@override final  int amountVnd;
@override final  int newCustomers;
@override final  int orders;
@override final  String sellerId;
@override final  String sellerName;
/// When an admin marked the week paid; absent until then
@override final  DateTime? paidAt;
/// The amount marked paid then
@override final  int? paidVnd;

/// Create a copy of PayoutBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$PayoutBodyCopyWith<_PayoutBody> get copyWith => __$PayoutBodyCopyWithImpl<_PayoutBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$PayoutBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _PayoutBody&&(identical(other.amountVnd, amountVnd) || other.amountVnd == amountVnd)&&(identical(other.newCustomers, newCustomers) || other.newCustomers == newCustomers)&&(identical(other.orders, orders) || other.orders == orders)&&(identical(other.sellerId, sellerId) || other.sellerId == sellerId)&&(identical(other.sellerName, sellerName) || other.sellerName == sellerName)&&(identical(other.paidAt, paidAt) || other.paidAt == paidAt)&&(identical(other.paidVnd, paidVnd) || other.paidVnd == paidVnd));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,amountVnd,newCustomers,orders,sellerId,sellerName,paidAt,paidVnd);
}

@override
String toString() {
    return 'PayoutBody(amountVnd: $amountVnd, newCustomers: $newCustomers, orders: $orders, sellerId: $sellerId, sellerName: $sellerName, paidAt: $paidAt, paidVnd: $paidVnd)';
}


}

/// @nodoc
abstract mixin class _$PayoutBodyCopyWith<$Res> implements $PayoutBodyCopyWith<$Res> {
  factory _$PayoutBodyCopyWith(_PayoutBody value, $Res Function(_PayoutBody) _then) = __$PayoutBodyCopyWithImpl;
@override @useResult
$Res call({
 int amountVnd, int newCustomers, int orders, String sellerId, String sellerName, DateTime? paidAt, int? paidVnd
});




}
/// @nodoc
class __$PayoutBodyCopyWithImpl<$Res>
    implements _$PayoutBodyCopyWith<$Res> {
  __$PayoutBodyCopyWithImpl(this._self, this._then);

  final _PayoutBody _self;
  final $Res Function(_PayoutBody) _then;

/// Create a copy of PayoutBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? amountVnd = null,Object? newCustomers = null,Object? orders = null,Object? sellerId = null,Object? sellerName = null,Object? paidAt = freezed,Object? paidVnd = freezed,}) {
  return _then(_PayoutBody(
amountVnd: null == amountVnd ? _self.amountVnd : amountVnd // ignore: cast_nullable_to_non_nullable
as int,newCustomers: null == newCustomers ? _self.newCustomers : newCustomers // ignore: cast_nullable_to_non_nullable
as int,orders: null == orders ? _self.orders : orders // ignore: cast_nullable_to_non_nullable
as int,sellerId: null == sellerId ? _self.sellerId : sellerId // ignore: cast_nullable_to_non_nullable
as String,sellerName: null == sellerName ? _self.sellerName : sellerName // ignore: cast_nullable_to_non_nullable
as String,paidAt: freezed == paidAt ? _self.paidAt : paidAt // ignore: cast_nullable_to_non_nullable
as DateTime?,paidVnd: freezed == paidVnd ? _self.paidVnd : paidVnd // ignore: cast_nullable_to_non_nullable
as int?,
  ));
}


}

// dart format on
