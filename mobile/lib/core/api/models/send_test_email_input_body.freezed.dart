// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'send_test_email_input_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$SendTestEmailInputBody {

/// Who receives it; the admin sending it when empty
 String? get to;
/// Create a copy of SendTestEmailInputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$SendTestEmailInputBodyCopyWith<SendTestEmailInputBody> get copyWith => _$SendTestEmailInputBodyCopyWithImpl<SendTestEmailInputBody>(this as SendTestEmailInputBody, _$identity);

  /// Serializes this SendTestEmailInputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as SendTestEmailInputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is SendTestEmailInputBody&&(identical(other.to, _this.to) || other.to == _this.to));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as SendTestEmailInputBody;
  return Object.hash(runtimeType,_this.to);
}

@override
String toString() {
  final _this = this as SendTestEmailInputBody;
  return 'SendTestEmailInputBody(to: ${_this.to})';
}


}

/// @nodoc
abstract mixin class $SendTestEmailInputBodyCopyWith<$Res>  {
  factory $SendTestEmailInputBodyCopyWith(SendTestEmailInputBody value, $Res Function(SendTestEmailInputBody) _then) = _$SendTestEmailInputBodyCopyWithImpl;
@useResult
$Res call({
 String? to
});




}
/// @nodoc
class _$SendTestEmailInputBodyCopyWithImpl<$Res>
    implements $SendTestEmailInputBodyCopyWith<$Res> {
  _$SendTestEmailInputBodyCopyWithImpl(this._self, this._then);

  final SendTestEmailInputBody _self;
  final $Res Function(SendTestEmailInputBody) _then;

/// Create a copy of SendTestEmailInputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? to = freezed,}) {
  return _then(SendTestEmailInputBody(
to: freezed == to ? _self.to : to // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [SendTestEmailInputBody].
extension SendTestEmailInputBodyPatterns on SendTestEmailInputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _SendTestEmailInputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _SendTestEmailInputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _SendTestEmailInputBody value)  $default,){
final _that = this;
switch (_that) {
case _SendTestEmailInputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _SendTestEmailInputBody value)?  $default,){
final _that = this;
switch (_that) {
case _SendTestEmailInputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String? to)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _SendTestEmailInputBody() when $default != null:
return $default(_that.to);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String? to)  $default,) {final _that = this;
switch (_that) {
case _SendTestEmailInputBody():
return $default(_that.to);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String? to)?  $default,) {final _that = this;
switch (_that) {
case _SendTestEmailInputBody() when $default != null:
return $default(_that.to);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _SendTestEmailInputBody implements SendTestEmailInputBody {
  const _SendTestEmailInputBody({this.to});
  factory _SendTestEmailInputBody.fromJson(Map<String, dynamic> json) => _$SendTestEmailInputBodyFromJson(json);

/// Who receives it; the admin sending it when empty
@override final  String? to;

/// Create a copy of SendTestEmailInputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$SendTestEmailInputBodyCopyWith<_SendTestEmailInputBody> get copyWith => __$SendTestEmailInputBodyCopyWithImpl<_SendTestEmailInputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$SendTestEmailInputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _SendTestEmailInputBody&&(identical(other.to, to) || other.to == to));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,to);
}

@override
String toString() {
    return 'SendTestEmailInputBody(to: $to)';
}


}

/// @nodoc
abstract mixin class _$SendTestEmailInputBodyCopyWith<$Res> implements $SendTestEmailInputBodyCopyWith<$Res> {
  factory _$SendTestEmailInputBodyCopyWith(_SendTestEmailInputBody value, $Res Function(_SendTestEmailInputBody) _then) = __$SendTestEmailInputBodyCopyWithImpl;
@override @useResult
$Res call({
 String? to
});




}
/// @nodoc
class __$SendTestEmailInputBodyCopyWithImpl<$Res>
    implements _$SendTestEmailInputBodyCopyWith<$Res> {
  __$SendTestEmailInputBodyCopyWithImpl(this._self, this._then);

  final _SendTestEmailInputBody _self;
  final $Res Function(_SendTestEmailInputBody) _then;

/// Create a copy of SendTestEmailInputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? to = freezed,}) {
  return _then(_SendTestEmailInputBody(
to: freezed == to ? _self.to : to // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
