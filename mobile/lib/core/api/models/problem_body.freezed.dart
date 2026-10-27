// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'problem_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$ProblemBody {

 ProblemBodyKind get kind; DateTime get reportedAt;/// The store's answer, none until it answers
 String? get answer; DateTime? get answeredAt; String? get note;
/// Create a copy of ProblemBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ProblemBodyCopyWith<ProblemBody> get copyWith => _$ProblemBodyCopyWithImpl<ProblemBody>(this as ProblemBody, _$identity);

  /// Serializes this ProblemBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as ProblemBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ProblemBody&&(identical(other.kind, _this.kind) || other.kind == _this.kind)&&(identical(other.reportedAt, _this.reportedAt) || other.reportedAt == _this.reportedAt)&&(identical(other.answer, _this.answer) || other.answer == _this.answer)&&(identical(other.answeredAt, _this.answeredAt) || other.answeredAt == _this.answeredAt)&&(identical(other.note, _this.note) || other.note == _this.note));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as ProblemBody;
  return Object.hash(runtimeType,_this.kind,_this.reportedAt,_this.answer,_this.answeredAt,_this.note);
}

@override
String toString() {
  final _this = this as ProblemBody;
  return 'ProblemBody(kind: ${_this.kind}, reportedAt: ${_this.reportedAt}, answer: ${_this.answer}, answeredAt: ${_this.answeredAt}, note: ${_this.note})';
}


}

/// @nodoc
abstract mixin class $ProblemBodyCopyWith<$Res>  {
  factory $ProblemBodyCopyWith(ProblemBody value, $Res Function(ProblemBody) _then) = _$ProblemBodyCopyWithImpl;
@useResult
$Res call({
 ProblemBodyKind kind, DateTime reportedAt, String? answer, DateTime? answeredAt, String? note
});




}
/// @nodoc
class _$ProblemBodyCopyWithImpl<$Res>
    implements $ProblemBodyCopyWith<$Res> {
  _$ProblemBodyCopyWithImpl(this._self, this._then);

  final ProblemBody _self;
  final $Res Function(ProblemBody) _then;

/// Create a copy of ProblemBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? kind = null,Object? reportedAt = null,Object? answer = freezed,Object? answeredAt = freezed,Object? note = freezed,}) {
  return _then(ProblemBody(
kind: null == kind ? _self.kind : kind // ignore: cast_nullable_to_non_nullable
as ProblemBodyKind,reportedAt: null == reportedAt ? _self.reportedAt : reportedAt // ignore: cast_nullable_to_non_nullable
as DateTime,answer: freezed == answer ? _self.answer : answer // ignore: cast_nullable_to_non_nullable
as String?,answeredAt: freezed == answeredAt ? _self.answeredAt : answeredAt // ignore: cast_nullable_to_non_nullable
as DateTime?,note: freezed == note ? _self.note : note // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [ProblemBody].
extension ProblemBodyPatterns on ProblemBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ProblemBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ProblemBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ProblemBody value)  $default,){
final _that = this;
switch (_that) {
case _ProblemBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ProblemBody value)?  $default,){
final _that = this;
switch (_that) {
case _ProblemBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( ProblemBodyKind kind,  DateTime reportedAt,  String? answer,  DateTime? answeredAt,  String? note)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ProblemBody() when $default != null:
return $default(_that.kind,_that.reportedAt,_that.answer,_that.answeredAt,_that.note);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( ProblemBodyKind kind,  DateTime reportedAt,  String? answer,  DateTime? answeredAt,  String? note)  $default,) {final _that = this;
switch (_that) {
case _ProblemBody():
return $default(_that.kind,_that.reportedAt,_that.answer,_that.answeredAt,_that.note);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( ProblemBodyKind kind,  DateTime reportedAt,  String? answer,  DateTime? answeredAt,  String? note)?  $default,) {final _that = this;
switch (_that) {
case _ProblemBody() when $default != null:
return $default(_that.kind,_that.reportedAt,_that.answer,_that.answeredAt,_that.note);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ProblemBody implements ProblemBody {
  const _ProblemBody({required this.kind, required this.reportedAt, this.answer, this.answeredAt, this.note});
  factory _ProblemBody.fromJson(Map<String, dynamic> json) => _$ProblemBodyFromJson(json);

@override final  ProblemBodyKind kind;
@override final  DateTime reportedAt;
/// The store's answer, none until it answers
@override final  String? answer;
@override final  DateTime? answeredAt;
@override final  String? note;

/// Create a copy of ProblemBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ProblemBodyCopyWith<_ProblemBody> get copyWith => __$ProblemBodyCopyWithImpl<_ProblemBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ProblemBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _ProblemBody&&(identical(other.kind, kind) || other.kind == kind)&&(identical(other.reportedAt, reportedAt) || other.reportedAt == reportedAt)&&(identical(other.answer, answer) || other.answer == answer)&&(identical(other.answeredAt, answeredAt) || other.answeredAt == answeredAt)&&(identical(other.note, note) || other.note == note));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,kind,reportedAt,answer,answeredAt,note);
}

@override
String toString() {
    return 'ProblemBody(kind: $kind, reportedAt: $reportedAt, answer: $answer, answeredAt: $answeredAt, note: $note)';
}


}

/// @nodoc
abstract mixin class _$ProblemBodyCopyWith<$Res> implements $ProblemBodyCopyWith<$Res> {
  factory _$ProblemBodyCopyWith(_ProblemBody value, $Res Function(_ProblemBody) _then) = __$ProblemBodyCopyWithImpl;
@override @useResult
$Res call({
 ProblemBodyKind kind, DateTime reportedAt, String? answer, DateTime? answeredAt, String? note
});




}
/// @nodoc
class __$ProblemBodyCopyWithImpl<$Res>
    implements _$ProblemBodyCopyWith<$Res> {
  __$ProblemBodyCopyWithImpl(this._self, this._then);

  final _ProblemBody _self;
  final $Res Function(_ProblemBody) _then;

/// Create a copy of ProblemBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? kind = null,Object? reportedAt = null,Object? answer = freezed,Object? answeredAt = freezed,Object? note = freezed,}) {
  return _then(_ProblemBody(
kind: null == kind ? _self.kind : kind // ignore: cast_nullable_to_non_nullable
as ProblemBodyKind,reportedAt: null == reportedAt ? _self.reportedAt : reportedAt // ignore: cast_nullable_to_non_nullable
as DateTime,answer: freezed == answer ? _self.answer : answer // ignore: cast_nullable_to_non_nullable
as String?,answeredAt: freezed == answeredAt ? _self.answeredAt : answeredAt // ignore: cast_nullable_to_non_nullable
as DateTime?,note: freezed == note ? _self.note : note // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
