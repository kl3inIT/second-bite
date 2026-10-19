// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'google_method_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$GoogleMethodBody {

/// The OAuth client ID the web's Google button uses
 String get clientId;
/// Create a copy of GoogleMethodBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$GoogleMethodBodyCopyWith<GoogleMethodBody> get copyWith => _$GoogleMethodBodyCopyWithImpl<GoogleMethodBody>(this as GoogleMethodBody, _$identity);

  /// Serializes this GoogleMethodBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as GoogleMethodBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is GoogleMethodBody&&(identical(other.clientId, _this.clientId) || other.clientId == _this.clientId));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as GoogleMethodBody;
  return Object.hash(runtimeType,_this.clientId);
}

@override
String toString() {
  final _this = this as GoogleMethodBody;
  return 'GoogleMethodBody(clientId: ${_this.clientId})';
}


}

/// @nodoc
abstract mixin class $GoogleMethodBodyCopyWith<$Res>  {
  factory $GoogleMethodBodyCopyWith(GoogleMethodBody value, $Res Function(GoogleMethodBody) _then) = _$GoogleMethodBodyCopyWithImpl;
@useResult
$Res call({
 String clientId
});




}
/// @nodoc
class _$GoogleMethodBodyCopyWithImpl<$Res>
    implements $GoogleMethodBodyCopyWith<$Res> {
  _$GoogleMethodBodyCopyWithImpl(this._self, this._then);

  final GoogleMethodBody _self;
  final $Res Function(GoogleMethodBody) _then;

/// Create a copy of GoogleMethodBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? clientId = null,}) {
  return _then(GoogleMethodBody(
clientId: null == clientId ? _self.clientId : clientId // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [GoogleMethodBody].
extension GoogleMethodBodyPatterns on GoogleMethodBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _GoogleMethodBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _GoogleMethodBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _GoogleMethodBody value)  $default,){
final _that = this;
switch (_that) {
case _GoogleMethodBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _GoogleMethodBody value)?  $default,){
final _that = this;
switch (_that) {
case _GoogleMethodBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String clientId)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _GoogleMethodBody() when $default != null:
return $default(_that.clientId);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String clientId)  $default,) {final _that = this;
switch (_that) {
case _GoogleMethodBody():
return $default(_that.clientId);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String clientId)?  $default,) {final _that = this;
switch (_that) {
case _GoogleMethodBody() when $default != null:
return $default(_that.clientId);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _GoogleMethodBody implements GoogleMethodBody {
  const _GoogleMethodBody({required this.clientId});
  factory _GoogleMethodBody.fromJson(Map<String, dynamic> json) => _$GoogleMethodBodyFromJson(json);

/// The OAuth client ID the web's Google button uses
@override final  String clientId;

/// Create a copy of GoogleMethodBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$GoogleMethodBodyCopyWith<_GoogleMethodBody> get copyWith => __$GoogleMethodBodyCopyWithImpl<_GoogleMethodBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$GoogleMethodBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _GoogleMethodBody&&(identical(other.clientId, clientId) || other.clientId == clientId));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,clientId);
}

@override
String toString() {
    return 'GoogleMethodBody(clientId: $clientId)';
}


}

/// @nodoc
abstract mixin class _$GoogleMethodBodyCopyWith<$Res> implements $GoogleMethodBodyCopyWith<$Res> {
  factory _$GoogleMethodBodyCopyWith(_GoogleMethodBody value, $Res Function(_GoogleMethodBody) _then) = __$GoogleMethodBodyCopyWithImpl;
@override @useResult
$Res call({
 String clientId
});




}
/// @nodoc
class __$GoogleMethodBodyCopyWithImpl<$Res>
    implements _$GoogleMethodBodyCopyWith<$Res> {
  __$GoogleMethodBodyCopyWithImpl(this._self, this._then);

  final _GoogleMethodBody _self;
  final $Res Function(_GoogleMethodBody) _then;

/// Create a copy of GoogleMethodBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? clientId = null,}) {
  return _then(_GoogleMethodBody(
clientId: null == clientId ? _self.clientId : clientId // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
