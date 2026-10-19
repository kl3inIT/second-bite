// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'set_seller_photo_request.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$SetSellerPhotoRequest {

/// From POST /photos
 String get photoId;
/// Create a copy of SetSellerPhotoRequest
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$SetSellerPhotoRequestCopyWith<SetSellerPhotoRequest> get copyWith => _$SetSellerPhotoRequestCopyWithImpl<SetSellerPhotoRequest>(this as SetSellerPhotoRequest, _$identity);

  /// Serializes this SetSellerPhotoRequest to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as SetSellerPhotoRequest;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is SetSellerPhotoRequest&&(identical(other.photoId, _this.photoId) || other.photoId == _this.photoId));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as SetSellerPhotoRequest;
  return Object.hash(runtimeType,_this.photoId);
}

@override
String toString() {
  final _this = this as SetSellerPhotoRequest;
  return 'SetSellerPhotoRequest(photoId: ${_this.photoId})';
}


}

/// @nodoc
abstract mixin class $SetSellerPhotoRequestCopyWith<$Res>  {
  factory $SetSellerPhotoRequestCopyWith(SetSellerPhotoRequest value, $Res Function(SetSellerPhotoRequest) _then) = _$SetSellerPhotoRequestCopyWithImpl;
@useResult
$Res call({
 String photoId
});




}
/// @nodoc
class _$SetSellerPhotoRequestCopyWithImpl<$Res>
    implements $SetSellerPhotoRequestCopyWith<$Res> {
  _$SetSellerPhotoRequestCopyWithImpl(this._self, this._then);

  final SetSellerPhotoRequest _self;
  final $Res Function(SetSellerPhotoRequest) _then;

/// Create a copy of SetSellerPhotoRequest
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? photoId = null,}) {
  return _then(SetSellerPhotoRequest(
photoId: null == photoId ? _self.photoId : photoId // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [SetSellerPhotoRequest].
extension SetSellerPhotoRequestPatterns on SetSellerPhotoRequest {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _SetSellerPhotoRequest value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _SetSellerPhotoRequest() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _SetSellerPhotoRequest value)  $default,){
final _that = this;
switch (_that) {
case _SetSellerPhotoRequest():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _SetSellerPhotoRequest value)?  $default,){
final _that = this;
switch (_that) {
case _SetSellerPhotoRequest() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String photoId)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _SetSellerPhotoRequest() when $default != null:
return $default(_that.photoId);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String photoId)  $default,) {final _that = this;
switch (_that) {
case _SetSellerPhotoRequest():
return $default(_that.photoId);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String photoId)?  $default,) {final _that = this;
switch (_that) {
case _SetSellerPhotoRequest() when $default != null:
return $default(_that.photoId);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _SetSellerPhotoRequest implements SetSellerPhotoRequest {
  const _SetSellerPhotoRequest({required this.photoId});
  factory _SetSellerPhotoRequest.fromJson(Map<String, dynamic> json) => _$SetSellerPhotoRequestFromJson(json);

/// From POST /photos
@override final  String photoId;

/// Create a copy of SetSellerPhotoRequest
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$SetSellerPhotoRequestCopyWith<_SetSellerPhotoRequest> get copyWith => __$SetSellerPhotoRequestCopyWithImpl<_SetSellerPhotoRequest>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$SetSellerPhotoRequestToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _SetSellerPhotoRequest&&(identical(other.photoId, photoId) || other.photoId == photoId));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,photoId);
}

@override
String toString() {
    return 'SetSellerPhotoRequest(photoId: $photoId)';
}


}

/// @nodoc
abstract mixin class _$SetSellerPhotoRequestCopyWith<$Res> implements $SetSellerPhotoRequestCopyWith<$Res> {
  factory _$SetSellerPhotoRequestCopyWith(_SetSellerPhotoRequest value, $Res Function(_SetSellerPhotoRequest) _then) = __$SetSellerPhotoRequestCopyWithImpl;
@override @useResult
$Res call({
 String photoId
});




}
/// @nodoc
class __$SetSellerPhotoRequestCopyWithImpl<$Res>
    implements _$SetSellerPhotoRequestCopyWith<$Res> {
  __$SetSellerPhotoRequestCopyWithImpl(this._self, this._then);

  final _SetSellerPhotoRequest _self;
  final $Res Function(_SetSellerPhotoRequest) _then;

/// Create a copy of SetSellerPhotoRequest
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? photoId = null,}) {
  return _then(_SetSellerPhotoRequest(
photoId: null == photoId ? _self.photoId : photoId // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
