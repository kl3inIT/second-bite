// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'add_seller_staff_request.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$AddSellerStaffRequest {

 String get email;
/// Create a copy of AddSellerStaffRequest
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AddSellerStaffRequestCopyWith<AddSellerStaffRequest> get copyWith => _$AddSellerStaffRequestCopyWithImpl<AddSellerStaffRequest>(this as AddSellerStaffRequest, _$identity);

  /// Serializes this AddSellerStaffRequest to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as AddSellerStaffRequest;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AddSellerStaffRequest&&(identical(other.email, _this.email) || other.email == _this.email));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as AddSellerStaffRequest;
  return Object.hash(runtimeType,_this.email);
}

@override
String toString() {
  final _this = this as AddSellerStaffRequest;
  return 'AddSellerStaffRequest(email: ${_this.email})';
}


}

/// @nodoc
abstract mixin class $AddSellerStaffRequestCopyWith<$Res>  {
  factory $AddSellerStaffRequestCopyWith(AddSellerStaffRequest value, $Res Function(AddSellerStaffRequest) _then) = _$AddSellerStaffRequestCopyWithImpl;
@useResult
$Res call({
 String email
});




}
/// @nodoc
class _$AddSellerStaffRequestCopyWithImpl<$Res>
    implements $AddSellerStaffRequestCopyWith<$Res> {
  _$AddSellerStaffRequestCopyWithImpl(this._self, this._then);

  final AddSellerStaffRequest _self;
  final $Res Function(AddSellerStaffRequest) _then;

/// Create a copy of AddSellerStaffRequest
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? email = null,}) {
  return _then(AddSellerStaffRequest(
email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [AddSellerStaffRequest].
extension AddSellerStaffRequestPatterns on AddSellerStaffRequest {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AddSellerStaffRequest value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AddSellerStaffRequest() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AddSellerStaffRequest value)  $default,){
final _that = this;
switch (_that) {
case _AddSellerStaffRequest():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AddSellerStaffRequest value)?  $default,){
final _that = this;
switch (_that) {
case _AddSellerStaffRequest() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String email)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AddSellerStaffRequest() when $default != null:
return $default(_that.email);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String email)  $default,) {final _that = this;
switch (_that) {
case _AddSellerStaffRequest():
return $default(_that.email);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String email)?  $default,) {final _that = this;
switch (_that) {
case _AddSellerStaffRequest() when $default != null:
return $default(_that.email);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _AddSellerStaffRequest implements AddSellerStaffRequest {
  const _AddSellerStaffRequest({required this.email});
  factory _AddSellerStaffRequest.fromJson(Map<String, dynamic> json) => _$AddSellerStaffRequestFromJson(json);

@override final  String email;

/// Create a copy of AddSellerStaffRequest
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AddSellerStaffRequestCopyWith<_AddSellerStaffRequest> get copyWith => __$AddSellerStaffRequestCopyWithImpl<_AddSellerStaffRequest>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AddSellerStaffRequestToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _AddSellerStaffRequest&&(identical(other.email, email) || other.email == email));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,email);
}

@override
String toString() {
    return 'AddSellerStaffRequest(email: $email)';
}


}

/// @nodoc
abstract mixin class _$AddSellerStaffRequestCopyWith<$Res> implements $AddSellerStaffRequestCopyWith<$Res> {
  factory _$AddSellerStaffRequestCopyWith(_AddSellerStaffRequest value, $Res Function(_AddSellerStaffRequest) _then) = __$AddSellerStaffRequestCopyWithImpl;
@override @useResult
$Res call({
 String email
});




}
/// @nodoc
class __$AddSellerStaffRequestCopyWithImpl<$Res>
    implements _$AddSellerStaffRequestCopyWith<$Res> {
  __$AddSellerStaffRequestCopyWithImpl(this._self, this._then);

  final _AddSellerStaffRequest _self;
  final $Res Function(_AddSellerStaffRequest) _then;

/// Create a copy of AddSellerStaffRequest
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? email = null,}) {
  return _then(_AddSellerStaffRequest(
email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
