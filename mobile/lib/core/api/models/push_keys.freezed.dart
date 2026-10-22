// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'push_keys.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$PushKeys {

 String get auth; String get p256dh;
/// Create a copy of PushKeys
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$PushKeysCopyWith<PushKeys> get copyWith => _$PushKeysCopyWithImpl<PushKeys>(this as PushKeys, _$identity);

  /// Serializes this PushKeys to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as PushKeys;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is PushKeys&&(identical(other.auth, _this.auth) || other.auth == _this.auth)&&(identical(other.p256dh, _this.p256dh) || other.p256dh == _this.p256dh));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as PushKeys;
  return Object.hash(runtimeType,_this.auth,_this.p256dh);
}

@override
String toString() {
  final _this = this as PushKeys;
  return 'PushKeys(auth: ${_this.auth}, p256dh: ${_this.p256dh})';
}


}

/// @nodoc
abstract mixin class $PushKeysCopyWith<$Res>  {
  factory $PushKeysCopyWith(PushKeys value, $Res Function(PushKeys) _then) = _$PushKeysCopyWithImpl;
@useResult
$Res call({
 String auth, String p256dh
});




}
/// @nodoc
class _$PushKeysCopyWithImpl<$Res>
    implements $PushKeysCopyWith<$Res> {
  _$PushKeysCopyWithImpl(this._self, this._then);

  final PushKeys _self;
  final $Res Function(PushKeys) _then;

/// Create a copy of PushKeys
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? auth = null,Object? p256dh = null,}) {
  return _then(PushKeys(
auth: null == auth ? _self.auth : auth // ignore: cast_nullable_to_non_nullable
as String,p256dh: null == p256dh ? _self.p256dh : p256dh // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [PushKeys].
extension PushKeysPatterns on PushKeys {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _PushKeys value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _PushKeys() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _PushKeys value)  $default,){
final _that = this;
switch (_that) {
case _PushKeys():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _PushKeys value)?  $default,){
final _that = this;
switch (_that) {
case _PushKeys() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String auth,  String p256dh)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _PushKeys() when $default != null:
return $default(_that.auth,_that.p256dh);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String auth,  String p256dh)  $default,) {final _that = this;
switch (_that) {
case _PushKeys():
return $default(_that.auth,_that.p256dh);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String auth,  String p256dh)?  $default,) {final _that = this;
switch (_that) {
case _PushKeys() when $default != null:
return $default(_that.auth,_that.p256dh);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _PushKeys implements PushKeys {
  const _PushKeys({required this.auth, required this.p256dh});
  factory _PushKeys.fromJson(Map<String, dynamic> json) => _$PushKeysFromJson(json);

@override final  String auth;
@override final  String p256dh;

/// Create a copy of PushKeys
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$PushKeysCopyWith<_PushKeys> get copyWith => __$PushKeysCopyWithImpl<_PushKeys>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$PushKeysToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _PushKeys&&(identical(other.auth, auth) || other.auth == auth)&&(identical(other.p256dh, p256dh) || other.p256dh == p256dh));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,auth,p256dh);
}

@override
String toString() {
    return 'PushKeys(auth: $auth, p256dh: $p256dh)';
}


}

/// @nodoc
abstract mixin class _$PushKeysCopyWith<$Res> implements $PushKeysCopyWith<$Res> {
  factory _$PushKeysCopyWith(_PushKeys value, $Res Function(_PushKeys) _then) = __$PushKeysCopyWithImpl;
@override @useResult
$Res call({
 String auth, String p256dh
});




}
/// @nodoc
class __$PushKeysCopyWithImpl<$Res>
    implements _$PushKeysCopyWith<$Res> {
  __$PushKeysCopyWithImpl(this._self, this._then);

  final _PushKeys _self;
  final $Res Function(_PushKeys) _then;

/// Create a copy of PushKeys
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? auth = null,Object? p256dh = null,}) {
  return _then(_PushKeys(
auth: null == auth ? _self.auth : auth // ignore: cast_nullable_to_non_nullable
as String,p256dh: null == p256dh ? _self.p256dh : p256dh // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
