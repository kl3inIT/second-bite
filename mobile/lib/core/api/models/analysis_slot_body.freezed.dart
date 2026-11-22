// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'analysis_slot_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$AnalysisSlotBody {

 int get collected; int get held;/// The hour of the window's start in Vietnam
 int get hour;/// 1 Monday to 7 Sunday, of the window's start in Vietnam
 int get weekday;
/// Create a copy of AnalysisSlotBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AnalysisSlotBodyCopyWith<AnalysisSlotBody> get copyWith => _$AnalysisSlotBodyCopyWithImpl<AnalysisSlotBody>(this as AnalysisSlotBody, _$identity);

  /// Serializes this AnalysisSlotBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as AnalysisSlotBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AnalysisSlotBody&&(identical(other.collected, _this.collected) || other.collected == _this.collected)&&(identical(other.held, _this.held) || other.held == _this.held)&&(identical(other.hour, _this.hour) || other.hour == _this.hour)&&(identical(other.weekday, _this.weekday) || other.weekday == _this.weekday));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as AnalysisSlotBody;
  return Object.hash(runtimeType,_this.collected,_this.held,_this.hour,_this.weekday);
}

@override
String toString() {
  final _this = this as AnalysisSlotBody;
  return 'AnalysisSlotBody(collected: ${_this.collected}, held: ${_this.held}, hour: ${_this.hour}, weekday: ${_this.weekday})';
}


}

/// @nodoc
abstract mixin class $AnalysisSlotBodyCopyWith<$Res>  {
  factory $AnalysisSlotBodyCopyWith(AnalysisSlotBody value, $Res Function(AnalysisSlotBody) _then) = _$AnalysisSlotBodyCopyWithImpl;
@useResult
$Res call({
 int collected, int held, int hour, int weekday
});




}
/// @nodoc
class _$AnalysisSlotBodyCopyWithImpl<$Res>
    implements $AnalysisSlotBodyCopyWith<$Res> {
  _$AnalysisSlotBodyCopyWithImpl(this._self, this._then);

  final AnalysisSlotBody _self;
  final $Res Function(AnalysisSlotBody) _then;

/// Create a copy of AnalysisSlotBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? collected = null,Object? held = null,Object? hour = null,Object? weekday = null,}) {
  return _then(AnalysisSlotBody(
collected: null == collected ? _self.collected : collected // ignore: cast_nullable_to_non_nullable
as int,held: null == held ? _self.held : held // ignore: cast_nullable_to_non_nullable
as int,hour: null == hour ? _self.hour : hour // ignore: cast_nullable_to_non_nullable
as int,weekday: null == weekday ? _self.weekday : weekday // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [AnalysisSlotBody].
extension AnalysisSlotBodyPatterns on AnalysisSlotBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AnalysisSlotBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AnalysisSlotBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AnalysisSlotBody value)  $default,){
final _that = this;
switch (_that) {
case _AnalysisSlotBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AnalysisSlotBody value)?  $default,){
final _that = this;
switch (_that) {
case _AnalysisSlotBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int collected,  int held,  int hour,  int weekday)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AnalysisSlotBody() when $default != null:
return $default(_that.collected,_that.held,_that.hour,_that.weekday);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int collected,  int held,  int hour,  int weekday)  $default,) {final _that = this;
switch (_that) {
case _AnalysisSlotBody():
return $default(_that.collected,_that.held,_that.hour,_that.weekday);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int collected,  int held,  int hour,  int weekday)?  $default,) {final _that = this;
switch (_that) {
case _AnalysisSlotBody() when $default != null:
return $default(_that.collected,_that.held,_that.hour,_that.weekday);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _AnalysisSlotBody implements AnalysisSlotBody {
  const _AnalysisSlotBody({required this.collected, required this.held, required this.hour, required this.weekday});
  factory _AnalysisSlotBody.fromJson(Map<String, dynamic> json) => _$AnalysisSlotBodyFromJson(json);

@override final  int collected;
@override final  int held;
/// The hour of the window's start in Vietnam
@override final  int hour;
/// 1 Monday to 7 Sunday, of the window's start in Vietnam
@override final  int weekday;

/// Create a copy of AnalysisSlotBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AnalysisSlotBodyCopyWith<_AnalysisSlotBody> get copyWith => __$AnalysisSlotBodyCopyWithImpl<_AnalysisSlotBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AnalysisSlotBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _AnalysisSlotBody&&(identical(other.collected, collected) || other.collected == collected)&&(identical(other.held, held) || other.held == held)&&(identical(other.hour, hour) || other.hour == hour)&&(identical(other.weekday, weekday) || other.weekday == weekday));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,collected,held,hour,weekday);
}

@override
String toString() {
    return 'AnalysisSlotBody(collected: $collected, held: $held, hour: $hour, weekday: $weekday)';
}


}

/// @nodoc
abstract mixin class _$AnalysisSlotBodyCopyWith<$Res> implements $AnalysisSlotBodyCopyWith<$Res> {
  factory _$AnalysisSlotBodyCopyWith(_AnalysisSlotBody value, $Res Function(_AnalysisSlotBody) _then) = __$AnalysisSlotBodyCopyWithImpl;
@override @useResult
$Res call({
 int collected, int held, int hour, int weekday
});




}
/// @nodoc
class __$AnalysisSlotBodyCopyWithImpl<$Res>
    implements _$AnalysisSlotBodyCopyWith<$Res> {
  __$AnalysisSlotBodyCopyWithImpl(this._self, this._then);

  final _AnalysisSlotBody _self;
  final $Res Function(_AnalysisSlotBody) _then;

/// Create a copy of AnalysisSlotBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? collected = null,Object? held = null,Object? hour = null,Object? weekday = null,}) {
  return _then(_AnalysisSlotBody(
collected: null == collected ? _self.collected : collected // ignore: cast_nullable_to_non_nullable
as int,held: null == held ? _self.held : held // ignore: cast_nullable_to_non_nullable
as int,hour: null == hour ? _self.hour : hour // ignore: cast_nullable_to_non_nullable
as int,weekday: null == weekday ? _self.weekday : weekday // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
