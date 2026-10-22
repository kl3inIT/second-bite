// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'details_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$DetailsBody {

/// The address as people write it
 String get address;/// Where the seller is, pinned on a map; inside Hanoi, or SELLER_LOCATION_OUTSIDE
 double get latitude; double get longitude; String get name;/// Shown to the seller's members and admins
 String get phone;
/// Create a copy of DetailsBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$DetailsBodyCopyWith<DetailsBody> get copyWith => _$DetailsBodyCopyWithImpl<DetailsBody>(this as DetailsBody, _$identity);

  /// Serializes this DetailsBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as DetailsBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is DetailsBody&&(identical(other.address, _this.address) || other.address == _this.address)&&(identical(other.latitude, _this.latitude) || other.latitude == _this.latitude)&&(identical(other.longitude, _this.longitude) || other.longitude == _this.longitude)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.phone, _this.phone) || other.phone == _this.phone));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as DetailsBody;
  return Object.hash(runtimeType,_this.address,_this.latitude,_this.longitude,_this.name,_this.phone);
}

@override
String toString() {
  final _this = this as DetailsBody;
  return 'DetailsBody(address: ${_this.address}, latitude: ${_this.latitude}, longitude: ${_this.longitude}, name: ${_this.name}, phone: ${_this.phone})';
}


}

/// @nodoc
abstract mixin class $DetailsBodyCopyWith<$Res>  {
  factory $DetailsBodyCopyWith(DetailsBody value, $Res Function(DetailsBody) _then) = _$DetailsBodyCopyWithImpl;
@useResult
$Res call({
 String address, double latitude, double longitude, String name, String phone
});




}
/// @nodoc
class _$DetailsBodyCopyWithImpl<$Res>
    implements $DetailsBodyCopyWith<$Res> {
  _$DetailsBodyCopyWithImpl(this._self, this._then);

  final DetailsBody _self;
  final $Res Function(DetailsBody) _then;

/// Create a copy of DetailsBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? address = null,Object? latitude = null,Object? longitude = null,Object? name = null,Object? phone = null,}) {
  return _then(DetailsBody(
address: null == address ? _self.address : address // ignore: cast_nullable_to_non_nullable
as String,latitude: null == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double,longitude: null == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,phone: null == phone ? _self.phone : phone // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [DetailsBody].
extension DetailsBodyPatterns on DetailsBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _DetailsBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _DetailsBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _DetailsBody value)  $default,){
final _that = this;
switch (_that) {
case _DetailsBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _DetailsBody value)?  $default,){
final _that = this;
switch (_that) {
case _DetailsBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String address,  double latitude,  double longitude,  String name,  String phone)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _DetailsBody() when $default != null:
return $default(_that.address,_that.latitude,_that.longitude,_that.name,_that.phone);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String address,  double latitude,  double longitude,  String name,  String phone)  $default,) {final _that = this;
switch (_that) {
case _DetailsBody():
return $default(_that.address,_that.latitude,_that.longitude,_that.name,_that.phone);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String address,  double latitude,  double longitude,  String name,  String phone)?  $default,) {final _that = this;
switch (_that) {
case _DetailsBody() when $default != null:
return $default(_that.address,_that.latitude,_that.longitude,_that.name,_that.phone);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _DetailsBody implements DetailsBody {
  const _DetailsBody({required this.address, required this.latitude, required this.longitude, required this.name, required this.phone});
  factory _DetailsBody.fromJson(Map<String, dynamic> json) => _$DetailsBodyFromJson(json);

/// The address as people write it
@override final  String address;
/// Where the seller is, pinned on a map; inside Hanoi, or SELLER_LOCATION_OUTSIDE
@override final  double latitude;
@override final  double longitude;
@override final  String name;
/// Shown to the seller's members and admins
@override final  String phone;

/// Create a copy of DetailsBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$DetailsBodyCopyWith<_DetailsBody> get copyWith => __$DetailsBodyCopyWithImpl<_DetailsBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$DetailsBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _DetailsBody&&(identical(other.address, address) || other.address == address)&&(identical(other.latitude, latitude) || other.latitude == latitude)&&(identical(other.longitude, longitude) || other.longitude == longitude)&&(identical(other.name, name) || other.name == name)&&(identical(other.phone, phone) || other.phone == phone));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,address,latitude,longitude,name,phone);
}

@override
String toString() {
    return 'DetailsBody(address: $address, latitude: $latitude, longitude: $longitude, name: $name, phone: $phone)';
}


}

/// @nodoc
abstract mixin class _$DetailsBodyCopyWith<$Res> implements $DetailsBodyCopyWith<$Res> {
  factory _$DetailsBodyCopyWith(_DetailsBody value, $Res Function(_DetailsBody) _then) = __$DetailsBodyCopyWithImpl;
@override @useResult
$Res call({
 String address, double latitude, double longitude, String name, String phone
});




}
/// @nodoc
class __$DetailsBodyCopyWithImpl<$Res>
    implements _$DetailsBodyCopyWith<$Res> {
  __$DetailsBodyCopyWithImpl(this._self, this._then);

  final _DetailsBody _self;
  final $Res Function(_DetailsBody) _then;

/// Create a copy of DetailsBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? address = null,Object? latitude = null,Object? longitude = null,Object? name = null,Object? phone = null,}) {
  return _then(_DetailsBody(
address: null == address ? _self.address : address // ignore: cast_nullable_to_non_nullable
as String,latitude: null == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double,longitude: null == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,phone: null == phone ? _self.phone : phone // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
