// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'admin_seller_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$AdminSellerBody {

 String get address; DateTime get createdAt; String get id; double get latitude; double get longitude; String get name; String get phone; AdminSellerBodyStatus get status; DateTime get updatedAt;/// When an admin deleted the seller, blocked, which waits for its orders still to finish; absent when it does not wait
 DateTime? get deletionRequestedAt;/// Absent when the owner deleted their account
 String? get ownerEmail;/// Served at /photos/{photoId}/1600.jpg and /400.jpg
 String? get photoId; DateTime? get statusChangedAt;/// Why an admin rejected or blocked the seller, as the owner is told
 String? get statusReason;
/// Create a copy of AdminSellerBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AdminSellerBodyCopyWith<AdminSellerBody> get copyWith => _$AdminSellerBodyCopyWithImpl<AdminSellerBody>(this as AdminSellerBody, _$identity);

  /// Serializes this AdminSellerBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as AdminSellerBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AdminSellerBody&&(identical(other.address, _this.address) || other.address == _this.address)&&(identical(other.createdAt, _this.createdAt) || other.createdAt == _this.createdAt)&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.latitude, _this.latitude) || other.latitude == _this.latitude)&&(identical(other.longitude, _this.longitude) || other.longitude == _this.longitude)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.phone, _this.phone) || other.phone == _this.phone)&&(identical(other.status, _this.status) || other.status == _this.status)&&(identical(other.updatedAt, _this.updatedAt) || other.updatedAt == _this.updatedAt)&&(identical(other.deletionRequestedAt, _this.deletionRequestedAt) || other.deletionRequestedAt == _this.deletionRequestedAt)&&(identical(other.ownerEmail, _this.ownerEmail) || other.ownerEmail == _this.ownerEmail)&&(identical(other.photoId, _this.photoId) || other.photoId == _this.photoId)&&(identical(other.statusChangedAt, _this.statusChangedAt) || other.statusChangedAt == _this.statusChangedAt)&&(identical(other.statusReason, _this.statusReason) || other.statusReason == _this.statusReason));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as AdminSellerBody;
  return Object.hash(runtimeType,_this.address,_this.createdAt,_this.id,_this.latitude,_this.longitude,_this.name,_this.phone,_this.status,_this.updatedAt,_this.deletionRequestedAt,_this.ownerEmail,_this.photoId,_this.statusChangedAt,_this.statusReason);
}

@override
String toString() {
  final _this = this as AdminSellerBody;
  return 'AdminSellerBody(address: ${_this.address}, createdAt: ${_this.createdAt}, id: ${_this.id}, latitude: ${_this.latitude}, longitude: ${_this.longitude}, name: ${_this.name}, phone: ${_this.phone}, status: ${_this.status}, updatedAt: ${_this.updatedAt}, deletionRequestedAt: ${_this.deletionRequestedAt}, ownerEmail: ${_this.ownerEmail}, photoId: ${_this.photoId}, statusChangedAt: ${_this.statusChangedAt}, statusReason: ${_this.statusReason})';
}


}

/// @nodoc
abstract mixin class $AdminSellerBodyCopyWith<$Res>  {
  factory $AdminSellerBodyCopyWith(AdminSellerBody value, $Res Function(AdminSellerBody) _then) = _$AdminSellerBodyCopyWithImpl;
@useResult
$Res call({
 String address, DateTime createdAt, String id, double latitude, double longitude, String name, String phone, AdminSellerBodyStatus status, DateTime updatedAt, DateTime? deletionRequestedAt, String? ownerEmail, String? photoId, DateTime? statusChangedAt, String? statusReason
});




}
/// @nodoc
class _$AdminSellerBodyCopyWithImpl<$Res>
    implements $AdminSellerBodyCopyWith<$Res> {
  _$AdminSellerBodyCopyWithImpl(this._self, this._then);

  final AdminSellerBody _self;
  final $Res Function(AdminSellerBody) _then;

/// Create a copy of AdminSellerBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? address = null,Object? createdAt = null,Object? id = null,Object? latitude = null,Object? longitude = null,Object? name = null,Object? phone = null,Object? status = null,Object? updatedAt = null,Object? deletionRequestedAt = freezed,Object? ownerEmail = freezed,Object? photoId = freezed,Object? statusChangedAt = freezed,Object? statusReason = freezed,}) {
  return _then(AdminSellerBody(
address: null == address ? _self.address : address // ignore: cast_nullable_to_non_nullable
as String,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,latitude: null == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double,longitude: null == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,phone: null == phone ? _self.phone : phone // ignore: cast_nullable_to_non_nullable
as String,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as AdminSellerBodyStatus,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,deletionRequestedAt: freezed == deletionRequestedAt ? _self.deletionRequestedAt : deletionRequestedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,ownerEmail: freezed == ownerEmail ? _self.ownerEmail : ownerEmail // ignore: cast_nullable_to_non_nullable
as String?,photoId: freezed == photoId ? _self.photoId : photoId // ignore: cast_nullable_to_non_nullable
as String?,statusChangedAt: freezed == statusChangedAt ? _self.statusChangedAt : statusChangedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,statusReason: freezed == statusReason ? _self.statusReason : statusReason // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [AdminSellerBody].
extension AdminSellerBodyPatterns on AdminSellerBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AdminSellerBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AdminSellerBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AdminSellerBody value)  $default,){
final _that = this;
switch (_that) {
case _AdminSellerBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AdminSellerBody value)?  $default,){
final _that = this;
switch (_that) {
case _AdminSellerBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String address,  DateTime createdAt,  String id,  double latitude,  double longitude,  String name,  String phone,  AdminSellerBodyStatus status,  DateTime updatedAt,  DateTime? deletionRequestedAt,  String? ownerEmail,  String? photoId,  DateTime? statusChangedAt,  String? statusReason)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AdminSellerBody() when $default != null:
return $default(_that.address,_that.createdAt,_that.id,_that.latitude,_that.longitude,_that.name,_that.phone,_that.status,_that.updatedAt,_that.deletionRequestedAt,_that.ownerEmail,_that.photoId,_that.statusChangedAt,_that.statusReason);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String address,  DateTime createdAt,  String id,  double latitude,  double longitude,  String name,  String phone,  AdminSellerBodyStatus status,  DateTime updatedAt,  DateTime? deletionRequestedAt,  String? ownerEmail,  String? photoId,  DateTime? statusChangedAt,  String? statusReason)  $default,) {final _that = this;
switch (_that) {
case _AdminSellerBody():
return $default(_that.address,_that.createdAt,_that.id,_that.latitude,_that.longitude,_that.name,_that.phone,_that.status,_that.updatedAt,_that.deletionRequestedAt,_that.ownerEmail,_that.photoId,_that.statusChangedAt,_that.statusReason);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String address,  DateTime createdAt,  String id,  double latitude,  double longitude,  String name,  String phone,  AdminSellerBodyStatus status,  DateTime updatedAt,  DateTime? deletionRequestedAt,  String? ownerEmail,  String? photoId,  DateTime? statusChangedAt,  String? statusReason)?  $default,) {final _that = this;
switch (_that) {
case _AdminSellerBody() when $default != null:
return $default(_that.address,_that.createdAt,_that.id,_that.latitude,_that.longitude,_that.name,_that.phone,_that.status,_that.updatedAt,_that.deletionRequestedAt,_that.ownerEmail,_that.photoId,_that.statusChangedAt,_that.statusReason);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _AdminSellerBody implements AdminSellerBody {
  const _AdminSellerBody({required this.address, required this.createdAt, required this.id, required this.latitude, required this.longitude, required this.name, required this.phone, required this.status, required this.updatedAt, this.deletionRequestedAt, this.ownerEmail, this.photoId, this.statusChangedAt, this.statusReason});
  factory _AdminSellerBody.fromJson(Map<String, dynamic> json) => _$AdminSellerBodyFromJson(json);

@override final  String address;
@override final  DateTime createdAt;
@override final  String id;
@override final  double latitude;
@override final  double longitude;
@override final  String name;
@override final  String phone;
@override final  AdminSellerBodyStatus status;
@override final  DateTime updatedAt;
/// When an admin deleted the seller, blocked, which waits for its orders still to finish; absent when it does not wait
@override final  DateTime? deletionRequestedAt;
/// Absent when the owner deleted their account
@override final  String? ownerEmail;
/// Served at /photos/{photoId}/1600.jpg and /400.jpg
@override final  String? photoId;
@override final  DateTime? statusChangedAt;
/// Why an admin rejected or blocked the seller, as the owner is told
@override final  String? statusReason;

/// Create a copy of AdminSellerBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AdminSellerBodyCopyWith<_AdminSellerBody> get copyWith => __$AdminSellerBodyCopyWithImpl<_AdminSellerBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AdminSellerBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _AdminSellerBody&&(identical(other.address, address) || other.address == address)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.id, id) || other.id == id)&&(identical(other.latitude, latitude) || other.latitude == latitude)&&(identical(other.longitude, longitude) || other.longitude == longitude)&&(identical(other.name, name) || other.name == name)&&(identical(other.phone, phone) || other.phone == phone)&&(identical(other.status, status) || other.status == status)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt)&&(identical(other.deletionRequestedAt, deletionRequestedAt) || other.deletionRequestedAt == deletionRequestedAt)&&(identical(other.ownerEmail, ownerEmail) || other.ownerEmail == ownerEmail)&&(identical(other.photoId, photoId) || other.photoId == photoId)&&(identical(other.statusChangedAt, statusChangedAt) || other.statusChangedAt == statusChangedAt)&&(identical(other.statusReason, statusReason) || other.statusReason == statusReason));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,address,createdAt,id,latitude,longitude,name,phone,status,updatedAt,deletionRequestedAt,ownerEmail,photoId,statusChangedAt,statusReason);
}

@override
String toString() {
    return 'AdminSellerBody(address: $address, createdAt: $createdAt, id: $id, latitude: $latitude, longitude: $longitude, name: $name, phone: $phone, status: $status, updatedAt: $updatedAt, deletionRequestedAt: $deletionRequestedAt, ownerEmail: $ownerEmail, photoId: $photoId, statusChangedAt: $statusChangedAt, statusReason: $statusReason)';
}


}

/// @nodoc
abstract mixin class _$AdminSellerBodyCopyWith<$Res> implements $AdminSellerBodyCopyWith<$Res> {
  factory _$AdminSellerBodyCopyWith(_AdminSellerBody value, $Res Function(_AdminSellerBody) _then) = __$AdminSellerBodyCopyWithImpl;
@override @useResult
$Res call({
 String address, DateTime createdAt, String id, double latitude, double longitude, String name, String phone, AdminSellerBodyStatus status, DateTime updatedAt, DateTime? deletionRequestedAt, String? ownerEmail, String? photoId, DateTime? statusChangedAt, String? statusReason
});




}
/// @nodoc
class __$AdminSellerBodyCopyWithImpl<$Res>
    implements _$AdminSellerBodyCopyWith<$Res> {
  __$AdminSellerBodyCopyWithImpl(this._self, this._then);

  final _AdminSellerBody _self;
  final $Res Function(_AdminSellerBody) _then;

/// Create a copy of AdminSellerBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? address = null,Object? createdAt = null,Object? id = null,Object? latitude = null,Object? longitude = null,Object? name = null,Object? phone = null,Object? status = null,Object? updatedAt = null,Object? deletionRequestedAt = freezed,Object? ownerEmail = freezed,Object? photoId = freezed,Object? statusChangedAt = freezed,Object? statusReason = freezed,}) {
  return _then(_AdminSellerBody(
address: null == address ? _self.address : address // ignore: cast_nullable_to_non_nullable
as String,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,latitude: null == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double,longitude: null == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,phone: null == phone ? _self.phone : phone // ignore: cast_nullable_to_non_nullable
as String,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as AdminSellerBodyStatus,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,deletionRequestedAt: freezed == deletionRequestedAt ? _self.deletionRequestedAt : deletionRequestedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,ownerEmail: freezed == ownerEmail ? _self.ownerEmail : ownerEmail // ignore: cast_nullable_to_non_nullable
as String?,photoId: freezed == photoId ? _self.photoId : photoId // ignore: cast_nullable_to_non_nullable
as String?,statusChangedAt: freezed == statusChangedAt ? _self.statusChangedAt : statusChangedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,statusReason: freezed == statusReason ? _self.statusReason : statusReason // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
