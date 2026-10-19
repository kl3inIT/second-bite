// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'session_output_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$SessionOutputBody {

 AccountBody get account;/// The session ends then unless it is used; each use moves the end 30 days on
 DateTime get expiresAt;/// Send it as Authorization: Bearer <token>; it is shown only now, and not when the cookie was asked for
 String? get token;
/// Create a copy of SessionOutputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$SessionOutputBodyCopyWith<SessionOutputBody> get copyWith => _$SessionOutputBodyCopyWithImpl<SessionOutputBody>(this as SessionOutputBody, _$identity);

  /// Serializes this SessionOutputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as SessionOutputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is SessionOutputBody&&(identical(other.account, _this.account) || other.account == _this.account)&&(identical(other.expiresAt, _this.expiresAt) || other.expiresAt == _this.expiresAt)&&(identical(other.token, _this.token) || other.token == _this.token));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as SessionOutputBody;
  return Object.hash(runtimeType,_this.account,_this.expiresAt,_this.token);
}

@override
String toString() {
  final _this = this as SessionOutputBody;
  return 'SessionOutputBody(account: ${_this.account}, expiresAt: ${_this.expiresAt}, token: ${_this.token})';
}


}

/// @nodoc
abstract mixin class $SessionOutputBodyCopyWith<$Res>  {
  factory $SessionOutputBodyCopyWith(SessionOutputBody value, $Res Function(SessionOutputBody) _then) = _$SessionOutputBodyCopyWithImpl;
@useResult
$Res call({
 AccountBody account, DateTime expiresAt, String? token
});


$AccountBodyCopyWith<$Res> get account;

}
/// @nodoc
class _$SessionOutputBodyCopyWithImpl<$Res>
    implements $SessionOutputBodyCopyWith<$Res> {
  _$SessionOutputBodyCopyWithImpl(this._self, this._then);

  final SessionOutputBody _self;
  final $Res Function(SessionOutputBody) _then;

/// Create a copy of SessionOutputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? account = null,Object? expiresAt = null,Object? token = freezed,}) {
  return _then(SessionOutputBody(
account: null == account ? _self.account : account // ignore: cast_nullable_to_non_nullable
as AccountBody,expiresAt: null == expiresAt ? _self.expiresAt : expiresAt // ignore: cast_nullable_to_non_nullable
as DateTime,token: freezed == token ? _self.token : token // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}
/// Create a copy of SessionOutputBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$AccountBodyCopyWith<$Res> get account {
  
  return $AccountBodyCopyWith<$Res>(_self.account, (value) {
    return _then(_self.copyWith(account: value));
  });
}
}


/// Adds pattern-matching-related methods to [SessionOutputBody].
extension SessionOutputBodyPatterns on SessionOutputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _SessionOutputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _SessionOutputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _SessionOutputBody value)  $default,){
final _that = this;
switch (_that) {
case _SessionOutputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _SessionOutputBody value)?  $default,){
final _that = this;
switch (_that) {
case _SessionOutputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( AccountBody account,  DateTime expiresAt,  String? token)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _SessionOutputBody() when $default != null:
return $default(_that.account,_that.expiresAt,_that.token);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( AccountBody account,  DateTime expiresAt,  String? token)  $default,) {final _that = this;
switch (_that) {
case _SessionOutputBody():
return $default(_that.account,_that.expiresAt,_that.token);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( AccountBody account,  DateTime expiresAt,  String? token)?  $default,) {final _that = this;
switch (_that) {
case _SessionOutputBody() when $default != null:
return $default(_that.account,_that.expiresAt,_that.token);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _SessionOutputBody implements SessionOutputBody {
  const _SessionOutputBody({required this.account, required this.expiresAt, this.token});
  factory _SessionOutputBody.fromJson(Map<String, dynamic> json) => _$SessionOutputBodyFromJson(json);

@override final  AccountBody account;
/// The session ends then unless it is used; each use moves the end 30 days on
@override final  DateTime expiresAt;
/// Send it as Authorization: Bearer <token>; it is shown only now, and not when the cookie was asked for
@override final  String? token;

/// Create a copy of SessionOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$SessionOutputBodyCopyWith<_SessionOutputBody> get copyWith => __$SessionOutputBodyCopyWithImpl<_SessionOutputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$SessionOutputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _SessionOutputBody&&(identical(other.account, account) || other.account == account)&&(identical(other.expiresAt, expiresAt) || other.expiresAt == expiresAt)&&(identical(other.token, token) || other.token == token));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,account,expiresAt,token);
}

@override
String toString() {
    return 'SessionOutputBody(account: $account, expiresAt: $expiresAt, token: $token)';
}


}

/// @nodoc
abstract mixin class _$SessionOutputBodyCopyWith<$Res> implements $SessionOutputBodyCopyWith<$Res> {
  factory _$SessionOutputBodyCopyWith(_SessionOutputBody value, $Res Function(_SessionOutputBody) _then) = __$SessionOutputBodyCopyWithImpl;
@override @useResult
$Res call({
 AccountBody account, DateTime expiresAt, String? token
});


@override $AccountBodyCopyWith<$Res> get account;

}
/// @nodoc
class __$SessionOutputBodyCopyWithImpl<$Res>
    implements _$SessionOutputBodyCopyWith<$Res> {
  __$SessionOutputBodyCopyWithImpl(this._self, this._then);

  final _SessionOutputBody _self;
  final $Res Function(_SessionOutputBody) _then;

/// Create a copy of SessionOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? account = null,Object? expiresAt = null,Object? token = freezed,}) {
  return _then(_SessionOutputBody(
account: null == account ? _self.account : account // ignore: cast_nullable_to_non_nullable
as AccountBody,expiresAt: null == expiresAt ? _self.expiresAt : expiresAt // ignore: cast_nullable_to_non_nullable
as DateTime,token: freezed == token ? _self.token : token // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

/// Create a copy of SessionOutputBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$AccountBodyCopyWith<$Res> get account {
  
  return $AccountBodyCopyWith<$Res>(_self.account, (value) {
    return _then(_self.copyWith(account: value));
  });
}
}

// dart format on
