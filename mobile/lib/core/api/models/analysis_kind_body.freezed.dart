// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'analysis_kind_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$AnalysisKindBody {

/// Units of them collected
 int get collected; AnalysisKindBodyKind get kind;/// Units posted
 int get posted;
/// Create a copy of AnalysisKindBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AnalysisKindBodyCopyWith<AnalysisKindBody> get copyWith => _$AnalysisKindBodyCopyWithImpl<AnalysisKindBody>(this as AnalysisKindBody, _$identity);

  /// Serializes this AnalysisKindBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as AnalysisKindBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AnalysisKindBody&&(identical(other.collected, _this.collected) || other.collected == _this.collected)&&(identical(other.kind, _this.kind) || other.kind == _this.kind)&&(identical(other.posted, _this.posted) || other.posted == _this.posted));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as AnalysisKindBody;
  return Object.hash(runtimeType,_this.collected,_this.kind,_this.posted);
}

@override
String toString() {
  final _this = this as AnalysisKindBody;
  return 'AnalysisKindBody(collected: ${_this.collected}, kind: ${_this.kind}, posted: ${_this.posted})';
}


}

/// @nodoc
abstract mixin class $AnalysisKindBodyCopyWith<$Res>  {
  factory $AnalysisKindBodyCopyWith(AnalysisKindBody value, $Res Function(AnalysisKindBody) _then) = _$AnalysisKindBodyCopyWithImpl;
@useResult
$Res call({
 int collected, AnalysisKindBodyKind kind, int posted
});




}
/// @nodoc
class _$AnalysisKindBodyCopyWithImpl<$Res>
    implements $AnalysisKindBodyCopyWith<$Res> {
  _$AnalysisKindBodyCopyWithImpl(this._self, this._then);

  final AnalysisKindBody _self;
  final $Res Function(AnalysisKindBody) _then;

/// Create a copy of AnalysisKindBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? collected = null,Object? kind = null,Object? posted = null,}) {
  return _then(AnalysisKindBody(
collected: null == collected ? _self.collected : collected // ignore: cast_nullable_to_non_nullable
as int,kind: null == kind ? _self.kind : kind // ignore: cast_nullable_to_non_nullable
as AnalysisKindBodyKind,posted: null == posted ? _self.posted : posted // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [AnalysisKindBody].
extension AnalysisKindBodyPatterns on AnalysisKindBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AnalysisKindBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AnalysisKindBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AnalysisKindBody value)  $default,){
final _that = this;
switch (_that) {
case _AnalysisKindBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AnalysisKindBody value)?  $default,){
final _that = this;
switch (_that) {
case _AnalysisKindBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int collected,  AnalysisKindBodyKind kind,  int posted)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AnalysisKindBody() when $default != null:
return $default(_that.collected,_that.kind,_that.posted);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int collected,  AnalysisKindBodyKind kind,  int posted)  $default,) {final _that = this;
switch (_that) {
case _AnalysisKindBody():
return $default(_that.collected,_that.kind,_that.posted);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int collected,  AnalysisKindBodyKind kind,  int posted)?  $default,) {final _that = this;
switch (_that) {
case _AnalysisKindBody() when $default != null:
return $default(_that.collected,_that.kind,_that.posted);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _AnalysisKindBody implements AnalysisKindBody {
  const _AnalysisKindBody({required this.collected, required this.kind, required this.posted});
  factory _AnalysisKindBody.fromJson(Map<String, dynamic> json) => _$AnalysisKindBodyFromJson(json);

/// Units of them collected
@override final  int collected;
@override final  AnalysisKindBodyKind kind;
/// Units posted
@override final  int posted;

/// Create a copy of AnalysisKindBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AnalysisKindBodyCopyWith<_AnalysisKindBody> get copyWith => __$AnalysisKindBodyCopyWithImpl<_AnalysisKindBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AnalysisKindBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _AnalysisKindBody&&(identical(other.collected, collected) || other.collected == collected)&&(identical(other.kind, kind) || other.kind == kind)&&(identical(other.posted, posted) || other.posted == posted));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,collected,kind,posted);
}

@override
String toString() {
    return 'AnalysisKindBody(collected: $collected, kind: $kind, posted: $posted)';
}


}

/// @nodoc
abstract mixin class _$AnalysisKindBodyCopyWith<$Res> implements $AnalysisKindBodyCopyWith<$Res> {
  factory _$AnalysisKindBodyCopyWith(_AnalysisKindBody value, $Res Function(_AnalysisKindBody) _then) = __$AnalysisKindBodyCopyWithImpl;
@override @useResult
$Res call({
 int collected, AnalysisKindBodyKind kind, int posted
});




}
/// @nodoc
class __$AnalysisKindBodyCopyWithImpl<$Res>
    implements _$AnalysisKindBodyCopyWith<$Res> {
  __$AnalysisKindBodyCopyWithImpl(this._self, this._then);

  final _AnalysisKindBody _self;
  final $Res Function(_AnalysisKindBody) _then;

/// Create a copy of AnalysisKindBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? collected = null,Object? kind = null,Object? posted = null,}) {
  return _then(_AnalysisKindBody(
collected: null == collected ? _self.collected : collected // ignore: cast_nullable_to_non_nullable
as int,kind: null == kind ? _self.kind : kind // ignore: cast_nullable_to_non_nullable
as AnalysisKindBodyKind,posted: null == posted ? _self.posted : posted // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
