// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'offer_seller_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$OfferSellerBody {

 String get address; String get id; String get name; OfferPhotoBody? get photo;
/// Create a copy of OfferSellerBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$OfferSellerBodyCopyWith<OfferSellerBody> get copyWith => _$OfferSellerBodyCopyWithImpl<OfferSellerBody>(this as OfferSellerBody, _$identity);

  /// Serializes this OfferSellerBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as OfferSellerBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is OfferSellerBody&&(identical(other.address, _this.address) || other.address == _this.address)&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.photo, _this.photo) || other.photo == _this.photo));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as OfferSellerBody;
  return Object.hash(runtimeType,_this.address,_this.id,_this.name,_this.photo);
}

@override
String toString() {
  final _this = this as OfferSellerBody;
  return 'OfferSellerBody(address: ${_this.address}, id: ${_this.id}, name: ${_this.name}, photo: ${_this.photo})';
}


}

/// @nodoc
abstract mixin class $OfferSellerBodyCopyWith<$Res>  {
  factory $OfferSellerBodyCopyWith(OfferSellerBody value, $Res Function(OfferSellerBody) _then) = _$OfferSellerBodyCopyWithImpl;
@useResult
$Res call({
 String address, String id, String name, OfferPhotoBody? photo
});


$OfferPhotoBodyCopyWith<$Res>? get photo;

}
/// @nodoc
class _$OfferSellerBodyCopyWithImpl<$Res>
    implements $OfferSellerBodyCopyWith<$Res> {
  _$OfferSellerBodyCopyWithImpl(this._self, this._then);

  final OfferSellerBody _self;
  final $Res Function(OfferSellerBody) _then;

/// Create a copy of OfferSellerBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? address = null,Object? id = null,Object? name = null,Object? photo = freezed,}) {
  return _then(OfferSellerBody(
address: null == address ? _self.address : address // ignore: cast_nullable_to_non_nullable
as String,id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,photo: freezed == photo ? _self.photo : photo // ignore: cast_nullable_to_non_nullable
as OfferPhotoBody?,
  ));
}
/// Create a copy of OfferSellerBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$OfferPhotoBodyCopyWith<$Res>? get photo {
    if (_self.photo == null) {
    return null;
  }

  return $OfferPhotoBodyCopyWith<$Res>(_self.photo!, (value) {
    return _then(_self.copyWith(photo: value));
  });
}
}


/// Adds pattern-matching-related methods to [OfferSellerBody].
extension OfferSellerBodyPatterns on OfferSellerBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _OfferSellerBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _OfferSellerBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _OfferSellerBody value)  $default,){
final _that = this;
switch (_that) {
case _OfferSellerBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _OfferSellerBody value)?  $default,){
final _that = this;
switch (_that) {
case _OfferSellerBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String address,  String id,  String name,  OfferPhotoBody? photo)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _OfferSellerBody() when $default != null:
return $default(_that.address,_that.id,_that.name,_that.photo);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String address,  String id,  String name,  OfferPhotoBody? photo)  $default,) {final _that = this;
switch (_that) {
case _OfferSellerBody():
return $default(_that.address,_that.id,_that.name,_that.photo);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String address,  String id,  String name,  OfferPhotoBody? photo)?  $default,) {final _that = this;
switch (_that) {
case _OfferSellerBody() when $default != null:
return $default(_that.address,_that.id,_that.name,_that.photo);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _OfferSellerBody implements OfferSellerBody {
  const _OfferSellerBody({required this.address, required this.id, required this.name, this.photo});
  factory _OfferSellerBody.fromJson(Map<String, dynamic> json) => _$OfferSellerBodyFromJson(json);

@override final  String address;
@override final  String id;
@override final  String name;
@override final  OfferPhotoBody? photo;

/// Create a copy of OfferSellerBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$OfferSellerBodyCopyWith<_OfferSellerBody> get copyWith => __$OfferSellerBodyCopyWithImpl<_OfferSellerBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$OfferSellerBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _OfferSellerBody&&(identical(other.address, address) || other.address == address)&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.photo, photo) || other.photo == photo));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,address,id,name,photo);
}

@override
String toString() {
    return 'OfferSellerBody(address: $address, id: $id, name: $name, photo: $photo)';
}


}

/// @nodoc
abstract mixin class _$OfferSellerBodyCopyWith<$Res> implements $OfferSellerBodyCopyWith<$Res> {
  factory _$OfferSellerBodyCopyWith(_OfferSellerBody value, $Res Function(_OfferSellerBody) _then) = __$OfferSellerBodyCopyWithImpl;
@override @useResult
$Res call({
 String address, String id, String name, OfferPhotoBody? photo
});


@override $OfferPhotoBodyCopyWith<$Res>? get photo;

}
/// @nodoc
class __$OfferSellerBodyCopyWithImpl<$Res>
    implements _$OfferSellerBodyCopyWith<$Res> {
  __$OfferSellerBodyCopyWithImpl(this._self, this._then);

  final _OfferSellerBody _self;
  final $Res Function(_OfferSellerBody) _then;

/// Create a copy of OfferSellerBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? address = null,Object? id = null,Object? name = null,Object? photo = freezed,}) {
  return _then(_OfferSellerBody(
address: null == address ? _self.address : address // ignore: cast_nullable_to_non_nullable
as String,id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,photo: freezed == photo ? _self.photo : photo // ignore: cast_nullable_to_non_nullable
as OfferPhotoBody?,
  ));
}

/// Create a copy of OfferSellerBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$OfferPhotoBodyCopyWith<$Res>? get photo {
    if (_self.photo == null) {
    return null;
  }

  return $OfferPhotoBodyCopyWith<$Res>(_self.photo!, (value) {
    return _then(_self.copyWith(photo: value));
  });
}
}

// dart format on
