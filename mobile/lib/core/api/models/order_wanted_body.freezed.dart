// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'order_wanted_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$OrderWantedBody {

 String get offerId; int get units;
/// Create a copy of OrderWantedBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$OrderWantedBodyCopyWith<OrderWantedBody> get copyWith => _$OrderWantedBodyCopyWithImpl<OrderWantedBody>(this as OrderWantedBody, _$identity);

  /// Serializes this OrderWantedBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as OrderWantedBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is OrderWantedBody&&(identical(other.offerId, _this.offerId) || other.offerId == _this.offerId)&&(identical(other.units, _this.units) || other.units == _this.units));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as OrderWantedBody;
  return Object.hash(runtimeType,_this.offerId,_this.units);
}

@override
String toString() {
  final _this = this as OrderWantedBody;
  return 'OrderWantedBody(offerId: ${_this.offerId}, units: ${_this.units})';
}


}

/// @nodoc
abstract mixin class $OrderWantedBodyCopyWith<$Res>  {
  factory $OrderWantedBodyCopyWith(OrderWantedBody value, $Res Function(OrderWantedBody) _then) = _$OrderWantedBodyCopyWithImpl;
@useResult
$Res call({
 String offerId, int units
});




}
/// @nodoc
class _$OrderWantedBodyCopyWithImpl<$Res>
    implements $OrderWantedBodyCopyWith<$Res> {
  _$OrderWantedBodyCopyWithImpl(this._self, this._then);

  final OrderWantedBody _self;
  final $Res Function(OrderWantedBody) _then;

/// Create a copy of OrderWantedBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? offerId = null,Object? units = null,}) {
  return _then(OrderWantedBody(
offerId: null == offerId ? _self.offerId : offerId // ignore: cast_nullable_to_non_nullable
as String,units: null == units ? _self.units : units // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [OrderWantedBody].
extension OrderWantedBodyPatterns on OrderWantedBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _OrderWantedBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _OrderWantedBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _OrderWantedBody value)  $default,){
final _that = this;
switch (_that) {
case _OrderWantedBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _OrderWantedBody value)?  $default,){
final _that = this;
switch (_that) {
case _OrderWantedBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String offerId,  int units)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _OrderWantedBody() when $default != null:
return $default(_that.offerId,_that.units);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String offerId,  int units)  $default,) {final _that = this;
switch (_that) {
case _OrderWantedBody():
return $default(_that.offerId,_that.units);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String offerId,  int units)?  $default,) {final _that = this;
switch (_that) {
case _OrderWantedBody() when $default != null:
return $default(_that.offerId,_that.units);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _OrderWantedBody implements OrderWantedBody {
  const _OrderWantedBody({required this.offerId, required this.units});
  factory _OrderWantedBody.fromJson(Map<String, dynamic> json) => _$OrderWantedBodyFromJson(json);

@override final  String offerId;
@override final  int units;

/// Create a copy of OrderWantedBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$OrderWantedBodyCopyWith<_OrderWantedBody> get copyWith => __$OrderWantedBodyCopyWithImpl<_OrderWantedBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$OrderWantedBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _OrderWantedBody&&(identical(other.offerId, offerId) || other.offerId == offerId)&&(identical(other.units, units) || other.units == units));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,offerId,units);
}

@override
String toString() {
    return 'OrderWantedBody(offerId: $offerId, units: $units)';
}


}

/// @nodoc
abstract mixin class _$OrderWantedBodyCopyWith<$Res> implements $OrderWantedBodyCopyWith<$Res> {
  factory _$OrderWantedBodyCopyWith(_OrderWantedBody value, $Res Function(_OrderWantedBody) _then) = __$OrderWantedBodyCopyWithImpl;
@override @useResult
$Res call({
 String offerId, int units
});




}
/// @nodoc
class __$OrderWantedBodyCopyWithImpl<$Res>
    implements _$OrderWantedBodyCopyWith<$Res> {
  __$OrderWantedBodyCopyWithImpl(this._self, this._then);

  final _OrderWantedBody _self;
  final $Res Function(_OrderWantedBody) _then;

/// Create a copy of OrderWantedBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? offerId = null,Object? units = null,}) {
  return _then(_OrderWantedBody(
offerId: null == offerId ? _self.offerId : offerId // ignore: cast_nullable_to_non_nullable
as String,units: null == units ? _self.units : units // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
