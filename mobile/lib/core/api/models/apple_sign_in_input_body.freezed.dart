// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'apple_sign_in_input_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$AppleSignInInputBody {

/// The authorization code Apple's sheet handed the application, exchanged once for the token that revokes the access
 String get authorizationCode;/// The identity token Apple's sheet handed the application
 String get idToken;/// The value whose SHA-256 was given to Apple as the nonce
 String get nonce;/// token: the token in the body (the mobile application); cookie: the session cookie instead
 AppleSignInInputBodySession get session;/// The family name Apple shares on the first authorization only
 String? get familyName;/// The given name Apple shares on the first authorization only
 String? get givenName;
/// Create a copy of AppleSignInInputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AppleSignInInputBodyCopyWith<AppleSignInInputBody> get copyWith => _$AppleSignInInputBodyCopyWithImpl<AppleSignInInputBody>(this as AppleSignInInputBody, _$identity);

  /// Serializes this AppleSignInInputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as AppleSignInInputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AppleSignInInputBody&&(identical(other.authorizationCode, _this.authorizationCode) || other.authorizationCode == _this.authorizationCode)&&(identical(other.idToken, _this.idToken) || other.idToken == _this.idToken)&&(identical(other.nonce, _this.nonce) || other.nonce == _this.nonce)&&(identical(other.session, _this.session) || other.session == _this.session)&&(identical(other.familyName, _this.familyName) || other.familyName == _this.familyName)&&(identical(other.givenName, _this.givenName) || other.givenName == _this.givenName));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as AppleSignInInputBody;
  return Object.hash(runtimeType,_this.authorizationCode,_this.idToken,_this.nonce,_this.session,_this.familyName,_this.givenName);
}

@override
String toString() {
  final _this = this as AppleSignInInputBody;
  return 'AppleSignInInputBody(authorizationCode: ${_this.authorizationCode}, idToken: ${_this.idToken}, nonce: ${_this.nonce}, session: ${_this.session}, familyName: ${_this.familyName}, givenName: ${_this.givenName})';
}


}

/// @nodoc
abstract mixin class $AppleSignInInputBodyCopyWith<$Res>  {
  factory $AppleSignInInputBodyCopyWith(AppleSignInInputBody value, $Res Function(AppleSignInInputBody) _then) = _$AppleSignInInputBodyCopyWithImpl;
@useResult
$Res call({
 String authorizationCode, String idToken, String nonce, AppleSignInInputBodySession session, String? familyName, String? givenName
});




}
/// @nodoc
class _$AppleSignInInputBodyCopyWithImpl<$Res>
    implements $AppleSignInInputBodyCopyWith<$Res> {
  _$AppleSignInInputBodyCopyWithImpl(this._self, this._then);

  final AppleSignInInputBody _self;
  final $Res Function(AppleSignInInputBody) _then;

/// Create a copy of AppleSignInInputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? authorizationCode = null,Object? idToken = null,Object? nonce = null,Object? session = null,Object? familyName = freezed,Object? givenName = freezed,}) {
  return _then(AppleSignInInputBody(
authorizationCode: null == authorizationCode ? _self.authorizationCode : authorizationCode // ignore: cast_nullable_to_non_nullable
as String,idToken: null == idToken ? _self.idToken : idToken // ignore: cast_nullable_to_non_nullable
as String,nonce: null == nonce ? _self.nonce : nonce // ignore: cast_nullable_to_non_nullable
as String,session: null == session ? _self.session : session // ignore: cast_nullable_to_non_nullable
as AppleSignInInputBodySession,familyName: freezed == familyName ? _self.familyName : familyName // ignore: cast_nullable_to_non_nullable
as String?,givenName: freezed == givenName ? _self.givenName : givenName // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [AppleSignInInputBody].
extension AppleSignInInputBodyPatterns on AppleSignInInputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AppleSignInInputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AppleSignInInputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AppleSignInInputBody value)  $default,){
final _that = this;
switch (_that) {
case _AppleSignInInputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AppleSignInInputBody value)?  $default,){
final _that = this;
switch (_that) {
case _AppleSignInInputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String authorizationCode,  String idToken,  String nonce,  AppleSignInInputBodySession session,  String? familyName,  String? givenName)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AppleSignInInputBody() when $default != null:
return $default(_that.authorizationCode,_that.idToken,_that.nonce,_that.session,_that.familyName,_that.givenName);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String authorizationCode,  String idToken,  String nonce,  AppleSignInInputBodySession session,  String? familyName,  String? givenName)  $default,) {final _that = this;
switch (_that) {
case _AppleSignInInputBody():
return $default(_that.authorizationCode,_that.idToken,_that.nonce,_that.session,_that.familyName,_that.givenName);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String authorizationCode,  String idToken,  String nonce,  AppleSignInInputBodySession session,  String? familyName,  String? givenName)?  $default,) {final _that = this;
switch (_that) {
case _AppleSignInInputBody() when $default != null:
return $default(_that.authorizationCode,_that.idToken,_that.nonce,_that.session,_that.familyName,_that.givenName);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _AppleSignInInputBody implements AppleSignInInputBody {
  const _AppleSignInInputBody({required this.authorizationCode, required this.idToken, required this.nonce, this.session = AppleSignInInputBodySession.token, this.familyName, this.givenName});
  factory _AppleSignInInputBody.fromJson(Map<String, dynamic> json) => _$AppleSignInInputBodyFromJson(json);

/// The authorization code Apple's sheet handed the application, exchanged once for the token that revokes the access
@override final  String authorizationCode;
/// The identity token Apple's sheet handed the application
@override final  String idToken;
/// The value whose SHA-256 was given to Apple as the nonce
@override final  String nonce;
/// token: the token in the body (the mobile application); cookie: the session cookie instead
@override@JsonKey() final  AppleSignInInputBodySession session;
/// The family name Apple shares on the first authorization only
@override final  String? familyName;
/// The given name Apple shares on the first authorization only
@override final  String? givenName;

/// Create a copy of AppleSignInInputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AppleSignInInputBodyCopyWith<_AppleSignInInputBody> get copyWith => __$AppleSignInInputBodyCopyWithImpl<_AppleSignInInputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AppleSignInInputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _AppleSignInInputBody&&(identical(other.authorizationCode, authorizationCode) || other.authorizationCode == authorizationCode)&&(identical(other.idToken, idToken) || other.idToken == idToken)&&(identical(other.nonce, nonce) || other.nonce == nonce)&&(identical(other.session, session) || other.session == session)&&(identical(other.familyName, familyName) || other.familyName == familyName)&&(identical(other.givenName, givenName) || other.givenName == givenName));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,authorizationCode,idToken,nonce,session,familyName,givenName);
}

@override
String toString() {
    return 'AppleSignInInputBody(authorizationCode: $authorizationCode, idToken: $idToken, nonce: $nonce, session: $session, familyName: $familyName, givenName: $givenName)';
}


}

/// @nodoc
abstract mixin class _$AppleSignInInputBodyCopyWith<$Res> implements $AppleSignInInputBodyCopyWith<$Res> {
  factory _$AppleSignInInputBodyCopyWith(_AppleSignInInputBody value, $Res Function(_AppleSignInInputBody) _then) = __$AppleSignInInputBodyCopyWithImpl;
@override @useResult
$Res call({
 String authorizationCode, String idToken, String nonce, AppleSignInInputBodySession session, String? familyName, String? givenName
});




}
/// @nodoc
class __$AppleSignInInputBodyCopyWithImpl<$Res>
    implements _$AppleSignInInputBodyCopyWith<$Res> {
  __$AppleSignInInputBodyCopyWithImpl(this._self, this._then);

  final _AppleSignInInputBody _self;
  final $Res Function(_AppleSignInInputBody) _then;

/// Create a copy of AppleSignInInputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? authorizationCode = null,Object? idToken = null,Object? nonce = null,Object? session = null,Object? familyName = freezed,Object? givenName = freezed,}) {
  return _then(_AppleSignInInputBody(
authorizationCode: null == authorizationCode ? _self.authorizationCode : authorizationCode // ignore: cast_nullable_to_non_nullable
as String,idToken: null == idToken ? _self.idToken : idToken // ignore: cast_nullable_to_non_nullable
as String,nonce: null == nonce ? _self.nonce : nonce // ignore: cast_nullable_to_non_nullable
as String,session: null == session ? _self.session : session // ignore: cast_nullable_to_non_nullable
as AppleSignInInputBodySession,familyName: freezed == familyName ? _self.familyName : familyName // ignore: cast_nullable_to_non_nullable
as String?,givenName: freezed == givenName ? _self.givenName : givenName // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
