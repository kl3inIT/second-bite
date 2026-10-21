// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'order_seller_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$OrderSellerBody {

 String get address; String get id; double get latitude; double get longitude; String get name;
/// Create a copy of OrderSellerBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$OrderSellerBodyCopyWith<OrderSellerBody> get copyWith => _$OrderSellerBodyCopyWithImpl<OrderSellerBody>(this as OrderSellerBody, _$identity);

  /// Serializes this OrderSellerBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as OrderSellerBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is OrderSellerBody&&(identical(other.address, _this.address) || other.address == _this.address)&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.latitude, _this.latitude) || other.latitude == _this.latitude)&&(identical(other.longitude, _this.longitude) || other.longitude == _this.longitude)&&(identical(other.name, _this.name) || other.name == _this.name));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as OrderSellerBody;
  return Object.hash(runtimeType,_this.address,_this.id,_this.latitude,_this.longitude,_this.name);
}

@override
String toString() {
  final _this = this as OrderSellerBody;
  return 'OrderSellerBody(address: ${_this.address}, id: ${_this.id}, latitude: ${_this.latitude}, longitude: ${_this.longitude}, name: ${_this.name})';
}


}

/// @nodoc
abstract mixin class $OrderSellerBodyCopyWith<$Res>  {
  factory $OrderSellerBodyCopyWith(OrderSellerBody value, $Res Function(OrderSellerBody) _then) = _$OrderSellerBodyCopyWithImpl;
@useResult
$Res call({
 String address, String id, double latitude, double longitude, String name
});




}
/// @nodoc
class _$OrderSellerBodyCopyWithImpl<$Res>
    implements $OrderSellerBodyCopyWith<$Res> {
  _$OrderSellerBodyCopyWithImpl(this._self, this._then);

  final OrderSellerBody _self;
  final $Res Function(OrderSellerBody) _then;

/// Create a copy of OrderSellerBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? address = null,Object? id = null,Object? latitude = null,Object? longitude = null,Object? name = null,}) {
  return _then(OrderSellerBody(
address: null == address ? _self.address : address // ignore: cast_nullable_to_non_nullable
as String,id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,latitude: null == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double,longitude: null == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [OrderSellerBody].
extension OrderSellerBodyPatterns on OrderSellerBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _OrderSellerBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _OrderSellerBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _OrderSellerBody value)  $default,){
final _that = this;
switch (_that) {
case _OrderSellerBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _OrderSellerBody value)?  $default,){
final _that = this;
switch (_that) {
case _OrderSellerBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String address,  String id,  double latitude,  double longitude,  String name)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _OrderSellerBody() when $default != null:
return $default(_that.address,_that.id,_that.latitude,_that.longitude,_that.name);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String address,  String id,  double latitude,  double longitude,  String name)  $default,) {final _that = this;
switch (_that) {
case _OrderSellerBody():
return $default(_that.address,_that.id,_that.latitude,_that.longitude,_that.name);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String address,  String id,  double latitude,  double longitude,  String name)?  $default,) {final _that = this;
switch (_that) {
case _OrderSellerBody() when $default != null:
return $default(_that.address,_that.id,_that.latitude,_that.longitude,_that.name);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _OrderSellerBody implements OrderSellerBody {
  const _OrderSellerBody({required this.address, required this.id, required this.latitude, required this.longitude, required this.name});
  factory _OrderSellerBody.fromJson(Map<String, dynamic> json) => _$OrderSellerBodyFromJson(json);

@override final  String address;
@override final  String id;
@override final  double latitude;
@override final  double longitude;
@override final  String name;

/// Create a copy of OrderSellerBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$OrderSellerBodyCopyWith<_OrderSellerBody> get copyWith => __$OrderSellerBodyCopyWithImpl<_OrderSellerBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$OrderSellerBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _OrderSellerBody&&(identical(other.address, address) || other.address == address)&&(identical(other.id, id) || other.id == id)&&(identical(other.latitude, latitude) || other.latitude == latitude)&&(identical(other.longitude, longitude) || other.longitude == longitude)&&(identical(other.name, name) || other.name == name));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,address,id,latitude,longitude,name);
}

@override
String toString() {
    return 'OrderSellerBody(address: $address, id: $id, latitude: $latitude, longitude: $longitude, name: $name)';
}


}

/// @nodoc
abstract mixin class _$OrderSellerBodyCopyWith<$Res> implements $OrderSellerBodyCopyWith<$Res> {
  factory _$OrderSellerBodyCopyWith(_OrderSellerBody value, $Res Function(_OrderSellerBody) _then) = __$OrderSellerBodyCopyWithImpl;
@override @useResult
$Res call({
 String address, String id, double latitude, double longitude, String name
});




}
/// @nodoc
class __$OrderSellerBodyCopyWithImpl<$Res>
    implements _$OrderSellerBodyCopyWith<$Res> {
  __$OrderSellerBodyCopyWithImpl(this._self, this._then);

  final _OrderSellerBody _self;
  final $Res Function(_OrderSellerBody) _then;

/// Create a copy of OrderSellerBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? address = null,Object? id = null,Object? latitude = null,Object? longitude = null,Object? name = null,}) {
  return _then(_OrderSellerBody(
address: null == address ? _self.address : address // ignore: cast_nullable_to_non_nullable
as String,id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,latitude: null == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double,longitude: null == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
