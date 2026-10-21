// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'dish_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$DishBody {

 DateTime get createdAt; String get description; bool get hidden; String get id; String get ingredients; DishBodyKind get kind; String get name; OfferPhotoBody get photo;/// Every photo, the cover first
 List<OfferPhotoBody> get photos; String get sellerId; String get unit; DateTime get updatedAt; int? get originalPriceVnd;
/// Create a copy of DishBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$DishBodyCopyWith<DishBody> get copyWith => _$DishBodyCopyWithImpl<DishBody>(this as DishBody, _$identity);

  /// Serializes this DishBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as DishBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is DishBody&&(identical(other.createdAt, _this.createdAt) || other.createdAt == _this.createdAt)&&(identical(other.description, _this.description) || other.description == _this.description)&&(identical(other.hidden, _this.hidden) || other.hidden == _this.hidden)&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.ingredients, _this.ingredients) || other.ingredients == _this.ingredients)&&(identical(other.kind, _this.kind) || other.kind == _this.kind)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.photo, _this.photo) || other.photo == _this.photo)&&const DeepCollectionEquality().equals(other.photos, _this.photos)&&(identical(other.sellerId, _this.sellerId) || other.sellerId == _this.sellerId)&&(identical(other.unit, _this.unit) || other.unit == _this.unit)&&(identical(other.updatedAt, _this.updatedAt) || other.updatedAt == _this.updatedAt)&&(identical(other.originalPriceVnd, _this.originalPriceVnd) || other.originalPriceVnd == _this.originalPriceVnd));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as DishBody;
  return Object.hash(runtimeType,_this.createdAt,_this.description,_this.hidden,_this.id,_this.ingredients,_this.kind,_this.name,_this.photo,const DeepCollectionEquality().hash(_this.photos),_this.sellerId,_this.unit,_this.updatedAt,_this.originalPriceVnd);
}

@override
String toString() {
  final _this = this as DishBody;
  return 'DishBody(createdAt: ${_this.createdAt}, description: ${_this.description}, hidden: ${_this.hidden}, id: ${_this.id}, ingredients: ${_this.ingredients}, kind: ${_this.kind}, name: ${_this.name}, photo: ${_this.photo}, photos: ${_this.photos}, sellerId: ${_this.sellerId}, unit: ${_this.unit}, updatedAt: ${_this.updatedAt}, originalPriceVnd: ${_this.originalPriceVnd})';
}


}

/// @nodoc
abstract mixin class $DishBodyCopyWith<$Res>  {
  factory $DishBodyCopyWith(DishBody value, $Res Function(DishBody) _then) = _$DishBodyCopyWithImpl;
@useResult
$Res call({
 DateTime createdAt, String description, bool hidden, String id, String ingredients, DishBodyKind kind, String name, OfferPhotoBody photo, List<OfferPhotoBody> photos, String sellerId, String unit, DateTime updatedAt, int? originalPriceVnd
});


$OfferPhotoBodyCopyWith<$Res> get photo;

}
/// @nodoc
class _$DishBodyCopyWithImpl<$Res>
    implements $DishBodyCopyWith<$Res> {
  _$DishBodyCopyWithImpl(this._self, this._then);

  final DishBody _self;
  final $Res Function(DishBody) _then;

/// Create a copy of DishBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? createdAt = null,Object? description = null,Object? hidden = null,Object? id = null,Object? ingredients = null,Object? kind = null,Object? name = null,Object? photo = null,Object? photos = null,Object? sellerId = null,Object? unit = null,Object? updatedAt = null,Object? originalPriceVnd = freezed,}) {
  return _then(DishBody(
createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,description: null == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String,hidden: null == hidden ? _self.hidden : hidden // ignore: cast_nullable_to_non_nullable
as bool,id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,ingredients: null == ingredients ? _self.ingredients : ingredients // ignore: cast_nullable_to_non_nullable
as String,kind: null == kind ? _self.kind : kind // ignore: cast_nullable_to_non_nullable
as DishBodyKind,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,photo: null == photo ? _self.photo : photo // ignore: cast_nullable_to_non_nullable
as OfferPhotoBody,photos: null == photos ? _self.photos : photos // ignore: cast_nullable_to_non_nullable
as List<OfferPhotoBody>,sellerId: null == sellerId ? _self.sellerId : sellerId // ignore: cast_nullable_to_non_nullable
as String,unit: null == unit ? _self.unit : unit // ignore: cast_nullable_to_non_nullable
as String,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,originalPriceVnd: freezed == originalPriceVnd ? _self.originalPriceVnd : originalPriceVnd // ignore: cast_nullable_to_non_nullable
as int?,
  ));
}
/// Create a copy of DishBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$OfferPhotoBodyCopyWith<$Res> get photo {
  
  return $OfferPhotoBodyCopyWith<$Res>(_self.photo, (value) {
    return _then(_self.copyWith(photo: value));
  });
}
}


/// Adds pattern-matching-related methods to [DishBody].
extension DishBodyPatterns on DishBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _DishBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _DishBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _DishBody value)  $default,){
final _that = this;
switch (_that) {
case _DishBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _DishBody value)?  $default,){
final _that = this;
switch (_that) {
case _DishBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( DateTime createdAt,  String description,  bool hidden,  String id,  String ingredients,  DishBodyKind kind,  String name,  OfferPhotoBody photo,  List<OfferPhotoBody> photos,  String sellerId,  String unit,  DateTime updatedAt,  int? originalPriceVnd)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _DishBody() when $default != null:
return $default(_that.createdAt,_that.description,_that.hidden,_that.id,_that.ingredients,_that.kind,_that.name,_that.photo,_that.photos,_that.sellerId,_that.unit,_that.updatedAt,_that.originalPriceVnd);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( DateTime createdAt,  String description,  bool hidden,  String id,  String ingredients,  DishBodyKind kind,  String name,  OfferPhotoBody photo,  List<OfferPhotoBody> photos,  String sellerId,  String unit,  DateTime updatedAt,  int? originalPriceVnd)  $default,) {final _that = this;
switch (_that) {
case _DishBody():
return $default(_that.createdAt,_that.description,_that.hidden,_that.id,_that.ingredients,_that.kind,_that.name,_that.photo,_that.photos,_that.sellerId,_that.unit,_that.updatedAt,_that.originalPriceVnd);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( DateTime createdAt,  String description,  bool hidden,  String id,  String ingredients,  DishBodyKind kind,  String name,  OfferPhotoBody photo,  List<OfferPhotoBody> photos,  String sellerId,  String unit,  DateTime updatedAt,  int? originalPriceVnd)?  $default,) {final _that = this;
switch (_that) {
case _DishBody() when $default != null:
return $default(_that.createdAt,_that.description,_that.hidden,_that.id,_that.ingredients,_that.kind,_that.name,_that.photo,_that.photos,_that.sellerId,_that.unit,_that.updatedAt,_that.originalPriceVnd);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _DishBody implements DishBody {
  const _DishBody({required this.createdAt, required this.description, required this.hidden, required this.id, required this.ingredients, required this.kind, required this.name, required this.photo, required  List<OfferPhotoBody> photos, required this.sellerId, required this.unit, required this.updatedAt, this.originalPriceVnd}): _photos = photos;
  factory _DishBody.fromJson(Map<String, dynamic> json) => _$DishBodyFromJson(json);

@override final  DateTime createdAt;
@override final  String description;
@override final  bool hidden;
@override final  String id;
@override final  String ingredients;
@override final  DishBodyKind kind;
@override final  String name;
@override final  OfferPhotoBody photo;
/// Every photo, the cover first
 final  List<OfferPhotoBody> _photos;
/// Every photo, the cover first
@override List<OfferPhotoBody> get photos {
  if (_photos is EqualUnmodifiableListView) return _photos;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_photos);
}

@override final  String sellerId;
@override final  String unit;
@override final  DateTime updatedAt;
@override final  int? originalPriceVnd;

/// Create a copy of DishBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$DishBodyCopyWith<_DishBody> get copyWith => __$DishBodyCopyWithImpl<_DishBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$DishBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _DishBody&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.description, description) || other.description == description)&&(identical(other.hidden, hidden) || other.hidden == hidden)&&(identical(other.id, id) || other.id == id)&&(identical(other.ingredients, ingredients) || other.ingredients == ingredients)&&(identical(other.kind, kind) || other.kind == kind)&&(identical(other.name, name) || other.name == name)&&(identical(other.photo, photo) || other.photo == photo)&&const DeepCollectionEquality().equals(other.photos, _photos)&&(identical(other.sellerId, sellerId) || other.sellerId == sellerId)&&(identical(other.unit, unit) || other.unit == unit)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt)&&(identical(other.originalPriceVnd, originalPriceVnd) || other.originalPriceVnd == originalPriceVnd));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,createdAt,description,hidden,id,ingredients,kind,name,photo,const DeepCollectionEquality().hash(_photos),sellerId,unit,updatedAt,originalPriceVnd);
}

@override
String toString() {
    return 'DishBody(createdAt: $createdAt, description: $description, hidden: $hidden, id: $id, ingredients: $ingredients, kind: $kind, name: $name, photo: $photo, photos: $photos, sellerId: $sellerId, unit: $unit, updatedAt: $updatedAt, originalPriceVnd: $originalPriceVnd)';
}


}

/// @nodoc
abstract mixin class _$DishBodyCopyWith<$Res> implements $DishBodyCopyWith<$Res> {
  factory _$DishBodyCopyWith(_DishBody value, $Res Function(_DishBody) _then) = __$DishBodyCopyWithImpl;
@override @useResult
$Res call({
 DateTime createdAt, String description, bool hidden, String id, String ingredients, DishBodyKind kind, String name, OfferPhotoBody photo, List<OfferPhotoBody> photos, String sellerId, String unit, DateTime updatedAt, int? originalPriceVnd
});


@override $OfferPhotoBodyCopyWith<$Res> get photo;

}
/// @nodoc
class __$DishBodyCopyWithImpl<$Res>
    implements _$DishBodyCopyWith<$Res> {
  __$DishBodyCopyWithImpl(this._self, this._then);

  final _DishBody _self;
  final $Res Function(_DishBody) _then;

/// Create a copy of DishBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? createdAt = null,Object? description = null,Object? hidden = null,Object? id = null,Object? ingredients = null,Object? kind = null,Object? name = null,Object? photo = null,Object? photos = null,Object? sellerId = null,Object? unit = null,Object? updatedAt = null,Object? originalPriceVnd = freezed,}) {
  return _then(_DishBody(
createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,description: null == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String,hidden: null == hidden ? _self.hidden : hidden // ignore: cast_nullable_to_non_nullable
as bool,id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,ingredients: null == ingredients ? _self.ingredients : ingredients // ignore: cast_nullable_to_non_nullable
as String,kind: null == kind ? _self.kind : kind // ignore: cast_nullable_to_non_nullable
as DishBodyKind,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,photo: null == photo ? _self.photo : photo // ignore: cast_nullable_to_non_nullable
as OfferPhotoBody,photos: null == photos ? _self._photos : photos // ignore: cast_nullable_to_non_nullable
as List<OfferPhotoBody>,sellerId: null == sellerId ? _self.sellerId : sellerId // ignore: cast_nullable_to_non_nullable
as String,unit: null == unit ? _self.unit : unit // ignore: cast_nullable_to_non_nullable
as String,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,originalPriceVnd: freezed == originalPriceVnd ? _self.originalPriceVnd : originalPriceVnd // ignore: cast_nullable_to_non_nullable
as int?,
  ));
}

/// Create a copy of DishBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$OfferPhotoBodyCopyWith<$Res> get photo {
  
  return $OfferPhotoBodyCopyWith<$Res>(_self.photo, (value) {
    return _then(_self.copyWith(photo: value));
  });
}
}

// dart format on
