// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'shift_summary_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$ShiftSummaryBody {

/// Orders, however they ended
 int get orders;/// Stores with a post or an order
 int get stores;/// Portions handed over
 int get unitsCollected;/// Portions the store refused or whose window ended without a hand-over; an order cancelled by its customer is in neither
 int get unitsNotCollected;/// Portions of the offers posted for it, whatever became of them
 int get unitsPosted;
/// Create a copy of ShiftSummaryBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ShiftSummaryBodyCopyWith<ShiftSummaryBody> get copyWith => _$ShiftSummaryBodyCopyWithImpl<ShiftSummaryBody>(this as ShiftSummaryBody, _$identity);

  /// Serializes this ShiftSummaryBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as ShiftSummaryBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ShiftSummaryBody&&(identical(other.orders, _this.orders) || other.orders == _this.orders)&&(identical(other.stores, _this.stores) || other.stores == _this.stores)&&(identical(other.unitsCollected, _this.unitsCollected) || other.unitsCollected == _this.unitsCollected)&&(identical(other.unitsNotCollected, _this.unitsNotCollected) || other.unitsNotCollected == _this.unitsNotCollected)&&(identical(other.unitsPosted, _this.unitsPosted) || other.unitsPosted == _this.unitsPosted));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as ShiftSummaryBody;
  return Object.hash(runtimeType,_this.orders,_this.stores,_this.unitsCollected,_this.unitsNotCollected,_this.unitsPosted);
}

@override
String toString() {
  final _this = this as ShiftSummaryBody;
  return 'ShiftSummaryBody(orders: ${_this.orders}, stores: ${_this.stores}, unitsCollected: ${_this.unitsCollected}, unitsNotCollected: ${_this.unitsNotCollected}, unitsPosted: ${_this.unitsPosted})';
}


}

/// @nodoc
abstract mixin class $ShiftSummaryBodyCopyWith<$Res>  {
  factory $ShiftSummaryBodyCopyWith(ShiftSummaryBody value, $Res Function(ShiftSummaryBody) _then) = _$ShiftSummaryBodyCopyWithImpl;
@useResult
$Res call({
 int orders, int stores, int unitsCollected, int unitsNotCollected, int unitsPosted
});




}
/// @nodoc
class _$ShiftSummaryBodyCopyWithImpl<$Res>
    implements $ShiftSummaryBodyCopyWith<$Res> {
  _$ShiftSummaryBodyCopyWithImpl(this._self, this._then);

  final ShiftSummaryBody _self;
  final $Res Function(ShiftSummaryBody) _then;

/// Create a copy of ShiftSummaryBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? orders = null,Object? stores = null,Object? unitsCollected = null,Object? unitsNotCollected = null,Object? unitsPosted = null,}) {
  return _then(ShiftSummaryBody(
orders: null == orders ? _self.orders : orders // ignore: cast_nullable_to_non_nullable
as int,stores: null == stores ? _self.stores : stores // ignore: cast_nullable_to_non_nullable
as int,unitsCollected: null == unitsCollected ? _self.unitsCollected : unitsCollected // ignore: cast_nullable_to_non_nullable
as int,unitsNotCollected: null == unitsNotCollected ? _self.unitsNotCollected : unitsNotCollected // ignore: cast_nullable_to_non_nullable
as int,unitsPosted: null == unitsPosted ? _self.unitsPosted : unitsPosted // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [ShiftSummaryBody].
extension ShiftSummaryBodyPatterns on ShiftSummaryBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ShiftSummaryBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ShiftSummaryBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ShiftSummaryBody value)  $default,){
final _that = this;
switch (_that) {
case _ShiftSummaryBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ShiftSummaryBody value)?  $default,){
final _that = this;
switch (_that) {
case _ShiftSummaryBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int orders,  int stores,  int unitsCollected,  int unitsNotCollected,  int unitsPosted)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ShiftSummaryBody() when $default != null:
return $default(_that.orders,_that.stores,_that.unitsCollected,_that.unitsNotCollected,_that.unitsPosted);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int orders,  int stores,  int unitsCollected,  int unitsNotCollected,  int unitsPosted)  $default,) {final _that = this;
switch (_that) {
case _ShiftSummaryBody():
return $default(_that.orders,_that.stores,_that.unitsCollected,_that.unitsNotCollected,_that.unitsPosted);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int orders,  int stores,  int unitsCollected,  int unitsNotCollected,  int unitsPosted)?  $default,) {final _that = this;
switch (_that) {
case _ShiftSummaryBody() when $default != null:
return $default(_that.orders,_that.stores,_that.unitsCollected,_that.unitsNotCollected,_that.unitsPosted);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ShiftSummaryBody implements ShiftSummaryBody {
  const _ShiftSummaryBody({required this.orders, required this.stores, required this.unitsCollected, required this.unitsNotCollected, required this.unitsPosted});
  factory _ShiftSummaryBody.fromJson(Map<String, dynamic> json) => _$ShiftSummaryBodyFromJson(json);

/// Orders, however they ended
@override final  int orders;
/// Stores with a post or an order
@override final  int stores;
/// Portions handed over
@override final  int unitsCollected;
/// Portions the store refused or whose window ended without a hand-over; an order cancelled by its customer is in neither
@override final  int unitsNotCollected;
/// Portions of the offers posted for it, whatever became of them
@override final  int unitsPosted;

/// Create a copy of ShiftSummaryBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ShiftSummaryBodyCopyWith<_ShiftSummaryBody> get copyWith => __$ShiftSummaryBodyCopyWithImpl<_ShiftSummaryBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ShiftSummaryBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _ShiftSummaryBody&&(identical(other.orders, orders) || other.orders == orders)&&(identical(other.stores, stores) || other.stores == stores)&&(identical(other.unitsCollected, unitsCollected) || other.unitsCollected == unitsCollected)&&(identical(other.unitsNotCollected, unitsNotCollected) || other.unitsNotCollected == unitsNotCollected)&&(identical(other.unitsPosted, unitsPosted) || other.unitsPosted == unitsPosted));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,orders,stores,unitsCollected,unitsNotCollected,unitsPosted);
}

@override
String toString() {
    return 'ShiftSummaryBody(orders: $orders, stores: $stores, unitsCollected: $unitsCollected, unitsNotCollected: $unitsNotCollected, unitsPosted: $unitsPosted)';
}


}

/// @nodoc
abstract mixin class _$ShiftSummaryBodyCopyWith<$Res> implements $ShiftSummaryBodyCopyWith<$Res> {
  factory _$ShiftSummaryBodyCopyWith(_ShiftSummaryBody value, $Res Function(_ShiftSummaryBody) _then) = __$ShiftSummaryBodyCopyWithImpl;
@override @useResult
$Res call({
 int orders, int stores, int unitsCollected, int unitsNotCollected, int unitsPosted
});




}
/// @nodoc
class __$ShiftSummaryBodyCopyWithImpl<$Res>
    implements _$ShiftSummaryBodyCopyWith<$Res> {
  __$ShiftSummaryBodyCopyWithImpl(this._self, this._then);

  final _ShiftSummaryBody _self;
  final $Res Function(_ShiftSummaryBody) _then;

/// Create a copy of ShiftSummaryBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? orders = null,Object? stores = null,Object? unitsCollected = null,Object? unitsNotCollected = null,Object? unitsPosted = null,}) {
  return _then(_ShiftSummaryBody(
orders: null == orders ? _self.orders : orders // ignore: cast_nullable_to_non_nullable
as int,stores: null == stores ? _self.stores : stores // ignore: cast_nullable_to_non_nullable
as int,unitsCollected: null == unitsCollected ? _self.unitsCollected : unitsCollected // ignore: cast_nullable_to_non_nullable
as int,unitsNotCollected: null == unitsNotCollected ? _self.unitsNotCollected : unitsNotCollected // ignore: cast_nullable_to_non_nullable
as int,unitsPosted: null == unitsPosted ? _self.unitsPosted : unitsPosted // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
