// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'shift_report_output_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$ShiftReportOutputBody {

/// Every day of the range, in order
 List<ShiftDayBody> get days; DateTime get since;/// The whole range
 ShiftSummaryBody get totals; DateTime get until;
/// Create a copy of ShiftReportOutputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ShiftReportOutputBodyCopyWith<ShiftReportOutputBody> get copyWith => _$ShiftReportOutputBodyCopyWithImpl<ShiftReportOutputBody>(this as ShiftReportOutputBody, _$identity);

  /// Serializes this ShiftReportOutputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as ShiftReportOutputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ShiftReportOutputBody&&const DeepCollectionEquality().equals(other.days, _this.days)&&(identical(other.since, _this.since) || other.since == _this.since)&&(identical(other.totals, _this.totals) || other.totals == _this.totals)&&(identical(other.until, _this.until) || other.until == _this.until));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as ShiftReportOutputBody;
  return Object.hash(runtimeType,const DeepCollectionEquality().hash(_this.days),_this.since,_this.totals,_this.until);
}

@override
String toString() {
  final _this = this as ShiftReportOutputBody;
  return 'ShiftReportOutputBody(days: ${_this.days}, since: ${_this.since}, totals: ${_this.totals}, until: ${_this.until})';
}


}

/// @nodoc
abstract mixin class $ShiftReportOutputBodyCopyWith<$Res>  {
  factory $ShiftReportOutputBodyCopyWith(ShiftReportOutputBody value, $Res Function(ShiftReportOutputBody) _then) = _$ShiftReportOutputBodyCopyWithImpl;
@useResult
$Res call({
 List<ShiftDayBody> days, DateTime since, ShiftSummaryBody totals, DateTime until
});


$ShiftSummaryBodyCopyWith<$Res> get totals;

}
/// @nodoc
class _$ShiftReportOutputBodyCopyWithImpl<$Res>
    implements $ShiftReportOutputBodyCopyWith<$Res> {
  _$ShiftReportOutputBodyCopyWithImpl(this._self, this._then);

  final ShiftReportOutputBody _self;
  final $Res Function(ShiftReportOutputBody) _then;

/// Create a copy of ShiftReportOutputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? days = null,Object? since = null,Object? totals = null,Object? until = null,}) {
  return _then(ShiftReportOutputBody(
days: null == days ? _self.days : days // ignore: cast_nullable_to_non_nullable
as List<ShiftDayBody>,since: null == since ? _self.since : since // ignore: cast_nullable_to_non_nullable
as DateTime,totals: null == totals ? _self.totals : totals // ignore: cast_nullable_to_non_nullable
as ShiftSummaryBody,until: null == until ? _self.until : until // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}
/// Create a copy of ShiftReportOutputBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$ShiftSummaryBodyCopyWith<$Res> get totals {
  
  return $ShiftSummaryBodyCopyWith<$Res>(_self.totals, (value) {
    return _then(_self.copyWith(totals: value));
  });
}
}


/// Adds pattern-matching-related methods to [ShiftReportOutputBody].
extension ShiftReportOutputBodyPatterns on ShiftReportOutputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ShiftReportOutputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ShiftReportOutputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ShiftReportOutputBody value)  $default,){
final _that = this;
switch (_that) {
case _ShiftReportOutputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ShiftReportOutputBody value)?  $default,){
final _that = this;
switch (_that) {
case _ShiftReportOutputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( List<ShiftDayBody> days,  DateTime since,  ShiftSummaryBody totals,  DateTime until)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ShiftReportOutputBody() when $default != null:
return $default(_that.days,_that.since,_that.totals,_that.until);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( List<ShiftDayBody> days,  DateTime since,  ShiftSummaryBody totals,  DateTime until)  $default,) {final _that = this;
switch (_that) {
case _ShiftReportOutputBody():
return $default(_that.days,_that.since,_that.totals,_that.until);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( List<ShiftDayBody> days,  DateTime since,  ShiftSummaryBody totals,  DateTime until)?  $default,) {final _that = this;
switch (_that) {
case _ShiftReportOutputBody() when $default != null:
return $default(_that.days,_that.since,_that.totals,_that.until);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ShiftReportOutputBody implements ShiftReportOutputBody {
  const _ShiftReportOutputBody({required  List<ShiftDayBody> days, required this.since, required this.totals, required this.until}): _days = days;
  factory _ShiftReportOutputBody.fromJson(Map<String, dynamic> json) => _$ShiftReportOutputBodyFromJson(json);

/// Every day of the range, in order
 final  List<ShiftDayBody> _days;
/// Every day of the range, in order
@override List<ShiftDayBody> get days {
  if (_days is EqualUnmodifiableListView) return _days;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_days);
}

@override final  DateTime since;
/// The whole range
@override final  ShiftSummaryBody totals;
@override final  DateTime until;

/// Create a copy of ShiftReportOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ShiftReportOutputBodyCopyWith<_ShiftReportOutputBody> get copyWith => __$ShiftReportOutputBodyCopyWithImpl<_ShiftReportOutputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ShiftReportOutputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _ShiftReportOutputBody&&const DeepCollectionEquality().equals(other.days, _days)&&(identical(other.since, since) || other.since == since)&&(identical(other.totals, totals) || other.totals == totals)&&(identical(other.until, until) || other.until == until));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,const DeepCollectionEquality().hash(_days),since,totals,until);
}

@override
String toString() {
    return 'ShiftReportOutputBody(days: $days, since: $since, totals: $totals, until: $until)';
}


}

/// @nodoc
abstract mixin class _$ShiftReportOutputBodyCopyWith<$Res> implements $ShiftReportOutputBodyCopyWith<$Res> {
  factory _$ShiftReportOutputBodyCopyWith(_ShiftReportOutputBody value, $Res Function(_ShiftReportOutputBody) _then) = __$ShiftReportOutputBodyCopyWithImpl;
@override @useResult
$Res call({
 List<ShiftDayBody> days, DateTime since, ShiftSummaryBody totals, DateTime until
});


@override $ShiftSummaryBodyCopyWith<$Res> get totals;

}
/// @nodoc
class __$ShiftReportOutputBodyCopyWithImpl<$Res>
    implements _$ShiftReportOutputBodyCopyWith<$Res> {
  __$ShiftReportOutputBodyCopyWithImpl(this._self, this._then);

  final _ShiftReportOutputBody _self;
  final $Res Function(_ShiftReportOutputBody) _then;

/// Create a copy of ShiftReportOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? days = null,Object? since = null,Object? totals = null,Object? until = null,}) {
  return _then(_ShiftReportOutputBody(
days: null == days ? _self._days : days // ignore: cast_nullable_to_non_nullable
as List<ShiftDayBody>,since: null == since ? _self.since : since // ignore: cast_nullable_to_non_nullable
as DateTime,totals: null == totals ? _self.totals : totals // ignore: cast_nullable_to_non_nullable
as ShiftSummaryBody,until: null == until ? _self.until : until // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}

/// Create a copy of ShiftReportOutputBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$ShiftSummaryBodyCopyWith<$Res> get totals {
  
  return $ShiftSummaryBodyCopyWith<$Res>(_self.totals, (value) {
    return _then(_self.copyWith(totals: value));
  });
}
}

// dart format on
