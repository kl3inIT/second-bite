// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'push_key_output_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$PushKeyOutputBody {

/// The VAPID public key, in base64url, for PushManager.subscribe's applicationServerKey
 String get publicKey;
/// Create a copy of PushKeyOutputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$PushKeyOutputBodyCopyWith<PushKeyOutputBody> get copyWith => _$PushKeyOutputBodyCopyWithImpl<PushKeyOutputBody>(this as PushKeyOutputBody, _$identity);

  /// Serializes this PushKeyOutputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as PushKeyOutputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is PushKeyOutputBody&&(identical(other.publicKey, _this.publicKey) || other.publicKey == _this.publicKey));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as PushKeyOutputBody;
  return Object.hash(runtimeType,_this.publicKey);
}

@override
String toString() {
  final _this = this as PushKeyOutputBody;
  return 'PushKeyOutputBody(publicKey: ${_this.publicKey})';
}


}

/// @nodoc
abstract mixin class $PushKeyOutputBodyCopyWith<$Res>  {
  factory $PushKeyOutputBodyCopyWith(PushKeyOutputBody value, $Res Function(PushKeyOutputBody) _then) = _$PushKeyOutputBodyCopyWithImpl;
@useResult
$Res call({
 String publicKey
});




}
/// @nodoc
class _$PushKeyOutputBodyCopyWithImpl<$Res>
    implements $PushKeyOutputBodyCopyWith<$Res> {
  _$PushKeyOutputBodyCopyWithImpl(this._self, this._then);

  final PushKeyOutputBody _self;
  final $Res Function(PushKeyOutputBody) _then;

/// Create a copy of PushKeyOutputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? publicKey = null,}) {
  return _then(PushKeyOutputBody(
publicKey: null == publicKey ? _self.publicKey : publicKey // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [PushKeyOutputBody].
extension PushKeyOutputBodyPatterns on PushKeyOutputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _PushKeyOutputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _PushKeyOutputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _PushKeyOutputBody value)  $default,){
final _that = this;
switch (_that) {
case _PushKeyOutputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _PushKeyOutputBody value)?  $default,){
final _that = this;
switch (_that) {
case _PushKeyOutputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String publicKey)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _PushKeyOutputBody() when $default != null:
return $default(_that.publicKey);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String publicKey)  $default,) {final _that = this;
switch (_that) {
case _PushKeyOutputBody():
return $default(_that.publicKey);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String publicKey)?  $default,) {final _that = this;
switch (_that) {
case _PushKeyOutputBody() when $default != null:
return $default(_that.publicKey);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _PushKeyOutputBody implements PushKeyOutputBody {
  const _PushKeyOutputBody({required this.publicKey});
  factory _PushKeyOutputBody.fromJson(Map<String, dynamic> json) => _$PushKeyOutputBodyFromJson(json);

/// The VAPID public key, in base64url, for PushManager.subscribe's applicationServerKey
@override final  String publicKey;

/// Create a copy of PushKeyOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$PushKeyOutputBodyCopyWith<_PushKeyOutputBody> get copyWith => __$PushKeyOutputBodyCopyWithImpl<_PushKeyOutputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$PushKeyOutputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _PushKeyOutputBody&&(identical(other.publicKey, publicKey) || other.publicKey == publicKey));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,publicKey);
}

@override
String toString() {
    return 'PushKeyOutputBody(publicKey: $publicKey)';
}


}

/// @nodoc
abstract mixin class _$PushKeyOutputBodyCopyWith<$Res> implements $PushKeyOutputBodyCopyWith<$Res> {
  factory _$PushKeyOutputBodyCopyWith(_PushKeyOutputBody value, $Res Function(_PushKeyOutputBody) _then) = __$PushKeyOutputBodyCopyWithImpl;
@override @useResult
$Res call({
 String publicKey
});




}
/// @nodoc
class __$PushKeyOutputBodyCopyWithImpl<$Res>
    implements _$PushKeyOutputBodyCopyWith<$Res> {
  __$PushKeyOutputBodyCopyWithImpl(this._self, this._then);

  final _PushKeyOutputBody _self;
  final $Res Function(_PushKeyOutputBody) _then;

/// Create a copy of PushKeyOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? publicKey = null,}) {
  return _then(_PushKeyOutputBody(
publicKey: null == publicKey ? _self.publicKey : publicKey // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
