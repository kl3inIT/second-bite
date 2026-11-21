// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'change_password_input_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$ChangePasswordInputBody {

/// The password the account has now, which confirms the change
 String get currentPassword;/// 8 to 128 characters, not the username
 String get newPassword;
/// Create a copy of ChangePasswordInputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ChangePasswordInputBodyCopyWith<ChangePasswordInputBody> get copyWith => _$ChangePasswordInputBodyCopyWithImpl<ChangePasswordInputBody>(this as ChangePasswordInputBody, _$identity);

  /// Serializes this ChangePasswordInputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as ChangePasswordInputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ChangePasswordInputBody&&(identical(other.currentPassword, _this.currentPassword) || other.currentPassword == _this.currentPassword)&&(identical(other.newPassword, _this.newPassword) || other.newPassword == _this.newPassword));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as ChangePasswordInputBody;
  return Object.hash(runtimeType,_this.currentPassword,_this.newPassword);
}

@override
String toString() {
  final _this = this as ChangePasswordInputBody;
  return 'ChangePasswordInputBody(currentPassword: ${_this.currentPassword}, newPassword: ${_this.newPassword})';
}


}

/// @nodoc
abstract mixin class $ChangePasswordInputBodyCopyWith<$Res>  {
  factory $ChangePasswordInputBodyCopyWith(ChangePasswordInputBody value, $Res Function(ChangePasswordInputBody) _then) = _$ChangePasswordInputBodyCopyWithImpl;
@useResult
$Res call({
 String currentPassword, String newPassword
});




}
/// @nodoc
class _$ChangePasswordInputBodyCopyWithImpl<$Res>
    implements $ChangePasswordInputBodyCopyWith<$Res> {
  _$ChangePasswordInputBodyCopyWithImpl(this._self, this._then);

  final ChangePasswordInputBody _self;
  final $Res Function(ChangePasswordInputBody) _then;

/// Create a copy of ChangePasswordInputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? currentPassword = null,Object? newPassword = null,}) {
  return _then(ChangePasswordInputBody(
currentPassword: null == currentPassword ? _self.currentPassword : currentPassword // ignore: cast_nullable_to_non_nullable
as String,newPassword: null == newPassword ? _self.newPassword : newPassword // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [ChangePasswordInputBody].
extension ChangePasswordInputBodyPatterns on ChangePasswordInputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ChangePasswordInputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ChangePasswordInputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ChangePasswordInputBody value)  $default,){
final _that = this;
switch (_that) {
case _ChangePasswordInputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ChangePasswordInputBody value)?  $default,){
final _that = this;
switch (_that) {
case _ChangePasswordInputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String currentPassword,  String newPassword)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ChangePasswordInputBody() when $default != null:
return $default(_that.currentPassword,_that.newPassword);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String currentPassword,  String newPassword)  $default,) {final _that = this;
switch (_that) {
case _ChangePasswordInputBody():
return $default(_that.currentPassword,_that.newPassword);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String currentPassword,  String newPassword)?  $default,) {final _that = this;
switch (_that) {
case _ChangePasswordInputBody() when $default != null:
return $default(_that.currentPassword,_that.newPassword);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ChangePasswordInputBody implements ChangePasswordInputBody {
  const _ChangePasswordInputBody({required this.currentPassword, required this.newPassword});
  factory _ChangePasswordInputBody.fromJson(Map<String, dynamic> json) => _$ChangePasswordInputBodyFromJson(json);

/// The password the account has now, which confirms the change
@override final  String currentPassword;
/// 8 to 128 characters, not the username
@override final  String newPassword;

/// Create a copy of ChangePasswordInputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ChangePasswordInputBodyCopyWith<_ChangePasswordInputBody> get copyWith => __$ChangePasswordInputBodyCopyWithImpl<_ChangePasswordInputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ChangePasswordInputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _ChangePasswordInputBody&&(identical(other.currentPassword, currentPassword) || other.currentPassword == currentPassword)&&(identical(other.newPassword, newPassword) || other.newPassword == newPassword));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,currentPassword,newPassword);
}

@override
String toString() {
    return 'ChangePasswordInputBody(currentPassword: $currentPassword, newPassword: $newPassword)';
}


}

/// @nodoc
abstract mixin class _$ChangePasswordInputBodyCopyWith<$Res> implements $ChangePasswordInputBodyCopyWith<$Res> {
  factory _$ChangePasswordInputBodyCopyWith(_ChangePasswordInputBody value, $Res Function(_ChangePasswordInputBody) _then) = __$ChangePasswordInputBodyCopyWithImpl;
@override @useResult
$Res call({
 String currentPassword, String newPassword
});




}
/// @nodoc
class __$ChangePasswordInputBodyCopyWithImpl<$Res>
    implements _$ChangePasswordInputBodyCopyWith<$Res> {
  __$ChangePasswordInputBodyCopyWithImpl(this._self, this._then);

  final _ChangePasswordInputBody _self;
  final $Res Function(_ChangePasswordInputBody) _then;

/// Create a copy of ChangePasswordInputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? currentPassword = null,Object? newPassword = null,}) {
  return _then(_ChangePasswordInputBody(
currentPassword: null == currentPassword ? _self.currentPassword : currentPassword // ignore: cast_nullable_to_non_nullable
as String,newPassword: null == newPassword ? _self.newPassword : newPassword // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
