// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'set_display_name_input_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$SetDisplayNameInputBody {

/// 1 to 50 characters once trimmed; Google never replaces it
 String get displayName;
/// Create a copy of SetDisplayNameInputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$SetDisplayNameInputBodyCopyWith<SetDisplayNameInputBody> get copyWith => _$SetDisplayNameInputBodyCopyWithImpl<SetDisplayNameInputBody>(this as SetDisplayNameInputBody, _$identity);

  /// Serializes this SetDisplayNameInputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as SetDisplayNameInputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is SetDisplayNameInputBody&&(identical(other.displayName, _this.displayName) || other.displayName == _this.displayName));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as SetDisplayNameInputBody;
  return Object.hash(runtimeType,_this.displayName);
}

@override
String toString() {
  final _this = this as SetDisplayNameInputBody;
  return 'SetDisplayNameInputBody(displayName: ${_this.displayName})';
}


}

/// @nodoc
abstract mixin class $SetDisplayNameInputBodyCopyWith<$Res>  {
  factory $SetDisplayNameInputBodyCopyWith(SetDisplayNameInputBody value, $Res Function(SetDisplayNameInputBody) _then) = _$SetDisplayNameInputBodyCopyWithImpl;
@useResult
$Res call({
 String displayName
});




}
/// @nodoc
class _$SetDisplayNameInputBodyCopyWithImpl<$Res>
    implements $SetDisplayNameInputBodyCopyWith<$Res> {
  _$SetDisplayNameInputBodyCopyWithImpl(this._self, this._then);

  final SetDisplayNameInputBody _self;
  final $Res Function(SetDisplayNameInputBody) _then;

/// Create a copy of SetDisplayNameInputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? displayName = null,}) {
  return _then(SetDisplayNameInputBody(
displayName: null == displayName ? _self.displayName : displayName // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [SetDisplayNameInputBody].
extension SetDisplayNameInputBodyPatterns on SetDisplayNameInputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _SetDisplayNameInputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _SetDisplayNameInputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _SetDisplayNameInputBody value)  $default,){
final _that = this;
switch (_that) {
case _SetDisplayNameInputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _SetDisplayNameInputBody value)?  $default,){
final _that = this;
switch (_that) {
case _SetDisplayNameInputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String displayName)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _SetDisplayNameInputBody() when $default != null:
return $default(_that.displayName);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String displayName)  $default,) {final _that = this;
switch (_that) {
case _SetDisplayNameInputBody():
return $default(_that.displayName);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String displayName)?  $default,) {final _that = this;
switch (_that) {
case _SetDisplayNameInputBody() when $default != null:
return $default(_that.displayName);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _SetDisplayNameInputBody implements SetDisplayNameInputBody {
  const _SetDisplayNameInputBody({required this.displayName});
  factory _SetDisplayNameInputBody.fromJson(Map<String, dynamic> json) => _$SetDisplayNameInputBodyFromJson(json);

/// 1 to 50 characters once trimmed; Google never replaces it
@override final  String displayName;

/// Create a copy of SetDisplayNameInputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$SetDisplayNameInputBodyCopyWith<_SetDisplayNameInputBody> get copyWith => __$SetDisplayNameInputBodyCopyWithImpl<_SetDisplayNameInputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$SetDisplayNameInputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _SetDisplayNameInputBody&&(identical(other.displayName, displayName) || other.displayName == displayName));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,displayName);
}

@override
String toString() {
    return 'SetDisplayNameInputBody(displayName: $displayName)';
}


}

/// @nodoc
abstract mixin class _$SetDisplayNameInputBodyCopyWith<$Res> implements $SetDisplayNameInputBodyCopyWith<$Res> {
  factory _$SetDisplayNameInputBodyCopyWith(_SetDisplayNameInputBody value, $Res Function(_SetDisplayNameInputBody) _then) = __$SetDisplayNameInputBodyCopyWithImpl;
@override @useResult
$Res call({
 String displayName
});




}
/// @nodoc
class __$SetDisplayNameInputBodyCopyWithImpl<$Res>
    implements _$SetDisplayNameInputBodyCopyWith<$Res> {
  __$SetDisplayNameInputBodyCopyWithImpl(this._self, this._then);

  final _SetDisplayNameInputBody _self;
  final $Res Function(_SetDisplayNameInputBody) _then;

/// Create a copy of SetDisplayNameInputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? displayName = null,}) {
  return _then(_SetDisplayNameInputBody(
displayName: null == displayName ? _self.displayName : displayName // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
