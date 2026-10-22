// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'hide_review_request.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$HideReviewRequest {

/// Why it is hidden, at most 500 characters
 String? get reason;
/// Create a copy of HideReviewRequest
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$HideReviewRequestCopyWith<HideReviewRequest> get copyWith => _$HideReviewRequestCopyWithImpl<HideReviewRequest>(this as HideReviewRequest, _$identity);

  /// Serializes this HideReviewRequest to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as HideReviewRequest;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is HideReviewRequest&&(identical(other.reason, _this.reason) || other.reason == _this.reason));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as HideReviewRequest;
  return Object.hash(runtimeType,_this.reason);
}

@override
String toString() {
  final _this = this as HideReviewRequest;
  return 'HideReviewRequest(reason: ${_this.reason})';
}


}

/// @nodoc
abstract mixin class $HideReviewRequestCopyWith<$Res>  {
  factory $HideReviewRequestCopyWith(HideReviewRequest value, $Res Function(HideReviewRequest) _then) = _$HideReviewRequestCopyWithImpl;
@useResult
$Res call({
 String? reason
});




}
/// @nodoc
class _$HideReviewRequestCopyWithImpl<$Res>
    implements $HideReviewRequestCopyWith<$Res> {
  _$HideReviewRequestCopyWithImpl(this._self, this._then);

  final HideReviewRequest _self;
  final $Res Function(HideReviewRequest) _then;

/// Create a copy of HideReviewRequest
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? reason = freezed,}) {
  return _then(HideReviewRequest(
reason: freezed == reason ? _self.reason : reason // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [HideReviewRequest].
extension HideReviewRequestPatterns on HideReviewRequest {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _HideReviewRequest value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _HideReviewRequest() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _HideReviewRequest value)  $default,){
final _that = this;
switch (_that) {
case _HideReviewRequest():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _HideReviewRequest value)?  $default,){
final _that = this;
switch (_that) {
case _HideReviewRequest() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String? reason)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _HideReviewRequest() when $default != null:
return $default(_that.reason);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String? reason)  $default,) {final _that = this;
switch (_that) {
case _HideReviewRequest():
return $default(_that.reason);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String? reason)?  $default,) {final _that = this;
switch (_that) {
case _HideReviewRequest() when $default != null:
return $default(_that.reason);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _HideReviewRequest implements HideReviewRequest {
  const _HideReviewRequest({this.reason});
  factory _HideReviewRequest.fromJson(Map<String, dynamic> json) => _$HideReviewRequestFromJson(json);

/// Why it is hidden, at most 500 characters
@override final  String? reason;

/// Create a copy of HideReviewRequest
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$HideReviewRequestCopyWith<_HideReviewRequest> get copyWith => __$HideReviewRequestCopyWithImpl<_HideReviewRequest>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$HideReviewRequestToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _HideReviewRequest&&(identical(other.reason, reason) || other.reason == reason));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,reason);
}

@override
String toString() {
    return 'HideReviewRequest(reason: $reason)';
}


}

/// @nodoc
abstract mixin class _$HideReviewRequestCopyWith<$Res> implements $HideReviewRequestCopyWith<$Res> {
  factory _$HideReviewRequestCopyWith(_HideReviewRequest value, $Res Function(_HideReviewRequest) _then) = __$HideReviewRequestCopyWithImpl;
@override @useResult
$Res call({
 String? reason
});




}
/// @nodoc
class __$HideReviewRequestCopyWithImpl<$Res>
    implements _$HideReviewRequestCopyWith<$Res> {
  __$HideReviewRequestCopyWithImpl(this._self, this._then);

  final _HideReviewRequest _self;
  final $Res Function(_HideReviewRequest) _then;

/// Create a copy of HideReviewRequest
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? reason = freezed,}) {
  return _then(_HideReviewRequest(
reason: freezed == reason ? _self.reason : reason // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
