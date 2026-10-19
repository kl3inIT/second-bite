// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'account_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$AccountBody {

/// Empty until Google gives one or the person sets it
 String get displayName; String get email; String get id; AccountBodyRole get role;
/// Create a copy of AccountBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AccountBodyCopyWith<AccountBody> get copyWith => _$AccountBodyCopyWithImpl<AccountBody>(this as AccountBody, _$identity);

  /// Serializes this AccountBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as AccountBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AccountBody&&(identical(other.displayName, _this.displayName) || other.displayName == _this.displayName)&&(identical(other.email, _this.email) || other.email == _this.email)&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.role, _this.role) || other.role == _this.role));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as AccountBody;
  return Object.hash(runtimeType,_this.displayName,_this.email,_this.id,_this.role);
}

@override
String toString() {
  final _this = this as AccountBody;
  return 'AccountBody(displayName: ${_this.displayName}, email: ${_this.email}, id: ${_this.id}, role: ${_this.role})';
}


}

/// @nodoc
abstract mixin class $AccountBodyCopyWith<$Res>  {
  factory $AccountBodyCopyWith(AccountBody value, $Res Function(AccountBody) _then) = _$AccountBodyCopyWithImpl;
@useResult
$Res call({
 String displayName, String email, String id, AccountBodyRole role
});




}
/// @nodoc
class _$AccountBodyCopyWithImpl<$Res>
    implements $AccountBodyCopyWith<$Res> {
  _$AccountBodyCopyWithImpl(this._self, this._then);

  final AccountBody _self;
  final $Res Function(AccountBody) _then;

/// Create a copy of AccountBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? displayName = null,Object? email = null,Object? id = null,Object? role = null,}) {
  return _then(AccountBody(
displayName: null == displayName ? _self.displayName : displayName // ignore: cast_nullable_to_non_nullable
as String,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,role: null == role ? _self.role : role // ignore: cast_nullable_to_non_nullable
as AccountBodyRole,
  ));
}

}


/// Adds pattern-matching-related methods to [AccountBody].
extension AccountBodyPatterns on AccountBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AccountBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AccountBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AccountBody value)  $default,){
final _that = this;
switch (_that) {
case _AccountBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AccountBody value)?  $default,){
final _that = this;
switch (_that) {
case _AccountBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String displayName,  String email,  String id,  AccountBodyRole role)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AccountBody() when $default != null:
return $default(_that.displayName,_that.email,_that.id,_that.role);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String displayName,  String email,  String id,  AccountBodyRole role)  $default,) {final _that = this;
switch (_that) {
case _AccountBody():
return $default(_that.displayName,_that.email,_that.id,_that.role);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String displayName,  String email,  String id,  AccountBodyRole role)?  $default,) {final _that = this;
switch (_that) {
case _AccountBody() when $default != null:
return $default(_that.displayName,_that.email,_that.id,_that.role);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _AccountBody implements AccountBody {
  const _AccountBody({required this.displayName, required this.email, required this.id, required this.role});
  factory _AccountBody.fromJson(Map<String, dynamic> json) => _$AccountBodyFromJson(json);

/// Empty until Google gives one or the person sets it
@override final  String displayName;
@override final  String email;
@override final  String id;
@override final  AccountBodyRole role;

/// Create a copy of AccountBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AccountBodyCopyWith<_AccountBody> get copyWith => __$AccountBodyCopyWithImpl<_AccountBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AccountBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _AccountBody&&(identical(other.displayName, displayName) || other.displayName == displayName)&&(identical(other.email, email) || other.email == email)&&(identical(other.id, id) || other.id == id)&&(identical(other.role, role) || other.role == role));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,displayName,email,id,role);
}

@override
String toString() {
    return 'AccountBody(displayName: $displayName, email: $email, id: $id, role: $role)';
}


}

/// @nodoc
abstract mixin class _$AccountBodyCopyWith<$Res> implements $AccountBodyCopyWith<$Res> {
  factory _$AccountBodyCopyWith(_AccountBody value, $Res Function(_AccountBody) _then) = __$AccountBodyCopyWithImpl;
@override @useResult
$Res call({
 String displayName, String email, String id, AccountBodyRole role
});




}
/// @nodoc
class __$AccountBodyCopyWithImpl<$Res>
    implements _$AccountBodyCopyWith<$Res> {
  __$AccountBodyCopyWithImpl(this._self, this._then);

  final _AccountBody _self;
  final $Res Function(_AccountBody) _then;

/// Create a copy of AccountBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? displayName = null,Object? email = null,Object? id = null,Object? role = null,}) {
  return _then(_AccountBody(
displayName: null == displayName ? _self.displayName : displayName // ignore: cast_nullable_to_non_nullable
as String,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,role: null == role ? _self.role : role // ignore: cast_nullable_to_non_nullable
as AccountBodyRole,
  ));
}


}

// dart format on
