// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'unsubscribe_push_input_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$UnsubscribePushInputBody {

 String get endpoint;
/// Create a copy of UnsubscribePushInputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$UnsubscribePushInputBodyCopyWith<UnsubscribePushInputBody> get copyWith => _$UnsubscribePushInputBodyCopyWithImpl<UnsubscribePushInputBody>(this as UnsubscribePushInputBody, _$identity);

  /// Serializes this UnsubscribePushInputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as UnsubscribePushInputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is UnsubscribePushInputBody&&(identical(other.endpoint, _this.endpoint) || other.endpoint == _this.endpoint));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as UnsubscribePushInputBody;
  return Object.hash(runtimeType,_this.endpoint);
}

@override
String toString() {
  final _this = this as UnsubscribePushInputBody;
  return 'UnsubscribePushInputBody(endpoint: ${_this.endpoint})';
}


}

/// @nodoc
abstract mixin class $UnsubscribePushInputBodyCopyWith<$Res>  {
  factory $UnsubscribePushInputBodyCopyWith(UnsubscribePushInputBody value, $Res Function(UnsubscribePushInputBody) _then) = _$UnsubscribePushInputBodyCopyWithImpl;
@useResult
$Res call({
 String endpoint
});




}
/// @nodoc
class _$UnsubscribePushInputBodyCopyWithImpl<$Res>
    implements $UnsubscribePushInputBodyCopyWith<$Res> {
  _$UnsubscribePushInputBodyCopyWithImpl(this._self, this._then);

  final UnsubscribePushInputBody _self;
  final $Res Function(UnsubscribePushInputBody) _then;

/// Create a copy of UnsubscribePushInputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? endpoint = null,}) {
  return _then(UnsubscribePushInputBody(
endpoint: null == endpoint ? _self.endpoint : endpoint // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [UnsubscribePushInputBody].
extension UnsubscribePushInputBodyPatterns on UnsubscribePushInputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _UnsubscribePushInputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _UnsubscribePushInputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _UnsubscribePushInputBody value)  $default,){
final _that = this;
switch (_that) {
case _UnsubscribePushInputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _UnsubscribePushInputBody value)?  $default,){
final _that = this;
switch (_that) {
case _UnsubscribePushInputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String endpoint)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _UnsubscribePushInputBody() when $default != null:
return $default(_that.endpoint);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String endpoint)  $default,) {final _that = this;
switch (_that) {
case _UnsubscribePushInputBody():
return $default(_that.endpoint);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String endpoint)?  $default,) {final _that = this;
switch (_that) {
case _UnsubscribePushInputBody() when $default != null:
return $default(_that.endpoint);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _UnsubscribePushInputBody implements UnsubscribePushInputBody {
  const _UnsubscribePushInputBody({required this.endpoint});
  factory _UnsubscribePushInputBody.fromJson(Map<String, dynamic> json) => _$UnsubscribePushInputBodyFromJson(json);

@override final  String endpoint;

/// Create a copy of UnsubscribePushInputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$UnsubscribePushInputBodyCopyWith<_UnsubscribePushInputBody> get copyWith => __$UnsubscribePushInputBodyCopyWithImpl<_UnsubscribePushInputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$UnsubscribePushInputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _UnsubscribePushInputBody&&(identical(other.endpoint, endpoint) || other.endpoint == endpoint));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,endpoint);
}

@override
String toString() {
    return 'UnsubscribePushInputBody(endpoint: $endpoint)';
}


}

/// @nodoc
abstract mixin class _$UnsubscribePushInputBodyCopyWith<$Res> implements $UnsubscribePushInputBodyCopyWith<$Res> {
  factory _$UnsubscribePushInputBodyCopyWith(_UnsubscribePushInputBody value, $Res Function(_UnsubscribePushInputBody) _then) = __$UnsubscribePushInputBodyCopyWithImpl;
@override @useResult
$Res call({
 String endpoint
});




}
/// @nodoc
class __$UnsubscribePushInputBodyCopyWithImpl<$Res>
    implements _$UnsubscribePushInputBodyCopyWith<$Res> {
  __$UnsubscribePushInputBodyCopyWithImpl(this._self, this._then);

  final _UnsubscribePushInputBody _self;
  final $Res Function(_UnsubscribePushInputBody) _then;

/// Create a copy of UnsubscribePushInputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? endpoint = null,}) {
  return _then(_UnsubscribePushInputBody(
endpoint: null == endpoint ? _self.endpoint : endpoint // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
