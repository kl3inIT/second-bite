// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'register_input_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$RegisterInputBody {

/// 8 to 128 characters, not the username
 String get password;/// 3 to 30 characters: letters without marks, digits, dots, underscores and hyphens, the first and the last a letter or a digit; kept in lower case
 String get username;/// token: the token in the body (the mobile application); cookie: the session cookie instead (the web)
 RegisterInputBodySession get session;
/// Create a copy of RegisterInputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$RegisterInputBodyCopyWith<RegisterInputBody> get copyWith => _$RegisterInputBodyCopyWithImpl<RegisterInputBody>(this as RegisterInputBody, _$identity);

  /// Serializes this RegisterInputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as RegisterInputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is RegisterInputBody&&(identical(other.password, _this.password) || other.password == _this.password)&&(identical(other.username, _this.username) || other.username == _this.username)&&(identical(other.session, _this.session) || other.session == _this.session));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as RegisterInputBody;
  return Object.hash(runtimeType,_this.password,_this.username,_this.session);
}

@override
String toString() {
  final _this = this as RegisterInputBody;
  return 'RegisterInputBody(password: ${_this.password}, username: ${_this.username}, session: ${_this.session})';
}


}

/// @nodoc
abstract mixin class $RegisterInputBodyCopyWith<$Res>  {
  factory $RegisterInputBodyCopyWith(RegisterInputBody value, $Res Function(RegisterInputBody) _then) = _$RegisterInputBodyCopyWithImpl;
@useResult
$Res call({
 String password, String username, RegisterInputBodySession session
});




}
/// @nodoc
class _$RegisterInputBodyCopyWithImpl<$Res>
    implements $RegisterInputBodyCopyWith<$Res> {
  _$RegisterInputBodyCopyWithImpl(this._self, this._then);

  final RegisterInputBody _self;
  final $Res Function(RegisterInputBody) _then;

/// Create a copy of RegisterInputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? password = null,Object? username = null,Object? session = null,}) {
  return _then(RegisterInputBody(
password: null == password ? _self.password : password // ignore: cast_nullable_to_non_nullable
as String,username: null == username ? _self.username : username // ignore: cast_nullable_to_non_nullable
as String,session: null == session ? _self.session : session // ignore: cast_nullable_to_non_nullable
as RegisterInputBodySession,
  ));
}

}


/// Adds pattern-matching-related methods to [RegisterInputBody].
extension RegisterInputBodyPatterns on RegisterInputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _RegisterInputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _RegisterInputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _RegisterInputBody value)  $default,){
final _that = this;
switch (_that) {
case _RegisterInputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _RegisterInputBody value)?  $default,){
final _that = this;
switch (_that) {
case _RegisterInputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String password,  String username,  RegisterInputBodySession session)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _RegisterInputBody() when $default != null:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String password,  String username,  RegisterInputBodySession session)  $default,) {final _that = this;
switch (_that) {
case _RegisterInputBody():
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String password,  String username,  RegisterInputBodySession session)?  $default,) {final _that = this;
switch (_that) {
case _RegisterInputBody() when $default != null:
return $default(_that.password,_that.username,_that.session);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _RegisterInputBody implements RegisterInputBody {
  const _RegisterInputBody({required this.password, required this.username, this.session = RegisterInputBodySession.token});
  factory _RegisterInputBody.fromJson(Map<String, dynamic> json) => _$RegisterInputBodyFromJson(json);

/// 8 to 128 characters, not the username
@override final  String password;
/// 3 to 30 characters: letters without marks, digits, dots, underscores and hyphens, the first and the last a letter or a digit; kept in lower case
@override final  String username;
/// token: the token in the body (the mobile application); cookie: the session cookie instead (the web)
@override@JsonKey() final  RegisterInputBodySession session;

/// Create a copy of RegisterInputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$RegisterInputBodyCopyWith<_RegisterInputBody> get copyWith => __$RegisterInputBodyCopyWithImpl<_RegisterInputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$RegisterInputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _RegisterInputBody&&(identical(other.password, password) || other.password == password)&&(identical(other.username, username) || other.username == username)&&(identical(other.session, session) || other.session == session));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,password,username,session);
}

@override
String toString() {
    return 'RegisterInputBody(password: $password, username: $username, session: $session)';
}


}

/// @nodoc
abstract mixin class _$RegisterInputBodyCopyWith<$Res> implements $RegisterInputBodyCopyWith<$Res> {
  factory _$RegisterInputBodyCopyWith(_RegisterInputBody value, $Res Function(_RegisterInputBody) _then) = __$RegisterInputBodyCopyWithImpl;
@override @useResult
$Res call({
 String password, String username, RegisterInputBodySession session
});




}
/// @nodoc
class __$RegisterInputBodyCopyWithImpl<$Res>
    implements _$RegisterInputBodyCopyWith<$Res> {
  __$RegisterInputBodyCopyWithImpl(this._self, this._then);

  final _RegisterInputBody _self;
  final $Res Function(_RegisterInputBody) _then;

/// Create a copy of RegisterInputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? password = null,Object? username = null,Object? session = null,}) {
  return _then(_RegisterInputBody(
password: null == password ? _self.password : password // ignore: cast_nullable_to_non_nullable
as String,username: null == username ? _self.username : username // ignore: cast_nullable_to_non_nullable
as String,session: null == session ? _self.session : session // ignore: cast_nullable_to_non_nullable
as RegisterInputBodySession,
  ));
}


}

// dart format on
