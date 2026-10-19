// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'collection_point_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$CollectionPointBody {

 String get address; double get latitude; double get longitude;
/// Create a copy of CollectionPointBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$CollectionPointBodyCopyWith<CollectionPointBody> get copyWith => _$CollectionPointBodyCopyWithImpl<CollectionPointBody>(this as CollectionPointBody, _$identity);

  /// Serializes this CollectionPointBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as CollectionPointBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is CollectionPointBody&&(identical(other.address, _this.address) || other.address == _this.address)&&(identical(other.latitude, _this.latitude) || other.latitude == _this.latitude)&&(identical(other.longitude, _this.longitude) || other.longitude == _this.longitude));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as CollectionPointBody;
  return Object.hash(runtimeType,_this.address,_this.latitude,_this.longitude);
}

@override
String toString() {
  final _this = this as CollectionPointBody;
  return 'CollectionPointBody(address: ${_this.address}, latitude: ${_this.latitude}, longitude: ${_this.longitude})';
}


}

/// @nodoc
abstract mixin class $CollectionPointBodyCopyWith<$Res>  {
  factory $CollectionPointBodyCopyWith(CollectionPointBody value, $Res Function(CollectionPointBody) _then) = _$CollectionPointBodyCopyWithImpl;
@useResult
$Res call({
 String address, double latitude, double longitude
});




}
/// @nodoc
class _$CollectionPointBodyCopyWithImpl<$Res>
    implements $CollectionPointBodyCopyWith<$Res> {
  _$CollectionPointBodyCopyWithImpl(this._self, this._then);

  final CollectionPointBody _self;
  final $Res Function(CollectionPointBody) _then;

/// Create a copy of CollectionPointBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? address = null,Object? latitude = null,Object? longitude = null,}) {
  return _then(CollectionPointBody(
address: null == address ? _self.address : address // ignore: cast_nullable_to_non_nullable
as String,latitude: null == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double,longitude: null == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double,
  ));
}

}


/// Adds pattern-matching-related methods to [CollectionPointBody].
extension CollectionPointBodyPatterns on CollectionPointBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _CollectionPointBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _CollectionPointBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _CollectionPointBody value)  $default,){
final _that = this;
switch (_that) {
case _CollectionPointBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _CollectionPointBody value)?  $default,){
final _that = this;
switch (_that) {
case _CollectionPointBody() when $default != null:
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
case _CollectionPointBody() when $default != null:
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
case _CollectionPointBody():
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
case _CollectionPointBody() when $default != null:
return $default(_that.address,_that.latitude,_that.longitude);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _CollectionPointBody implements CollectionPointBody {
  const _CollectionPointBody({required this.address, required this.latitude, required this.longitude});
  factory _CollectionPointBody.fromJson(Map<String, dynamic> json) => _$CollectionPointBodyFromJson(json);

@override final  String address;
@override final  double latitude;
@override final  double longitude;

/// Create a copy of CollectionPointBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$CollectionPointBodyCopyWith<_CollectionPointBody> get copyWith => __$CollectionPointBodyCopyWithImpl<_CollectionPointBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$CollectionPointBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _CollectionPointBody&&(identical(other.address, address) || other.address == address)&&(identical(other.latitude, latitude) || other.latitude == latitude)&&(identical(other.longitude, longitude) || other.longitude == longitude));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,address,latitude,longitude);
}

@override
String toString() {
    return 'CollectionPointBody(address: $address, latitude: $latitude, longitude: $longitude)';
}


}

/// @nodoc
abstract mixin class _$CollectionPointBodyCopyWith<$Res> implements $CollectionPointBodyCopyWith<$Res> {
  factory _$CollectionPointBodyCopyWith(_CollectionPointBody value, $Res Function(_CollectionPointBody) _then) = __$CollectionPointBodyCopyWithImpl;
@override @useResult
$Res call({
 String address, double latitude, double longitude
});




}
/// @nodoc
class __$CollectionPointBodyCopyWithImpl<$Res>
    implements _$CollectionPointBodyCopyWith<$Res> {
  __$CollectionPointBodyCopyWithImpl(this._self, this._then);

  final _CollectionPointBody _self;
  final $Res Function(_CollectionPointBody) _then;

/// Create a copy of CollectionPointBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? address = null,Object? latitude = null,Object? longitude = null,}) {
  return _then(_CollectionPointBody(
address: null == address ? _self.address : address // ignore: cast_nullable_to_non_nullable
as String,latitude: null == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double,longitude: null == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double,
  ));
}


}

// dart format on
