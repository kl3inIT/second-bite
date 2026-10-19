// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'request_code_output_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$RequestCodeOutputBody {

/// Send it back with the code
 String get challengeId; DateTime get expiresAt;
/// Create a copy of RequestCodeOutputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$RequestCodeOutputBodyCopyWith<RequestCodeOutputBody> get copyWith => _$RequestCodeOutputBodyCopyWithImpl<RequestCodeOutputBody>(this as RequestCodeOutputBody, _$identity);

  /// Serializes this RequestCodeOutputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as RequestCodeOutputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is RequestCodeOutputBody&&(identical(other.challengeId, _this.challengeId) || other.challengeId == _this.challengeId)&&(identical(other.expiresAt, _this.expiresAt) || other.expiresAt == _this.expiresAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as RequestCodeOutputBody;
  return Object.hash(runtimeType,_this.challengeId,_this.expiresAt);
}

@override
String toString() {
  final _this = this as RequestCodeOutputBody;
  return 'RequestCodeOutputBody(challengeId: ${_this.challengeId}, expiresAt: ${_this.expiresAt})';
}


}

/// @nodoc
abstract mixin class $RequestCodeOutputBodyCopyWith<$Res>  {
  factory $RequestCodeOutputBodyCopyWith(RequestCodeOutputBody value, $Res Function(RequestCodeOutputBody) _then) = _$RequestCodeOutputBodyCopyWithImpl;
@useResult
$Res call({
 String challengeId, DateTime expiresAt
});




}
/// @nodoc
class _$RequestCodeOutputBodyCopyWithImpl<$Res>
    implements $RequestCodeOutputBodyCopyWith<$Res> {
  _$RequestCodeOutputBodyCopyWithImpl(this._self, this._then);

  final RequestCodeOutputBody _self;
  final $Res Function(RequestCodeOutputBody) _then;

/// Create a copy of RequestCodeOutputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? challengeId = null,Object? expiresAt = null,}) {
  return _then(RequestCodeOutputBody(
challengeId: null == challengeId ? _self.challengeId : challengeId // ignore: cast_nullable_to_non_nullable
as String,expiresAt: null == expiresAt ? _self.expiresAt : expiresAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}

}


/// Adds pattern-matching-related methods to [RequestCodeOutputBody].
extension RequestCodeOutputBodyPatterns on RequestCodeOutputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _RequestCodeOutputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _RequestCodeOutputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _RequestCodeOutputBody value)  $default,){
final _that = this;
switch (_that) {
case _RequestCodeOutputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _RequestCodeOutputBody value)?  $default,){
final _that = this;
switch (_that) {
case _RequestCodeOutputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String challengeId,  DateTime expiresAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _RequestCodeOutputBody() when $default != null:
return $default(_that.challengeId,_that.expiresAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String challengeId,  DateTime expiresAt)  $default,) {final _that = this;
switch (_that) {
case _RequestCodeOutputBody():
return $default(_that.challengeId,_that.expiresAt);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String challengeId,  DateTime expiresAt)?  $default,) {final _that = this;
switch (_that) {
case _RequestCodeOutputBody() when $default != null:
return $default(_that.challengeId,_that.expiresAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _RequestCodeOutputBody implements RequestCodeOutputBody {
  const _RequestCodeOutputBody({required this.challengeId, required this.expiresAt});
  factory _RequestCodeOutputBody.fromJson(Map<String, dynamic> json) => _$RequestCodeOutputBodyFromJson(json);

/// Send it back with the code
@override final  String challengeId;
@override final  DateTime expiresAt;

/// Create a copy of RequestCodeOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$RequestCodeOutputBodyCopyWith<_RequestCodeOutputBody> get copyWith => __$RequestCodeOutputBodyCopyWithImpl<_RequestCodeOutputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$RequestCodeOutputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _RequestCodeOutputBody&&(identical(other.challengeId, challengeId) || other.challengeId == challengeId)&&(identical(other.expiresAt, expiresAt) || other.expiresAt == expiresAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,challengeId,expiresAt);
}

@override
String toString() {
    return 'RequestCodeOutputBody(challengeId: $challengeId, expiresAt: $expiresAt)';
}


}

/// @nodoc
abstract mixin class _$RequestCodeOutputBodyCopyWith<$Res> implements $RequestCodeOutputBodyCopyWith<$Res> {
  factory _$RequestCodeOutputBodyCopyWith(_RequestCodeOutputBody value, $Res Function(_RequestCodeOutputBody) _then) = __$RequestCodeOutputBodyCopyWithImpl;
@override @useResult
$Res call({
 String challengeId, DateTime expiresAt
});




}
/// @nodoc
class __$RequestCodeOutputBodyCopyWithImpl<$Res>
    implements _$RequestCodeOutputBodyCopyWith<$Res> {
  __$RequestCodeOutputBodyCopyWithImpl(this._self, this._then);

  final _RequestCodeOutputBody _self;
  final $Res Function(_RequestCodeOutputBody) _then;

/// Create a copy of RequestCodeOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? challengeId = null,Object? expiresAt = null,}) {
  return _then(_RequestCodeOutputBody(
challengeId: null == challengeId ? _self.challengeId : challengeId // ignore: cast_nullable_to_non_nullable
as String,expiresAt: null == expiresAt ? _self.expiresAt : expiresAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}


}

// dart format on
