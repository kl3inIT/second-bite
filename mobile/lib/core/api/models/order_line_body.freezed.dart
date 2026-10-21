// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'order_line_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$OrderLineBody {

 String get name; String get offerId; int get originalPriceVnd; OrderLinePhotoBody get photo; int get priceVnd; String get unit; int get units;
/// Create a copy of OrderLineBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$OrderLineBodyCopyWith<OrderLineBody> get copyWith => _$OrderLineBodyCopyWithImpl<OrderLineBody>(this as OrderLineBody, _$identity);

  /// Serializes this OrderLineBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as OrderLineBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is OrderLineBody&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.offerId, _this.offerId) || other.offerId == _this.offerId)&&(identical(other.originalPriceVnd, _this.originalPriceVnd) || other.originalPriceVnd == _this.originalPriceVnd)&&(identical(other.photo, _this.photo) || other.photo == _this.photo)&&(identical(other.priceVnd, _this.priceVnd) || other.priceVnd == _this.priceVnd)&&(identical(other.unit, _this.unit) || other.unit == _this.unit)&&(identical(other.units, _this.units) || other.units == _this.units));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as OrderLineBody;
  return Object.hash(runtimeType,_this.name,_this.offerId,_this.originalPriceVnd,_this.photo,_this.priceVnd,_this.unit,_this.units);
}

@override
String toString() {
  final _this = this as OrderLineBody;
  return 'OrderLineBody(name: ${_this.name}, offerId: ${_this.offerId}, originalPriceVnd: ${_this.originalPriceVnd}, photo: ${_this.photo}, priceVnd: ${_this.priceVnd}, unit: ${_this.unit}, units: ${_this.units})';
}


}

/// @nodoc
abstract mixin class $OrderLineBodyCopyWith<$Res>  {
  factory $OrderLineBodyCopyWith(OrderLineBody value, $Res Function(OrderLineBody) _then) = _$OrderLineBodyCopyWithImpl;
@useResult
$Res call({
 String name, String offerId, int originalPriceVnd, OrderLinePhotoBody photo, int priceVnd, String unit, int units
});


$OrderLinePhotoBodyCopyWith<$Res> get photo;

}
/// @nodoc
class _$OrderLineBodyCopyWithImpl<$Res>
    implements $OrderLineBodyCopyWith<$Res> {
  _$OrderLineBodyCopyWithImpl(this._self, this._then);

  final OrderLineBody _self;
  final $Res Function(OrderLineBody) _then;

/// Create a copy of OrderLineBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? name = null,Object? offerId = null,Object? originalPriceVnd = null,Object? photo = null,Object? priceVnd = null,Object? unit = null,Object? units = null,}) {
  return _then(OrderLineBody(
name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,offerId: null == offerId ? _self.offerId : offerId // ignore: cast_nullable_to_non_nullable
as String,originalPriceVnd: null == originalPriceVnd ? _self.originalPriceVnd : originalPriceVnd // ignore: cast_nullable_to_non_nullable
as int,photo: null == photo ? _self.photo : photo // ignore: cast_nullable_to_non_nullable
as OrderLinePhotoBody,priceVnd: null == priceVnd ? _self.priceVnd : priceVnd // ignore: cast_nullable_to_non_nullable
as int,unit: null == unit ? _self.unit : unit // ignore: cast_nullable_to_non_nullable
as String,units: null == units ? _self.units : units // ignore: cast_nullable_to_non_nullable
as int,
  ));
}
/// Create a copy of OrderLineBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$OrderLinePhotoBodyCopyWith<$Res> get photo {
  
  return $OrderLinePhotoBodyCopyWith<$Res>(_self.photo, (value) {
    return _then(_self.copyWith(photo: value));
  });
}
}


/// Adds pattern-matching-related methods to [OrderLineBody].
extension OrderLineBodyPatterns on OrderLineBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _OrderLineBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _OrderLineBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _OrderLineBody value)  $default,){
final _that = this;
switch (_that) {
case _OrderLineBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _OrderLineBody value)?  $default,){
final _that = this;
switch (_that) {
case _OrderLineBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String name,  String offerId,  int originalPriceVnd,  OrderLinePhotoBody photo,  int priceVnd,  String unit,  int units)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _OrderLineBody() when $default != null:
return $default(_that.name,_that.offerId,_that.originalPriceVnd,_that.photo,_that.priceVnd,_that.unit,_that.units);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String name,  String offerId,  int originalPriceVnd,  OrderLinePhotoBody photo,  int priceVnd,  String unit,  int units)  $default,) {final _that = this;
switch (_that) {
case _OrderLineBody():
return $default(_that.name,_that.offerId,_that.originalPriceVnd,_that.photo,_that.priceVnd,_that.unit,_that.units);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String name,  String offerId,  int originalPriceVnd,  OrderLinePhotoBody photo,  int priceVnd,  String unit,  int units)?  $default,) {final _that = this;
switch (_that) {
case _OrderLineBody() when $default != null:
return $default(_that.name,_that.offerId,_that.originalPriceVnd,_that.photo,_that.priceVnd,_that.unit,_that.units);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _OrderLineBody implements OrderLineBody {
  const _OrderLineBody({required this.name, required this.offerId, required this.originalPriceVnd, required this.photo, required this.priceVnd, required this.unit, required this.units});
  factory _OrderLineBody.fromJson(Map<String, dynamic> json) => _$OrderLineBodyFromJson(json);

@override final  String name;
@override final  String offerId;
@override final  int originalPriceVnd;
@override final  OrderLinePhotoBody photo;
@override final  int priceVnd;
@override final  String unit;
@override final  int units;

/// Create a copy of OrderLineBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$OrderLineBodyCopyWith<_OrderLineBody> get copyWith => __$OrderLineBodyCopyWithImpl<_OrderLineBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$OrderLineBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _OrderLineBody&&(identical(other.name, name) || other.name == name)&&(identical(other.offerId, offerId) || other.offerId == offerId)&&(identical(other.originalPriceVnd, originalPriceVnd) || other.originalPriceVnd == originalPriceVnd)&&(identical(other.photo, photo) || other.photo == photo)&&(identical(other.priceVnd, priceVnd) || other.priceVnd == priceVnd)&&(identical(other.unit, unit) || other.unit == unit)&&(identical(other.units, units) || other.units == units));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,name,offerId,originalPriceVnd,photo,priceVnd,unit,units);
}

@override
String toString() {
    return 'OrderLineBody(name: $name, offerId: $offerId, originalPriceVnd: $originalPriceVnd, photo: $photo, priceVnd: $priceVnd, unit: $unit, units: $units)';
}


}

/// @nodoc
abstract mixin class _$OrderLineBodyCopyWith<$Res> implements $OrderLineBodyCopyWith<$Res> {
  factory _$OrderLineBodyCopyWith(_OrderLineBody value, $Res Function(_OrderLineBody) _then) = __$OrderLineBodyCopyWithImpl;
@override @useResult
$Res call({
 String name, String offerId, int originalPriceVnd, OrderLinePhotoBody photo, int priceVnd, String unit, int units
});


@override $OrderLinePhotoBodyCopyWith<$Res> get photo;

}
/// @nodoc
class __$OrderLineBodyCopyWithImpl<$Res>
    implements _$OrderLineBodyCopyWith<$Res> {
  __$OrderLineBodyCopyWithImpl(this._self, this._then);

  final _OrderLineBody _self;
  final $Res Function(_OrderLineBody) _then;

/// Create a copy of OrderLineBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? name = null,Object? offerId = null,Object? originalPriceVnd = null,Object? photo = null,Object? priceVnd = null,Object? unit = null,Object? units = null,}) {
  return _then(_OrderLineBody(
name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,offerId: null == offerId ? _self.offerId : offerId // ignore: cast_nullable_to_non_nullable
as String,originalPriceVnd: null == originalPriceVnd ? _self.originalPriceVnd : originalPriceVnd // ignore: cast_nullable_to_non_nullable
as int,photo: null == photo ? _self.photo : photo // ignore: cast_nullable_to_non_nullable
as OrderLinePhotoBody,priceVnd: null == priceVnd ? _self.priceVnd : priceVnd // ignore: cast_nullable_to_non_nullable
as int,unit: null == unit ? _self.unit : unit // ignore: cast_nullable_to_non_nullable
as String,units: null == units ? _self.units : units // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

/// Create a copy of OrderLineBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$OrderLinePhotoBodyCopyWith<$Res> get photo {
  
  return $OrderLinePhotoBodyCopyWith<$Res>(_self.photo, (value) {
    return _then(_self.copyWith(photo: value));
  });
}
}

// dart format on
