// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'status_day_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$StatusDayBody {

 int get active; int get blocked;/// The day in Vietnam, as YYYY-MM-DD
 DateTime get day; int get deleted; int get pending; int get rejected;
/// Create a copy of StatusDayBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$StatusDayBodyCopyWith<StatusDayBody> get copyWith => _$StatusDayBodyCopyWithImpl<StatusDayBody>(this as StatusDayBody, _$identity);

  /// Serializes this StatusDayBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as StatusDayBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is StatusDayBody&&(identical(other.active, _this.active) || other.active == _this.active)&&(identical(other.blocked, _this.blocked) || other.blocked == _this.blocked)&&(identical(other.day, _this.day) || other.day == _this.day)&&(identical(other.deleted, _this.deleted) || other.deleted == _this.deleted)&&(identical(other.pending, _this.pending) || other.pending == _this.pending)&&(identical(other.rejected, _this.rejected) || other.rejected == _this.rejected));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as StatusDayBody;
  return Object.hash(runtimeType,_this.active,_this.blocked,_this.day,_this.deleted,_this.pending,_this.rejected);
}

@override
String toString() {
  final _this = this as StatusDayBody;
  return 'StatusDayBody(active: ${_this.active}, blocked: ${_this.blocked}, day: ${_this.day}, deleted: ${_this.deleted}, pending: ${_this.pending}, rejected: ${_this.rejected})';
}


}

/// @nodoc
abstract mixin class $StatusDayBodyCopyWith<$Res>  {
  factory $StatusDayBodyCopyWith(StatusDayBody value, $Res Function(StatusDayBody) _then) = _$StatusDayBodyCopyWithImpl;
@useResult
$Res call({
 int active, int blocked, DateTime day, int deleted, int pending, int rejected
});




}
/// @nodoc
class _$StatusDayBodyCopyWithImpl<$Res>
    implements $StatusDayBodyCopyWith<$Res> {
  _$StatusDayBodyCopyWithImpl(this._self, this._then);

  final StatusDayBody _self;
  final $Res Function(StatusDayBody) _then;

/// Create a copy of StatusDayBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? active = null,Object? blocked = null,Object? day = null,Object? deleted = null,Object? pending = null,Object? rejected = null,}) {
  return _then(StatusDayBody(
active: null == active ? _self.active : active // ignore: cast_nullable_to_non_nullable
as int,blocked: null == blocked ? _self.blocked : blocked // ignore: cast_nullable_to_non_nullable
as int,day: null == day ? _self.day : day // ignore: cast_nullable_to_non_nullable
as DateTime,deleted: null == deleted ? _self.deleted : deleted // ignore: cast_nullable_to_non_nullable
as int,pending: null == pending ? _self.pending : pending // ignore: cast_nullable_to_non_nullable
as int,rejected: null == rejected ? _self.rejected : rejected // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [StatusDayBody].
extension StatusDayBodyPatterns on StatusDayBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _StatusDayBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _StatusDayBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _StatusDayBody value)  $default,){
final _that = this;
switch (_that) {
case _StatusDayBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _StatusDayBody value)?  $default,){
final _that = this;
switch (_that) {
case _StatusDayBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int active,  int blocked,  DateTime day,  int deleted,  int pending,  int rejected)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _StatusDayBody() when $default != null:
return $default(_that.active,_that.blocked,_that.day,_that.deleted,_that.pending,_that.rejected);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int active,  int blocked,  DateTime day,  int deleted,  int pending,  int rejected)  $default,) {final _that = this;
switch (_that) {
case _StatusDayBody():
return $default(_that.active,_that.blocked,_that.day,_that.deleted,_that.pending,_that.rejected);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int active,  int blocked,  DateTime day,  int deleted,  int pending,  int rejected)?  $default,) {final _that = this;
switch (_that) {
case _StatusDayBody() when $default != null:
return $default(_that.active,_that.blocked,_that.day,_that.deleted,_that.pending,_that.rejected);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _StatusDayBody implements StatusDayBody {
  const _StatusDayBody({required this.active, required this.blocked, required this.day, required this.deleted, required this.pending, required this.rejected});
  factory _StatusDayBody.fromJson(Map<String, dynamic> json) => _$StatusDayBodyFromJson(json);

@override final  int active;
@override final  int blocked;
/// The day in Vietnam, as YYYY-MM-DD
@override final  DateTime day;
@override final  int deleted;
@override final  int pending;
@override final  int rejected;

/// Create a copy of StatusDayBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$StatusDayBodyCopyWith<_StatusDayBody> get copyWith => __$StatusDayBodyCopyWithImpl<_StatusDayBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$StatusDayBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _StatusDayBody&&(identical(other.active, active) || other.active == active)&&(identical(other.blocked, blocked) || other.blocked == blocked)&&(identical(other.day, day) || other.day == day)&&(identical(other.deleted, deleted) || other.deleted == deleted)&&(identical(other.pending, pending) || other.pending == pending)&&(identical(other.rejected, rejected) || other.rejected == rejected));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,active,blocked,day,deleted,pending,rejected);
}

@override
String toString() {
    return 'StatusDayBody(active: $active, blocked: $blocked, day: $day, deleted: $deleted, pending: $pending, rejected: $rejected)';
}


}

/// @nodoc
abstract mixin class _$StatusDayBodyCopyWith<$Res> implements $StatusDayBodyCopyWith<$Res> {
  factory _$StatusDayBodyCopyWith(_StatusDayBody value, $Res Function(_StatusDayBody) _then) = __$StatusDayBodyCopyWithImpl;
@override @useResult
$Res call({
 int active, int blocked, DateTime day, int deleted, int pending, int rejected
});




}
/// @nodoc
class __$StatusDayBodyCopyWithImpl<$Res>
    implements _$StatusDayBodyCopyWith<$Res> {
  __$StatusDayBodyCopyWithImpl(this._self, this._then);

  final _StatusDayBody _self;
  final $Res Function(_StatusDayBody) _then;

/// Create a copy of StatusDayBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? active = null,Object? blocked = null,Object? day = null,Object? deleted = null,Object? pending = null,Object? rejected = null,}) {
  return _then(_StatusDayBody(
active: null == active ? _self.active : active // ignore: cast_nullable_to_non_nullable
as int,blocked: null == blocked ? _self.blocked : blocked // ignore: cast_nullable_to_non_nullable
as int,day: null == day ? _self.day : day // ignore: cast_nullable_to_non_nullable
as DateTime,deleted: null == deleted ? _self.deleted : deleted // ignore: cast_nullable_to_non_nullable
as int,pending: null == pending ? _self.pending : pending // ignore: cast_nullable_to_non_nullable
as int,rejected: null == rejected ? _self.rejected : rejected // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
