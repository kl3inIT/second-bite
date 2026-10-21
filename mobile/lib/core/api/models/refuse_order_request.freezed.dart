// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'refuse_order_request.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$RefuseOrderRequest {

 RefuseOrderRequestReason get reason; String? get note;
/// Create a copy of RefuseOrderRequest
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$RefuseOrderRequestCopyWith<RefuseOrderRequest> get copyWith => _$RefuseOrderRequestCopyWithImpl<RefuseOrderRequest>(this as RefuseOrderRequest, _$identity);

  /// Serializes this RefuseOrderRequest to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as RefuseOrderRequest;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is RefuseOrderRequest&&(identical(other.reason, _this.reason) || other.reason == _this.reason)&&(identical(other.note, _this.note) || other.note == _this.note));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as RefuseOrderRequest;
  return Object.hash(runtimeType,_this.reason,_this.note);
}

@override
String toString() {
  final _this = this as RefuseOrderRequest;
  return 'RefuseOrderRequest(reason: ${_this.reason}, note: ${_this.note})';
}


}

/// @nodoc
abstract mixin class $RefuseOrderRequestCopyWith<$Res>  {
  factory $RefuseOrderRequestCopyWith(RefuseOrderRequest value, $Res Function(RefuseOrderRequest) _then) = _$RefuseOrderRequestCopyWithImpl;
@useResult
$Res call({
 RefuseOrderRequestReason reason, String? note
});




}
/// @nodoc
class _$RefuseOrderRequestCopyWithImpl<$Res>
    implements $RefuseOrderRequestCopyWith<$Res> {
  _$RefuseOrderRequestCopyWithImpl(this._self, this._then);

  final RefuseOrderRequest _self;
  final $Res Function(RefuseOrderRequest) _then;

/// Create a copy of RefuseOrderRequest
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? reason = null,Object? note = freezed,}) {
  return _then(RefuseOrderRequest(
reason: null == reason ? _self.reason : reason // ignore: cast_nullable_to_non_nullable
as RefuseOrderRequestReason,note: freezed == note ? _self.note : note // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [RefuseOrderRequest].
extension RefuseOrderRequestPatterns on RefuseOrderRequest {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _RefuseOrderRequest value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _RefuseOrderRequest() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _RefuseOrderRequest value)  $default,){
final _that = this;
switch (_that) {
case _RefuseOrderRequest():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _RefuseOrderRequest value)?  $default,){
final _that = this;
switch (_that) {
case _RefuseOrderRequest() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( RefuseOrderRequestReason reason,  String? note)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _RefuseOrderRequest() when $default != null:
return $default(_that.reason,_that.note);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( RefuseOrderRequestReason reason,  String? note)  $default,) {final _that = this;
switch (_that) {
case _RefuseOrderRequest():
return $default(_that.reason,_that.note);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( RefuseOrderRequestReason reason,  String? note)?  $default,) {final _that = this;
switch (_that) {
case _RefuseOrderRequest() when $default != null:
return $default(_that.reason,_that.note);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _RefuseOrderRequest implements RefuseOrderRequest {
  const _RefuseOrderRequest({required this.reason, this.note});
  factory _RefuseOrderRequest.fromJson(Map<String, dynamic> json) => _$RefuseOrderRequestFromJson(json);

@override final  RefuseOrderRequestReason reason;
@override final  String? note;

/// Create a copy of RefuseOrderRequest
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$RefuseOrderRequestCopyWith<_RefuseOrderRequest> get copyWith => __$RefuseOrderRequestCopyWithImpl<_RefuseOrderRequest>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$RefuseOrderRequestToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _RefuseOrderRequest&&(identical(other.reason, reason) || other.reason == reason)&&(identical(other.note, note) || other.note == note));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,reason,note);
}

@override
String toString() {
    return 'RefuseOrderRequest(reason: $reason, note: $note)';
}


}

/// @nodoc
abstract mixin class _$RefuseOrderRequestCopyWith<$Res> implements $RefuseOrderRequestCopyWith<$Res> {
  factory _$RefuseOrderRequestCopyWith(_RefuseOrderRequest value, $Res Function(_RefuseOrderRequest) _then) = __$RefuseOrderRequestCopyWithImpl;
@override @useResult
$Res call({
 RefuseOrderRequestReason reason, String? note
});




}
/// @nodoc
class __$RefuseOrderRequestCopyWithImpl<$Res>
    implements _$RefuseOrderRequestCopyWith<$Res> {
  __$RefuseOrderRequestCopyWithImpl(this._self, this._then);

  final _RefuseOrderRequest _self;
  final $Res Function(_RefuseOrderRequest) _then;

/// Create a copy of RefuseOrderRequest
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? reason = null,Object? note = freezed,}) {
  return _then(_RefuseOrderRequest(
reason: null == reason ? _self.reason : reason // ignore: cast_nullable_to_non_nullable
as RefuseOrderRequestReason,note: freezed == note ? _self.note : note // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
