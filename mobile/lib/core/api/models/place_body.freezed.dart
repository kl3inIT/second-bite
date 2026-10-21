// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'place_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$PlaceBody {

/// As people write it; a house number typed first goes before a street that has none
 String get address; double get latitude; double get longitude;
/// Create a copy of PlaceBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$PlaceBodyCopyWith<PlaceBody> get copyWith => _$PlaceBodyCopyWithImpl<PlaceBody>(this as PlaceBody, _$identity);

  /// Serializes this PlaceBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as PlaceBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is PlaceBody&&(identical(other.address, _this.address) || other.address == _this.address)&&(identical(other.latitude, _this.latitude) || other.latitude == _this.latitude)&&(identical(other.longitude, _this.longitude) || other.longitude == _this.longitude));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as PlaceBody;
  return Object.hash(runtimeType,_this.address,_this.latitude,_this.longitude);
}

@override
String toString() {
  final _this = this as PlaceBody;
  return 'PlaceBody(address: ${_this.address}, latitude: ${_this.latitude}, longitude: ${_this.longitude})';
}


}

/// @nodoc
abstract mixin class $PlaceBodyCopyWith<$Res>  {
  factory $PlaceBodyCopyWith(PlaceBody value, $Res Function(PlaceBody) _then) = _$PlaceBodyCopyWithImpl;
@useResult
$Res call({
 String address, double latitude, double longitude
});




}
/// @nodoc
class _$PlaceBodyCopyWithImpl<$Res>
    implements $PlaceBodyCopyWith<$Res> {
  _$PlaceBodyCopyWithImpl(this._self, this._then);

  final PlaceBody _self;
  final $Res Function(PlaceBody) _then;

/// Create a copy of PlaceBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? address = null,Object? latitude = null,Object? longitude = null,}) {
  return _then(PlaceBody(
address: null == address ? _self.address : address // ignore: cast_nullable_to_non_nullable
as String,latitude: null == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double,longitude: null == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double,
  ));
}

}


/// Adds pattern-matching-related methods to [PlaceBody].
extension PlaceBodyPatterns on PlaceBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _PlaceBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _PlaceBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _PlaceBody value)  $default,){
final _that = this;
switch (_that) {
case _PlaceBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _PlaceBody value)?  $default,){
final _that = this;
switch (_that) {
case _PlaceBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String address,  double latitude,  double longitude)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _PlaceBody() when $default != null:
return $default(_that.address,_that.latitude,_that.longitude);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String address,  double latitude,  double longitude)  $default,) {final _that = this;
switch (_that) {
case _PlaceBody():
return $default(_that.address,_that.latitude,_that.longitude);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String address,  double latitude,  double longitude)?  $default,) {final _that = this;
switch (_that) {
case _PlaceBody() when $default != null:
return $default(_that.address,_that.latitude,_that.longitude);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _PlaceBody implements PlaceBody {
  const _PlaceBody({required this.address, required this.latitude, required this.longitude});
  factory _PlaceBody.fromJson(Map<String, dynamic> json) => _$PlaceBodyFromJson(json);

/// As people write it; a house number typed first goes before a street that has none
@override final  String address;
@override final  double latitude;
@override final  double longitude;

/// Create a copy of PlaceBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$PlaceBodyCopyWith<_PlaceBody> get copyWith => __$PlaceBodyCopyWithImpl<_PlaceBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$PlaceBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _PlaceBody&&(identical(other.address, address) || other.address == address)&&(identical(other.latitude, latitude) || other.latitude == latitude)&&(identical(other.longitude, longitude) || other.longitude == longitude));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,address,latitude,longitude);
}

@override
String toString() {
    return 'PlaceBody(address: $address, latitude: $latitude, longitude: $longitude)';
}


}

/// @nodoc
abstract mixin class _$PlaceBodyCopyWith<$Res> implements $PlaceBodyCopyWith<$Res> {
  factory _$PlaceBodyCopyWith(_PlaceBody value, $Res Function(_PlaceBody) _then) = __$PlaceBodyCopyWithImpl;
@override @useResult
$Res call({
 String address, double latitude, double longitude
});




}
/// @nodoc
class __$PlaceBodyCopyWithImpl<$Res>
    implements _$PlaceBodyCopyWith<$Res> {
  __$PlaceBodyCopyWithImpl(this._self, this._then);

  final _PlaceBody _self;
  final $Res Function(_PlaceBody) _then;

/// Create a copy of PlaceBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? address = null,Object? latitude = null,Object? longitude = null,}) {
  return _then(_PlaceBody(
address: null == address ? _self.address : address // ignore: cast_nullable_to_non_nullable
as String,latitude: null == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double,longitude: null == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double,
  ));
}


}

// dart format on
