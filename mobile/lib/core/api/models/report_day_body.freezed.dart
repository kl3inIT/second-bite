// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'report_day_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$ReportDayBody {

 CountsBody get counts; DateTime get day;
/// Create a copy of ReportDayBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ReportDayBodyCopyWith<ReportDayBody> get copyWith => _$ReportDayBodyCopyWithImpl<ReportDayBody>(this as ReportDayBody, _$identity);

  /// Serializes this ReportDayBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as ReportDayBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ReportDayBody&&(identical(other.counts, _this.counts) || other.counts == _this.counts)&&(identical(other.day, _this.day) || other.day == _this.day));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as ReportDayBody;
  return Object.hash(runtimeType,_this.counts,_this.day);
}

@override
String toString() {
  final _this = this as ReportDayBody;
  return 'ReportDayBody(counts: ${_this.counts}, day: ${_this.day})';
}


}

/// @nodoc
abstract mixin class $ReportDayBodyCopyWith<$Res>  {
  factory $ReportDayBodyCopyWith(ReportDayBody value, $Res Function(ReportDayBody) _then) = _$ReportDayBodyCopyWithImpl;
@useResult
$Res call({
 CountsBody counts, DateTime day
});


$CountsBodyCopyWith<$Res> get counts;

}
/// @nodoc
class _$ReportDayBodyCopyWithImpl<$Res>
    implements $ReportDayBodyCopyWith<$Res> {
  _$ReportDayBodyCopyWithImpl(this._self, this._then);

  final ReportDayBody _self;
  final $Res Function(ReportDayBody) _then;

/// Create a copy of ReportDayBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? counts = null,Object? day = null,}) {
  return _then(ReportDayBody(
counts: null == counts ? _self.counts : counts // ignore: cast_nullable_to_non_nullable
as CountsBody,day: null == day ? _self.day : day // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}
/// Create a copy of ReportDayBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$CountsBodyCopyWith<$Res> get counts {
  
  return $CountsBodyCopyWith<$Res>(_self.counts, (value) {
    return _then(_self.copyWith(counts: value));
  });
}
}


/// Adds pattern-matching-related methods to [ReportDayBody].
extension ReportDayBodyPatterns on ReportDayBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ReportDayBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ReportDayBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ReportDayBody value)  $default,){
final _that = this;
switch (_that) {
case _ReportDayBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ReportDayBody value)?  $default,){
final _that = this;
switch (_that) {
case _ReportDayBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( CountsBody counts,  DateTime day)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ReportDayBody() when $default != null:
return $default(_that.counts,_that.day);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( CountsBody counts,  DateTime day)  $default,) {final _that = this;
switch (_that) {
case _ReportDayBody():
return $default(_that.counts,_that.day);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( CountsBody counts,  DateTime day)?  $default,) {final _that = this;
switch (_that) {
case _ReportDayBody() when $default != null:
return $default(_that.counts,_that.day);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ReportDayBody implements ReportDayBody {
  const _ReportDayBody({required this.counts, required this.day});
  factory _ReportDayBody.fromJson(Map<String, dynamic> json) => _$ReportDayBodyFromJson(json);

@override final  CountsBody counts;
@override final  DateTime day;

/// Create a copy of ReportDayBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ReportDayBodyCopyWith<_ReportDayBody> get copyWith => __$ReportDayBodyCopyWithImpl<_ReportDayBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ReportDayBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _ReportDayBody&&(identical(other.counts, counts) || other.counts == counts)&&(identical(other.day, day) || other.day == day));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,counts,day);
}

@override
String toString() {
    return 'ReportDayBody(counts: $counts, day: $day)';
}


}

/// @nodoc
abstract mixin class _$ReportDayBodyCopyWith<$Res> implements $ReportDayBodyCopyWith<$Res> {
  factory _$ReportDayBodyCopyWith(_ReportDayBody value, $Res Function(_ReportDayBody) _then) = __$ReportDayBodyCopyWithImpl;
@override @useResult
$Res call({
 CountsBody counts, DateTime day
});


@override $CountsBodyCopyWith<$Res> get counts;

}
/// @nodoc
class __$ReportDayBodyCopyWithImpl<$Res>
    implements _$ReportDayBodyCopyWith<$Res> {
  __$ReportDayBodyCopyWithImpl(this._self, this._then);

  final _ReportDayBody _self;
  final $Res Function(_ReportDayBody) _then;

/// Create a copy of ReportDayBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? counts = null,Object? day = null,}) {
  return _then(_ReportDayBody(
counts: null == counts ? _self.counts : counts // ignore: cast_nullable_to_non_nullable
as CountsBody,day: null == day ? _self.day : day // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}

/// Create a copy of ReportDayBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$CountsBodyCopyWith<$Res> get counts {
  
  return $CountsBodyCopyWith<$Res>(_self.counts, (value) {
    return _then(_self.copyWith(counts: value));
  });
}
}

// dart format on
