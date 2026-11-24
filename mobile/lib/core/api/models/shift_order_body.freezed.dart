// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'shift_order_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$ShiftOrderBody {

/// The name copied on the order; empty once forgotten
 String get customer;/// The dishes, each with its portions when more than one
 String get dishes; int get number; DateTime get orderedAt;/// The phone copied on the order; empty once forgotten
 String get phone; ShiftOrderBodyStatus get status; String get store; int get units; DateTime get windowEnd; DateTime get windowStart;
/// Create a copy of ShiftOrderBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ShiftOrderBodyCopyWith<ShiftOrderBody> get copyWith => _$ShiftOrderBodyCopyWithImpl<ShiftOrderBody>(this as ShiftOrderBody, _$identity);

  /// Serializes this ShiftOrderBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as ShiftOrderBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ShiftOrderBody&&(identical(other.customer, _this.customer) || other.customer == _this.customer)&&(identical(other.dishes, _this.dishes) || other.dishes == _this.dishes)&&(identical(other.number, _this.number) || other.number == _this.number)&&(identical(other.orderedAt, _this.orderedAt) || other.orderedAt == _this.orderedAt)&&(identical(other.phone, _this.phone) || other.phone == _this.phone)&&(identical(other.status, _this.status) || other.status == _this.status)&&(identical(other.store, _this.store) || other.store == _this.store)&&(identical(other.units, _this.units) || other.units == _this.units)&&(identical(other.windowEnd, _this.windowEnd) || other.windowEnd == _this.windowEnd)&&(identical(other.windowStart, _this.windowStart) || other.windowStart == _this.windowStart));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as ShiftOrderBody;
  return Object.hash(runtimeType,_this.customer,_this.dishes,_this.number,_this.orderedAt,_this.phone,_this.status,_this.store,_this.units,_this.windowEnd,_this.windowStart);
}

@override
String toString() {
  final _this = this as ShiftOrderBody;
  return 'ShiftOrderBody(customer: ${_this.customer}, dishes: ${_this.dishes}, number: ${_this.number}, orderedAt: ${_this.orderedAt}, phone: ${_this.phone}, status: ${_this.status}, store: ${_this.store}, units: ${_this.units}, windowEnd: ${_this.windowEnd}, windowStart: ${_this.windowStart})';
}


}

/// @nodoc
abstract mixin class $ShiftOrderBodyCopyWith<$Res>  {
  factory $ShiftOrderBodyCopyWith(ShiftOrderBody value, $Res Function(ShiftOrderBody) _then) = _$ShiftOrderBodyCopyWithImpl;
@useResult
$Res call({
 String customer, String dishes, int number, DateTime orderedAt, String phone, ShiftOrderBodyStatus status, String store, int units, DateTime windowEnd, DateTime windowStart
});




}
/// @nodoc
class _$ShiftOrderBodyCopyWithImpl<$Res>
    implements $ShiftOrderBodyCopyWith<$Res> {
  _$ShiftOrderBodyCopyWithImpl(this._self, this._then);

  final ShiftOrderBody _self;
  final $Res Function(ShiftOrderBody) _then;

/// Create a copy of ShiftOrderBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? customer = null,Object? dishes = null,Object? number = null,Object? orderedAt = null,Object? phone = null,Object? status = null,Object? store = null,Object? units = null,Object? windowEnd = null,Object? windowStart = null,}) {
  return _then(ShiftOrderBody(
customer: null == customer ? _self.customer : customer // ignore: cast_nullable_to_non_nullable
as String,dishes: null == dishes ? _self.dishes : dishes // ignore: cast_nullable_to_non_nullable
as String,number: null == number ? _self.number : number // ignore: cast_nullable_to_non_nullable
as int,orderedAt: null == orderedAt ? _self.orderedAt : orderedAt // ignore: cast_nullable_to_non_nullable
as DateTime,phone: null == phone ? _self.phone : phone // ignore: cast_nullable_to_non_nullable
as String,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as ShiftOrderBodyStatus,store: null == store ? _self.store : store // ignore: cast_nullable_to_non_nullable
as String,units: null == units ? _self.units : units // ignore: cast_nullable_to_non_nullable
as int,windowEnd: null == windowEnd ? _self.windowEnd : windowEnd // ignore: cast_nullable_to_non_nullable
as DateTime,windowStart: null == windowStart ? _self.windowStart : windowStart // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}

}


/// Adds pattern-matching-related methods to [ShiftOrderBody].
extension ShiftOrderBodyPatterns on ShiftOrderBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ShiftOrderBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ShiftOrderBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ShiftOrderBody value)  $default,){
final _that = this;
switch (_that) {
case _ShiftOrderBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ShiftOrderBody value)?  $default,){
final _that = this;
switch (_that) {
case _ShiftOrderBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String customer,  String dishes,  int number,  DateTime orderedAt,  String phone,  ShiftOrderBodyStatus status,  String store,  int units,  DateTime windowEnd,  DateTime windowStart)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ShiftOrderBody() when $default != null:
return $default(_that.customer,_that.dishes,_that.number,_that.orderedAt,_that.phone,_that.status,_that.store,_that.units,_that.windowEnd,_that.windowStart);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String customer,  String dishes,  int number,  DateTime orderedAt,  String phone,  ShiftOrderBodyStatus status,  String store,  int units,  DateTime windowEnd,  DateTime windowStart)  $default,) {final _that = this;
switch (_that) {
case _ShiftOrderBody():
return $default(_that.customer,_that.dishes,_that.number,_that.orderedAt,_that.phone,_that.status,_that.store,_that.units,_that.windowEnd,_that.windowStart);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String customer,  String dishes,  int number,  DateTime orderedAt,  String phone,  ShiftOrderBodyStatus status,  String store,  int units,  DateTime windowEnd,  DateTime windowStart)?  $default,) {final _that = this;
switch (_that) {
case _ShiftOrderBody() when $default != null:
return $default(_that.customer,_that.dishes,_that.number,_that.orderedAt,_that.phone,_that.status,_that.store,_that.units,_that.windowEnd,_that.windowStart);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ShiftOrderBody implements ShiftOrderBody {
  const _ShiftOrderBody({required this.customer, required this.dishes, required this.number, required this.orderedAt, required this.phone, required this.status, required this.store, required this.units, required this.windowEnd, required this.windowStart});
  factory _ShiftOrderBody.fromJson(Map<String, dynamic> json) => _$ShiftOrderBodyFromJson(json);

/// The name copied on the order; empty once forgotten
@override final  String customer;
/// The dishes, each with its portions when more than one
@override final  String dishes;
@override final  int number;
@override final  DateTime orderedAt;
/// The phone copied on the order; empty once forgotten
@override final  String phone;
@override final  ShiftOrderBodyStatus status;
@override final  String store;
@override final  int units;
@override final  DateTime windowEnd;
@override final  DateTime windowStart;

/// Create a copy of ShiftOrderBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ShiftOrderBodyCopyWith<_ShiftOrderBody> get copyWith => __$ShiftOrderBodyCopyWithImpl<_ShiftOrderBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ShiftOrderBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _ShiftOrderBody&&(identical(other.customer, customer) || other.customer == customer)&&(identical(other.dishes, dishes) || other.dishes == dishes)&&(identical(other.number, number) || other.number == number)&&(identical(other.orderedAt, orderedAt) || other.orderedAt == orderedAt)&&(identical(other.phone, phone) || other.phone == phone)&&(identical(other.status, status) || other.status == status)&&(identical(other.store, store) || other.store == store)&&(identical(other.units, units) || other.units == units)&&(identical(other.windowEnd, windowEnd) || other.windowEnd == windowEnd)&&(identical(other.windowStart, windowStart) || other.windowStart == windowStart));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,customer,dishes,number,orderedAt,phone,status,store,units,windowEnd,windowStart);
}

@override
String toString() {
    return 'ShiftOrderBody(customer: $customer, dishes: $dishes, number: $number, orderedAt: $orderedAt, phone: $phone, status: $status, store: $store, units: $units, windowEnd: $windowEnd, windowStart: $windowStart)';
}


}

/// @nodoc
abstract mixin class _$ShiftOrderBodyCopyWith<$Res> implements $ShiftOrderBodyCopyWith<$Res> {
  factory _$ShiftOrderBodyCopyWith(_ShiftOrderBody value, $Res Function(_ShiftOrderBody) _then) = __$ShiftOrderBodyCopyWithImpl;
@override @useResult
$Res call({
 String customer, String dishes, int number, DateTime orderedAt, String phone, ShiftOrderBodyStatus status, String store, int units, DateTime windowEnd, DateTime windowStart
});




}
/// @nodoc
class __$ShiftOrderBodyCopyWithImpl<$Res>
    implements _$ShiftOrderBodyCopyWith<$Res> {
  __$ShiftOrderBodyCopyWithImpl(this._self, this._then);

  final _ShiftOrderBody _self;
  final $Res Function(_ShiftOrderBody) _then;

/// Create a copy of ShiftOrderBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? customer = null,Object? dishes = null,Object? number = null,Object? orderedAt = null,Object? phone = null,Object? status = null,Object? store = null,Object? units = null,Object? windowEnd = null,Object? windowStart = null,}) {
  return _then(_ShiftOrderBody(
customer: null == customer ? _self.customer : customer // ignore: cast_nullable_to_non_nullable
as String,dishes: null == dishes ? _self.dishes : dishes // ignore: cast_nullable_to_non_nullable
as String,number: null == number ? _self.number : number // ignore: cast_nullable_to_non_nullable
as int,orderedAt: null == orderedAt ? _self.orderedAt : orderedAt // ignore: cast_nullable_to_non_nullable
as DateTime,phone: null == phone ? _self.phone : phone // ignore: cast_nullable_to_non_nullable
as String,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as ShiftOrderBodyStatus,store: null == store ? _self.store : store // ignore: cast_nullable_to_non_nullable
as String,units: null == units ? _self.units : units // ignore: cast_nullable_to_non_nullable
as int,windowEnd: null == windowEnd ? _self.windowEnd : windowEnd // ignore: cast_nullable_to_non_nullable
as DateTime,windowStart: null == windowStart ? _self.windowStart : windowStart // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}


}

// dart format on
