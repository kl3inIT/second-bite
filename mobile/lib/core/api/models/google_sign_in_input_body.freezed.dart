// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'google_sign_in_input_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$GoogleSignInInputBody {

/// The ID token Google's sign-in handed the page or the application
 String get idToken;/// token: the token in the body (the mobile application); cookie: the session cookie instead (the web)
 GoogleSignInInputBodySession get session;/// The value whose SHA-256 was given to Google as the nonce; required when the token carries one
 String? get nonce;
/// Create a copy of GoogleSignInInputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$GoogleSignInInputBodyCopyWith<GoogleSignInInputBody> get copyWith => _$GoogleSignInInputBodyCopyWithImpl<GoogleSignInInputBody>(this as GoogleSignInInputBody, _$identity);

  /// Serializes this GoogleSignInInputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as GoogleSignInInputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is GoogleSignInInputBody&&(identical(other.idToken, _this.idToken) || other.idToken == _this.idToken)&&(identical(other.session, _this.session) || other.session == _this.session)&&(identical(other.nonce, _this.nonce) || other.nonce == _this.nonce));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as GoogleSignInInputBody;
  return Object.hash(runtimeType,_this.idToken,_this.session,_this.nonce);
}

@override
String toString() {
  final _this = this as GoogleSignInInputBody;
  return 'GoogleSignInInputBody(idToken: ${_this.idToken}, session: ${_this.session}, nonce: ${_this.nonce})';
}


}

/// @nodoc
abstract mixin class $GoogleSignInInputBodyCopyWith<$Res>  {
  factory $GoogleSignInInputBodyCopyWith(GoogleSignInInputBody value, $Res Function(GoogleSignInInputBody) _then) = _$GoogleSignInInputBodyCopyWithImpl;
@useResult
$Res call({
 String idToken, GoogleSignInInputBodySession session, String? nonce
});




}
/// @nodoc
class _$GoogleSignInInputBodyCopyWithImpl<$Res>
    implements $GoogleSignInInputBodyCopyWith<$Res> {
  _$GoogleSignInInputBodyCopyWithImpl(this._self, this._then);

  final GoogleSignInInputBody _self;
  final $Res Function(GoogleSignInInputBody) _then;

/// Create a copy of GoogleSignInInputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? idToken = null,Object? session = null,Object? nonce = freezed,}) {
  return _then(GoogleSignInInputBody(
idToken: null == idToken ? _self.idToken : idToken // ignore: cast_nullable_to_non_nullable
as String,session: null == session ? _self.session : session // ignore: cast_nullable_to_non_nullable
as GoogleSignInInputBodySession,nonce: freezed == nonce ? _self.nonce : nonce // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [GoogleSignInInputBody].
extension GoogleSignInInputBodyPatterns on GoogleSignInInputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _GoogleSignInInputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _GoogleSignInInputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _GoogleSignInInputBody value)  $default,){
final _that = this;
switch (_that) {
case _GoogleSignInInputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _GoogleSignInInputBody value)?  $default,){
final _that = this;
switch (_that) {
case _GoogleSignInInputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String idToken,  GoogleSignInInputBodySession session,  String? nonce)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _GoogleSignInInputBody() when $default != null:
return $default(_that.idToken,_that.session,_that.nonce);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String idToken,  GoogleSignInInputBodySession session,  String? nonce)  $default,) {final _that = this;
switch (_that) {
case _GoogleSignInInputBody():
return $default(_that.idToken,_that.session,_that.nonce);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String idToken,  GoogleSignInInputBodySession session,  String? nonce)?  $default,) {final _that = this;
switch (_that) {
case _GoogleSignInInputBody() when $default != null:
return $default(_that.idToken,_that.session,_that.nonce);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _GoogleSignInInputBody implements GoogleSignInInputBody {
  const _GoogleSignInInputBody({required this.idToken, this.session = GoogleSignInInputBodySession.token, this.nonce});
  factory _GoogleSignInInputBody.fromJson(Map<String, dynamic> json) => _$GoogleSignInInputBodyFromJson(json);

/// The ID token Google's sign-in handed the page or the application
@override final  String idToken;
/// token: the token in the body (the mobile application); cookie: the session cookie instead (the web)
@override@JsonKey() final  GoogleSignInInputBodySession session;
/// The value whose SHA-256 was given to Google as the nonce; required when the token carries one
@override final  String? nonce;

/// Create a copy of GoogleSignInInputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$GoogleSignInInputBodyCopyWith<_GoogleSignInInputBody> get copyWith => __$GoogleSignInInputBodyCopyWithImpl<_GoogleSignInInputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$GoogleSignInInputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _GoogleSignInInputBody&&(identical(other.idToken, idToken) || other.idToken == idToken)&&(identical(other.session, session) || other.session == session)&&(identical(other.nonce, nonce) || other.nonce == nonce));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,idToken,session,nonce);
}

@override
String toString() {
    return 'GoogleSignInInputBody(idToken: $idToken, session: $session, nonce: $nonce)';
}


}

/// @nodoc
abstract mixin class _$GoogleSignInInputBodyCopyWith<$Res> implements $GoogleSignInInputBodyCopyWith<$Res> {
  factory _$GoogleSignInInputBodyCopyWith(_GoogleSignInInputBody value, $Res Function(_GoogleSignInInputBody) _then) = __$GoogleSignInInputBodyCopyWithImpl;
@override @useResult
$Res call({
 String idToken, GoogleSignInInputBodySession session, String? nonce
});




}
/// @nodoc
class __$GoogleSignInInputBodyCopyWithImpl<$Res>
    implements _$GoogleSignInInputBodyCopyWith<$Res> {
  __$GoogleSignInInputBodyCopyWithImpl(this._self, this._then);

  final _GoogleSignInInputBody _self;
  final $Res Function(_GoogleSignInInputBody) _then;

/// Create a copy of GoogleSignInInputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? idToken = null,Object? session = null,Object? nonce = freezed,}) {
  return _then(_GoogleSignInInputBody(
idToken: null == idToken ? _self.idToken : idToken // ignore: cast_nullable_to_non_nullable
as String,session: null == session ? _self.session : session // ignore: cast_nullable_to_non_nullable
as GoogleSignInInputBodySession,nonce: freezed == nonce ? _self.nonce : nonce // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
