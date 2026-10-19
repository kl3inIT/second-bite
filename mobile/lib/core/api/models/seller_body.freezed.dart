// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'seller_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$SellerBody {

 String get address; DateTime get createdAt; String get id; double get latitude; double get longitude; String get name; String get phone; SellerBodyStatus get status; DateTime get updatedAt;/// The caller's role; absent for an admin who is not a member
 SellerBodyMyRole? get myRole;/// Served at /photos/{photoId}/1600.jpg and /400.jpg
 String? get photoId; DateTime? get statusChangedAt;
/// Create a copy of SellerBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$SellerBodyCopyWith<SellerBody> get copyWith => _$SellerBodyCopyWithImpl<SellerBody>(this as SellerBody, _$identity);

  /// Serializes this SellerBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as SellerBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is SellerBody&&(identical(other.address, _this.address) || other.address == _this.address)&&(identical(other.createdAt, _this.createdAt) || other.createdAt == _this.createdAt)&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.latitude, _this.latitude) || other.latitude == _this.latitude)&&(identical(other.longitude, _this.longitude) || other.longitude == _this.longitude)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.phone, _this.phone) || other.phone == _this.phone)&&(identical(other.status, _this.status) || other.status == _this.status)&&(identical(other.updatedAt, _this.updatedAt) || other.updatedAt == _this.updatedAt)&&(identical(other.myRole, _this.myRole) || other.myRole == _this.myRole)&&(identical(other.photoId, _this.photoId) || other.photoId == _this.photoId)&&(identical(other.statusChangedAt, _this.statusChangedAt) || other.statusChangedAt == _this.statusChangedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as SellerBody;
  return Object.hash(runtimeType,_this.address,_this.createdAt,_this.id,_this.latitude,_this.longitude,_this.name,_this.phone,_this.status,_this.updatedAt,_this.myRole,_this.photoId,_this.statusChangedAt);
}

@override
String toString() {
  final _this = this as SellerBody;
  return 'SellerBody(address: ${_this.address}, createdAt: ${_this.createdAt}, id: ${_this.id}, latitude: ${_this.latitude}, longitude: ${_this.longitude}, name: ${_this.name}, phone: ${_this.phone}, status: ${_this.status}, updatedAt: ${_this.updatedAt}, myRole: ${_this.myRole}, photoId: ${_this.photoId}, statusChangedAt: ${_this.statusChangedAt})';
}


}

/// @nodoc
abstract mixin class $SellerBodyCopyWith<$Res>  {
  factory $SellerBodyCopyWith(SellerBody value, $Res Function(SellerBody) _then) = _$SellerBodyCopyWithImpl;
@useResult
$Res call({
 String address, DateTime createdAt, String id, double latitude, double longitude, String name, String phone, SellerBodyStatus status, DateTime updatedAt, SellerBodyMyRole? myRole, String? photoId, DateTime? statusChangedAt
});




}
/// @nodoc
class _$SellerBodyCopyWithImpl<$Res>
    implements $SellerBodyCopyWith<$Res> {
  _$SellerBodyCopyWithImpl(this._self, this._then);

  final SellerBody _self;
  final $Res Function(SellerBody) _then;

/// Create a copy of SellerBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? address = null,Object? createdAt = null,Object? id = null,Object? latitude = null,Object? longitude = null,Object? name = null,Object? phone = null,Object? status = null,Object? updatedAt = null,Object? myRole = freezed,Object? photoId = freezed,Object? statusChangedAt = freezed,}) {
  return _then(SellerBody(
address: null == address ? _self.address : address // ignore: cast_nullable_to_non_nullable
as String,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,latitude: null == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double,longitude: null == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,phone: null == phone ? _self.phone : phone // ignore: cast_nullable_to_non_nullable
as String,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as SellerBodyStatus,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,myRole: freezed == myRole ? _self.myRole : myRole // ignore: cast_nullable_to_non_nullable
as SellerBodyMyRole?,photoId: freezed == photoId ? _self.photoId : photoId // ignore: cast_nullable_to_non_nullable
as String?,statusChangedAt: freezed == statusChangedAt ? _self.statusChangedAt : statusChangedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,
  ));
}

}


/// Adds pattern-matching-related methods to [SellerBody].
extension SellerBodyPatterns on SellerBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _SellerBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _SellerBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _SellerBody value)  $default,){
final _that = this;
switch (_that) {
case _SellerBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _SellerBody value)?  $default,){
final _that = this;
switch (_that) {
case _SellerBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String address,  DateTime createdAt,  String id,  double latitude,  double longitude,  String name,  String phone,  SellerBodyStatus status,  DateTime updatedAt,  SellerBodyMyRole? myRole,  String? photoId,  DateTime? statusChangedAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _SellerBody() when $default != null:
return $default(_that.address,_that.createdAt,_that.id,_that.latitude,_that.longitude,_that.name,_that.phone,_that.status,_that.updatedAt,_that.myRole,_that.photoId,_that.statusChangedAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String address,  DateTime createdAt,  String id,  double latitude,  double longitude,  String name,  String phone,  SellerBodyStatus status,  DateTime updatedAt,  SellerBodyMyRole? myRole,  String? photoId,  DateTime? statusChangedAt)  $default,) {final _that = this;
switch (_that) {
case _SellerBody():
return $default(_that.address,_that.createdAt,_that.id,_that.latitude,_that.longitude,_that.name,_that.phone,_that.status,_that.updatedAt,_that.myRole,_that.photoId,_that.statusChangedAt);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String address,  DateTime createdAt,  String id,  double latitude,  double longitude,  String name,  String phone,  SellerBodyStatus status,  DateTime updatedAt,  SellerBodyMyRole? myRole,  String? photoId,  DateTime? statusChangedAt)?  $default,) {final _that = this;
switch (_that) {
case _SellerBody() when $default != null:
return $default(_that.address,_that.createdAt,_that.id,_that.latitude,_that.longitude,_that.name,_that.phone,_that.status,_that.updatedAt,_that.myRole,_that.photoId,_that.statusChangedAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _SellerBody implements SellerBody {
  const _SellerBody({required this.address, required this.createdAt, required this.id, required this.latitude, required this.longitude, required this.name, required this.phone, required this.status, required this.updatedAt, this.myRole, this.photoId, this.statusChangedAt});
  factory _SellerBody.fromJson(Map<String, dynamic> json) => _$SellerBodyFromJson(json);

@override final  String address;
@override final  DateTime createdAt;
@override final  String id;
@override final  double latitude;
@override final  double longitude;
@override final  String name;
@override final  String phone;
@override final  SellerBodyStatus status;
@override final  DateTime updatedAt;
/// The caller's role; absent for an admin who is not a member
@override final  SellerBodyMyRole? myRole;
/// Served at /photos/{photoId}/1600.jpg and /400.jpg
@override final  String? photoId;
@override final  DateTime? statusChangedAt;

/// Create a copy of SellerBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$SellerBodyCopyWith<_SellerBody> get copyWith => __$SellerBodyCopyWithImpl<_SellerBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$SellerBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _SellerBody&&(identical(other.address, address) || other.address == address)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.id, id) || other.id == id)&&(identical(other.latitude, latitude) || other.latitude == latitude)&&(identical(other.longitude, longitude) || other.longitude == longitude)&&(identical(other.name, name) || other.name == name)&&(identical(other.phone, phone) || other.phone == phone)&&(identical(other.status, status) || other.status == status)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt)&&(identical(other.myRole, myRole) || other.myRole == myRole)&&(identical(other.photoId, photoId) || other.photoId == photoId)&&(identical(other.statusChangedAt, statusChangedAt) || other.statusChangedAt == statusChangedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,address,createdAt,id,latitude,longitude,name,phone,status,updatedAt,myRole,photoId,statusChangedAt);
}

@override
String toString() {
    return 'SellerBody(address: $address, createdAt: $createdAt, id: $id, latitude: $latitude, longitude: $longitude, name: $name, phone: $phone, status: $status, updatedAt: $updatedAt, myRole: $myRole, photoId: $photoId, statusChangedAt: $statusChangedAt)';
}


}

/// @nodoc
abstract mixin class _$SellerBodyCopyWith<$Res> implements $SellerBodyCopyWith<$Res> {
  factory _$SellerBodyCopyWith(_SellerBody value, $Res Function(_SellerBody) _then) = __$SellerBodyCopyWithImpl;
@override @useResult
$Res call({
 String address, DateTime createdAt, String id, double latitude, double longitude, String name, String phone, SellerBodyStatus status, DateTime updatedAt, SellerBodyMyRole? myRole, String? photoId, DateTime? statusChangedAt
});




}
/// @nodoc
class __$SellerBodyCopyWithImpl<$Res>
    implements _$SellerBodyCopyWith<$Res> {
  __$SellerBodyCopyWithImpl(this._self, this._then);

  final _SellerBody _self;
  final $Res Function(_SellerBody) _then;

/// Create a copy of SellerBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? address = null,Object? createdAt = null,Object? id = null,Object? latitude = null,Object? longitude = null,Object? name = null,Object? phone = null,Object? status = null,Object? updatedAt = null,Object? myRole = freezed,Object? photoId = freezed,Object? statusChangedAt = freezed,}) {
  return _then(_SellerBody(
address: null == address ? _self.address : address // ignore: cast_nullable_to_non_nullable
as String,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,latitude: null == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double,longitude: null == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,phone: null == phone ? _self.phone : phone // ignore: cast_nullable_to_non_nullable
as String,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as SellerBodyStatus,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,myRole: freezed == myRole ? _self.myRole : myRole // ignore: cast_nullable_to_non_nullable
as SellerBodyMyRole?,photoId: freezed == photoId ? _self.photoId : photoId // ignore: cast_nullable_to_non_nullable
as String?,statusChangedAt: freezed == statusChangedAt ? _self.statusChangedAt : statusChangedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,
  ));
}


}

// dart format on
