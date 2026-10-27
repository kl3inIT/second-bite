// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'send_seller_feedback_request.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$SendSellerFeedbackRequest {

/// 1 to 1,000 characters, or SELLER_FEEDBACK_INVALID
 String get text;
/// Create a copy of SendSellerFeedbackRequest
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$SendSellerFeedbackRequestCopyWith<SendSellerFeedbackRequest> get copyWith => _$SendSellerFeedbackRequestCopyWithImpl<SendSellerFeedbackRequest>(this as SendSellerFeedbackRequest, _$identity);

  /// Serializes this SendSellerFeedbackRequest to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as SendSellerFeedbackRequest;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is SendSellerFeedbackRequest&&(identical(other.text, _this.text) || other.text == _this.text));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as SendSellerFeedbackRequest;
  return Object.hash(runtimeType,_this.text);
}

@override
String toString() {
  final _this = this as SendSellerFeedbackRequest;
  return 'SendSellerFeedbackRequest(text: ${_this.text})';
}


}

/// @nodoc
abstract mixin class $SendSellerFeedbackRequestCopyWith<$Res>  {
  factory $SendSellerFeedbackRequestCopyWith(SendSellerFeedbackRequest value, $Res Function(SendSellerFeedbackRequest) _then) = _$SendSellerFeedbackRequestCopyWithImpl;
@useResult
$Res call({
 String text
});




}
/// @nodoc
class _$SendSellerFeedbackRequestCopyWithImpl<$Res>
    implements $SendSellerFeedbackRequestCopyWith<$Res> {
  _$SendSellerFeedbackRequestCopyWithImpl(this._self, this._then);

  final SendSellerFeedbackRequest _self;
  final $Res Function(SendSellerFeedbackRequest) _then;

/// Create a copy of SendSellerFeedbackRequest
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? text = null,}) {
  return _then(SendSellerFeedbackRequest(
text: null == text ? _self.text : text // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [SendSellerFeedbackRequest].
extension SendSellerFeedbackRequestPatterns on SendSellerFeedbackRequest {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _SendSellerFeedbackRequest value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _SendSellerFeedbackRequest() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _SendSellerFeedbackRequest value)  $default,){
final _that = this;
switch (_that) {
case _SendSellerFeedbackRequest():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _SendSellerFeedbackRequest value)?  $default,){
final _that = this;
switch (_that) {
case _SendSellerFeedbackRequest() when $default != null:
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
case _SendSellerFeedbackRequest() when $default != null:
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
case _SendSellerFeedbackRequest():
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
case _SendSellerFeedbackRequest() when $default != null:
return $default(_that.text);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _SendSellerFeedbackRequest implements SendSellerFeedbackRequest {
  const _SendSellerFeedbackRequest({required this.text});
  factory _SendSellerFeedbackRequest.fromJson(Map<String, dynamic> json) => _$SendSellerFeedbackRequestFromJson(json);

/// 1 to 1,000 characters, or SELLER_FEEDBACK_INVALID
@override final  String text;

/// Create a copy of SendSellerFeedbackRequest
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$SendSellerFeedbackRequestCopyWith<_SendSellerFeedbackRequest> get copyWith => __$SendSellerFeedbackRequestCopyWithImpl<_SendSellerFeedbackRequest>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$SendSellerFeedbackRequestToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _SendSellerFeedbackRequest&&(identical(other.text, text) || other.text == text));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,text);
}

@override
String toString() {
    return 'SendSellerFeedbackRequest(text: $text)';
}


}

/// @nodoc
abstract mixin class _$SendSellerFeedbackRequestCopyWith<$Res> implements $SendSellerFeedbackRequestCopyWith<$Res> {
  factory _$SendSellerFeedbackRequestCopyWith(_SendSellerFeedbackRequest value, $Res Function(_SendSellerFeedbackRequest) _then) = __$SendSellerFeedbackRequestCopyWithImpl;
@override @useResult
$Res call({
 String text
});




}
/// @nodoc
class __$SendSellerFeedbackRequestCopyWithImpl<$Res>
    implements _$SendSellerFeedbackRequestCopyWith<$Res> {
  __$SendSellerFeedbackRequestCopyWithImpl(this._self, this._then);

  final _SendSellerFeedbackRequest _self;
  final $Res Function(_SendSellerFeedbackRequest) _then;

/// Create a copy of SendSellerFeedbackRequest
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? text = null,}) {
  return _then(_SendSellerFeedbackRequest(
text: null == text ? _self.text : text // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
