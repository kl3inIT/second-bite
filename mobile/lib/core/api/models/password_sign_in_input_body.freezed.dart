// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'password_sign_in_input_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$PasswordSignInInputBody {

 String get password; String get username;/// token: the token in the body (the mobile application); cookie: the session cookie instead (the web)
 PasswordSignInInputBodySession get session;
/// Create a copy of PasswordSignInInputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$PasswordSignInInputBodyCopyWith<PasswordSignInInputBody> get copyWith => _$PasswordSignInInputBodyCopyWithImpl<PasswordSignInInputBody>(this as PasswordSignInInputBody, _$identity);

  /// Serializes this PasswordSignInInputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as PasswordSignInInputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is PasswordSignInInputBody&&(identical(other.password, _this.password) || other.password == _this.password)&&(identical(other.username, _this.username) || other.username == _this.username)&&(identical(other.session, _this.session) || other.session == _this.session));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as PasswordSignInInputBody;
  return Object.hash(runtimeType,_this.password,_this.username,_this.session);
}

@override
String toString() {
  final _this = this as PasswordSignInInputBody;
  return 'PasswordSignInInputBody(password: ${_this.password}, username: ${_this.username}, session: ${_this.session})';
}


}

/// @nodoc
abstract mixin class $PasswordSignInInputBodyCopyWith<$Res>  {
  factory $PasswordSignInInputBodyCopyWith(PasswordSignInInputBody value, $Res Function(PasswordSignInInputBody) _then) = _$PasswordSignInInputBodyCopyWithImpl;
@useResult
$Res call({
 String password, String username, PasswordSignInInputBodySession session
});




}
/// @nodoc
class _$PasswordSignInInputBodyCopyWithImpl<$Res>
    implements $PasswordSignInInputBodyCopyWith<$Res> {
  _$PasswordSignInInputBodyCopyWithImpl(this._self, this._then);

  final PasswordSignInInputBody _self;
  final $Res Function(PasswordSignInInputBody) _then;

/// Create a copy of PasswordSignInInputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? password = null,Object? username = null,Object? session = null,}) {
  return _then(PasswordSignInInputBody(
password: null == password ? _self.password : password // ignore: cast_nullable_to_non_nullable
as String,username: null == username ? _self.username : username // ignore: cast_nullable_to_non_nullable
as String,session: null == session ? _self.session : session // ignore: cast_nullable_to_non_nullable
as PasswordSignInInputBodySession,
  ));
}

}


/// Adds pattern-matching-related methods to [PasswordSignInInputBody].
extension PasswordSignInInputBodyPatterns on PasswordSignInInputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _PasswordSignInInputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _PasswordSignInInputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _PasswordSignInInputBody value)  $default,){
final _that = this;
switch (_that) {
case _PasswordSignInInputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _PasswordSignInInputBody value)?  $default,){
final _that = this;
switch (_that) {
case _PasswordSignInInputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String password,  String username,  PasswordSignInInputBodySession session)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _PasswordSignInInputBody() when $default != null:
return $default(_that.password,_that.username,_that.session);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String password,  String username,  PasswordSignInInputBodySession session)  $default,) {final _that = this;
switch (_that) {
case _PasswordSignInInputBody():
return $default(_that.password,_that.username,_that.session);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String password,  String username,  PasswordSignInInputBodySession session)?  $default,) {final _that = this;
switch (_that) {
case _PasswordSignInInputBody() when $default != null:
return $default(_that.password,_that.username,_that.session);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _PasswordSignInInputBody implements PasswordSignInInputBody {
  const _PasswordSignInInputBody({required this.password, required this.username, this.session = PasswordSignInInputBodySession.token});
  factory _PasswordSignInInputBody.fromJson(Map<String, dynamic> json) => _$PasswordSignInInputBodyFromJson(json);

@override final  String password;
@override final  String username;
/// token: the token in the body (the mobile application); cookie: the session cookie instead (the web)
@override@JsonKey() final  PasswordSignInInputBodySession session;

/// Create a copy of PasswordSignInInputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$PasswordSignInInputBodyCopyWith<_PasswordSignInInputBody> get copyWith => __$PasswordSignInInputBodyCopyWithImpl<_PasswordSignInInputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$PasswordSignInInputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _PasswordSignInInputBody&&(identical(other.password, password) || other.password == password)&&(identical(other.username, username) || other.username == username)&&(identical(other.session, session) || other.session == session));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,password,username,session);
}

@override
String toString() {
    return 'PasswordSignInInputBody(password: $password, username: $username, session: $session)';
}


}

/// @nodoc
abstract mixin class _$PasswordSignInInputBodyCopyWith<$Res> implements $PasswordSignInInputBodyCopyWith<$Res> {
  factory _$PasswordSignInInputBodyCopyWith(_PasswordSignInInputBody value, $Res Function(_PasswordSignInInputBody) _then) = __$PasswordSignInInputBodyCopyWithImpl;
@override @useResult
$Res call({
 String password, String username, PasswordSignInInputBodySession session
});




}
/// @nodoc
class __$PasswordSignInInputBodyCopyWithImpl<$Res>
    implements _$PasswordSignInInputBodyCopyWith<$Res> {
  __$PasswordSignInInputBodyCopyWithImpl(this._self, this._then);

  final _PasswordSignInInputBody _self;
  final $Res Function(_PasswordSignInInputBody) _then;

/// Create a copy of PasswordSignInInputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? password = null,Object? username = null,Object? session = null,}) {
  return _then(_PasswordSignInInputBody(
password: null == password ? _self.password : password // ignore: cast_nullable_to_non_nullable
as String,username: null == username ? _self.username : username // ignore: cast_nullable_to_non_nullable
as String,session: null == session ? _self.session : session // ignore: cast_nullable_to_non_nullable
as PasswordSignInInputBodySession,
  ));
}


}

// dart format on
