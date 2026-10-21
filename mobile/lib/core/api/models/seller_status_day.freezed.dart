// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'seller_status_day.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$SellerStatusDay {

 int get active; int get blocked;/// A day in Vietnam time
 DateTime get date; int get pending;
/// Create a copy of SellerStatusDay
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$SellerStatusDayCopyWith<SellerStatusDay> get copyWith => _$SellerStatusDayCopyWithImpl<SellerStatusDay>(this as SellerStatusDay, _$identity);

  /// Serializes this SellerStatusDay to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as SellerStatusDay;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is SellerStatusDay&&(identical(other.active, _this.active) || other.active == _this.active)&&(identical(other.blocked, _this.blocked) || other.blocked == _this.blocked)&&(identical(other.date, _this.date) || other.date == _this.date)&&(identical(other.pending, _this.pending) || other.pending == _this.pending));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as SellerStatusDay;
  return Object.hash(runtimeType,_this.active,_this.blocked,_this.date,_this.pending);
}

@override
String toString() {
  final _this = this as SellerStatusDay;
  return 'SellerStatusDay(active: ${_this.active}, blocked: ${_this.blocked}, date: ${_this.date}, pending: ${_this.pending})';
}


}

/// @nodoc
abstract mixin class $SellerStatusDayCopyWith<$Res>  {
  factory $SellerStatusDayCopyWith(SellerStatusDay value, $Res Function(SellerStatusDay) _then) = _$SellerStatusDayCopyWithImpl;
@useResult
$Res call({
 int active, int blocked, DateTime date, int pending
});




}
/// @nodoc
class _$SellerStatusDayCopyWithImpl<$Res>
    implements $SellerStatusDayCopyWith<$Res> {
  _$SellerStatusDayCopyWithImpl(this._self, this._then);

  final SellerStatusDay _self;
  final $Res Function(SellerStatusDay) _then;

/// Create a copy of SellerStatusDay
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? active = null,Object? blocked = null,Object? date = null,Object? pending = null,}) {
  return _then(SellerStatusDay(
active: null == active ? _self.active : active // ignore: cast_nullable_to_non_nullable
as int,blocked: null == blocked ? _self.blocked : blocked // ignore: cast_nullable_to_non_nullable
as int,date: null == date ? _self.date : date // ignore: cast_nullable_to_non_nullable
as DateTime,pending: null == pending ? _self.pending : pending // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [SellerStatusDay].
extension SellerStatusDayPatterns on SellerStatusDay {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _SellerStatusDay value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _SellerStatusDay() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _SellerStatusDay value)  $default,){
final _that = this;
switch (_that) {
case _SellerStatusDay():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _SellerStatusDay value)?  $default,){
final _that = this;
switch (_that) {
case _SellerStatusDay() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int active,  int blocked,  DateTime date,  int pending)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _SellerStatusDay() when $default != null:
return $default(_that.active,_that.blocked,_that.date,_that.pending);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int active,  int blocked,  DateTime date,  int pending)  $default,) {final _that = this;
switch (_that) {
case _SellerStatusDay():
return $default(_that.active,_that.blocked,_that.date,_that.pending);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int active,  int blocked,  DateTime date,  int pending)?  $default,) {final _that = this;
switch (_that) {
case _SellerStatusDay() when $default != null:
return $default(_that.active,_that.blocked,_that.date,_that.pending);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _SellerStatusDay implements SellerStatusDay {
  const _SellerStatusDay({required this.active, required this.blocked, required this.date, required this.pending});
  factory _SellerStatusDay.fromJson(Map<String, dynamic> json) => _$SellerStatusDayFromJson(json);

@override final  int active;
@override final  int blocked;
/// A day in Vietnam time
@override final  DateTime date;
@override final  int pending;

/// Create a copy of SellerStatusDay
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$SellerStatusDayCopyWith<_SellerStatusDay> get copyWith => __$SellerStatusDayCopyWithImpl<_SellerStatusDay>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$SellerStatusDayToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _SellerStatusDay&&(identical(other.active, active) || other.active == active)&&(identical(other.blocked, blocked) || other.blocked == blocked)&&(identical(other.date, date) || other.date == date)&&(identical(other.pending, pending) || other.pending == pending));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,active,blocked,date,pending);
}

@override
String toString() {
    return 'SellerStatusDay(active: $active, blocked: $blocked, date: $date, pending: $pending)';
}


}

/// @nodoc
abstract mixin class _$SellerStatusDayCopyWith<$Res> implements $SellerStatusDayCopyWith<$Res> {
  factory _$SellerStatusDayCopyWith(_SellerStatusDay value, $Res Function(_SellerStatusDay) _then) = __$SellerStatusDayCopyWithImpl;
@override @useResult
$Res call({
 int active, int blocked, DateTime date, int pending
});




}
/// @nodoc
class __$SellerStatusDayCopyWithImpl<$Res>
    implements _$SellerStatusDayCopyWith<$Res> {
  __$SellerStatusDayCopyWithImpl(this._self, this._then);

  final _SellerStatusDay _self;
  final $Res Function(_SellerStatusDay) _then;

/// Create a copy of SellerStatusDay
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? active = null,Object? blocked = null,Object? date = null,Object? pending = null,}) {
  return _then(_SellerStatusDay(
active: null == active ? _self.active : active // ignore: cast_nullable_to_non_nullable
as int,blocked: null == blocked ? _self.blocked : blocked // ignore: cast_nullable_to_non_nullable
as int,date: null == date ? _self.date : date // ignore: cast_nullable_to_non_nullable
as DateTime,pending: null == pending ? _self.pending : pending // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
