// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'delete_account_with_password_input_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$DeleteAccountWithPasswordInputBody {

/// The account's password, which confirms the deletion
 String get password;
/// Create a copy of DeleteAccountWithPasswordInputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$DeleteAccountWithPasswordInputBodyCopyWith<DeleteAccountWithPasswordInputBody> get copyWith => _$DeleteAccountWithPasswordInputBodyCopyWithImpl<DeleteAccountWithPasswordInputBody>(this as DeleteAccountWithPasswordInputBody, _$identity);

  /// Serializes this DeleteAccountWithPasswordInputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as DeleteAccountWithPasswordInputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is DeleteAccountWithPasswordInputBody&&(identical(other.password, _this.password) || other.password == _this.password));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as DeleteAccountWithPasswordInputBody;
  return Object.hash(runtimeType,_this.password);
}

@override
String toString() {
  final _this = this as DeleteAccountWithPasswordInputBody;
  return 'DeleteAccountWithPasswordInputBody(password: ${_this.password})';
}


}

/// @nodoc
abstract mixin class $DeleteAccountWithPasswordInputBodyCopyWith<$Res>  {
  factory $DeleteAccountWithPasswordInputBodyCopyWith(DeleteAccountWithPasswordInputBody value, $Res Function(DeleteAccountWithPasswordInputBody) _then) = _$DeleteAccountWithPasswordInputBodyCopyWithImpl;
@useResult
$Res call({
 String password
});




}
/// @nodoc
class _$DeleteAccountWithPasswordInputBodyCopyWithImpl<$Res>
    implements $DeleteAccountWithPasswordInputBodyCopyWith<$Res> {
  _$DeleteAccountWithPasswordInputBodyCopyWithImpl(this._self, this._then);

  final DeleteAccountWithPasswordInputBody _self;
  final $Res Function(DeleteAccountWithPasswordInputBody) _then;

/// Create a copy of DeleteAccountWithPasswordInputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? password = null,}) {
  return _then(DeleteAccountWithPasswordInputBody(
password: null == password ? _self.password : password // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [DeleteAccountWithPasswordInputBody].
extension DeleteAccountWithPasswordInputBodyPatterns on DeleteAccountWithPasswordInputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _DeleteAccountWithPasswordInputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _DeleteAccountWithPasswordInputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _DeleteAccountWithPasswordInputBody value)  $default,){
final _that = this;
switch (_that) {
case _DeleteAccountWithPasswordInputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _DeleteAccountWithPasswordInputBody value)?  $default,){
final _that = this;
switch (_that) {
case _DeleteAccountWithPasswordInputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String password)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _DeleteAccountWithPasswordInputBody() when $default != null:
return $default(_that.password);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String password)  $default,) {final _that = this;
switch (_that) {
case _DeleteAccountWithPasswordInputBody():
return $default(_that.password);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String password)?  $default,) {final _that = this;
switch (_that) {
case _DeleteAccountWithPasswordInputBody() when $default != null:
return $default(_that.password);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _DeleteAccountWithPasswordInputBody implements DeleteAccountWithPasswordInputBody {
  const _DeleteAccountWithPasswordInputBody({required this.password});
  factory _DeleteAccountWithPasswordInputBody.fromJson(Map<String, dynamic> json) => _$DeleteAccountWithPasswordInputBodyFromJson(json);

/// The account's password, which confirms the deletion
@override final  String password;

/// Create a copy of DeleteAccountWithPasswordInputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$DeleteAccountWithPasswordInputBodyCopyWith<_DeleteAccountWithPasswordInputBody> get copyWith => __$DeleteAccountWithPasswordInputBodyCopyWithImpl<_DeleteAccountWithPasswordInputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$DeleteAccountWithPasswordInputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _DeleteAccountWithPasswordInputBody&&(identical(other.password, password) || other.password == password));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,password);
}

@override
String toString() {
    return 'DeleteAccountWithPasswordInputBody(password: $password)';
}


}

/// @nodoc
abstract mixin class _$DeleteAccountWithPasswordInputBodyCopyWith<$Res> implements $DeleteAccountWithPasswordInputBodyCopyWith<$Res> {
  factory _$DeleteAccountWithPasswordInputBodyCopyWith(_DeleteAccountWithPasswordInputBody value, $Res Function(_DeleteAccountWithPasswordInputBody) _then) = __$DeleteAccountWithPasswordInputBodyCopyWithImpl;
@override @useResult
$Res call({
 String password
});




}
/// @nodoc
class __$DeleteAccountWithPasswordInputBodyCopyWithImpl<$Res>
    implements _$DeleteAccountWithPasswordInputBodyCopyWith<$Res> {
  __$DeleteAccountWithPasswordInputBodyCopyWithImpl(this._self, this._then);

  final _DeleteAccountWithPasswordInputBody _self;
  final $Res Function(_DeleteAccountWithPasswordInputBody) _then;

/// Create a copy of DeleteAccountWithPasswordInputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? password = null,}) {
  return _then(_DeleteAccountWithPasswordInputBody(
password: null == password ? _self.password : password // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
