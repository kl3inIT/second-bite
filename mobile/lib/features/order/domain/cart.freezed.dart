// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'cart.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$CartLine {

 String get id; String get name; int get priceVnd; int get originalPriceVnd; int get unitsLeft; DateTime get windowStart; DateTime get windowEnd; int get quantity; OfferPhotoBody? get photo;
/// Create a copy of CartLine
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$CartLineCopyWith<CartLine> get copyWith => _$CartLineCopyWithImpl<CartLine>(this as CartLine, _$identity);

  /// Serializes this CartLine to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as CartLine;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is CartLine&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.priceVnd, _this.priceVnd) || other.priceVnd == _this.priceVnd)&&(identical(other.originalPriceVnd, _this.originalPriceVnd) || other.originalPriceVnd == _this.originalPriceVnd)&&(identical(other.unitsLeft, _this.unitsLeft) || other.unitsLeft == _this.unitsLeft)&&(identical(other.windowStart, _this.windowStart) || other.windowStart == _this.windowStart)&&(identical(other.windowEnd, _this.windowEnd) || other.windowEnd == _this.windowEnd)&&(identical(other.quantity, _this.quantity) || other.quantity == _this.quantity)&&(identical(other.photo, _this.photo) || other.photo == _this.photo));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as CartLine;
  return Object.hash(runtimeType,_this.id,_this.name,_this.priceVnd,_this.originalPriceVnd,_this.unitsLeft,_this.windowStart,_this.windowEnd,_this.quantity,_this.photo);
}

@override
String toString() {
  final _this = this as CartLine;
  return 'CartLine(id: ${_this.id}, name: ${_this.name}, priceVnd: ${_this.priceVnd}, originalPriceVnd: ${_this.originalPriceVnd}, unitsLeft: ${_this.unitsLeft}, windowStart: ${_this.windowStart}, windowEnd: ${_this.windowEnd}, quantity: ${_this.quantity}, photo: ${_this.photo})';
}


}

/// @nodoc
abstract mixin class $CartLineCopyWith<$Res>  {
  factory $CartLineCopyWith(CartLine value, $Res Function(CartLine) _then) = _$CartLineCopyWithImpl;
@useResult
$Res call({
 String id, String name, int priceVnd, int originalPriceVnd, int unitsLeft, DateTime windowStart, DateTime windowEnd, int quantity, OfferPhotoBody? photo
});


$OfferPhotoBodyCopyWith<$Res>? get photo;

}
/// @nodoc
class _$CartLineCopyWithImpl<$Res>
    implements $CartLineCopyWith<$Res> {
  _$CartLineCopyWithImpl(this._self, this._then);

  final CartLine _self;
  final $Res Function(CartLine) _then;

/// Create a copy of CartLine
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? name = null,Object? priceVnd = null,Object? originalPriceVnd = null,Object? unitsLeft = null,Object? windowStart = null,Object? windowEnd = null,Object? quantity = null,Object? photo = freezed,}) {
  return _then(CartLine(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,priceVnd: null == priceVnd ? _self.priceVnd : priceVnd // ignore: cast_nullable_to_non_nullable
as int,originalPriceVnd: null == originalPriceVnd ? _self.originalPriceVnd : originalPriceVnd // ignore: cast_nullable_to_non_nullable
as int,unitsLeft: null == unitsLeft ? _self.unitsLeft : unitsLeft // ignore: cast_nullable_to_non_nullable
as int,windowStart: null == windowStart ? _self.windowStart : windowStart // ignore: cast_nullable_to_non_nullable
as DateTime,windowEnd: null == windowEnd ? _self.windowEnd : windowEnd // ignore: cast_nullable_to_non_nullable
as DateTime,quantity: null == quantity ? _self.quantity : quantity // ignore: cast_nullable_to_non_nullable
as int,photo: freezed == photo ? _self.photo : photo // ignore: cast_nullable_to_non_nullable
as OfferPhotoBody?,
  ));
}
/// Create a copy of CartLine
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$OfferPhotoBodyCopyWith<$Res>? get photo {
    if (_self.photo == null) {
    return null;
  }

  return $OfferPhotoBodyCopyWith<$Res>(_self.photo!, (value) {
    return _then(_self.copyWith(photo: value));
  });
}
}


/// Adds pattern-matching-related methods to [CartLine].
extension CartLinePatterns on CartLine {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _CartLine value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _CartLine() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _CartLine value)  $default,){
final _that = this;
switch (_that) {
case _CartLine():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _CartLine value)?  $default,){
final _that = this;
switch (_that) {
case _CartLine() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String name,  int priceVnd,  int originalPriceVnd,  int unitsLeft,  DateTime windowStart,  DateTime windowEnd,  int quantity,  OfferPhotoBody? photo)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _CartLine() when $default != null:
return $default(_that.id,_that.name,_that.priceVnd,_that.originalPriceVnd,_that.unitsLeft,_that.windowStart,_that.windowEnd,_that.quantity,_that.photo);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String name,  int priceVnd,  int originalPriceVnd,  int unitsLeft,  DateTime windowStart,  DateTime windowEnd,  int quantity,  OfferPhotoBody? photo)  $default,) {final _that = this;
switch (_that) {
case _CartLine():
return $default(_that.id,_that.name,_that.priceVnd,_that.originalPriceVnd,_that.unitsLeft,_that.windowStart,_that.windowEnd,_that.quantity,_that.photo);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String name,  int priceVnd,  int originalPriceVnd,  int unitsLeft,  DateTime windowStart,  DateTime windowEnd,  int quantity,  OfferPhotoBody? photo)?  $default,) {final _that = this;
switch (_that) {
case _CartLine() when $default != null:
return $default(_that.id,_that.name,_that.priceVnd,_that.originalPriceVnd,_that.unitsLeft,_that.windowStart,_that.windowEnd,_that.quantity,_that.photo);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _CartLine implements CartLine {
  const _CartLine({required this.id, required this.name, required this.priceVnd, required this.originalPriceVnd, required this.unitsLeft, required this.windowStart, required this.windowEnd, required this.quantity, this.photo});
  factory _CartLine.fromJson(Map<String, dynamic> json) => _$CartLineFromJson(json);

@override final  String id;
@override final  String name;
@override final  int priceVnd;
@override final  int originalPriceVnd;
@override final  int unitsLeft;
@override final  DateTime windowStart;
@override final  DateTime windowEnd;
@override final  int quantity;
@override final  OfferPhotoBody? photo;

/// Create a copy of CartLine
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$CartLineCopyWith<_CartLine> get copyWith => __$CartLineCopyWithImpl<_CartLine>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$CartLineToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _CartLine&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.priceVnd, priceVnd) || other.priceVnd == priceVnd)&&(identical(other.originalPriceVnd, originalPriceVnd) || other.originalPriceVnd == originalPriceVnd)&&(identical(other.unitsLeft, unitsLeft) || other.unitsLeft == unitsLeft)&&(identical(other.windowStart, windowStart) || other.windowStart == windowStart)&&(identical(other.windowEnd, windowEnd) || other.windowEnd == windowEnd)&&(identical(other.quantity, quantity) || other.quantity == quantity)&&(identical(other.photo, photo) || other.photo == photo));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,id,name,priceVnd,originalPriceVnd,unitsLeft,windowStart,windowEnd,quantity,photo);
}

@override
String toString() {
    return 'CartLine(id: $id, name: $name, priceVnd: $priceVnd, originalPriceVnd: $originalPriceVnd, unitsLeft: $unitsLeft, windowStart: $windowStart, windowEnd: $windowEnd, quantity: $quantity, photo: $photo)';
}


}

/// @nodoc
abstract mixin class _$CartLineCopyWith<$Res> implements $CartLineCopyWith<$Res> {
  factory _$CartLineCopyWith(_CartLine value, $Res Function(_CartLine) _then) = __$CartLineCopyWithImpl;
@override @useResult
$Res call({
 String id, String name, int priceVnd, int originalPriceVnd, int unitsLeft, DateTime windowStart, DateTime windowEnd, int quantity, OfferPhotoBody? photo
});


@override $OfferPhotoBodyCopyWith<$Res>? get photo;

}
/// @nodoc
class __$CartLineCopyWithImpl<$Res>
    implements _$CartLineCopyWith<$Res> {
  __$CartLineCopyWithImpl(this._self, this._then);

  final _CartLine _self;
  final $Res Function(_CartLine) _then;

/// Create a copy of CartLine
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? name = null,Object? priceVnd = null,Object? originalPriceVnd = null,Object? unitsLeft = null,Object? windowStart = null,Object? windowEnd = null,Object? quantity = null,Object? photo = freezed,}) {
  return _then(_CartLine(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,priceVnd: null == priceVnd ? _self.priceVnd : priceVnd // ignore: cast_nullable_to_non_nullable
as int,originalPriceVnd: null == originalPriceVnd ? _self.originalPriceVnd : originalPriceVnd // ignore: cast_nullable_to_non_nullable
as int,unitsLeft: null == unitsLeft ? _self.unitsLeft : unitsLeft // ignore: cast_nullable_to_non_nullable
as int,windowStart: null == windowStart ? _self.windowStart : windowStart // ignore: cast_nullable_to_non_nullable
as DateTime,windowEnd: null == windowEnd ? _self.windowEnd : windowEnd // ignore: cast_nullable_to_non_nullable
as DateTime,quantity: null == quantity ? _self.quantity : quantity // ignore: cast_nullable_to_non_nullable
as int,photo: freezed == photo ? _self.photo : photo // ignore: cast_nullable_to_non_nullable
as OfferPhotoBody?,
  ));
}

/// Create a copy of CartLine
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$OfferPhotoBodyCopyWith<$Res>? get photo {
    if (_self.photo == null) {
    return null;
  }

  return $OfferPhotoBodyCopyWith<$Res>(_self.photo!, (value) {
    return _then(_self.copyWith(photo: value));
  });
}
}


/// @nodoc
mixin _$Basket {

 OfferSellerBody get seller; CollectionPointBody get collectionPoint; List<CartLine> get lines; double? get distanceMeters;
/// Create a copy of Basket
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$BasketCopyWith<Basket> get copyWith => _$BasketCopyWithImpl<Basket>(this as Basket, _$identity);

  /// Serializes this Basket to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as Basket;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is Basket&&(identical(other.seller, _this.seller) || other.seller == _this.seller)&&(identical(other.collectionPoint, _this.collectionPoint) || other.collectionPoint == _this.collectionPoint)&&const DeepCollectionEquality().equals(other.lines, _this.lines)&&(identical(other.distanceMeters, _this.distanceMeters) || other.distanceMeters == _this.distanceMeters));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as Basket;
  return Object.hash(runtimeType,_this.seller,_this.collectionPoint,const DeepCollectionEquality().hash(_this.lines),_this.distanceMeters);
}

@override
String toString() {
  final _this = this as Basket;
  return 'Basket(seller: ${_this.seller}, collectionPoint: ${_this.collectionPoint}, lines: ${_this.lines}, distanceMeters: ${_this.distanceMeters})';
}


}

/// @nodoc
abstract mixin class $BasketCopyWith<$Res>  {
  factory $BasketCopyWith(Basket value, $Res Function(Basket) _then) = _$BasketCopyWithImpl;
@useResult
$Res call({
 OfferSellerBody seller, CollectionPointBody collectionPoint, List<CartLine> lines, double? distanceMeters
});


$OfferSellerBodyCopyWith<$Res> get seller;$CollectionPointBodyCopyWith<$Res> get collectionPoint;

}
/// @nodoc
class _$BasketCopyWithImpl<$Res>
    implements $BasketCopyWith<$Res> {
  _$BasketCopyWithImpl(this._self, this._then);

  final Basket _self;
  final $Res Function(Basket) _then;

/// Create a copy of Basket
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? seller = null,Object? collectionPoint = null,Object? lines = null,Object? distanceMeters = freezed,}) {
  return _then(Basket(
seller: null == seller ? _self.seller : seller // ignore: cast_nullable_to_non_nullable
as OfferSellerBody,collectionPoint: null == collectionPoint ? _self.collectionPoint : collectionPoint // ignore: cast_nullable_to_non_nullable
as CollectionPointBody,lines: null == lines ? _self.lines : lines // ignore: cast_nullable_to_non_nullable
as List<CartLine>,distanceMeters: freezed == distanceMeters ? _self.distanceMeters : distanceMeters // ignore: cast_nullable_to_non_nullable
as double?,
  ));
}
/// Create a copy of Basket
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$OfferSellerBodyCopyWith<$Res> get seller {
  
  return $OfferSellerBodyCopyWith<$Res>(_self.seller, (value) {
    return _then(_self.copyWith(seller: value));
  });
}/// Create a copy of Basket
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$CollectionPointBodyCopyWith<$Res> get collectionPoint {
  
  return $CollectionPointBodyCopyWith<$Res>(_self.collectionPoint, (value) {
    return _then(_self.copyWith(collectionPoint: value));
  });
}
}


/// Adds pattern-matching-related methods to [Basket].
extension BasketPatterns on Basket {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _Basket value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _Basket() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _Basket value)  $default,){
final _that = this;
switch (_that) {
case _Basket():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _Basket value)?  $default,){
final _that = this;
switch (_that) {
case _Basket() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( OfferSellerBody seller,  CollectionPointBody collectionPoint,  List<CartLine> lines,  double? distanceMeters)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _Basket() when $default != null:
return $default(_that.seller,_that.collectionPoint,_that.lines,_that.distanceMeters);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( OfferSellerBody seller,  CollectionPointBody collectionPoint,  List<CartLine> lines,  double? distanceMeters)  $default,) {final _that = this;
switch (_that) {
case _Basket():
return $default(_that.seller,_that.collectionPoint,_that.lines,_that.distanceMeters);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( OfferSellerBody seller,  CollectionPointBody collectionPoint,  List<CartLine> lines,  double? distanceMeters)?  $default,) {final _that = this;
switch (_that) {
case _Basket() when $default != null:
return $default(_that.seller,_that.collectionPoint,_that.lines,_that.distanceMeters);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _Basket implements Basket {
  const _Basket({required this.seller, required this.collectionPoint, required  List<CartLine> lines, this.distanceMeters}): _lines = lines;
  factory _Basket.fromJson(Map<String, dynamic> json) => _$BasketFromJson(json);

@override final  OfferSellerBody seller;
@override final  CollectionPointBody collectionPoint;
 final  List<CartLine> _lines;
@override List<CartLine> get lines {
  if (_lines is EqualUnmodifiableListView) return _lines;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_lines);
}

@override final  double? distanceMeters;

/// Create a copy of Basket
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$BasketCopyWith<_Basket> get copyWith => __$BasketCopyWithImpl<_Basket>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$BasketToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _Basket&&(identical(other.seller, seller) || other.seller == seller)&&(identical(other.collectionPoint, collectionPoint) || other.collectionPoint == collectionPoint)&&const DeepCollectionEquality().equals(other.lines, _lines)&&(identical(other.distanceMeters, distanceMeters) || other.distanceMeters == distanceMeters));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,seller,collectionPoint,const DeepCollectionEquality().hash(_lines),distanceMeters);
}

@override
String toString() {
    return 'Basket(seller: $seller, collectionPoint: $collectionPoint, lines: $lines, distanceMeters: $distanceMeters)';
}


}

/// @nodoc
abstract mixin class _$BasketCopyWith<$Res> implements $BasketCopyWith<$Res> {
  factory _$BasketCopyWith(_Basket value, $Res Function(_Basket) _then) = __$BasketCopyWithImpl;
@override @useResult
$Res call({
 OfferSellerBody seller, CollectionPointBody collectionPoint, List<CartLine> lines, double? distanceMeters
});


@override $OfferSellerBodyCopyWith<$Res> get seller;@override $CollectionPointBodyCopyWith<$Res> get collectionPoint;

}
/// @nodoc
class __$BasketCopyWithImpl<$Res>
    implements _$BasketCopyWith<$Res> {
  __$BasketCopyWithImpl(this._self, this._then);

  final _Basket _self;
  final $Res Function(_Basket) _then;

/// Create a copy of Basket
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? seller = null,Object? collectionPoint = null,Object? lines = null,Object? distanceMeters = freezed,}) {
  return _then(_Basket(
seller: null == seller ? _self.seller : seller // ignore: cast_nullable_to_non_nullable
as OfferSellerBody,collectionPoint: null == collectionPoint ? _self.collectionPoint : collectionPoint // ignore: cast_nullable_to_non_nullable
as CollectionPointBody,lines: null == lines ? _self._lines : lines // ignore: cast_nullable_to_non_nullable
as List<CartLine>,distanceMeters: freezed == distanceMeters ? _self.distanceMeters : distanceMeters // ignore: cast_nullable_to_non_nullable
as double?,
  ));
}

/// Create a copy of Basket
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$OfferSellerBodyCopyWith<$Res> get seller {
  
  return $OfferSellerBodyCopyWith<$Res>(_self.seller, (value) {
    return _then(_self.copyWith(seller: value));
  });
}/// Create a copy of Basket
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$CollectionPointBodyCopyWith<$Res> get collectionPoint {
  
  return $CollectionPointBodyCopyWith<$Res>(_self.collectionPoint, (value) {
    return _then(_self.copyWith(collectionPoint: value));
  });
}
}


/// @nodoc
mixin _$Cart {

 List<Basket> get baskets;
/// Create a copy of Cart
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$CartCopyWith<Cart> get copyWith => _$CartCopyWithImpl<Cart>(this as Cart, _$identity);

  /// Serializes this Cart to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as Cart;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is Cart&&const DeepCollectionEquality().equals(other.baskets, _this.baskets));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as Cart;
  return Object.hash(runtimeType,const DeepCollectionEquality().hash(_this.baskets));
}

@override
String toString() {
  final _this = this as Cart;
  return 'Cart(baskets: ${_this.baskets})';
}


}

/// @nodoc
abstract mixin class $CartCopyWith<$Res>  {
  factory $CartCopyWith(Cart value, $Res Function(Cart) _then) = _$CartCopyWithImpl;
@useResult
$Res call({
 List<Basket> baskets
});




}
/// @nodoc
class _$CartCopyWithImpl<$Res>
    implements $CartCopyWith<$Res> {
  _$CartCopyWithImpl(this._self, this._then);

  final Cart _self;
  final $Res Function(Cart) _then;

/// Create a copy of Cart
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? baskets = null,}) {
  return _then(Cart(
baskets: null == baskets ? _self.baskets : baskets // ignore: cast_nullable_to_non_nullable
as List<Basket>,
  ));
}

}


/// Adds pattern-matching-related methods to [Cart].
extension CartPatterns on Cart {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _Cart value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _Cart() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _Cart value)  $default,){
final _that = this;
switch (_that) {
case _Cart():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _Cart value)?  $default,){
final _that = this;
switch (_that) {
case _Cart() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( List<Basket> baskets)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _Cart() when $default != null:
return $default(_that.baskets);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( List<Basket> baskets)  $default,) {final _that = this;
switch (_that) {
case _Cart():
return $default(_that.baskets);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( List<Basket> baskets)?  $default,) {final _that = this;
switch (_that) {
case _Cart() when $default != null:
return $default(_that.baskets);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _Cart implements Cart {
  const _Cart({required  List<Basket> baskets}): _baskets = baskets;
  factory _Cart.fromJson(Map<String, dynamic> json) => _$CartFromJson(json);

 final  List<Basket> _baskets;
@override List<Basket> get baskets {
  if (_baskets is EqualUnmodifiableListView) return _baskets;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_baskets);
}


/// Create a copy of Cart
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$CartCopyWith<_Cart> get copyWith => __$CartCopyWithImpl<_Cart>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$CartToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _Cart&&const DeepCollectionEquality().equals(other.baskets, _baskets));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,const DeepCollectionEquality().hash(_baskets));
}

@override
String toString() {
    return 'Cart(baskets: $baskets)';
}


}

/// @nodoc
abstract mixin class _$CartCopyWith<$Res> implements $CartCopyWith<$Res> {
  factory _$CartCopyWith(_Cart value, $Res Function(_Cart) _then) = __$CartCopyWithImpl;
@override @useResult
$Res call({
 List<Basket> baskets
});




}
/// @nodoc
class __$CartCopyWithImpl<$Res>
    implements _$CartCopyWith<$Res> {
  __$CartCopyWithImpl(this._self, this._then);

  final _Cart _self;
  final $Res Function(_Cart) _then;

/// Create a copy of Cart
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? baskets = null,}) {
  return _then(_Cart(
baskets: null == baskets ? _self._baskets : baskets // ignore: cast_nullable_to_non_nullable
as List<Basket>,
  ));
}


}

// dart format on
