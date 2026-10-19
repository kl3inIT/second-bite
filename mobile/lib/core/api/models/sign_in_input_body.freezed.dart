// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'sign_in_input_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$SignInInputBody {

 String get challengeId;/// The six digits of the email
 String get code;/// token: the token in the body (the mobile application); cookie: the session cookie instead (the web)
 SignInInputBodySession get session;
/// Create a copy of SignInInputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$SignInInputBodyCopyWith<SignInInputBody> get copyWith => _$SignInInputBodyCopyWithImpl<SignInInputBody>(this as SignInInputBody, _$identity);

  /// Serializes this SignInInputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as SignInInputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is SignInInputBody&&(identical(other.challengeId, _this.challengeId) || other.challengeId == _this.challengeId)&&(identical(other.code, _this.code) || other.code == _this.code)&&(identical(other.session, _this.session) || other.session == _this.session));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as SignInInputBody;
  return Object.hash(runtimeType,_this.challengeId,_this.code,_this.session);
}

@override
String toString() {
  final _this = this as SignInInputBody;
  return 'SignInInputBody(challengeId: ${_this.challengeId}, code: ${_this.code}, session: ${_this.session})';
}


}

/// @nodoc
abstract mixin class $SignInInputBodyCopyWith<$Res>  {
  factory $SignInInputBodyCopyWith(SignInInputBody value, $Res Function(SignInInputBody) _then) = _$SignInInputBodyCopyWithImpl;
@useResult
$Res call({
 String challengeId, String code, SignInInputBodySession session
});




}
/// @nodoc
class _$SignInInputBodyCopyWithImpl<$Res>
    implements $SignInInputBodyCopyWith<$Res> {
  _$SignInInputBodyCopyWithImpl(this._self, this._then);

  final SignInInputBody _self;
  final $Res Function(SignInInputBody) _then;

/// Create a copy of SignInInputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? challengeId = null,Object? code = null,Object? session = null,}) {
  return _then(SignInInputBody(
challengeId: null == challengeId ? _self.challengeId : challengeId // ignore: cast_nullable_to_non_nullable
as String,code: null == code ? _self.code : code // ignore: cast_nullable_to_non_nullable
as String,session: null == session ? _self.session : session // ignore: cast_nullable_to_non_nullable
as SignInInputBodySession,
  ));
}

}


/// Adds pattern-matching-related methods to [SignInInputBody].
extension SignInInputBodyPatterns on SignInInputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _SignInInputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _SignInInputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _SignInInputBody value)  $default,){
final _that = this;
switch (_that) {
case _SignInInputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _SignInInputBody value)?  $default,){
final _that = this;
switch (_that) {
case _SignInInputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String challengeId,  String code,  SignInInputBodySession session)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _SignInInputBody() when $default != null:
return $default(_that.challengeId,_that.code,_that.session);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String challengeId,  String code,  SignInInputBodySession session)  $default,) {final _that = this;
switch (_that) {
case _SignInInputBody():
return $default(_that.challengeId,_that.code,_that.session);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String challengeId,  String code,  SignInInputBodySession session)?  $default,) {final _that = this;
switch (_that) {
case _SignInInputBody() when $default != null:
return $default(_that.challengeId,_that.code,_that.session);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _SignInInputBody implements SignInInputBody {
  const _SignInInputBody({required this.challengeId, required this.code, this.session = SignInInputBodySession.token});
  factory _SignInInputBody.fromJson(Map<String, dynamic> json) => _$SignInInputBodyFromJson(json);

@override final  String challengeId;
/// The six digits of the email
@override final  String code;
/// token: the token in the body (the mobile application); cookie: the session cookie instead (the web)
@override@JsonKey() final  SignInInputBodySession session;

/// Create a copy of SignInInputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$SignInInputBodyCopyWith<_SignInInputBody> get copyWith => __$SignInInputBodyCopyWithImpl<_SignInInputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$SignInInputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _SignInInputBody&&(identical(other.challengeId, challengeId) || other.challengeId == challengeId)&&(identical(other.code, code) || other.code == code)&&(identical(other.session, session) || other.session == session));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,challengeId,code,session);
}

@override
String toString() {
    return 'SignInInputBody(challengeId: $challengeId, code: $code, session: $session)';
}


}

/// @nodoc
abstract mixin class _$SignInInputBodyCopyWith<$Res> implements $SignInInputBodyCopyWith<$Res> {
  factory _$SignInInputBodyCopyWith(_SignInInputBody value, $Res Function(_SignInInputBody) _then) = __$SignInInputBodyCopyWithImpl;
@override @useResult
$Res call({
 String challengeId, String code, SignInInputBodySession session
});




}
/// @nodoc
class __$SignInInputBodyCopyWithImpl<$Res>
    implements _$SignInInputBodyCopyWith<$Res> {
  __$SignInInputBodyCopyWithImpl(this._self, this._then);

  final _SignInInputBody _self;
  final $Res Function(_SignInInputBody) _then;

/// Create a copy of SignInInputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? challengeId = null,Object? code = null,Object? session = null,}) {
  return _then(_SignInInputBody(
challengeId: null == challengeId ? _self.challengeId : challengeId // ignore: cast_nullable_to_non_nullable
as String,code: null == code ? _self.code : code // ignore: cast_nullable_to_non_nullable
as String,session: null == session ? _self.session : session // ignore: cast_nullable_to_non_nullable
as SignInInputBodySession,
  ));
}


}

// dart format on
