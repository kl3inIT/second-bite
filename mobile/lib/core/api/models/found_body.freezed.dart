// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'found_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$FoundBody {

/// Where the offer is collected, copied from the seller when it was posted
 CollectionPointBody get collectionPoint; DateTime get createdAt; String get description; int get discountPercent; String get id; FoundBodyKind get kind; String get name; int get originalPriceVnd; OfferPhotoBody get photo; int get priceVnd; OfferSellerBody get seller; String get sellerId;/// sold_out and closed are read from the units left and the window
 FoundBodyStatus get status; String get unit; int get units; int get unitsLeft; DateTime get updatedAt; DateTime get windowEnd; DateTime get windowStart;/// From the point searched near; absent without one
 double? get distanceMeters; int? get weightGrams; DateTime? get withdrawnAt;
/// Create a copy of FoundBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$FoundBodyCopyWith<FoundBody> get copyWith => _$FoundBodyCopyWithImpl<FoundBody>(this as FoundBody, _$identity);

  /// Serializes this FoundBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as FoundBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is FoundBody&&(identical(other.collectionPoint, _this.collectionPoint) || other.collectionPoint == _this.collectionPoint)&&(identical(other.createdAt, _this.createdAt) || other.createdAt == _this.createdAt)&&(identical(other.description, _this.description) || other.description == _this.description)&&(identical(other.discountPercent, _this.discountPercent) || other.discountPercent == _this.discountPercent)&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.kind, _this.kind) || other.kind == _this.kind)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.originalPriceVnd, _this.originalPriceVnd) || other.originalPriceVnd == _this.originalPriceVnd)&&(identical(other.photo, _this.photo) || other.photo == _this.photo)&&(identical(other.priceVnd, _this.priceVnd) || other.priceVnd == _this.priceVnd)&&(identical(other.seller, _this.seller) || other.seller == _this.seller)&&(identical(other.sellerId, _this.sellerId) || other.sellerId == _this.sellerId)&&(identical(other.status, _this.status) || other.status == _this.status)&&(identical(other.unit, _this.unit) || other.unit == _this.unit)&&(identical(other.units, _this.units) || other.units == _this.units)&&(identical(other.unitsLeft, _this.unitsLeft) || other.unitsLeft == _this.unitsLeft)&&(identical(other.updatedAt, _this.updatedAt) || other.updatedAt == _this.updatedAt)&&(identical(other.windowEnd, _this.windowEnd) || other.windowEnd == _this.windowEnd)&&(identical(other.windowStart, _this.windowStart) || other.windowStart == _this.windowStart)&&(identical(other.distanceMeters, _this.distanceMeters) || other.distanceMeters == _this.distanceMeters)&&(identical(other.weightGrams, _this.weightGrams) || other.weightGrams == _this.weightGrams)&&(identical(other.withdrawnAt, _this.withdrawnAt) || other.withdrawnAt == _this.withdrawnAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as FoundBody;
  return Object.hashAll([runtimeType,_this.collectionPoint,_this.createdAt,_this.description,_this.discountPercent,_this.id,_this.kind,_this.name,_this.originalPriceVnd,_this.photo,_this.priceVnd,_this.seller,_this.sellerId,_this.status,_this.unit,_this.units,_this.unitsLeft,_this.updatedAt,_this.windowEnd,_this.windowStart,_this.distanceMeters,_this.weightGrams,_this.withdrawnAt]);
}

@override
String toString() {
  final _this = this as FoundBody;
  return 'FoundBody(collectionPoint: ${_this.collectionPoint}, createdAt: ${_this.createdAt}, description: ${_this.description}, discountPercent: ${_this.discountPercent}, id: ${_this.id}, kind: ${_this.kind}, name: ${_this.name}, originalPriceVnd: ${_this.originalPriceVnd}, photo: ${_this.photo}, priceVnd: ${_this.priceVnd}, seller: ${_this.seller}, sellerId: ${_this.sellerId}, status: ${_this.status}, unit: ${_this.unit}, units: ${_this.units}, unitsLeft: ${_this.unitsLeft}, updatedAt: ${_this.updatedAt}, windowEnd: ${_this.windowEnd}, windowStart: ${_this.windowStart}, distanceMeters: ${_this.distanceMeters}, weightGrams: ${_this.weightGrams}, withdrawnAt: ${_this.withdrawnAt})';
}


}

/// @nodoc
abstract mixin class $FoundBodyCopyWith<$Res>  {
  factory $FoundBodyCopyWith(FoundBody value, $Res Function(FoundBody) _then) = _$FoundBodyCopyWithImpl;
@useResult
$Res call({
 CollectionPointBody collectionPoint, DateTime createdAt, String description, int discountPercent, String id, FoundBodyKind kind, String name, int originalPriceVnd, OfferPhotoBody photo, int priceVnd, OfferSellerBody seller, String sellerId, FoundBodyStatus status, String unit, int units, int unitsLeft, DateTime updatedAt, DateTime windowEnd, DateTime windowStart, double? distanceMeters, int? weightGrams, DateTime? withdrawnAt
});


$CollectionPointBodyCopyWith<$Res> get collectionPoint;$OfferPhotoBodyCopyWith<$Res> get photo;$OfferSellerBodyCopyWith<$Res> get seller;

}
/// @nodoc
class _$FoundBodyCopyWithImpl<$Res>
    implements $FoundBodyCopyWith<$Res> {
  _$FoundBodyCopyWithImpl(this._self, this._then);

  final FoundBody _self;
  final $Res Function(FoundBody) _then;

/// Create a copy of FoundBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? collectionPoint = null,Object? createdAt = null,Object? description = null,Object? discountPercent = null,Object? id = null,Object? kind = null,Object? name = null,Object? originalPriceVnd = null,Object? photo = null,Object? priceVnd = null,Object? seller = null,Object? sellerId = null,Object? status = null,Object? unit = null,Object? units = null,Object? unitsLeft = null,Object? updatedAt = null,Object? windowEnd = null,Object? windowStart = null,Object? distanceMeters = freezed,Object? weightGrams = freezed,Object? withdrawnAt = freezed,}) {
  return _then(FoundBody(
collectionPoint: null == collectionPoint ? _self.collectionPoint : collectionPoint // ignore: cast_nullable_to_non_nullable
as CollectionPointBody,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,description: null == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String,discountPercent: null == discountPercent ? _self.discountPercent : discountPercent // ignore: cast_nullable_to_non_nullable
as int,id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,kind: null == kind ? _self.kind : kind // ignore: cast_nullable_to_non_nullable
as FoundBodyKind,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,originalPriceVnd: null == originalPriceVnd ? _self.originalPriceVnd : originalPriceVnd // ignore: cast_nullable_to_non_nullable
as int,photo: null == photo ? _self.photo : photo // ignore: cast_nullable_to_non_nullable
as OfferPhotoBody,priceVnd: null == priceVnd ? _self.priceVnd : priceVnd // ignore: cast_nullable_to_non_nullable
as int,seller: null == seller ? _self.seller : seller // ignore: cast_nullable_to_non_nullable
as OfferSellerBody,sellerId: null == sellerId ? _self.sellerId : sellerId // ignore: cast_nullable_to_non_nullable
as String,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as FoundBodyStatus,unit: null == unit ? _self.unit : unit // ignore: cast_nullable_to_non_nullable
as String,units: null == units ? _self.units : units // ignore: cast_nullable_to_non_nullable
as int,unitsLeft: null == unitsLeft ? _self.unitsLeft : unitsLeft // ignore: cast_nullable_to_non_nullable
as int,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,windowEnd: null == windowEnd ? _self.windowEnd : windowEnd // ignore: cast_nullable_to_non_nullable
as DateTime,windowStart: null == windowStart ? _self.windowStart : windowStart // ignore: cast_nullable_to_non_nullable
as DateTime,distanceMeters: freezed == distanceMeters ? _self.distanceMeters : distanceMeters // ignore: cast_nullable_to_non_nullable
as double?,weightGrams: freezed == weightGrams ? _self.weightGrams : weightGrams // ignore: cast_nullable_to_non_nullable
as int?,withdrawnAt: freezed == withdrawnAt ? _self.withdrawnAt : withdrawnAt // ignore: cast_nullable_to_non_nullable
as DateTime?,
  ));
}
/// Create a copy of FoundBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$CollectionPointBodyCopyWith<$Res> get collectionPoint {
  
  return $CollectionPointBodyCopyWith<$Res>(_self.collectionPoint, (value) {
    return _then(_self.copyWith(collectionPoint: value));
  });
}/// Create a copy of FoundBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$OfferPhotoBodyCopyWith<$Res> get photo {
  
  return $OfferPhotoBodyCopyWith<$Res>(_self.photo, (value) {
    return _then(_self.copyWith(photo: value));
  });
}/// Create a copy of FoundBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$OfferSellerBodyCopyWith<$Res> get seller {
  
  return $OfferSellerBodyCopyWith<$Res>(_self.seller, (value) {
    return _then(_self.copyWith(seller: value));
  });
}
}


/// Adds pattern-matching-related methods to [FoundBody].
extension FoundBodyPatterns on FoundBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _FoundBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _FoundBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _FoundBody value)  $default,){
final _that = this;
switch (_that) {
case _FoundBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _FoundBody value)?  $default,){
final _that = this;
switch (_that) {
case _FoundBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( CollectionPointBody collectionPoint,  DateTime createdAt,  String description,  int discountPercent,  String id,  FoundBodyKind kind,  String name,  int originalPriceVnd,  OfferPhotoBody photo,  int priceVnd,  OfferSellerBody seller,  String sellerId,  FoundBodyStatus status,  String unit,  int units,  int unitsLeft,  DateTime updatedAt,  DateTime windowEnd,  DateTime windowStart,  double? distanceMeters,  int? weightGrams,  DateTime? withdrawnAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _FoundBody() when $default != null:
return $default(_that.collectionPoint,_that.createdAt,_that.description,_that.discountPercent,_that.id,_that.kind,_that.name,_that.originalPriceVnd,_that.photo,_that.priceVnd,_that.seller,_that.sellerId,_that.status,_that.unit,_that.units,_that.unitsLeft,_that.updatedAt,_that.windowEnd,_that.windowStart,_that.distanceMeters,_that.weightGrams,_that.withdrawnAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( CollectionPointBody collectionPoint,  DateTime createdAt,  String description,  int discountPercent,  String id,  FoundBodyKind kind,  String name,  int originalPriceVnd,  OfferPhotoBody photo,  int priceVnd,  OfferSellerBody seller,  String sellerId,  FoundBodyStatus status,  String unit,  int units,  int unitsLeft,  DateTime updatedAt,  DateTime windowEnd,  DateTime windowStart,  double? distanceMeters,  int? weightGrams,  DateTime? withdrawnAt)  $default,) {final _that = this;
switch (_that) {
case _FoundBody():
return $default(_that.collectionPoint,_that.createdAt,_that.description,_that.discountPercent,_that.id,_that.kind,_that.name,_that.originalPriceVnd,_that.photo,_that.priceVnd,_that.seller,_that.sellerId,_that.status,_that.unit,_that.units,_that.unitsLeft,_that.updatedAt,_that.windowEnd,_that.windowStart,_that.distanceMeters,_that.weightGrams,_that.withdrawnAt);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( CollectionPointBody collectionPoint,  DateTime createdAt,  String description,  int discountPercent,  String id,  FoundBodyKind kind,  String name,  int originalPriceVnd,  OfferPhotoBody photo,  int priceVnd,  OfferSellerBody seller,  String sellerId,  FoundBodyStatus status,  String unit,  int units,  int unitsLeft,  DateTime updatedAt,  DateTime windowEnd,  DateTime windowStart,  double? distanceMeters,  int? weightGrams,  DateTime? withdrawnAt)?  $default,) {final _that = this;
switch (_that) {
case _FoundBody() when $default != null:
return $default(_that.collectionPoint,_that.createdAt,_that.description,_that.discountPercent,_that.id,_that.kind,_that.name,_that.originalPriceVnd,_that.photo,_that.priceVnd,_that.seller,_that.sellerId,_that.status,_that.unit,_that.units,_that.unitsLeft,_that.updatedAt,_that.windowEnd,_that.windowStart,_that.distanceMeters,_that.weightGrams,_that.withdrawnAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _FoundBody implements FoundBody {
  const _FoundBody({required this.collectionPoint, required this.createdAt, required this.description, required this.discountPercent, required this.id, required this.kind, required this.name, required this.originalPriceVnd, required this.photo, required this.priceVnd, required this.seller, required this.sellerId, required this.status, required this.unit, required this.units, required this.unitsLeft, required this.updatedAt, required this.windowEnd, required this.windowStart, this.distanceMeters, this.weightGrams, this.withdrawnAt});
  factory _FoundBody.fromJson(Map<String, dynamic> json) => _$FoundBodyFromJson(json);

/// Where the offer is collected, copied from the seller when it was posted
@override final  CollectionPointBody collectionPoint;
@override final  DateTime createdAt;
@override final  String description;
@override final  int discountPercent;
@override final  String id;
@override final  FoundBodyKind kind;
@override final  String name;
@override final  int originalPriceVnd;
@override final  OfferPhotoBody photo;
@override final  int priceVnd;
@override final  OfferSellerBody seller;
@override final  String sellerId;
/// sold_out and closed are read from the units left and the window
@override final  FoundBodyStatus status;
@override final  String unit;
@override final  int units;
@override final  int unitsLeft;
@override final  DateTime updatedAt;
@override final  DateTime windowEnd;
@override final  DateTime windowStart;
/// From the point searched near; absent without one
@override final  double? distanceMeters;
@override final  int? weightGrams;
@override final  DateTime? withdrawnAt;

/// Create a copy of FoundBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$FoundBodyCopyWith<_FoundBody> get copyWith => __$FoundBodyCopyWithImpl<_FoundBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$FoundBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _FoundBody&&(identical(other.collectionPoint, collectionPoint) || other.collectionPoint == collectionPoint)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.description, description) || other.description == description)&&(identical(other.discountPercent, discountPercent) || other.discountPercent == discountPercent)&&(identical(other.id, id) || other.id == id)&&(identical(other.kind, kind) || other.kind == kind)&&(identical(other.name, name) || other.name == name)&&(identical(other.originalPriceVnd, originalPriceVnd) || other.originalPriceVnd == originalPriceVnd)&&(identical(other.photo, photo) || other.photo == photo)&&(identical(other.priceVnd, priceVnd) || other.priceVnd == priceVnd)&&(identical(other.seller, seller) || other.seller == seller)&&(identical(other.sellerId, sellerId) || other.sellerId == sellerId)&&(identical(other.status, status) || other.status == status)&&(identical(other.unit, unit) || other.unit == unit)&&(identical(other.units, units) || other.units == units)&&(identical(other.unitsLeft, unitsLeft) || other.unitsLeft == unitsLeft)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt)&&(identical(other.windowEnd, windowEnd) || other.windowEnd == windowEnd)&&(identical(other.windowStart, windowStart) || other.windowStart == windowStart)&&(identical(other.distanceMeters, distanceMeters) || other.distanceMeters == distanceMeters)&&(identical(other.weightGrams, weightGrams) || other.weightGrams == weightGrams)&&(identical(other.withdrawnAt, withdrawnAt) || other.withdrawnAt == withdrawnAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hashAll([runtimeType,collectionPoint,createdAt,description,discountPercent,id,kind,name,originalPriceVnd,photo,priceVnd,seller,sellerId,status,unit,units,unitsLeft,updatedAt,windowEnd,windowStart,distanceMeters,weightGrams,withdrawnAt]);
}

@override
String toString() {
    return 'FoundBody(collectionPoint: $collectionPoint, createdAt: $createdAt, description: $description, discountPercent: $discountPercent, id: $id, kind: $kind, name: $name, originalPriceVnd: $originalPriceVnd, photo: $photo, priceVnd: $priceVnd, seller: $seller, sellerId: $sellerId, status: $status, unit: $unit, units: $units, unitsLeft: $unitsLeft, updatedAt: $updatedAt, windowEnd: $windowEnd, windowStart: $windowStart, distanceMeters: $distanceMeters, weightGrams: $weightGrams, withdrawnAt: $withdrawnAt)';
}


}

/// @nodoc
abstract mixin class _$FoundBodyCopyWith<$Res> implements $FoundBodyCopyWith<$Res> {
  factory _$FoundBodyCopyWith(_FoundBody value, $Res Function(_FoundBody) _then) = __$FoundBodyCopyWithImpl;
@override @useResult
$Res call({
 CollectionPointBody collectionPoint, DateTime createdAt, String description, int discountPercent, String id, FoundBodyKind kind, String name, int originalPriceVnd, OfferPhotoBody photo, int priceVnd, OfferSellerBody seller, String sellerId, FoundBodyStatus status, String unit, int units, int unitsLeft, DateTime updatedAt, DateTime windowEnd, DateTime windowStart, double? distanceMeters, int? weightGrams, DateTime? withdrawnAt
});


@override $CollectionPointBodyCopyWith<$Res> get collectionPoint;@override $OfferPhotoBodyCopyWith<$Res> get photo;@override $OfferSellerBodyCopyWith<$Res> get seller;

}
/// @nodoc
class __$FoundBodyCopyWithImpl<$Res>
    implements _$FoundBodyCopyWith<$Res> {
  __$FoundBodyCopyWithImpl(this._self, this._then);

  final _FoundBody _self;
  final $Res Function(_FoundBody) _then;

/// Create a copy of FoundBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? collectionPoint = null,Object? createdAt = null,Object? description = null,Object? discountPercent = null,Object? id = null,Object? kind = null,Object? name = null,Object? originalPriceVnd = null,Object? photo = null,Object? priceVnd = null,Object? seller = null,Object? sellerId = null,Object? status = null,Object? unit = null,Object? units = null,Object? unitsLeft = null,Object? updatedAt = null,Object? windowEnd = null,Object? windowStart = null,Object? distanceMeters = freezed,Object? weightGrams = freezed,Object? withdrawnAt = freezed,}) {
  return _then(_FoundBody(
collectionPoint: null == collectionPoint ? _self.collectionPoint : collectionPoint // ignore: cast_nullable_to_non_nullable
as CollectionPointBody,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,description: null == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String,discountPercent: null == discountPercent ? _self.discountPercent : discountPercent // ignore: cast_nullable_to_non_nullable
as int,id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,kind: null == kind ? _self.kind : kind // ignore: cast_nullable_to_non_nullable
as FoundBodyKind,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,originalPriceVnd: null == originalPriceVnd ? _self.originalPriceVnd : originalPriceVnd // ignore: cast_nullable_to_non_nullable
as int,photo: null == photo ? _self.photo : photo // ignore: cast_nullable_to_non_nullable
as OfferPhotoBody,priceVnd: null == priceVnd ? _self.priceVnd : priceVnd // ignore: cast_nullable_to_non_nullable
as int,seller: null == seller ? _self.seller : seller // ignore: cast_nullable_to_non_nullable
as OfferSellerBody,sellerId: null == sellerId ? _self.sellerId : sellerId // ignore: cast_nullable_to_non_nullable
as String,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as FoundBodyStatus,unit: null == unit ? _self.unit : unit // ignore: cast_nullable_to_non_nullable
as String,units: null == units ? _self.units : units // ignore: cast_nullable_to_non_nullable
as int,unitsLeft: null == unitsLeft ? _self.unitsLeft : unitsLeft // ignore: cast_nullable_to_non_nullable
as int,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,windowEnd: null == windowEnd ? _self.windowEnd : windowEnd // ignore: cast_nullable_to_non_nullable
as DateTime,windowStart: null == windowStart ? _self.windowStart : windowStart // ignore: cast_nullable_to_non_nullable
as DateTime,distanceMeters: freezed == distanceMeters ? _self.distanceMeters : distanceMeters // ignore: cast_nullable_to_non_nullable
as double?,weightGrams: freezed == weightGrams ? _self.weightGrams : weightGrams // ignore: cast_nullable_to_non_nullable
as int?,withdrawnAt: freezed == withdrawnAt ? _self.withdrawnAt : withdrawnAt // ignore: cast_nullable_to_non_nullable
as DateTime?,
  ));
}

/// Create a copy of FoundBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$CollectionPointBodyCopyWith<$Res> get collectionPoint {
  
  return $CollectionPointBodyCopyWith<$Res>(_self.collectionPoint, (value) {
    return _then(_self.copyWith(collectionPoint: value));
  });
}/// Create a copy of FoundBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$OfferPhotoBodyCopyWith<$Res> get photo {
  
  return $OfferPhotoBodyCopyWith<$Res>(_self.photo, (value) {
    return _then(_self.copyWith(photo: value));
  });
}/// Create a copy of FoundBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$OfferSellerBodyCopyWith<$Res> get seller {
  
  return $OfferSellerBodyCopyWith<$Res>(_self.seller, (value) {
    return _then(_self.copyWith(seller: value));
  });
}
}

// dart format on
