// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'seller_profile_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$SellerProfileBody {

 String get address; String get id; double get latitude; double get longitude; String get name; SellerPhotoBody? get photo;
/// Create a copy of SellerProfileBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$SellerProfileBodyCopyWith<SellerProfileBody> get copyWith => _$SellerProfileBodyCopyWithImpl<SellerProfileBody>(this as SellerProfileBody, _$identity);

  /// Serializes this SellerProfileBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as SellerProfileBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is SellerProfileBody&&(identical(other.address, _this.address) || other.address == _this.address)&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.latitude, _this.latitude) || other.latitude == _this.latitude)&&(identical(other.longitude, _this.longitude) || other.longitude == _this.longitude)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.photo, _this.photo) || other.photo == _this.photo));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as SellerProfileBody;
  return Object.hash(runtimeType,_this.address,_this.id,_this.latitude,_this.longitude,_this.name,_this.photo);
}

@override
String toString() {
  final _this = this as SellerProfileBody;
  return 'SellerProfileBody(address: ${_this.address}, id: ${_this.id}, latitude: ${_this.latitude}, longitude: ${_this.longitude}, name: ${_this.name}, photo: ${_this.photo})';
}


}

/// @nodoc
abstract mixin class $SellerProfileBodyCopyWith<$Res>  {
  factory $SellerProfileBodyCopyWith(SellerProfileBody value, $Res Function(SellerProfileBody) _then) = _$SellerProfileBodyCopyWithImpl;
@useResult
$Res call({
 String address, String id, double latitude, double longitude, String name, SellerPhotoBody? photo
});


$SellerPhotoBodyCopyWith<$Res>? get photo;

}
/// @nodoc
class _$SellerProfileBodyCopyWithImpl<$Res>
    implements $SellerProfileBodyCopyWith<$Res> {
  _$SellerProfileBodyCopyWithImpl(this._self, this._then);

  final SellerProfileBody _self;
  final $Res Function(SellerProfileBody) _then;

/// Create a copy of SellerProfileBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? address = null,Object? id = null,Object? latitude = null,Object? longitude = null,Object? name = null,Object? photo = freezed,}) {
  return _then(SellerProfileBody(
address: null == address ? _self.address : address // ignore: cast_nullable_to_non_nullable
as String,id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,latitude: null == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double,longitude: null == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,photo: freezed == photo ? _self.photo : photo // ignore: cast_nullable_to_non_nullable
as SellerPhotoBody?,
  ));
}
/// Create a copy of SellerProfileBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$SellerPhotoBodyCopyWith<$Res>? get photo {
    if (_self.photo == null) {
    return null;
  }

  return $SellerPhotoBodyCopyWith<$Res>(_self.photo!, (value) {
    return _then(_self.copyWith(photo: value));
  });
}
}


/// Adds pattern-matching-related methods to [SellerProfileBody].
extension SellerProfileBodyPatterns on SellerProfileBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _SellerProfileBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _SellerProfileBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _SellerProfileBody value)  $default,){
final _that = this;
switch (_that) {
case _SellerProfileBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _SellerProfileBody value)?  $default,){
final _that = this;
switch (_that) {
case _SellerProfileBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String address,  String id,  double latitude,  double longitude,  String name,  SellerPhotoBody? photo)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _SellerProfileBody() when $default != null:
return $default(_that.address,_that.id,_that.latitude,_that.longitude,_that.name,_that.photo);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String address,  String id,  double latitude,  double longitude,  String name,  SellerPhotoBody? photo)  $default,) {final _that = this;
switch (_that) {
case _SellerProfileBody():
return $default(_that.address,_that.id,_that.latitude,_that.longitude,_that.name,_that.photo);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String address,  String id,  double latitude,  double longitude,  String name,  SellerPhotoBody? photo)?  $default,) {final _that = this;
switch (_that) {
case _SellerProfileBody() when $default != null:
return $default(_that.address,_that.id,_that.latitude,_that.longitude,_that.name,_that.photo);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _SellerProfileBody implements SellerProfileBody {
  const _SellerProfileBody({required this.address, required this.id, required this.latitude, required this.longitude, required this.name, this.photo});
  factory _SellerProfileBody.fromJson(Map<String, dynamic> json) => _$SellerProfileBodyFromJson(json);

@override final  String address;
@override final  String id;
@override final  double latitude;
@override final  double longitude;
@override final  String name;
@override final  SellerPhotoBody? photo;

/// Create a copy of SellerProfileBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$SellerProfileBodyCopyWith<_SellerProfileBody> get copyWith => __$SellerProfileBodyCopyWithImpl<_SellerProfileBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$SellerProfileBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _SellerProfileBody&&(identical(other.address, address) || other.address == address)&&(identical(other.id, id) || other.id == id)&&(identical(other.latitude, latitude) || other.latitude == latitude)&&(identical(other.longitude, longitude) || other.longitude == longitude)&&(identical(other.name, name) || other.name == name)&&(identical(other.photo, photo) || other.photo == photo));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,address,id,latitude,longitude,name,photo);
}

@override
String toString() {
    return 'SellerProfileBody(address: $address, id: $id, latitude: $latitude, longitude: $longitude, name: $name, photo: $photo)';
}


}

/// @nodoc
abstract mixin class _$SellerProfileBodyCopyWith<$Res> implements $SellerProfileBodyCopyWith<$Res> {
  factory _$SellerProfileBodyCopyWith(_SellerProfileBody value, $Res Function(_SellerProfileBody) _then) = __$SellerProfileBodyCopyWithImpl;
@override @useResult
$Res call({
 String address, String id, double latitude, double longitude, String name, SellerPhotoBody? photo
});


@override $SellerPhotoBodyCopyWith<$Res>? get photo;

}
/// @nodoc
class __$SellerProfileBodyCopyWithImpl<$Res>
    implements _$SellerProfileBodyCopyWith<$Res> {
  __$SellerProfileBodyCopyWithImpl(this._self, this._then);

  final _SellerProfileBody _self;
  final $Res Function(_SellerProfileBody) _then;

/// Create a copy of SellerProfileBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? address = null,Object? id = null,Object? latitude = null,Object? longitude = null,Object? name = null,Object? photo = freezed,}) {
  return _then(_SellerProfileBody(
address: null == address ? _self.address : address // ignore: cast_nullable_to_non_nullable
as String,id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,latitude: null == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double,longitude: null == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,photo: freezed == photo ? _self.photo : photo // ignore: cast_nullable_to_non_nullable
as SellerPhotoBody?,
  ));
}

/// Create a copy of SellerProfileBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$SellerPhotoBodyCopyWith<$Res>? get photo {
    if (_self.photo == null) {
    return null;
  }

  return $SellerPhotoBodyCopyWith<$Res>(_self.photo!, (value) {
    return _then(_self.copyWith(photo: value));
  });
}
}

// dart format on
