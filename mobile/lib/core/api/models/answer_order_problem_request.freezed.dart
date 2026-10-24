// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'answer_order_problem_request.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$AnswerOrderProblemRequest {

/// 1 to 500 characters, or ORDER_ANSWER_INVALID
 String get answer;
/// Create a copy of AnswerOrderProblemRequest
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AnswerOrderProblemRequestCopyWith<AnswerOrderProblemRequest> get copyWith => _$AnswerOrderProblemRequestCopyWithImpl<AnswerOrderProblemRequest>(this as AnswerOrderProblemRequest, _$identity);

  /// Serializes this AnswerOrderProblemRequest to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as AnswerOrderProblemRequest;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AnswerOrderProblemRequest&&(identical(other.answer, _this.answer) || other.answer == _this.answer));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as AnswerOrderProblemRequest;
  return Object.hash(runtimeType,_this.answer);
}

@override
String toString() {
  final _this = this as AnswerOrderProblemRequest;
  return 'AnswerOrderProblemRequest(answer: ${_this.answer})';
}


}

/// @nodoc
abstract mixin class $AnswerOrderProblemRequestCopyWith<$Res>  {
  factory $AnswerOrderProblemRequestCopyWith(AnswerOrderProblemRequest value, $Res Function(AnswerOrderProblemRequest) _then) = _$AnswerOrderProblemRequestCopyWithImpl;
@useResult
$Res call({
 String answer
});




}
/// @nodoc
class _$AnswerOrderProblemRequestCopyWithImpl<$Res>
    implements $AnswerOrderProblemRequestCopyWith<$Res> {
  _$AnswerOrderProblemRequestCopyWithImpl(this._self, this._then);

  final AnswerOrderProblemRequest _self;
  final $Res Function(AnswerOrderProblemRequest) _then;

/// Create a copy of AnswerOrderProblemRequest
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? answer = null,}) {
  return _then(AnswerOrderProblemRequest(
answer: null == answer ? _self.answer : answer // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [AnswerOrderProblemRequest].
extension AnswerOrderProblemRequestPatterns on AnswerOrderProblemRequest {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AnswerOrderProblemRequest value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AnswerOrderProblemRequest() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AnswerOrderProblemRequest value)  $default,){
final _that = this;
switch (_that) {
case _AnswerOrderProblemRequest():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AnswerOrderProblemRequest value)?  $default,){
final _that = this;
switch (_that) {
case _AnswerOrderProblemRequest() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String answer)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AnswerOrderProblemRequest() when $default != null:
return $default(_that.answer);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String answer)  $default,) {final _that = this;
switch (_that) {
case _AnswerOrderProblemRequest():
return $default(_that.answer);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String answer)?  $default,) {final _that = this;
switch (_that) {
case _AnswerOrderProblemRequest() when $default != null:
return $default(_that.answer);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _AnswerOrderProblemRequest implements AnswerOrderProblemRequest {
  const _AnswerOrderProblemRequest({required this.answer});
  factory _AnswerOrderProblemRequest.fromJson(Map<String, dynamic> json) => _$AnswerOrderProblemRequestFromJson(json);

/// 1 to 500 characters, or ORDER_ANSWER_INVALID
@override final  String answer;

/// Create a copy of AnswerOrderProblemRequest
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AnswerOrderProblemRequestCopyWith<_AnswerOrderProblemRequest> get copyWith => __$AnswerOrderProblemRequestCopyWithImpl<_AnswerOrderProblemRequest>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AnswerOrderProblemRequestToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _AnswerOrderProblemRequest&&(identical(other.answer, answer) || other.answer == answer));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,answer);
}

@override
String toString() {
    return 'AnswerOrderProblemRequest(answer: $answer)';
}


}

/// @nodoc
abstract mixin class _$AnswerOrderProblemRequestCopyWith<$Res> implements $AnswerOrderProblemRequestCopyWith<$Res> {
  factory _$AnswerOrderProblemRequestCopyWith(_AnswerOrderProblemRequest value, $Res Function(_AnswerOrderProblemRequest) _then) = __$AnswerOrderProblemRequestCopyWithImpl;
@override @useResult
$Res call({
 String answer
});




}
/// @nodoc
class __$AnswerOrderProblemRequestCopyWithImpl<$Res>
    implements _$AnswerOrderProblemRequestCopyWith<$Res> {
  __$AnswerOrderProblemRequestCopyWithImpl(this._self, this._then);

  final _AnswerOrderProblemRequest _self;
  final $Res Function(_AnswerOrderProblemRequest) _then;

/// Create a copy of AnswerOrderProblemRequest
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? answer = null,}) {
  return _then(_AnswerOrderProblemRequest(
answer: null == answer ? _self.answer : answer // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
