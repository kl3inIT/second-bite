// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'promotion_reward_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$PromotionRewardBody {

 PromotionRewardBodyType get type;/// VND for fixed, 1 to 100 for percentage
 int get value;/// The most a percentage takes off, in VND; required with a percentage
 int? get maxVnd;
/// Create a copy of PromotionRewardBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$PromotionRewardBodyCopyWith<PromotionRewardBody> get copyWith => _$PromotionRewardBodyCopyWithImpl<PromotionRewardBody>(this as PromotionRewardBody, _$identity);

  /// Serializes this PromotionRewardBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as PromotionRewardBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is PromotionRewardBody&&(identical(other.type, _this.type) || other.type == _this.type)&&(identical(other.value, _this.value) || other.value == _this.value)&&(identical(other.maxVnd, _this.maxVnd) || other.maxVnd == _this.maxVnd));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as PromotionRewardBody;
  return Object.hash(runtimeType,_this.type,_this.value,_this.maxVnd);
}

@override
String toString() {
  final _this = this as PromotionRewardBody;
  return 'PromotionRewardBody(type: ${_this.type}, value: ${_this.value}, maxVnd: ${_this.maxVnd})';
}


}

/// @nodoc
abstract mixin class $PromotionRewardBodyCopyWith<$Res>  {
  factory $PromotionRewardBodyCopyWith(PromotionRewardBody value, $Res Function(PromotionRewardBody) _then) = _$PromotionRewardBodyCopyWithImpl;
@useResult
$Res call({
 PromotionRewardBodyType type, int value, int? maxVnd
});




}
/// @nodoc
class _$PromotionRewardBodyCopyWithImpl<$Res>
    implements $PromotionRewardBodyCopyWith<$Res> {
  _$PromotionRewardBodyCopyWithImpl(this._self, this._then);

  final PromotionRewardBody _self;
  final $Res Function(PromotionRewardBody) _then;

/// Create a copy of PromotionRewardBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? type = null,Object? value = null,Object? maxVnd = freezed,}) {
  return _then(PromotionRewardBody(
type: null == type ? _self.type : type // ignore: cast_nullable_to_non_nullable
as PromotionRewardBodyType,value: null == value ? _self.value : value // ignore: cast_nullable_to_non_nullable
as int,maxVnd: freezed == maxVnd ? _self.maxVnd : maxVnd // ignore: cast_nullable_to_non_nullable
as int?,
  ));
}

}


/// Adds pattern-matching-related methods to [PromotionRewardBody].
extension PromotionRewardBodyPatterns on PromotionRewardBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _PromotionRewardBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _PromotionRewardBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _PromotionRewardBody value)  $default,){
final _that = this;
switch (_that) {
case _PromotionRewardBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _PromotionRewardBody value)?  $default,){
final _that = this;
switch (_that) {
case _PromotionRewardBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( PromotionRewardBodyType type,  int value,  int? maxVnd)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _PromotionRewardBody() when $default != null:
return $default(_that.type,_that.value,_that.maxVnd);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( PromotionRewardBodyType type,  int value,  int? maxVnd)  $default,) {final _that = this;
switch (_that) {
case _PromotionRewardBody():
return $default(_that.type,_that.value,_that.maxVnd);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( PromotionRewardBodyType type,  int value,  int? maxVnd)?  $default,) {final _that = this;
switch (_that) {
case _PromotionRewardBody() when $default != null:
return $default(_that.type,_that.value,_that.maxVnd);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _PromotionRewardBody implements PromotionRewardBody {
  const _PromotionRewardBody({required this.type, required this.value, this.maxVnd});
  factory _PromotionRewardBody.fromJson(Map<String, dynamic> json) => _$PromotionRewardBodyFromJson(json);

@override final  PromotionRewardBodyType type;
/// VND for fixed, 1 to 100 for percentage
@override final  int value;
/// The most a percentage takes off, in VND; required with a percentage
@override final  int? maxVnd;

/// Create a copy of PromotionRewardBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$PromotionRewardBodyCopyWith<_PromotionRewardBody> get copyWith => __$PromotionRewardBodyCopyWithImpl<_PromotionRewardBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$PromotionRewardBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _PromotionRewardBody&&(identical(other.type, type) || other.type == type)&&(identical(other.value, value) || other.value == value)&&(identical(other.maxVnd, maxVnd) || other.maxVnd == maxVnd));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,type,value,maxVnd);
}

@override
String toString() {
    return 'PromotionRewardBody(type: $type, value: $value, maxVnd: $maxVnd)';
}


}

/// @nodoc
abstract mixin class _$PromotionRewardBodyCopyWith<$Res> implements $PromotionRewardBodyCopyWith<$Res> {
  factory _$PromotionRewardBodyCopyWith(_PromotionRewardBody value, $Res Function(_PromotionRewardBody) _then) = __$PromotionRewardBodyCopyWithImpl;
@override @useResult
$Res call({
 PromotionRewardBodyType type, int value, int? maxVnd
});




}
/// @nodoc
class __$PromotionRewardBodyCopyWithImpl<$Res>
    implements _$PromotionRewardBodyCopyWith<$Res> {
  __$PromotionRewardBodyCopyWithImpl(this._self, this._then);

  final _PromotionRewardBody _self;
  final $Res Function(_PromotionRewardBody) _then;

/// Create a copy of PromotionRewardBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? type = null,Object? value = null,Object? maxVnd = freezed,}) {
  return _then(_PromotionRewardBody(
type: null == type ? _self.type : type // ignore: cast_nullable_to_non_nullable
as PromotionRewardBodyType,value: null == value ? _self.value : value // ignore: cast_nullable_to_non_nullable
as int,maxVnd: freezed == maxVnd ? _self.maxVnd : maxVnd // ignore: cast_nullable_to_non_nullable
as int?,
  ));
}


}

// dart format on
