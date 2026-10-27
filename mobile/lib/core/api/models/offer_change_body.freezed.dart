// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'offer_change_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$OfferChangeBody {

 String? get description; OfferChangeBodyKind? get kind;/// Leaves it as it is when absent, and empties it when the kind is changed from other
 String? get kindLabel;/// Replaces the photos after the cover; at most two
 List<String>? get morePhotoIds; String? get name; int? get originalPriceVnd; String? get photoId; int? get priceVnd; String? get unit; int? get units; int? get weightGrams; DateTime? get windowEnd; DateTime? get windowStart;
/// Create a copy of OfferChangeBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$OfferChangeBodyCopyWith<OfferChangeBody> get copyWith => _$OfferChangeBodyCopyWithImpl<OfferChangeBody>(this as OfferChangeBody, _$identity);

  /// Serializes this OfferChangeBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as OfferChangeBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is OfferChangeBody&&(identical(other.description, _this.description) || other.description == _this.description)&&(identical(other.kind, _this.kind) || other.kind == _this.kind)&&(identical(other.kindLabel, _this.kindLabel) || other.kindLabel == _this.kindLabel)&&const DeepCollectionEquality().equals(other.morePhotoIds, _this.morePhotoIds)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.originalPriceVnd, _this.originalPriceVnd) || other.originalPriceVnd == _this.originalPriceVnd)&&(identical(other.photoId, _this.photoId) || other.photoId == _this.photoId)&&(identical(other.priceVnd, _this.priceVnd) || other.priceVnd == _this.priceVnd)&&(identical(other.unit, _this.unit) || other.unit == _this.unit)&&(identical(other.units, _this.units) || other.units == _this.units)&&(identical(other.weightGrams, _this.weightGrams) || other.weightGrams == _this.weightGrams)&&(identical(other.windowEnd, _this.windowEnd) || other.windowEnd == _this.windowEnd)&&(identical(other.windowStart, _this.windowStart) || other.windowStart == _this.windowStart));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as OfferChangeBody;
  return Object.hash(runtimeType,_this.description,_this.kind,_this.kindLabel,const DeepCollectionEquality().hash(_this.morePhotoIds),_this.name,_this.originalPriceVnd,_this.photoId,_this.priceVnd,_this.unit,_this.units,_this.weightGrams,_this.windowEnd,_this.windowStart);
}

@override
String toString() {
  final _this = this as OfferChangeBody;
  return 'OfferChangeBody(description: ${_this.description}, kind: ${_this.kind}, kindLabel: ${_this.kindLabel}, morePhotoIds: ${_this.morePhotoIds}, name: ${_this.name}, originalPriceVnd: ${_this.originalPriceVnd}, photoId: ${_this.photoId}, priceVnd: ${_this.priceVnd}, unit: ${_this.unit}, units: ${_this.units}, weightGrams: ${_this.weightGrams}, windowEnd: ${_this.windowEnd}, windowStart: ${_this.windowStart})';
}


}

/// @nodoc
abstract mixin class $OfferChangeBodyCopyWith<$Res>  {
  factory $OfferChangeBodyCopyWith(OfferChangeBody value, $Res Function(OfferChangeBody) _then) = _$OfferChangeBodyCopyWithImpl;
@useResult
$Res call({
 String? description, OfferChangeBodyKind? kind, String? kindLabel, List<String>? morePhotoIds, String? name, int? originalPriceVnd, String? photoId, int? priceVnd, String? unit, int? units, int? weightGrams, DateTime? windowEnd, DateTime? windowStart
});




}
/// @nodoc
class _$OfferChangeBodyCopyWithImpl<$Res>
    implements $OfferChangeBodyCopyWith<$Res> {
  _$OfferChangeBodyCopyWithImpl(this._self, this._then);

  final OfferChangeBody _self;
  final $Res Function(OfferChangeBody) _then;

/// Create a copy of OfferChangeBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? description = freezed,Object? kind = freezed,Object? kindLabel = freezed,Object? morePhotoIds = freezed,Object? name = freezed,Object? originalPriceVnd = freezed,Object? photoId = freezed,Object? priceVnd = freezed,Object? unit = freezed,Object? units = freezed,Object? weightGrams = freezed,Object? windowEnd = freezed,Object? windowStart = freezed,}) {
  return _then(OfferChangeBody(
description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,kind: freezed == kind ? _self.kind : kind // ignore: cast_nullable_to_non_nullable
as OfferChangeBodyKind?,kindLabel: freezed == kindLabel ? _self.kindLabel : kindLabel // ignore: cast_nullable_to_non_nullable
as String?,morePhotoIds: freezed == morePhotoIds ? _self.morePhotoIds : morePhotoIds // ignore: cast_nullable_to_non_nullable
as List<String>?,name: freezed == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String?,originalPriceVnd: freezed == originalPriceVnd ? _self.originalPriceVnd : originalPriceVnd // ignore: cast_nullable_to_non_nullable
as int?,photoId: freezed == photoId ? _self.photoId : photoId // ignore: cast_nullable_to_non_nullable
as String?,priceVnd: freezed == priceVnd ? _self.priceVnd : priceVnd // ignore: cast_nullable_to_non_nullable
as int?,unit: freezed == unit ? _self.unit : unit // ignore: cast_nullable_to_non_nullable
as String?,units: freezed == units ? _self.units : units // ignore: cast_nullable_to_non_nullable
as int?,weightGrams: freezed == weightGrams ? _self.weightGrams : weightGrams // ignore: cast_nullable_to_non_nullable
as int?,windowEnd: freezed == windowEnd ? _self.windowEnd : windowEnd // ignore: cast_nullable_to_non_nullable
as DateTime?,windowStart: freezed == windowStart ? _self.windowStart : windowStart // ignore: cast_nullable_to_non_nullable
as DateTime?,
  ));
}

}


/// Adds pattern-matching-related methods to [OfferChangeBody].
extension OfferChangeBodyPatterns on OfferChangeBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _OfferChangeBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _OfferChangeBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _OfferChangeBody value)  $default,){
final _that = this;
switch (_that) {
case _OfferChangeBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _OfferChangeBody value)?  $default,){
final _that = this;
switch (_that) {
case _OfferChangeBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String? description,  OfferChangeBodyKind? kind,  String? kindLabel,  List<String>? morePhotoIds,  String? name,  int? originalPriceVnd,  String? photoId,  int? priceVnd,  String? unit,  int? units,  int? weightGrams,  DateTime? windowEnd,  DateTime? windowStart)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _OfferChangeBody() when $default != null:
return $default(_that.description,_that.kind,_that.kindLabel,_that.morePhotoIds,_that.name,_that.originalPriceVnd,_that.photoId,_that.priceVnd,_that.unit,_that.units,_that.weightGrams,_that.windowEnd,_that.windowStart);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String? description,  OfferChangeBodyKind? kind,  String? kindLabel,  List<String>? morePhotoIds,  String? name,  int? originalPriceVnd,  String? photoId,  int? priceVnd,  String? unit,  int? units,  int? weightGrams,  DateTime? windowEnd,  DateTime? windowStart)  $default,) {final _that = this;
switch (_that) {
case _OfferChangeBody():
return $default(_that.description,_that.kind,_that.kindLabel,_that.morePhotoIds,_that.name,_that.originalPriceVnd,_that.photoId,_that.priceVnd,_that.unit,_that.units,_that.weightGrams,_that.windowEnd,_that.windowStart);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String? description,  OfferChangeBodyKind? kind,  String? kindLabel,  List<String>? morePhotoIds,  String? name,  int? originalPriceVnd,  String? photoId,  int? priceVnd,  String? unit,  int? units,  int? weightGrams,  DateTime? windowEnd,  DateTime? windowStart)?  $default,) {final _that = this;
switch (_that) {
case _OfferChangeBody() when $default != null:
return $default(_that.description,_that.kind,_that.kindLabel,_that.morePhotoIds,_that.name,_that.originalPriceVnd,_that.photoId,_that.priceVnd,_that.unit,_that.units,_that.weightGrams,_that.windowEnd,_that.windowStart);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _OfferChangeBody implements OfferChangeBody {
  const _OfferChangeBody({this.description, this.kind, this.kindLabel,  List<String>? morePhotoIds, this.name, this.originalPriceVnd, this.photoId, this.priceVnd, this.unit, this.units, this.weightGrams, this.windowEnd, this.windowStart}): _morePhotoIds = morePhotoIds;
  factory _OfferChangeBody.fromJson(Map<String, dynamic> json) => _$OfferChangeBodyFromJson(json);

@override final  String? description;
@override final  OfferChangeBodyKind? kind;
/// Leaves it as it is when absent, and empties it when the kind is changed from other
@override final  String? kindLabel;
/// Replaces the photos after the cover; at most two
 final  List<String>? _morePhotoIds;
/// Replaces the photos after the cover; at most two
@override List<String>? get morePhotoIds {
  final value = _morePhotoIds;
  if (value == null) return null;
  if (_morePhotoIds is EqualUnmodifiableListView) return _morePhotoIds;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(value);
}

@override final  String? name;
@override final  int? originalPriceVnd;
@override final  String? photoId;
@override final  int? priceVnd;
@override final  String? unit;
@override final  int? units;
@override final  int? weightGrams;
@override final  DateTime? windowEnd;
@override final  DateTime? windowStart;

/// Create a copy of OfferChangeBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$OfferChangeBodyCopyWith<_OfferChangeBody> get copyWith => __$OfferChangeBodyCopyWithImpl<_OfferChangeBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$OfferChangeBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _OfferChangeBody&&(identical(other.description, description) || other.description == description)&&(identical(other.kind, kind) || other.kind == kind)&&(identical(other.kindLabel, kindLabel) || other.kindLabel == kindLabel)&&const DeepCollectionEquality().equals(other.morePhotoIds, _morePhotoIds)&&(identical(other.name, name) || other.name == name)&&(identical(other.originalPriceVnd, originalPriceVnd) || other.originalPriceVnd == originalPriceVnd)&&(identical(other.photoId, photoId) || other.photoId == photoId)&&(identical(other.priceVnd, priceVnd) || other.priceVnd == priceVnd)&&(identical(other.unit, unit) || other.unit == unit)&&(identical(other.units, units) || other.units == units)&&(identical(other.weightGrams, weightGrams) || other.weightGrams == weightGrams)&&(identical(other.windowEnd, windowEnd) || other.windowEnd == windowEnd)&&(identical(other.windowStart, windowStart) || other.windowStart == windowStart));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,description,kind,kindLabel,const DeepCollectionEquality().hash(_morePhotoIds),name,originalPriceVnd,photoId,priceVnd,unit,units,weightGrams,windowEnd,windowStart);
}

@override
String toString() {
    return 'OfferChangeBody(description: $description, kind: $kind, kindLabel: $kindLabel, morePhotoIds: $morePhotoIds, name: $name, originalPriceVnd: $originalPriceVnd, photoId: $photoId, priceVnd: $priceVnd, unit: $unit, units: $units, weightGrams: $weightGrams, windowEnd: $windowEnd, windowStart: $windowStart)';
}


}

/// @nodoc
abstract mixin class _$OfferChangeBodyCopyWith<$Res> implements $OfferChangeBodyCopyWith<$Res> {
  factory _$OfferChangeBodyCopyWith(_OfferChangeBody value, $Res Function(_OfferChangeBody) _then) = __$OfferChangeBodyCopyWithImpl;
@override @useResult
$Res call({
 String? description, OfferChangeBodyKind? kind, String? kindLabel, List<String>? morePhotoIds, String? name, int? originalPriceVnd, String? photoId, int? priceVnd, String? unit, int? units, int? weightGrams, DateTime? windowEnd, DateTime? windowStart
});




}
/// @nodoc
class __$OfferChangeBodyCopyWithImpl<$Res>
    implements _$OfferChangeBodyCopyWith<$Res> {
  __$OfferChangeBodyCopyWithImpl(this._self, this._then);

  final _OfferChangeBody _self;
  final $Res Function(_OfferChangeBody) _then;

/// Create a copy of OfferChangeBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? description = freezed,Object? kind = freezed,Object? kindLabel = freezed,Object? morePhotoIds = freezed,Object? name = freezed,Object? originalPriceVnd = freezed,Object? photoId = freezed,Object? priceVnd = freezed,Object? unit = freezed,Object? units = freezed,Object? weightGrams = freezed,Object? windowEnd = freezed,Object? windowStart = freezed,}) {
  return _then(_OfferChangeBody(
description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,kind: freezed == kind ? _self.kind : kind // ignore: cast_nullable_to_non_nullable
as OfferChangeBodyKind?,kindLabel: freezed == kindLabel ? _self.kindLabel : kindLabel // ignore: cast_nullable_to_non_nullable
as String?,morePhotoIds: freezed == morePhotoIds ? _self._morePhotoIds : morePhotoIds // ignore: cast_nullable_to_non_nullable
as List<String>?,name: freezed == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String?,originalPriceVnd: freezed == originalPriceVnd ? _self.originalPriceVnd : originalPriceVnd // ignore: cast_nullable_to_non_nullable
as int?,photoId: freezed == photoId ? _self.photoId : photoId // ignore: cast_nullable_to_non_nullable
as String?,priceVnd: freezed == priceVnd ? _self.priceVnd : priceVnd // ignore: cast_nullable_to_non_nullable
as int?,unit: freezed == unit ? _self.unit : unit // ignore: cast_nullable_to_non_nullable
as String?,units: freezed == units ? _self.units : units // ignore: cast_nullable_to_non_nullable
as int?,weightGrams: freezed == weightGrams ? _self.weightGrams : weightGrams // ignore: cast_nullable_to_non_nullable
as int?,windowEnd: freezed == windowEnd ? _self.windowEnd : windowEnd // ignore: cast_nullable_to_non_nullable
as DateTime?,windowStart: freezed == windowStart ? _self.windowStart : windowStart // ignore: cast_nullable_to_non_nullable
as DateTime?,
  ));
}


}

// dart format on
