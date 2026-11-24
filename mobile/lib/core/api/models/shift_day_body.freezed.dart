// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'shift_day_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$ShiftDayBody {

 DateTime get day;/// In the order asked
 List<ShiftBlockBody> get shifts;/// The whole day, whatever the shifts
 ShiftSummaryBody get summary;
/// Create a copy of ShiftDayBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ShiftDayBodyCopyWith<ShiftDayBody> get copyWith => _$ShiftDayBodyCopyWithImpl<ShiftDayBody>(this as ShiftDayBody, _$identity);

  /// Serializes this ShiftDayBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as ShiftDayBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ShiftDayBody&&(identical(other.day, _this.day) || other.day == _this.day)&&const DeepCollectionEquality().equals(other.shifts, _this.shifts)&&(identical(other.summary, _this.summary) || other.summary == _this.summary));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as ShiftDayBody;
  return Object.hash(runtimeType,_this.day,const DeepCollectionEquality().hash(_this.shifts),_this.summary);
}

@override
String toString() {
  final _this = this as ShiftDayBody;
  return 'ShiftDayBody(day: ${_this.day}, shifts: ${_this.shifts}, summary: ${_this.summary})';
}


}

/// @nodoc
abstract mixin class $ShiftDayBodyCopyWith<$Res>  {
  factory $ShiftDayBodyCopyWith(ShiftDayBody value, $Res Function(ShiftDayBody) _then) = _$ShiftDayBodyCopyWithImpl;
@useResult
$Res call({
 DateTime day, List<ShiftBlockBody> shifts, ShiftSummaryBody summary
});


$ShiftSummaryBodyCopyWith<$Res> get summary;

}
/// @nodoc
class _$ShiftDayBodyCopyWithImpl<$Res>
    implements $ShiftDayBodyCopyWith<$Res> {
  _$ShiftDayBodyCopyWithImpl(this._self, this._then);

  final ShiftDayBody _self;
  final $Res Function(ShiftDayBody) _then;

/// Create a copy of ShiftDayBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? day = null,Object? shifts = null,Object? summary = null,}) {
  return _then(ShiftDayBody(
day: null == day ? _self.day : day // ignore: cast_nullable_to_non_nullable
as DateTime,shifts: null == shifts ? _self.shifts : shifts // ignore: cast_nullable_to_non_nullable
as List<ShiftBlockBody>,summary: null == summary ? _self.summary : summary // ignore: cast_nullable_to_non_nullable
as ShiftSummaryBody,
  ));
}
/// Create a copy of ShiftDayBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$ShiftSummaryBodyCopyWith<$Res> get summary {
  
  return $ShiftSummaryBodyCopyWith<$Res>(_self.summary, (value) {
    return _then(_self.copyWith(summary: value));
  });
}
}


/// Adds pattern-matching-related methods to [ShiftDayBody].
extension ShiftDayBodyPatterns on ShiftDayBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ShiftDayBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ShiftDayBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ShiftDayBody value)  $default,){
final _that = this;
switch (_that) {
case _ShiftDayBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ShiftDayBody value)?  $default,){
final _that = this;
switch (_that) {
case _ShiftDayBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( DateTime day,  List<ShiftBlockBody> shifts,  ShiftSummaryBody summary)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ShiftDayBody() when $default != null:
return $default(_that.day,_that.shifts,_that.summary);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( DateTime day,  List<ShiftBlockBody> shifts,  ShiftSummaryBody summary)  $default,) {final _that = this;
switch (_that) {
case _ShiftDayBody():
return $default(_that.day,_that.shifts,_that.summary);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( DateTime day,  List<ShiftBlockBody> shifts,  ShiftSummaryBody summary)?  $default,) {final _that = this;
switch (_that) {
case _ShiftDayBody() when $default != null:
return $default(_that.day,_that.shifts,_that.summary);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ShiftDayBody implements ShiftDayBody {
  const _ShiftDayBody({required this.day, required  List<ShiftBlockBody> shifts, required this.summary}): _shifts = shifts;
  factory _ShiftDayBody.fromJson(Map<String, dynamic> json) => _$ShiftDayBodyFromJson(json);

@override final  DateTime day;
/// In the order asked
 final  List<ShiftBlockBody> _shifts;
/// In the order asked
@override List<ShiftBlockBody> get shifts {
  if (_shifts is EqualUnmodifiableListView) return _shifts;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_shifts);
}

/// The whole day, whatever the shifts
@override final  ShiftSummaryBody summary;

/// Create a copy of ShiftDayBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ShiftDayBodyCopyWith<_ShiftDayBody> get copyWith => __$ShiftDayBodyCopyWithImpl<_ShiftDayBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ShiftDayBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _ShiftDayBody&&(identical(other.day, day) || other.day == day)&&const DeepCollectionEquality().equals(other.shifts, _shifts)&&(identical(other.summary, summary) || other.summary == summary));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,day,const DeepCollectionEquality().hash(_shifts),summary);
}

@override
String toString() {
    return 'ShiftDayBody(day: $day, shifts: $shifts, summary: $summary)';
}


}

/// @nodoc
abstract mixin class _$ShiftDayBodyCopyWith<$Res> implements $ShiftDayBodyCopyWith<$Res> {
  factory _$ShiftDayBodyCopyWith(_ShiftDayBody value, $Res Function(_ShiftDayBody) _then) = __$ShiftDayBodyCopyWithImpl;
@override @useResult
$Res call({
 DateTime day, List<ShiftBlockBody> shifts, ShiftSummaryBody summary
});


@override $ShiftSummaryBodyCopyWith<$Res> get summary;

}
/// @nodoc
class __$ShiftDayBodyCopyWithImpl<$Res>
    implements _$ShiftDayBodyCopyWith<$Res> {
  __$ShiftDayBodyCopyWithImpl(this._self, this._then);

  final _ShiftDayBody _self;
  final $Res Function(_ShiftDayBody) _then;

/// Create a copy of ShiftDayBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? day = null,Object? shifts = null,Object? summary = null,}) {
  return _then(_ShiftDayBody(
day: null == day ? _self.day : day // ignore: cast_nullable_to_non_nullable
as DateTime,shifts: null == shifts ? _self._shifts : shifts // ignore: cast_nullable_to_non_nullable
as List<ShiftBlockBody>,summary: null == summary ? _self.summary : summary // ignore: cast_nullable_to_non_nullable
as ShiftSummaryBody,
  ));
}

/// Create a copy of ShiftDayBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$ShiftSummaryBodyCopyWith<$Res> get summary {
  
  return $ShiftSummaryBodyCopyWith<$Res>(_self.summary, (value) {
    return _then(_self.copyWith(summary: value));
  });
}
}

// dart format on
