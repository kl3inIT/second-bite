// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'promotion_counts_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$PromotionCountsBody {

 int get ended; int get paused; int get running; int get scheduled;
/// Create a copy of PromotionCountsBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$PromotionCountsBodyCopyWith<PromotionCountsBody> get copyWith => _$PromotionCountsBodyCopyWithImpl<PromotionCountsBody>(this as PromotionCountsBody, _$identity);

  /// Serializes this PromotionCountsBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as PromotionCountsBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is PromotionCountsBody&&(identical(other.ended, _this.ended) || other.ended == _this.ended)&&(identical(other.paused, _this.paused) || other.paused == _this.paused)&&(identical(other.running, _this.running) || other.running == _this.running)&&(identical(other.scheduled, _this.scheduled) || other.scheduled == _this.scheduled));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as PromotionCountsBody;
  return Object.hash(runtimeType,_this.ended,_this.paused,_this.running,_this.scheduled);
}

@override
String toString() {
  final _this = this as PromotionCountsBody;
  return 'PromotionCountsBody(ended: ${_this.ended}, paused: ${_this.paused}, running: ${_this.running}, scheduled: ${_this.scheduled})';
}


}

/// @nodoc
abstract mixin class $PromotionCountsBodyCopyWith<$Res>  {
  factory $PromotionCountsBodyCopyWith(PromotionCountsBody value, $Res Function(PromotionCountsBody) _then) = _$PromotionCountsBodyCopyWithImpl;
@useResult
$Res call({
 int ended, int paused, int running, int scheduled
});




}
/// @nodoc
class _$PromotionCountsBodyCopyWithImpl<$Res>
    implements $PromotionCountsBodyCopyWith<$Res> {
  _$PromotionCountsBodyCopyWithImpl(this._self, this._then);

  final PromotionCountsBody _self;
  final $Res Function(PromotionCountsBody) _then;

/// Create a copy of PromotionCountsBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? ended = null,Object? paused = null,Object? running = null,Object? scheduled = null,}) {
  return _then(PromotionCountsBody(
ended: null == ended ? _self.ended : ended // ignore: cast_nullable_to_non_nullable
as int,paused: null == paused ? _self.paused : paused // ignore: cast_nullable_to_non_nullable
as int,running: null == running ? _self.running : running // ignore: cast_nullable_to_non_nullable
as int,scheduled: null == scheduled ? _self.scheduled : scheduled // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [PromotionCountsBody].
extension PromotionCountsBodyPatterns on PromotionCountsBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _PromotionCountsBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _PromotionCountsBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _PromotionCountsBody value)  $default,){
final _that = this;
switch (_that) {
case _PromotionCountsBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _PromotionCountsBody value)?  $default,){
final _that = this;
switch (_that) {
case _PromotionCountsBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int ended,  int paused,  int running,  int scheduled)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _PromotionCountsBody() when $default != null:
return $default(_that.ended,_that.paused,_that.running,_that.scheduled);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int ended,  int paused,  int running,  int scheduled)  $default,) {final _that = this;
switch (_that) {
case _PromotionCountsBody():
return $default(_that.ended,_that.paused,_that.running,_that.scheduled);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int ended,  int paused,  int running,  int scheduled)?  $default,) {final _that = this;
switch (_that) {
case _PromotionCountsBody() when $default != null:
return $default(_that.ended,_that.paused,_that.running,_that.scheduled);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _PromotionCountsBody implements PromotionCountsBody {
  const _PromotionCountsBody({required this.ended, required this.paused, required this.running, required this.scheduled});
  factory _PromotionCountsBody.fromJson(Map<String, dynamic> json) => _$PromotionCountsBodyFromJson(json);

@override final  int ended;
@override final  int paused;
@override final  int running;
@override final  int scheduled;

/// Create a copy of PromotionCountsBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$PromotionCountsBodyCopyWith<_PromotionCountsBody> get copyWith => __$PromotionCountsBodyCopyWithImpl<_PromotionCountsBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$PromotionCountsBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _PromotionCountsBody&&(identical(other.ended, ended) || other.ended == ended)&&(identical(other.paused, paused) || other.paused == paused)&&(identical(other.running, running) || other.running == running)&&(identical(other.scheduled, scheduled) || other.scheduled == scheduled));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,ended,paused,running,scheduled);
}

@override
String toString() {
    return 'PromotionCountsBody(ended: $ended, paused: $paused, running: $running, scheduled: $scheduled)';
}


}

/// @nodoc
abstract mixin class _$PromotionCountsBodyCopyWith<$Res> implements $PromotionCountsBodyCopyWith<$Res> {
  factory _$PromotionCountsBodyCopyWith(_PromotionCountsBody value, $Res Function(_PromotionCountsBody) _then) = __$PromotionCountsBodyCopyWithImpl;
@override @useResult
$Res call({
 int ended, int paused, int running, int scheduled
});




}
/// @nodoc
class __$PromotionCountsBodyCopyWithImpl<$Res>
    implements _$PromotionCountsBodyCopyWith<$Res> {
  __$PromotionCountsBodyCopyWithImpl(this._self, this._then);

  final _PromotionCountsBody _self;
  final $Res Function(_PromotionCountsBody) _then;

/// Create a copy of PromotionCountsBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? ended = null,Object? paused = null,Object? running = null,Object? scheduled = null,}) {
  return _then(_PromotionCountsBody(
ended: null == ended ? _self.ended : ended // ignore: cast_nullable_to_non_nullable
as int,paused: null == paused ? _self.paused : paused // ignore: cast_nullable_to_non_nullable
as int,running: null == running ? _self.running : running // ignore: cast_nullable_to_non_nullable
as int,scheduled: null == scheduled ? _self.scheduled : scheduled // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
