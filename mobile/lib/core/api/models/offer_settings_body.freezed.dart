// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'offer_settings_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$OfferSettingsBody {

/// The search radius when a customer names none
 int get defaultRadiusKm; int get maxRadiusKm;/// How far below its original price an offer must be priced
 int get minDiscountPercent;/// How far ahead of posting a window may start
 int get startsWithinHours;/// The longest collection window
 int get windowMaxMinutes;/// The shortest collection window
 int get windowMinMinutes; DateTime? get updatedAt; String? get updatedBy;
/// Create a copy of OfferSettingsBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$OfferSettingsBodyCopyWith<OfferSettingsBody> get copyWith => _$OfferSettingsBodyCopyWithImpl<OfferSettingsBody>(this as OfferSettingsBody, _$identity);

  /// Serializes this OfferSettingsBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as OfferSettingsBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is OfferSettingsBody&&(identical(other.defaultRadiusKm, _this.defaultRadiusKm) || other.defaultRadiusKm == _this.defaultRadiusKm)&&(identical(other.maxRadiusKm, _this.maxRadiusKm) || other.maxRadiusKm == _this.maxRadiusKm)&&(identical(other.minDiscountPercent, _this.minDiscountPercent) || other.minDiscountPercent == _this.minDiscountPercent)&&(identical(other.startsWithinHours, _this.startsWithinHours) || other.startsWithinHours == _this.startsWithinHours)&&(identical(other.windowMaxMinutes, _this.windowMaxMinutes) || other.windowMaxMinutes == _this.windowMaxMinutes)&&(identical(other.windowMinMinutes, _this.windowMinMinutes) || other.windowMinMinutes == _this.windowMinMinutes)&&(identical(other.updatedAt, _this.updatedAt) || other.updatedAt == _this.updatedAt)&&(identical(other.updatedBy, _this.updatedBy) || other.updatedBy == _this.updatedBy));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as OfferSettingsBody;
  return Object.hash(runtimeType,_this.defaultRadiusKm,_this.maxRadiusKm,_this.minDiscountPercent,_this.startsWithinHours,_this.windowMaxMinutes,_this.windowMinMinutes,_this.updatedAt,_this.updatedBy);
}

@override
String toString() {
  final _this = this as OfferSettingsBody;
  return 'OfferSettingsBody(defaultRadiusKm: ${_this.defaultRadiusKm}, maxRadiusKm: ${_this.maxRadiusKm}, minDiscountPercent: ${_this.minDiscountPercent}, startsWithinHours: ${_this.startsWithinHours}, windowMaxMinutes: ${_this.windowMaxMinutes}, windowMinMinutes: ${_this.windowMinMinutes}, updatedAt: ${_this.updatedAt}, updatedBy: ${_this.updatedBy})';
}


}

/// @nodoc
abstract mixin class $OfferSettingsBodyCopyWith<$Res>  {
  factory $OfferSettingsBodyCopyWith(OfferSettingsBody value, $Res Function(OfferSettingsBody) _then) = _$OfferSettingsBodyCopyWithImpl;
@useResult
$Res call({
 int defaultRadiusKm, int maxRadiusKm, int minDiscountPercent, int startsWithinHours, int windowMaxMinutes, int windowMinMinutes, DateTime? updatedAt, String? updatedBy
});




}
/// @nodoc
class _$OfferSettingsBodyCopyWithImpl<$Res>
    implements $OfferSettingsBodyCopyWith<$Res> {
  _$OfferSettingsBodyCopyWithImpl(this._self, this._then);

  final OfferSettingsBody _self;
  final $Res Function(OfferSettingsBody) _then;

/// Create a copy of OfferSettingsBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? defaultRadiusKm = null,Object? maxRadiusKm = null,Object? minDiscountPercent = null,Object? startsWithinHours = null,Object? windowMaxMinutes = null,Object? windowMinMinutes = null,Object? updatedAt = freezed,Object? updatedBy = freezed,}) {
  return _then(OfferSettingsBody(
defaultRadiusKm: null == defaultRadiusKm ? _self.defaultRadiusKm : defaultRadiusKm // ignore: cast_nullable_to_non_nullable
as int,maxRadiusKm: null == maxRadiusKm ? _self.maxRadiusKm : maxRadiusKm // ignore: cast_nullable_to_non_nullable
as int,minDiscountPercent: null == minDiscountPercent ? _self.minDiscountPercent : minDiscountPercent // ignore: cast_nullable_to_non_nullable
as int,startsWithinHours: null == startsWithinHours ? _self.startsWithinHours : startsWithinHours // ignore: cast_nullable_to_non_nullable
as int,windowMaxMinutes: null == windowMaxMinutes ? _self.windowMaxMinutes : windowMaxMinutes // ignore: cast_nullable_to_non_nullable
as int,windowMinMinutes: null == windowMinMinutes ? _self.windowMinMinutes : windowMinMinutes // ignore: cast_nullable_to_non_nullable
as int,updatedAt: freezed == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,updatedBy: freezed == updatedBy ? _self.updatedBy : updatedBy // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [OfferSettingsBody].
extension OfferSettingsBodyPatterns on OfferSettingsBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _OfferSettingsBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _OfferSettingsBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _OfferSettingsBody value)  $default,){
final _that = this;
switch (_that) {
case _OfferSettingsBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _OfferSettingsBody value)?  $default,){
final _that = this;
switch (_that) {
case _OfferSettingsBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int defaultRadiusKm,  int maxRadiusKm,  int minDiscountPercent,  int startsWithinHours,  int windowMaxMinutes,  int windowMinMinutes,  DateTime? updatedAt,  String? updatedBy)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _OfferSettingsBody() when $default != null:
return $default(_that.defaultRadiusKm,_that.maxRadiusKm,_that.minDiscountPercent,_that.startsWithinHours,_that.windowMaxMinutes,_that.windowMinMinutes,_that.updatedAt,_that.updatedBy);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int defaultRadiusKm,  int maxRadiusKm,  int minDiscountPercent,  int startsWithinHours,  int windowMaxMinutes,  int windowMinMinutes,  DateTime? updatedAt,  String? updatedBy)  $default,) {final _that = this;
switch (_that) {
case _OfferSettingsBody():
return $default(_that.defaultRadiusKm,_that.maxRadiusKm,_that.minDiscountPercent,_that.startsWithinHours,_that.windowMaxMinutes,_that.windowMinMinutes,_that.updatedAt,_that.updatedBy);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int defaultRadiusKm,  int maxRadiusKm,  int minDiscountPercent,  int startsWithinHours,  int windowMaxMinutes,  int windowMinMinutes,  DateTime? updatedAt,  String? updatedBy)?  $default,) {final _that = this;
switch (_that) {
case _OfferSettingsBody() when $default != null:
return $default(_that.defaultRadiusKm,_that.maxRadiusKm,_that.minDiscountPercent,_that.startsWithinHours,_that.windowMaxMinutes,_that.windowMinMinutes,_that.updatedAt,_that.updatedBy);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _OfferSettingsBody implements OfferSettingsBody {
  const _OfferSettingsBody({required this.defaultRadiusKm, required this.maxRadiusKm, required this.minDiscountPercent, required this.startsWithinHours, required this.windowMaxMinutes, required this.windowMinMinutes, this.updatedAt, this.updatedBy});
  factory _OfferSettingsBody.fromJson(Map<String, dynamic> json) => _$OfferSettingsBodyFromJson(json);

/// The search radius when a customer names none
@override final  int defaultRadiusKm;
@override final  int maxRadiusKm;
/// How far below its original price an offer must be priced
@override final  int minDiscountPercent;
/// How far ahead of posting a window may start
@override final  int startsWithinHours;
/// The longest collection window
@override final  int windowMaxMinutes;
/// The shortest collection window
@override final  int windowMinMinutes;
@override final  DateTime? updatedAt;
@override final  String? updatedBy;

/// Create a copy of OfferSettingsBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$OfferSettingsBodyCopyWith<_OfferSettingsBody> get copyWith => __$OfferSettingsBodyCopyWithImpl<_OfferSettingsBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$OfferSettingsBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _OfferSettingsBody&&(identical(other.defaultRadiusKm, defaultRadiusKm) || other.defaultRadiusKm == defaultRadiusKm)&&(identical(other.maxRadiusKm, maxRadiusKm) || other.maxRadiusKm == maxRadiusKm)&&(identical(other.minDiscountPercent, minDiscountPercent) || other.minDiscountPercent == minDiscountPercent)&&(identical(other.startsWithinHours, startsWithinHours) || other.startsWithinHours == startsWithinHours)&&(identical(other.windowMaxMinutes, windowMaxMinutes) || other.windowMaxMinutes == windowMaxMinutes)&&(identical(other.windowMinMinutes, windowMinMinutes) || other.windowMinMinutes == windowMinMinutes)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt)&&(identical(other.updatedBy, updatedBy) || other.updatedBy == updatedBy));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,defaultRadiusKm,maxRadiusKm,minDiscountPercent,startsWithinHours,windowMaxMinutes,windowMinMinutes,updatedAt,updatedBy);
}

@override
String toString() {
    return 'OfferSettingsBody(defaultRadiusKm: $defaultRadiusKm, maxRadiusKm: $maxRadiusKm, minDiscountPercent: $minDiscountPercent, startsWithinHours: $startsWithinHours, windowMaxMinutes: $windowMaxMinutes, windowMinMinutes: $windowMinMinutes, updatedAt: $updatedAt, updatedBy: $updatedBy)';
}


}

/// @nodoc
abstract mixin class _$OfferSettingsBodyCopyWith<$Res> implements $OfferSettingsBodyCopyWith<$Res> {
  factory _$OfferSettingsBodyCopyWith(_OfferSettingsBody value, $Res Function(_OfferSettingsBody) _then) = __$OfferSettingsBodyCopyWithImpl;
@override @useResult
$Res call({
 int defaultRadiusKm, int maxRadiusKm, int minDiscountPercent, int startsWithinHours, int windowMaxMinutes, int windowMinMinutes, DateTime? updatedAt, String? updatedBy
});




}
/// @nodoc
class __$OfferSettingsBodyCopyWithImpl<$Res>
    implements _$OfferSettingsBodyCopyWith<$Res> {
  __$OfferSettingsBodyCopyWithImpl(this._self, this._then);

  final _OfferSettingsBody _self;
  final $Res Function(_OfferSettingsBody) _then;

/// Create a copy of OfferSettingsBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? defaultRadiusKm = null,Object? maxRadiusKm = null,Object? minDiscountPercent = null,Object? startsWithinHours = null,Object? windowMaxMinutes = null,Object? windowMinMinutes = null,Object? updatedAt = freezed,Object? updatedBy = freezed,}) {
  return _then(_OfferSettingsBody(
defaultRadiusKm: null == defaultRadiusKm ? _self.defaultRadiusKm : defaultRadiusKm // ignore: cast_nullable_to_non_nullable
as int,maxRadiusKm: null == maxRadiusKm ? _self.maxRadiusKm : maxRadiusKm // ignore: cast_nullable_to_non_nullable
as int,minDiscountPercent: null == minDiscountPercent ? _self.minDiscountPercent : minDiscountPercent // ignore: cast_nullable_to_non_nullable
as int,startsWithinHours: null == startsWithinHours ? _self.startsWithinHours : startsWithinHours // ignore: cast_nullable_to_non_nullable
as int,windowMaxMinutes: null == windowMaxMinutes ? _self.windowMaxMinutes : windowMaxMinutes // ignore: cast_nullable_to_non_nullable
as int,windowMinMinutes: null == windowMinMinutes ? _self.windowMinMinutes : windowMinMinutes // ignore: cast_nullable_to_non_nullable
as int,updatedAt: freezed == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,updatedBy: freezed == updatedBy ? _self.updatedBy : updatedBy // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
