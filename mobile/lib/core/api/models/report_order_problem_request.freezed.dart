// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'report_order_problem_request.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$ReportOrderProblemRequest {

 ReportOrderProblemRequestKind get kind;/// Up to 500 characters, or ORDER_PROBLEM_INVALID
 String? get note;
/// Create a copy of ReportOrderProblemRequest
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ReportOrderProblemRequestCopyWith<ReportOrderProblemRequest> get copyWith => _$ReportOrderProblemRequestCopyWithImpl<ReportOrderProblemRequest>(this as ReportOrderProblemRequest, _$identity);

  /// Serializes this ReportOrderProblemRequest to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as ReportOrderProblemRequest;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ReportOrderProblemRequest&&(identical(other.kind, _this.kind) || other.kind == _this.kind)&&(identical(other.note, _this.note) || other.note == _this.note));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as ReportOrderProblemRequest;
  return Object.hash(runtimeType,_this.kind,_this.note);
}

@override
String toString() {
  final _this = this as ReportOrderProblemRequest;
  return 'ReportOrderProblemRequest(kind: ${_this.kind}, note: ${_this.note})';
}


}

/// @nodoc
abstract mixin class $ReportOrderProblemRequestCopyWith<$Res>  {
  factory $ReportOrderProblemRequestCopyWith(ReportOrderProblemRequest value, $Res Function(ReportOrderProblemRequest) _then) = _$ReportOrderProblemRequestCopyWithImpl;
@useResult
$Res call({
 ReportOrderProblemRequestKind kind, String? note
});




}
/// @nodoc
class _$ReportOrderProblemRequestCopyWithImpl<$Res>
    implements $ReportOrderProblemRequestCopyWith<$Res> {
  _$ReportOrderProblemRequestCopyWithImpl(this._self, this._then);

  final ReportOrderProblemRequest _self;
  final $Res Function(ReportOrderProblemRequest) _then;

/// Create a copy of ReportOrderProblemRequest
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? kind = null,Object? note = freezed,}) {
  return _then(ReportOrderProblemRequest(
kind: null == kind ? _self.kind : kind // ignore: cast_nullable_to_non_nullable
as ReportOrderProblemRequestKind,note: freezed == note ? _self.note : note // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [ReportOrderProblemRequest].
extension ReportOrderProblemRequestPatterns on ReportOrderProblemRequest {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ReportOrderProblemRequest value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ReportOrderProblemRequest() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ReportOrderProblemRequest value)  $default,){
final _that = this;
switch (_that) {
case _ReportOrderProblemRequest():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ReportOrderProblemRequest value)?  $default,){
final _that = this;
switch (_that) {
case _ReportOrderProblemRequest() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( ReportOrderProblemRequestKind kind,  String? note)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ReportOrderProblemRequest() when $default != null:
return $default(_that.kind,_that.note);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( ReportOrderProblemRequestKind kind,  String? note)  $default,) {final _that = this;
switch (_that) {
case _ReportOrderProblemRequest():
return $default(_that.kind,_that.note);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( ReportOrderProblemRequestKind kind,  String? note)?  $default,) {final _that = this;
switch (_that) {
case _ReportOrderProblemRequest() when $default != null:
return $default(_that.kind,_that.note);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ReportOrderProblemRequest implements ReportOrderProblemRequest {
  const _ReportOrderProblemRequest({required this.kind, this.note});
  factory _ReportOrderProblemRequest.fromJson(Map<String, dynamic> json) => _$ReportOrderProblemRequestFromJson(json);

@override final  ReportOrderProblemRequestKind kind;
/// Up to 500 characters, or ORDER_PROBLEM_INVALID
@override final  String? note;

/// Create a copy of ReportOrderProblemRequest
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ReportOrderProblemRequestCopyWith<_ReportOrderProblemRequest> get copyWith => __$ReportOrderProblemRequestCopyWithImpl<_ReportOrderProblemRequest>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ReportOrderProblemRequestToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _ReportOrderProblemRequest&&(identical(other.kind, kind) || other.kind == kind)&&(identical(other.note, note) || other.note == note));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,kind,note);
}

@override
String toString() {
    return 'ReportOrderProblemRequest(kind: $kind, note: $note)';
}


}

/// @nodoc
abstract mixin class _$ReportOrderProblemRequestCopyWith<$Res> implements $ReportOrderProblemRequestCopyWith<$Res> {
  factory _$ReportOrderProblemRequestCopyWith(_ReportOrderProblemRequest value, $Res Function(_ReportOrderProblemRequest) _then) = __$ReportOrderProblemRequestCopyWithImpl;
@override @useResult
$Res call({
 ReportOrderProblemRequestKind kind, String? note
});




}
/// @nodoc
class __$ReportOrderProblemRequestCopyWithImpl<$Res>
    implements _$ReportOrderProblemRequestCopyWith<$Res> {
  __$ReportOrderProblemRequestCopyWithImpl(this._self, this._then);

  final _ReportOrderProblemRequest _self;
  final $Res Function(_ReportOrderProblemRequest) _then;

/// Create a copy of ReportOrderProblemRequest
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? kind = null,Object? note = freezed,}) {
  return _then(_ReportOrderProblemRequest(
kind: null == kind ? _self.kind : kind // ignore: cast_nullable_to_non_nullable
as ReportOrderProblemRequestKind,note: freezed == note ? _self.note : note // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
