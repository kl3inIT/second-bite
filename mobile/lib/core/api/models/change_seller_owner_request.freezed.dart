// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'change_seller_owner_request.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$ChangeSellerOwnerRequest {

/// The new owner's address
 String get email;
/// Create a copy of ChangeSellerOwnerRequest
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ChangeSellerOwnerRequestCopyWith<ChangeSellerOwnerRequest> get copyWith => _$ChangeSellerOwnerRequestCopyWithImpl<ChangeSellerOwnerRequest>(this as ChangeSellerOwnerRequest, _$identity);

  /// Serializes this ChangeSellerOwnerRequest to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as ChangeSellerOwnerRequest;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ChangeSellerOwnerRequest&&(identical(other.email, _this.email) || other.email == _this.email));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as ChangeSellerOwnerRequest;
  return Object.hash(runtimeType,_this.email);
}

@override
String toString() {
  final _this = this as ChangeSellerOwnerRequest;
  return 'ChangeSellerOwnerRequest(email: ${_this.email})';
}


}

/// @nodoc
abstract mixin class $ChangeSellerOwnerRequestCopyWith<$Res>  {
  factory $ChangeSellerOwnerRequestCopyWith(ChangeSellerOwnerRequest value, $Res Function(ChangeSellerOwnerRequest) _then) = _$ChangeSellerOwnerRequestCopyWithImpl;
@useResult
$Res call({
 String email
});




}
/// @nodoc
class _$ChangeSellerOwnerRequestCopyWithImpl<$Res>
    implements $ChangeSellerOwnerRequestCopyWith<$Res> {
  _$ChangeSellerOwnerRequestCopyWithImpl(this._self, this._then);

  final ChangeSellerOwnerRequest _self;
  final $Res Function(ChangeSellerOwnerRequest) _then;

/// Create a copy of ChangeSellerOwnerRequest
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? email = null,}) {
  return _then(ChangeSellerOwnerRequest(
email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [ChangeSellerOwnerRequest].
extension ChangeSellerOwnerRequestPatterns on ChangeSellerOwnerRequest {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ChangeSellerOwnerRequest value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ChangeSellerOwnerRequest() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ChangeSellerOwnerRequest value)  $default,){
final _that = this;
switch (_that) {
case _ChangeSellerOwnerRequest():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ChangeSellerOwnerRequest value)?  $default,){
final _that = this;
switch (_that) {
case _ChangeSellerOwnerRequest() when $default != null:
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
case _ChangeSellerOwnerRequest() when $default != null:
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
case _ChangeSellerOwnerRequest():
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
case _ChangeSellerOwnerRequest() when $default != null:
return $default(_that.email);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ChangeSellerOwnerRequest implements ChangeSellerOwnerRequest {
  const _ChangeSellerOwnerRequest({required this.email});
  factory _ChangeSellerOwnerRequest.fromJson(Map<String, dynamic> json) => _$ChangeSellerOwnerRequestFromJson(json);

/// The new owner's address
@override final  String email;

/// Create a copy of ChangeSellerOwnerRequest
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ChangeSellerOwnerRequestCopyWith<_ChangeSellerOwnerRequest> get copyWith => __$ChangeSellerOwnerRequestCopyWithImpl<_ChangeSellerOwnerRequest>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ChangeSellerOwnerRequestToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _ChangeSellerOwnerRequest&&(identical(other.email, email) || other.email == email));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,email);
}

@override
String toString() {
    return 'ChangeSellerOwnerRequest(email: $email)';
}


}

/// @nodoc
abstract mixin class _$ChangeSellerOwnerRequestCopyWith<$Res> implements $ChangeSellerOwnerRequestCopyWith<$Res> {
  factory _$ChangeSellerOwnerRequestCopyWith(_ChangeSellerOwnerRequest value, $Res Function(_ChangeSellerOwnerRequest) _then) = __$ChangeSellerOwnerRequestCopyWithImpl;
@override @useResult
$Res call({
 String email
});




}
/// @nodoc
class __$ChangeSellerOwnerRequestCopyWithImpl<$Res>
    implements _$ChangeSellerOwnerRequestCopyWith<$Res> {
  __$ChangeSellerOwnerRequestCopyWithImpl(this._self, this._then);

  final _ChangeSellerOwnerRequest _self;
  final $Res Function(_ChangeSellerOwnerRequest) _then;

/// Create a copy of ChangeSellerOwnerRequest
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? email = null,}) {
  return _then(_ChangeSellerOwnerRequest(
email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
