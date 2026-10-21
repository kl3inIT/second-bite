// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'send_order_message_request.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$SendOrderMessageRequest {

/// Trimmed; 1 to 1,000 characters
 String get text;
/// Create a copy of SendOrderMessageRequest
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$SendOrderMessageRequestCopyWith<SendOrderMessageRequest> get copyWith => _$SendOrderMessageRequestCopyWithImpl<SendOrderMessageRequest>(this as SendOrderMessageRequest, _$identity);

  /// Serializes this SendOrderMessageRequest to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as SendOrderMessageRequest;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is SendOrderMessageRequest&&(identical(other.text, _this.text) || other.text == _this.text));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as SendOrderMessageRequest;
  return Object.hash(runtimeType,_this.text);
}

@override
String toString() {
  final _this = this as SendOrderMessageRequest;
  return 'SendOrderMessageRequest(text: ${_this.text})';
}


}

/// @nodoc
abstract mixin class $SendOrderMessageRequestCopyWith<$Res>  {
  factory $SendOrderMessageRequestCopyWith(SendOrderMessageRequest value, $Res Function(SendOrderMessageRequest) _then) = _$SendOrderMessageRequestCopyWithImpl;
@useResult
$Res call({
 String text
});




}
/// @nodoc
class _$SendOrderMessageRequestCopyWithImpl<$Res>
    implements $SendOrderMessageRequestCopyWith<$Res> {
  _$SendOrderMessageRequestCopyWithImpl(this._self, this._then);

  final SendOrderMessageRequest _self;
  final $Res Function(SendOrderMessageRequest) _then;

/// Create a copy of SendOrderMessageRequest
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? text = null,}) {
  return _then(SendOrderMessageRequest(
text: null == text ? _self.text : text // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [SendOrderMessageRequest].
extension SendOrderMessageRequestPatterns on SendOrderMessageRequest {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _SendOrderMessageRequest value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _SendOrderMessageRequest() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _SendOrderMessageRequest value)  $default,){
final _that = this;
switch (_that) {
case _SendOrderMessageRequest():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _SendOrderMessageRequest value)?  $default,){
final _that = this;
switch (_that) {
case _SendOrderMessageRequest() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String text)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _SendOrderMessageRequest() when $default != null:
return $default(_that.text);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String text)  $default,) {final _that = this;
switch (_that) {
case _SendOrderMessageRequest():
return $default(_that.text);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String text)?  $default,) {final _that = this;
switch (_that) {
case _SendOrderMessageRequest() when $default != null:
return $default(_that.text);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _SendOrderMessageRequest implements SendOrderMessageRequest {
  const _SendOrderMessageRequest({required this.text});
  factory _SendOrderMessageRequest.fromJson(Map<String, dynamic> json) => _$SendOrderMessageRequestFromJson(json);

/// Trimmed; 1 to 1,000 characters
@override final  String text;

/// Create a copy of SendOrderMessageRequest
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$SendOrderMessageRequestCopyWith<_SendOrderMessageRequest> get copyWith => __$SendOrderMessageRequestCopyWithImpl<_SendOrderMessageRequest>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$SendOrderMessageRequestToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _SendOrderMessageRequest&&(identical(other.text, text) || other.text == text));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,text);
}

@override
String toString() {
    return 'SendOrderMessageRequest(text: $text)';
}


}

/// @nodoc
abstract mixin class _$SendOrderMessageRequestCopyWith<$Res> implements $SendOrderMessageRequestCopyWith<$Res> {
  factory _$SendOrderMessageRequestCopyWith(_SendOrderMessageRequest value, $Res Function(_SendOrderMessageRequest) _then) = __$SendOrderMessageRequestCopyWithImpl;
@override @useResult
$Res call({
 String text
});




}
/// @nodoc
class __$SendOrderMessageRequestCopyWithImpl<$Res>
    implements _$SendOrderMessageRequestCopyWith<$Res> {
  __$SendOrderMessageRequestCopyWithImpl(this._self, this._then);

  final _SendOrderMessageRequest _self;
  final $Res Function(_SendOrderMessageRequest) _then;

/// Create a copy of SendOrderMessageRequest
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? text = null,}) {
  return _then(_SendOrderMessageRequest(
text: null == text ? _self.text : text // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
