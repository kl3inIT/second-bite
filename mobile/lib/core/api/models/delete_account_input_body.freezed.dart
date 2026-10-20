// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'delete_account_input_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$DeleteAccountInputBody {

 String get challengeId;/// The six digits of the deletion email
 String get code;
/// Create a copy of DeleteAccountInputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$DeleteAccountInputBodyCopyWith<DeleteAccountInputBody> get copyWith => _$DeleteAccountInputBodyCopyWithImpl<DeleteAccountInputBody>(this as DeleteAccountInputBody, _$identity);

  /// Serializes this DeleteAccountInputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as DeleteAccountInputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is DeleteAccountInputBody&&(identical(other.challengeId, _this.challengeId) || other.challengeId == _this.challengeId)&&(identical(other.code, _this.code) || other.code == _this.code));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as DeleteAccountInputBody;
  return Object.hash(runtimeType,_this.challengeId,_this.code);
}

@override
String toString() {
  final _this = this as DeleteAccountInputBody;
  return 'DeleteAccountInputBody(challengeId: ${_this.challengeId}, code: ${_this.code})';
}


}

/// @nodoc
abstract mixin class $DeleteAccountInputBodyCopyWith<$Res>  {
  factory $DeleteAccountInputBodyCopyWith(DeleteAccountInputBody value, $Res Function(DeleteAccountInputBody) _then) = _$DeleteAccountInputBodyCopyWithImpl;
@useResult
$Res call({
 String challengeId, String code
});




}
/// @nodoc
class _$DeleteAccountInputBodyCopyWithImpl<$Res>
    implements $DeleteAccountInputBodyCopyWith<$Res> {
  _$DeleteAccountInputBodyCopyWithImpl(this._self, this._then);

  final DeleteAccountInputBody _self;
  final $Res Function(DeleteAccountInputBody) _then;

/// Create a copy of DeleteAccountInputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? challengeId = null,Object? code = null,}) {
  return _then(DeleteAccountInputBody(
challengeId: null == challengeId ? _self.challengeId : challengeId // ignore: cast_nullable_to_non_nullable
as String,code: null == code ? _self.code : code // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [DeleteAccountInputBody].
extension DeleteAccountInputBodyPatterns on DeleteAccountInputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _DeleteAccountInputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _DeleteAccountInputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _DeleteAccountInputBody value)  $default,){
final _that = this;
switch (_that) {
case _DeleteAccountInputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _DeleteAccountInputBody value)?  $default,){
final _that = this;
switch (_that) {
case _DeleteAccountInputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String challengeId,  String code)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _DeleteAccountInputBody() when $default != null:
return $default(_that.challengeId,_that.code);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String challengeId,  String code)  $default,) {final _that = this;
switch (_that) {
case _DeleteAccountInputBody():
return $default(_that.challengeId,_that.code);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String challengeId,  String code)?  $default,) {final _that = this;
switch (_that) {
case _DeleteAccountInputBody() when $default != null:
return $default(_that.challengeId,_that.code);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _DeleteAccountInputBody implements DeleteAccountInputBody {
  const _DeleteAccountInputBody({required this.challengeId, required this.code});
  factory _DeleteAccountInputBody.fromJson(Map<String, dynamic> json) => _$DeleteAccountInputBodyFromJson(json);

@override final  String challengeId;
/// The six digits of the deletion email
@override final  String code;

/// Create a copy of DeleteAccountInputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$DeleteAccountInputBodyCopyWith<_DeleteAccountInputBody> get copyWith => __$DeleteAccountInputBodyCopyWithImpl<_DeleteAccountInputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$DeleteAccountInputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _DeleteAccountInputBody&&(identical(other.challengeId, challengeId) || other.challengeId == challengeId)&&(identical(other.code, code) || other.code == code));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,challengeId,code);
}

@override
String toString() {
    return 'DeleteAccountInputBody(challengeId: $challengeId, code: $code)';
}


}

/// @nodoc
abstract mixin class _$DeleteAccountInputBodyCopyWith<$Res> implements $DeleteAccountInputBodyCopyWith<$Res> {
  factory _$DeleteAccountInputBodyCopyWith(_DeleteAccountInputBody value, $Res Function(_DeleteAccountInputBody) _then) = __$DeleteAccountInputBodyCopyWithImpl;
@override @useResult
$Res call({
 String challengeId, String code
});




}
/// @nodoc
class __$DeleteAccountInputBodyCopyWithImpl<$Res>
    implements _$DeleteAccountInputBodyCopyWith<$Res> {
  __$DeleteAccountInputBodyCopyWithImpl(this._self, this._then);

  final _DeleteAccountInputBody _self;
  final $Res Function(_DeleteAccountInputBody) _then;

/// Create a copy of DeleteAccountInputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? challengeId = null,Object? code = null,}) {
  return _then(_DeleteAccountInputBody(
challengeId: null == challengeId ? _self.challengeId : challengeId // ignore: cast_nullable_to_non_nullable
as String,code: null == code ? _self.code : code // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
