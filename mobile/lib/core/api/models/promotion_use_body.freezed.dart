// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'promotion_use_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$PromotionUseBody {

/// Discounts of the orders still to collect; given back when they are cancelled, refused or expire
 int get heldVnd;/// budgetVnd less spentVnd and heldVnd
 int get leftVnd;/// Of those, the orders of a new customer
 int get newCustomers;/// Orders still to collect or handed over that took a discount
 int get orders;/// Sellers whose orders took a discount
 int get sellers;/// Discounts of the orders handed over
 int get spentVnd;
/// Create a copy of PromotionUseBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$PromotionUseBodyCopyWith<PromotionUseBody> get copyWith => _$PromotionUseBodyCopyWithImpl<PromotionUseBody>(this as PromotionUseBody, _$identity);

  /// Serializes this PromotionUseBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as PromotionUseBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is PromotionUseBody&&(identical(other.heldVnd, _this.heldVnd) || other.heldVnd == _this.heldVnd)&&(identical(other.leftVnd, _this.leftVnd) || other.leftVnd == _this.leftVnd)&&(identical(other.newCustomers, _this.newCustomers) || other.newCustomers == _this.newCustomers)&&(identical(other.orders, _this.orders) || other.orders == _this.orders)&&(identical(other.sellers, _this.sellers) || other.sellers == _this.sellers)&&(identical(other.spentVnd, _this.spentVnd) || other.spentVnd == _this.spentVnd));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as PromotionUseBody;
  return Object.hash(runtimeType,_this.heldVnd,_this.leftVnd,_this.newCustomers,_this.orders,_this.sellers,_this.spentVnd);
}

@override
String toString() {
  final _this = this as PromotionUseBody;
  return 'PromotionUseBody(heldVnd: ${_this.heldVnd}, leftVnd: ${_this.leftVnd}, newCustomers: ${_this.newCustomers}, orders: ${_this.orders}, sellers: ${_this.sellers}, spentVnd: ${_this.spentVnd})';
}


}

/// @nodoc
abstract mixin class $PromotionUseBodyCopyWith<$Res>  {
  factory $PromotionUseBodyCopyWith(PromotionUseBody value, $Res Function(PromotionUseBody) _then) = _$PromotionUseBodyCopyWithImpl;
@useResult
$Res call({
 int heldVnd, int leftVnd, int newCustomers, int orders, int sellers, int spentVnd
});




}
/// @nodoc
class _$PromotionUseBodyCopyWithImpl<$Res>
    implements $PromotionUseBodyCopyWith<$Res> {
  _$PromotionUseBodyCopyWithImpl(this._self, this._then);

  final PromotionUseBody _self;
  final $Res Function(PromotionUseBody) _then;

/// Create a copy of PromotionUseBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? heldVnd = null,Object? leftVnd = null,Object? newCustomers = null,Object? orders = null,Object? sellers = null,Object? spentVnd = null,}) {
  return _then(PromotionUseBody(
heldVnd: null == heldVnd ? _self.heldVnd : heldVnd // ignore: cast_nullable_to_non_nullable
as int,leftVnd: null == leftVnd ? _self.leftVnd : leftVnd // ignore: cast_nullable_to_non_nullable
as int,newCustomers: null == newCustomers ? _self.newCustomers : newCustomers // ignore: cast_nullable_to_non_nullable
as int,orders: null == orders ? _self.orders : orders // ignore: cast_nullable_to_non_nullable
as int,sellers: null == sellers ? _self.sellers : sellers // ignore: cast_nullable_to_non_nullable
as int,spentVnd: null == spentVnd ? _self.spentVnd : spentVnd // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [PromotionUseBody].
extension PromotionUseBodyPatterns on PromotionUseBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _PromotionUseBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _PromotionUseBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _PromotionUseBody value)  $default,){
final _that = this;
switch (_that) {
case _PromotionUseBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _PromotionUseBody value)?  $default,){
final _that = this;
switch (_that) {
case _PromotionUseBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int heldVnd,  int leftVnd,  int newCustomers,  int orders,  int sellers,  int spentVnd)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _PromotionUseBody() when $default != null:
return $default(_that.heldVnd,_that.leftVnd,_that.newCustomers,_that.orders,_that.sellers,_that.spentVnd);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int heldVnd,  int leftVnd,  int newCustomers,  int orders,  int sellers,  int spentVnd)  $default,) {final _that = this;
switch (_that) {
case _PromotionUseBody():
return $default(_that.heldVnd,_that.leftVnd,_that.newCustomers,_that.orders,_that.sellers,_that.spentVnd);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int heldVnd,  int leftVnd,  int newCustomers,  int orders,  int sellers,  int spentVnd)?  $default,) {final _that = this;
switch (_that) {
case _PromotionUseBody() when $default != null:
return $default(_that.heldVnd,_that.leftVnd,_that.newCustomers,_that.orders,_that.sellers,_that.spentVnd);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _PromotionUseBody implements PromotionUseBody {
  const _PromotionUseBody({required this.heldVnd, required this.leftVnd, required this.newCustomers, required this.orders, required this.sellers, required this.spentVnd});
  factory _PromotionUseBody.fromJson(Map<String, dynamic> json) => _$PromotionUseBodyFromJson(json);

/// Discounts of the orders still to collect; given back when they are cancelled, refused or expire
@override final  int heldVnd;
/// budgetVnd less spentVnd and heldVnd
@override final  int leftVnd;
/// Of those, the orders of a new customer
@override final  int newCustomers;
/// Orders still to collect or handed over that took a discount
@override final  int orders;
/// Sellers whose orders took a discount
@override final  int sellers;
/// Discounts of the orders handed over
@override final  int spentVnd;

/// Create a copy of PromotionUseBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$PromotionUseBodyCopyWith<_PromotionUseBody> get copyWith => __$PromotionUseBodyCopyWithImpl<_PromotionUseBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$PromotionUseBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _PromotionUseBody&&(identical(other.heldVnd, heldVnd) || other.heldVnd == heldVnd)&&(identical(other.leftVnd, leftVnd) || other.leftVnd == leftVnd)&&(identical(other.newCustomers, newCustomers) || other.newCustomers == newCustomers)&&(identical(other.orders, orders) || other.orders == orders)&&(identical(other.sellers, sellers) || other.sellers == sellers)&&(identical(other.spentVnd, spentVnd) || other.spentVnd == spentVnd));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,heldVnd,leftVnd,newCustomers,orders,sellers,spentVnd);
}

@override
String toString() {
    return 'PromotionUseBody(heldVnd: $heldVnd, leftVnd: $leftVnd, newCustomers: $newCustomers, orders: $orders, sellers: $sellers, spentVnd: $spentVnd)';
}


}

/// @nodoc
abstract mixin class _$PromotionUseBodyCopyWith<$Res> implements $PromotionUseBodyCopyWith<$Res> {
  factory _$PromotionUseBodyCopyWith(_PromotionUseBody value, $Res Function(_PromotionUseBody) _then) = __$PromotionUseBodyCopyWithImpl;
@override @useResult
$Res call({
 int heldVnd, int leftVnd, int newCustomers, int orders, int sellers, int spentVnd
});




}
/// @nodoc
class __$PromotionUseBodyCopyWithImpl<$Res>
    implements _$PromotionUseBodyCopyWith<$Res> {
  __$PromotionUseBodyCopyWithImpl(this._self, this._then);

  final _PromotionUseBody _self;
  final $Res Function(_PromotionUseBody) _then;

/// Create a copy of PromotionUseBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? heldVnd = null,Object? leftVnd = null,Object? newCustomers = null,Object? orders = null,Object? sellers = null,Object? spentVnd = null,}) {
  return _then(_PromotionUseBody(
heldVnd: null == heldVnd ? _self.heldVnd : heldVnd // ignore: cast_nullable_to_non_nullable
as int,leftVnd: null == leftVnd ? _self.leftVnd : leftVnd // ignore: cast_nullable_to_non_nullable
as int,newCustomers: null == newCustomers ? _self.newCustomers : newCustomers // ignore: cast_nullable_to_non_nullable
as int,orders: null == orders ? _self.orders : orders // ignore: cast_nullable_to_non_nullable
as int,sellers: null == sellers ? _self.sellers : sellers // ignore: cast_nullable_to_non_nullable
as int,spentVnd: null == spentVnd ? _self.spentVnd : spentVnd // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
