// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'admin_review_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$AdminReviewBody {

/// When the customer rated the order
 DateTime get createdAt;/// Who collected, as given with the order
 String get customerName;/// The order reviewed, which names its review
 String get orderId;/// SB- and a number
 String get orderNumber; String get sellerId; String get sellerName; int get stars; List<String> get tags; String? get comment;/// When an admin hid it; absent while it shows
 DateTime? get hiddenAt;/// Why an admin hid it, when they said
 String? get hiddenReason;
/// Create a copy of AdminReviewBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AdminReviewBodyCopyWith<AdminReviewBody> get copyWith => _$AdminReviewBodyCopyWithImpl<AdminReviewBody>(this as AdminReviewBody, _$identity);

  /// Serializes this AdminReviewBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as AdminReviewBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AdminReviewBody&&(identical(other.createdAt, _this.createdAt) || other.createdAt == _this.createdAt)&&(identical(other.customerName, _this.customerName) || other.customerName == _this.customerName)&&(identical(other.orderId, _this.orderId) || other.orderId == _this.orderId)&&(identical(other.orderNumber, _this.orderNumber) || other.orderNumber == _this.orderNumber)&&(identical(other.sellerId, _this.sellerId) || other.sellerId == _this.sellerId)&&(identical(other.sellerName, _this.sellerName) || other.sellerName == _this.sellerName)&&(identical(other.stars, _this.stars) || other.stars == _this.stars)&&const DeepCollectionEquality().equals(other.tags, _this.tags)&&(identical(other.comment, _this.comment) || other.comment == _this.comment)&&(identical(other.hiddenAt, _this.hiddenAt) || other.hiddenAt == _this.hiddenAt)&&(identical(other.hiddenReason, _this.hiddenReason) || other.hiddenReason == _this.hiddenReason));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as AdminReviewBody;
  return Object.hash(runtimeType,_this.createdAt,_this.customerName,_this.orderId,_this.orderNumber,_this.sellerId,_this.sellerName,_this.stars,const DeepCollectionEquality().hash(_this.tags),_this.comment,_this.hiddenAt,_this.hiddenReason);
}

@override
String toString() {
  final _this = this as AdminReviewBody;
  return 'AdminReviewBody(createdAt: ${_this.createdAt}, customerName: ${_this.customerName}, orderId: ${_this.orderId}, orderNumber: ${_this.orderNumber}, sellerId: ${_this.sellerId}, sellerName: ${_this.sellerName}, stars: ${_this.stars}, tags: ${_this.tags}, comment: ${_this.comment}, hiddenAt: ${_this.hiddenAt}, hiddenReason: ${_this.hiddenReason})';
}


}

/// @nodoc
abstract mixin class $AdminReviewBodyCopyWith<$Res>  {
  factory $AdminReviewBodyCopyWith(AdminReviewBody value, $Res Function(AdminReviewBody) _then) = _$AdminReviewBodyCopyWithImpl;
@useResult
$Res call({
 DateTime createdAt, String customerName, String orderId, String orderNumber, String sellerId, String sellerName, int stars, List<String> tags, String? comment, DateTime? hiddenAt, String? hiddenReason
});




}
/// @nodoc
class _$AdminReviewBodyCopyWithImpl<$Res>
    implements $AdminReviewBodyCopyWith<$Res> {
  _$AdminReviewBodyCopyWithImpl(this._self, this._then);

  final AdminReviewBody _self;
  final $Res Function(AdminReviewBody) _then;

/// Create a copy of AdminReviewBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? createdAt = null,Object? customerName = null,Object? orderId = null,Object? orderNumber = null,Object? sellerId = null,Object? sellerName = null,Object? stars = null,Object? tags = null,Object? comment = freezed,Object? hiddenAt = freezed,Object? hiddenReason = freezed,}) {
  return _then(AdminReviewBody(
createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,customerName: null == customerName ? _self.customerName : customerName // ignore: cast_nullable_to_non_nullable
as String,orderId: null == orderId ? _self.orderId : orderId // ignore: cast_nullable_to_non_nullable
as String,orderNumber: null == orderNumber ? _self.orderNumber : orderNumber // ignore: cast_nullable_to_non_nullable
as String,sellerId: null == sellerId ? _self.sellerId : sellerId // ignore: cast_nullable_to_non_nullable
as String,sellerName: null == sellerName ? _self.sellerName : sellerName // ignore: cast_nullable_to_non_nullable
as String,stars: null == stars ? _self.stars : stars // ignore: cast_nullable_to_non_nullable
as int,tags: null == tags ? _self.tags : tags // ignore: cast_nullable_to_non_nullable
as List<String>,comment: freezed == comment ? _self.comment : comment // ignore: cast_nullable_to_non_nullable
as String?,hiddenAt: freezed == hiddenAt ? _self.hiddenAt : hiddenAt // ignore: cast_nullable_to_non_nullable
as DateTime?,hiddenReason: freezed == hiddenReason ? _self.hiddenReason : hiddenReason // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [AdminReviewBody].
extension AdminReviewBodyPatterns on AdminReviewBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AdminReviewBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AdminReviewBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AdminReviewBody value)  $default,){
final _that = this;
switch (_that) {
case _AdminReviewBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AdminReviewBody value)?  $default,){
final _that = this;
switch (_that) {
case _AdminReviewBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( DateTime createdAt,  String customerName,  String orderId,  String orderNumber,  String sellerId,  String sellerName,  int stars,  List<String> tags,  String? comment,  DateTime? hiddenAt,  String? hiddenReason)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AdminReviewBody() when $default != null:
return $default(_that.createdAt,_that.customerName,_that.orderId,_that.orderNumber,_that.sellerId,_that.sellerName,_that.stars,_that.tags,_that.comment,_that.hiddenAt,_that.hiddenReason);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( DateTime createdAt,  String customerName,  String orderId,  String orderNumber,  String sellerId,  String sellerName,  int stars,  List<String> tags,  String? comment,  DateTime? hiddenAt,  String? hiddenReason)  $default,) {final _that = this;
switch (_that) {
case _AdminReviewBody():
return $default(_that.createdAt,_that.customerName,_that.orderId,_that.orderNumber,_that.sellerId,_that.sellerName,_that.stars,_that.tags,_that.comment,_that.hiddenAt,_that.hiddenReason);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( DateTime createdAt,  String customerName,  String orderId,  String orderNumber,  String sellerId,  String sellerName,  int stars,  List<String> tags,  String? comment,  DateTime? hiddenAt,  String? hiddenReason)?  $default,) {final _that = this;
switch (_that) {
case _AdminReviewBody() when $default != null:
return $default(_that.createdAt,_that.customerName,_that.orderId,_that.orderNumber,_that.sellerId,_that.sellerName,_that.stars,_that.tags,_that.comment,_that.hiddenAt,_that.hiddenReason);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _AdminReviewBody implements AdminReviewBody {
  const _AdminReviewBody({required this.createdAt, required this.customerName, required this.orderId, required this.orderNumber, required this.sellerId, required this.sellerName, required this.stars, required  List<String> tags, this.comment, this.hiddenAt, this.hiddenReason}): _tags = tags;
  factory _AdminReviewBody.fromJson(Map<String, dynamic> json) => _$AdminReviewBodyFromJson(json);

/// When the customer rated the order
@override final  DateTime createdAt;
/// Who collected, as given with the order
@override final  String customerName;
/// The order reviewed, which names its review
@override final  String orderId;
/// SB- and a number
@override final  String orderNumber;
@override final  String sellerId;
@override final  String sellerName;
@override final  int stars;
 final  List<String> _tags;
@override List<String> get tags {
  if (_tags is EqualUnmodifiableListView) return _tags;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_tags);
}

@override final  String? comment;
/// When an admin hid it; absent while it shows
@override final  DateTime? hiddenAt;
/// Why an admin hid it, when they said
@override final  String? hiddenReason;

/// Create a copy of AdminReviewBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AdminReviewBodyCopyWith<_AdminReviewBody> get copyWith => __$AdminReviewBodyCopyWithImpl<_AdminReviewBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AdminReviewBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _AdminReviewBody&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.customerName, customerName) || other.customerName == customerName)&&(identical(other.orderId, orderId) || other.orderId == orderId)&&(identical(other.orderNumber, orderNumber) || other.orderNumber == orderNumber)&&(identical(other.sellerId, sellerId) || other.sellerId == sellerId)&&(identical(other.sellerName, sellerName) || other.sellerName == sellerName)&&(identical(other.stars, stars) || other.stars == stars)&&const DeepCollectionEquality().equals(other.tags, _tags)&&(identical(other.comment, comment) || other.comment == comment)&&(identical(other.hiddenAt, hiddenAt) || other.hiddenAt == hiddenAt)&&(identical(other.hiddenReason, hiddenReason) || other.hiddenReason == hiddenReason));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,createdAt,customerName,orderId,orderNumber,sellerId,sellerName,stars,const DeepCollectionEquality().hash(_tags),comment,hiddenAt,hiddenReason);
}

@override
String toString() {
    return 'AdminReviewBody(createdAt: $createdAt, customerName: $customerName, orderId: $orderId, orderNumber: $orderNumber, sellerId: $sellerId, sellerName: $sellerName, stars: $stars, tags: $tags, comment: $comment, hiddenAt: $hiddenAt, hiddenReason: $hiddenReason)';
}


}

/// @nodoc
abstract mixin class _$AdminReviewBodyCopyWith<$Res> implements $AdminReviewBodyCopyWith<$Res> {
  factory _$AdminReviewBodyCopyWith(_AdminReviewBody value, $Res Function(_AdminReviewBody) _then) = __$AdminReviewBodyCopyWithImpl;
@override @useResult
$Res call({
 DateTime createdAt, String customerName, String orderId, String orderNumber, String sellerId, String sellerName, int stars, List<String> tags, String? comment, DateTime? hiddenAt, String? hiddenReason
});




}
/// @nodoc
class __$AdminReviewBodyCopyWithImpl<$Res>
    implements _$AdminReviewBodyCopyWith<$Res> {
  __$AdminReviewBodyCopyWithImpl(this._self, this._then);

  final _AdminReviewBody _self;
  final $Res Function(_AdminReviewBody) _then;

/// Create a copy of AdminReviewBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? createdAt = null,Object? customerName = null,Object? orderId = null,Object? orderNumber = null,Object? sellerId = null,Object? sellerName = null,Object? stars = null,Object? tags = null,Object? comment = freezed,Object? hiddenAt = freezed,Object? hiddenReason = freezed,}) {
  return _then(_AdminReviewBody(
createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,customerName: null == customerName ? _self.customerName : customerName // ignore: cast_nullable_to_non_nullable
as String,orderId: null == orderId ? _self.orderId : orderId // ignore: cast_nullable_to_non_nullable
as String,orderNumber: null == orderNumber ? _self.orderNumber : orderNumber // ignore: cast_nullable_to_non_nullable
as String,sellerId: null == sellerId ? _self.sellerId : sellerId // ignore: cast_nullable_to_non_nullable
as String,sellerName: null == sellerName ? _self.sellerName : sellerName // ignore: cast_nullable_to_non_nullable
as String,stars: null == stars ? _self.stars : stars // ignore: cast_nullable_to_non_nullable
as int,tags: null == tags ? _self._tags : tags // ignore: cast_nullable_to_non_nullable
as List<String>,comment: freezed == comment ? _self.comment : comment // ignore: cast_nullable_to_non_nullable
as String?,hiddenAt: freezed == hiddenAt ? _self.hiddenAt : hiddenAt // ignore: cast_nullable_to_non_nullable
as DateTime?,hiddenReason: freezed == hiddenReason ? _self.hiddenReason : hiddenReason // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
