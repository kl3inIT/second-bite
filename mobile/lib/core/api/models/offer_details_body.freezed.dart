// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'offer_details_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$OfferDetailsBody {

 OfferDetailsBodyKind get kind; String get name;/// What one unit normally sells for; the price must be the minimum discount below it
 int get originalPriceVnd;/// The cover: from POST /photos, or the photo of an earlier offer of the seller
 String get photoId;/// Price of one unit, in whole đồng
 int get priceVnd; int get units;/// The last handover
 DateTime get windowEnd;/// When the offer is ready to collect
 DateTime get windowStart;/// Required for a mixed_box, which is described by what it may hold; allergens are written here
 String? get description;/// Up to two more photos after the cover
 List<String>? get morePhotoIds;/// What one unit is called; "suất" when empty
 String? get unit;/// Weight of one unit, to measure food saved
 int? get weightGrams;
/// Create a copy of OfferDetailsBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$OfferDetailsBodyCopyWith<OfferDetailsBody> get copyWith => _$OfferDetailsBodyCopyWithImpl<OfferDetailsBody>(this as OfferDetailsBody, _$identity);

  /// Serializes this OfferDetailsBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as OfferDetailsBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is OfferDetailsBody&&(identical(other.kind, _this.kind) || other.kind == _this.kind)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.originalPriceVnd, _this.originalPriceVnd) || other.originalPriceVnd == _this.originalPriceVnd)&&(identical(other.photoId, _this.photoId) || other.photoId == _this.photoId)&&(identical(other.priceVnd, _this.priceVnd) || other.priceVnd == _this.priceVnd)&&(identical(other.units, _this.units) || other.units == _this.units)&&(identical(other.windowEnd, _this.windowEnd) || other.windowEnd == _this.windowEnd)&&(identical(other.windowStart, _this.windowStart) || other.windowStart == _this.windowStart)&&(identical(other.description, _this.description) || other.description == _this.description)&&const DeepCollectionEquality().equals(other.morePhotoIds, _this.morePhotoIds)&&(identical(other.unit, _this.unit) || other.unit == _this.unit)&&(identical(other.weightGrams, _this.weightGrams) || other.weightGrams == _this.weightGrams));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as OfferDetailsBody;
  return Object.hash(runtimeType,_this.kind,_this.name,_this.originalPriceVnd,_this.photoId,_this.priceVnd,_this.units,_this.windowEnd,_this.windowStart,_this.description,const DeepCollectionEquality().hash(_this.morePhotoIds),_this.unit,_this.weightGrams);
}

@override
String toString() {
  final _this = this as OfferDetailsBody;
  return 'OfferDetailsBody(kind: ${_this.kind}, name: ${_this.name}, originalPriceVnd: ${_this.originalPriceVnd}, photoId: ${_this.photoId}, priceVnd: ${_this.priceVnd}, units: ${_this.units}, windowEnd: ${_this.windowEnd}, windowStart: ${_this.windowStart}, description: ${_this.description}, morePhotoIds: ${_this.morePhotoIds}, unit: ${_this.unit}, weightGrams: ${_this.weightGrams})';
}


}

/// @nodoc
abstract mixin class $OfferDetailsBodyCopyWith<$Res>  {
  factory $OfferDetailsBodyCopyWith(OfferDetailsBody value, $Res Function(OfferDetailsBody) _then) = _$OfferDetailsBodyCopyWithImpl;
@useResult
$Res call({
 OfferDetailsBodyKind kind, String name, int originalPriceVnd, String photoId, int priceVnd, int units, DateTime windowEnd, DateTime windowStart, String? description, List<String>? morePhotoIds, String? unit, int? weightGrams
});




}
/// @nodoc
class _$OfferDetailsBodyCopyWithImpl<$Res>
    implements $OfferDetailsBodyCopyWith<$Res> {
  _$OfferDetailsBodyCopyWithImpl(this._self, this._then);

  final OfferDetailsBody _self;
  final $Res Function(OfferDetailsBody) _then;

/// Create a copy of OfferDetailsBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? kind = null,Object? name = null,Object? originalPriceVnd = null,Object? photoId = null,Object? priceVnd = null,Object? units = null,Object? windowEnd = null,Object? windowStart = null,Object? description = freezed,Object? morePhotoIds = freezed,Object? unit = freezed,Object? weightGrams = freezed,}) {
  return _then(OfferDetailsBody(
kind: null == kind ? _self.kind : kind // ignore: cast_nullable_to_non_nullable
as OfferDetailsBodyKind,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,originalPriceVnd: null == originalPriceVnd ? _self.originalPriceVnd : originalPriceVnd // ignore: cast_nullable_to_non_nullable
as int,photoId: null == photoId ? _self.photoId : photoId // ignore: cast_nullable_to_non_nullable
as String,priceVnd: null == priceVnd ? _self.priceVnd : priceVnd // ignore: cast_nullable_to_non_nullable
as int,units: null == units ? _self.units : units // ignore: cast_nullable_to_non_nullable
as int,windowEnd: null == windowEnd ? _self.windowEnd : windowEnd // ignore: cast_nullable_to_non_nullable
as DateTime,windowStart: null == windowStart ? _self.windowStart : windowStart // ignore: cast_nullable_to_non_nullable
as DateTime,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,morePhotoIds: freezed == morePhotoIds ? _self.morePhotoIds : morePhotoIds // ignore: cast_nullable_to_non_nullable
as List<String>?,unit: freezed == unit ? _self.unit : unit // ignore: cast_nullable_to_non_nullable
as String?,weightGrams: freezed == weightGrams ? _self.weightGrams : weightGrams // ignore: cast_nullable_to_non_nullable
as int?,
  ));
}

}


/// Adds pattern-matching-related methods to [OfferDetailsBody].
extension OfferDetailsBodyPatterns on OfferDetailsBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _OfferDetailsBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _OfferDetailsBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _OfferDetailsBody value)  $default,){
final _that = this;
switch (_that) {
case _OfferDetailsBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _OfferDetailsBody value)?  $default,){
final _that = this;
switch (_that) {
case _OfferDetailsBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( OfferDetailsBodyKind kind,  String name,  int originalPriceVnd,  String photoId,  int priceVnd,  int units,  DateTime windowEnd,  DateTime windowStart,  String? description,  List<String>? morePhotoIds,  String? unit,  int? weightGrams)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _OfferDetailsBody() when $default != null:
return $default(_that.kind,_that.name,_that.originalPriceVnd,_that.photoId,_that.priceVnd,_that.units,_that.windowEnd,_that.windowStart,_that.description,_that.morePhotoIds,_that.unit,_that.weightGrams);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( OfferDetailsBodyKind kind,  String name,  int originalPriceVnd,  String photoId,  int priceVnd,  int units,  DateTime windowEnd,  DateTime windowStart,  String? description,  List<String>? morePhotoIds,  String? unit,  int? weightGrams)  $default,) {final _that = this;
switch (_that) {
case _OfferDetailsBody():
return $default(_that.kind,_that.name,_that.originalPriceVnd,_that.photoId,_that.priceVnd,_that.units,_that.windowEnd,_that.windowStart,_that.description,_that.morePhotoIds,_that.unit,_that.weightGrams);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( OfferDetailsBodyKind kind,  String name,  int originalPriceVnd,  String photoId,  int priceVnd,  int units,  DateTime windowEnd,  DateTime windowStart,  String? description,  List<String>? morePhotoIds,  String? unit,  int? weightGrams)?  $default,) {final _that = this;
switch (_that) {
case _OfferDetailsBody() when $default != null:
return $default(_that.kind,_that.name,_that.originalPriceVnd,_that.photoId,_that.priceVnd,_that.units,_that.windowEnd,_that.windowStart,_that.description,_that.morePhotoIds,_that.unit,_that.weightGrams);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _OfferDetailsBody implements OfferDetailsBody {
  const _OfferDetailsBody({required this.kind, required this.name, required this.originalPriceVnd, required this.photoId, required this.priceVnd, required this.units, required this.windowEnd, required this.windowStart, this.description,  List<String>? morePhotoIds, this.unit, this.weightGrams}): _morePhotoIds = morePhotoIds;
  factory _OfferDetailsBody.fromJson(Map<String, dynamic> json) => _$OfferDetailsBodyFromJson(json);

@override final  OfferDetailsBodyKind kind;
@override final  String name;
/// What one unit normally sells for; the price must be the minimum discount below it
@override final  int originalPriceVnd;
/// The cover: from POST /photos, or the photo of an earlier offer of the seller
@override final  String photoId;
/// Price of one unit, in whole đồng
@override final  int priceVnd;
@override final  int units;
/// The last handover
@override final  DateTime windowEnd;
/// When the offer is ready to collect
@override final  DateTime windowStart;
/// Required for a mixed_box, which is described by what it may hold; allergens are written here
@override final  String? description;
/// Up to two more photos after the cover
 final  List<String>? _morePhotoIds;
/// Up to two more photos after the cover
@override List<String>? get morePhotoIds {
  final value = _morePhotoIds;
  if (value == null) return null;
  if (_morePhotoIds is EqualUnmodifiableListView) return _morePhotoIds;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(value);
}

/// What one unit is called; "suất" when empty
@override final  String? unit;
/// Weight of one unit, to measure food saved
@override final  int? weightGrams;

/// Create a copy of OfferDetailsBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$OfferDetailsBodyCopyWith<_OfferDetailsBody> get copyWith => __$OfferDetailsBodyCopyWithImpl<_OfferDetailsBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$OfferDetailsBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _OfferDetailsBody&&(identical(other.kind, kind) || other.kind == kind)&&(identical(other.name, name) || other.name == name)&&(identical(other.originalPriceVnd, originalPriceVnd) || other.originalPriceVnd == originalPriceVnd)&&(identical(other.photoId, photoId) || other.photoId == photoId)&&(identical(other.priceVnd, priceVnd) || other.priceVnd == priceVnd)&&(identical(other.units, units) || other.units == units)&&(identical(other.windowEnd, windowEnd) || other.windowEnd == windowEnd)&&(identical(other.windowStart, windowStart) || other.windowStart == windowStart)&&(identical(other.description, description) || other.description == description)&&const DeepCollectionEquality().equals(other.morePhotoIds, _morePhotoIds)&&(identical(other.unit, unit) || other.unit == unit)&&(identical(other.weightGrams, weightGrams) || other.weightGrams == weightGrams));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,kind,name,originalPriceVnd,photoId,priceVnd,units,windowEnd,windowStart,description,const DeepCollectionEquality().hash(_morePhotoIds),unit,weightGrams);
}

@override
String toString() {
    return 'OfferDetailsBody(kind: $kind, name: $name, originalPriceVnd: $originalPriceVnd, photoId: $photoId, priceVnd: $priceVnd, units: $units, windowEnd: $windowEnd, windowStart: $windowStart, description: $description, morePhotoIds: $morePhotoIds, unit: $unit, weightGrams: $weightGrams)';
}


}

/// @nodoc
abstract mixin class _$OfferDetailsBodyCopyWith<$Res> implements $OfferDetailsBodyCopyWith<$Res> {
  factory _$OfferDetailsBodyCopyWith(_OfferDetailsBody value, $Res Function(_OfferDetailsBody) _then) = __$OfferDetailsBodyCopyWithImpl;
@override @useResult
$Res call({
 OfferDetailsBodyKind kind, String name, int originalPriceVnd, String photoId, int priceVnd, int units, DateTime windowEnd, DateTime windowStart, String? description, List<String>? morePhotoIds, String? unit, int? weightGrams
});




}
/// @nodoc
class __$OfferDetailsBodyCopyWithImpl<$Res>
    implements _$OfferDetailsBodyCopyWith<$Res> {
  __$OfferDetailsBodyCopyWithImpl(this._self, this._then);

  final _OfferDetailsBody _self;
  final $Res Function(_OfferDetailsBody) _then;

/// Create a copy of OfferDetailsBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? kind = null,Object? name = null,Object? originalPriceVnd = null,Object? photoId = null,Object? priceVnd = null,Object? units = null,Object? windowEnd = null,Object? windowStart = null,Object? description = freezed,Object? morePhotoIds = freezed,Object? unit = freezed,Object? weightGrams = freezed,}) {
  return _then(_OfferDetailsBody(
kind: null == kind ? _self.kind : kind // ignore: cast_nullable_to_non_nullable
as OfferDetailsBodyKind,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,originalPriceVnd: null == originalPriceVnd ? _self.originalPriceVnd : originalPriceVnd // ignore: cast_nullable_to_non_nullable
as int,photoId: null == photoId ? _self.photoId : photoId // ignore: cast_nullable_to_non_nullable
as String,priceVnd: null == priceVnd ? _self.priceVnd : priceVnd // ignore: cast_nullable_to_non_nullable
as int,units: null == units ? _self.units : units // ignore: cast_nullable_to_non_nullable
as int,windowEnd: null == windowEnd ? _self.windowEnd : windowEnd // ignore: cast_nullable_to_non_nullable
as DateTime,windowStart: null == windowStart ? _self.windowStart : windowStart // ignore: cast_nullable_to_non_nullable
as DateTime,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,morePhotoIds: freezed == morePhotoIds ? _self._morePhotoIds : morePhotoIds // ignore: cast_nullable_to_non_nullable
as List<String>?,unit: freezed == unit ? _self.unit : unit // ignore: cast_nullable_to_non_nullable
as String?,weightGrams: freezed == weightGrams ? _self.weightGrams : weightGrams // ignore: cast_nullable_to_non_nullable
as int?,
  ));
}


}

// dart format on
