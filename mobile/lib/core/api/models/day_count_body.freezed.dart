// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'day_count_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$DayCountBody {

 int get count;/// A day in Vietnam time
 DateTime get date;
/// Create a copy of DayCountBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$DayCountBodyCopyWith<DayCountBody> get copyWith => _$DayCountBodyCopyWithImpl<DayCountBody>(this as DayCountBody, _$identity);

  /// Serializes this DayCountBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as DayCountBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is DayCountBody&&(identical(other.count, _this.count) || other.count == _this.count)&&(identical(other.date, _this.date) || other.date == _this.date));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as DayCountBody;
  return Object.hash(runtimeType,_this.count,_this.date);
}

@override
String toString() {
  final _this = this as DayCountBody;
  return 'DayCountBody(count: ${_this.count}, date: ${_this.date})';
}


}

/// @nodoc
abstract mixin class $DayCountBodyCopyWith<$Res>  {
  factory $DayCountBodyCopyWith(DayCountBody value, $Res Function(DayCountBody) _then) = _$DayCountBodyCopyWithImpl;
@useResult
$Res call({
 int count, DateTime date
});




}
/// @nodoc
class _$DayCountBodyCopyWithImpl<$Res>
    implements $DayCountBodyCopyWith<$Res> {
  _$DayCountBodyCopyWithImpl(this._self, this._then);

  final DayCountBody _self;
  final $Res Function(DayCountBody) _then;

/// Create a copy of DayCountBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? count = null,Object? date = null,}) {
  return _then(DayCountBody(
count: null == count ? _self.count : count // ignore: cast_nullable_to_non_nullable
as int,date: null == date ? _self.date : date // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}

}


/// Adds pattern-matching-related methods to [DayCountBody].
extension DayCountBodyPatterns on DayCountBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _DayCountBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _DayCountBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _DayCountBody value)  $default,){
final _that = this;
switch (_that) {
case _DayCountBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _DayCountBody value)?  $default,){
final _that = this;
switch (_that) {
case _DayCountBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int count,  DateTime date)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _DayCountBody() when $default != null:
return $default(_that.count,_that.date);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int count,  DateTime date)  $default,) {final _that = this;
switch (_that) {
case _DayCountBody():
return $default(_that.count,_that.date);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int count,  DateTime date)?  $default,) {final _that = this;
switch (_that) {
case _DayCountBody() when $default != null:
return $default(_that.count,_that.date);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _DayCountBody implements DayCountBody {
  const _DayCountBody({required this.count, required this.date});
  factory _DayCountBody.fromJson(Map<String, dynamic> json) => _$DayCountBodyFromJson(json);

@override final  int count;
/// A day in Vietnam time
@override final  DateTime date;

/// Create a copy of DayCountBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$DayCountBodyCopyWith<_DayCountBody> get copyWith => __$DayCountBodyCopyWithImpl<_DayCountBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$DayCountBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _DayCountBody&&(identical(other.count, count) || other.count == count)&&(identical(other.date, date) || other.date == date));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,count,date);
}

@override
String toString() {
    return 'DayCountBody(count: $count, date: $date)';
}


}

/// @nodoc
abstract mixin class _$DayCountBodyCopyWith<$Res> implements $DayCountBodyCopyWith<$Res> {
  factory _$DayCountBodyCopyWith(_DayCountBody value, $Res Function(_DayCountBody) _then) = __$DayCountBodyCopyWithImpl;
@override @useResult
$Res call({
 int count, DateTime date
});




}
/// @nodoc
class __$DayCountBodyCopyWithImpl<$Res>
    implements _$DayCountBodyCopyWith<$Res> {
  __$DayCountBodyCopyWithImpl(this._self, this._then);

  final _DayCountBody _self;
  final $Res Function(_DayCountBody) _then;

/// Create a copy of DayCountBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? count = null,Object? date = null,}) {
  return _then(_DayCountBody(
count: null == count ? _self.count : count // ignore: cast_nullable_to_non_nullable
as int,date: null == date ? _self.date : date // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}


}

// dart format on
