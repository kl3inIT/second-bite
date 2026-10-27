// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'seller_review_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$SellerReviewBody {

/// When the customer rated the order
 DateTime get createdAt;/// Who collected, as given with the order; empty once the customer deleted their account
 String get customerName;/// The order reviewed, which names its review
 String get orderId;/// SB- and a number
 String get orderNumber; int get stars; List<String> get tags; String? get comment;/// The names of the order's dishes, joined by commas
 String? get dishes;
/// Create a copy of SellerReviewBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$SellerReviewBodyCopyWith<SellerReviewBody> get copyWith => _$SellerReviewBodyCopyWithImpl<SellerReviewBody>(this as SellerReviewBody, _$identity);

  /// Serializes this SellerReviewBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as SellerReviewBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is SellerReviewBody&&(identical(other.createdAt, _this.createdAt) || other.createdAt == _this.createdAt)&&(identical(other.customerName, _this.customerName) || other.customerName == _this.customerName)&&(identical(other.orderId, _this.orderId) || other.orderId == _this.orderId)&&(identical(other.orderNumber, _this.orderNumber) || other.orderNumber == _this.orderNumber)&&(identical(other.stars, _this.stars) || other.stars == _this.stars)&&const DeepCollectionEquality().equals(other.tags, _this.tags)&&(identical(other.comment, _this.comment) || other.comment == _this.comment)&&(identical(other.dishes, _this.dishes) || other.dishes == _this.dishes));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as SellerReviewBody;
  return Object.hash(runtimeType,_this.createdAt,_this.customerName,_this.orderId,_this.orderNumber,_this.stars,const DeepCollectionEquality().hash(_this.tags),_this.comment,_this.dishes);
}

@override
String toString() {
  final _this = this as SellerReviewBody;
  return 'SellerReviewBody(createdAt: ${_this.createdAt}, customerName: ${_this.customerName}, orderId: ${_this.orderId}, orderNumber: ${_this.orderNumber}, stars: ${_this.stars}, tags: ${_this.tags}, comment: ${_this.comment}, dishes: ${_this.dishes})';
}


}

/// @nodoc
abstract mixin class $SellerReviewBodyCopyWith<$Res>  {
  factory $SellerReviewBodyCopyWith(SellerReviewBody value, $Res Function(SellerReviewBody) _then) = _$SellerReviewBodyCopyWithImpl;
@useResult
$Res call({
 DateTime createdAt, String customerName, String orderId, String orderNumber, int stars, List<String> tags, String? comment, String? dishes
});




}
/// @nodoc
class _$SellerReviewBodyCopyWithImpl<$Res>
    implements $SellerReviewBodyCopyWith<$Res> {
  _$SellerReviewBodyCopyWithImpl(this._self, this._then);

  final SellerReviewBody _self;
  final $Res Function(SellerReviewBody) _then;

/// Create a copy of SellerReviewBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? createdAt = null,Object? customerName = null,Object? orderId = null,Object? orderNumber = null,Object? stars = null,Object? tags = null,Object? comment = freezed,Object? dishes = freezed,}) {
  return _then(SellerReviewBody(
createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,customerName: null == customerName ? _self.customerName : customerName // ignore: cast_nullable_to_non_nullable
as String,orderId: null == orderId ? _self.orderId : orderId // ignore: cast_nullable_to_non_nullable
as String,orderNumber: null == orderNumber ? _self.orderNumber : orderNumber // ignore: cast_nullable_to_non_nullable
as String,stars: null == stars ? _self.stars : stars // ignore: cast_nullable_to_non_nullable
as int,tags: null == tags ? _self.tags : tags // ignore: cast_nullable_to_non_nullable
as List<String>,comment: freezed == comment ? _self.comment : comment // ignore: cast_nullable_to_non_nullable
as String?,dishes: freezed == dishes ? _self.dishes : dishes // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [SellerReviewBody].
extension SellerReviewBodyPatterns on SellerReviewBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _SellerReviewBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _SellerReviewBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _SellerReviewBody value)  $default,){
final _that = this;
switch (_that) {
case _SellerReviewBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _SellerReviewBody value)?  $default,){
final _that = this;
switch (_that) {
case _SellerReviewBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( DateTime createdAt,  String customerName,  String orderId,  String orderNumber,  int stars,  List<String> tags,  String? comment,  String? dishes)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _SellerReviewBody() when $default != null:
return $default(_that.createdAt,_that.customerName,_that.orderId,_that.orderNumber,_that.stars,_that.tags,_that.comment,_that.dishes);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( DateTime createdAt,  String customerName,  String orderId,  String orderNumber,  int stars,  List<String> tags,  String? comment,  String? dishes)  $default,) {final _that = this;
switch (_that) {
case _SellerReviewBody():
return $default(_that.createdAt,_that.customerName,_that.orderId,_that.orderNumber,_that.stars,_that.tags,_that.comment,_that.dishes);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( DateTime createdAt,  String customerName,  String orderId,  String orderNumber,  int stars,  List<String> tags,  String? comment,  String? dishes)?  $default,) {final _that = this;
switch (_that) {
case _SellerReviewBody() when $default != null:
return $default(_that.createdAt,_that.customerName,_that.orderId,_that.orderNumber,_that.stars,_that.tags,_that.comment,_that.dishes);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _SellerReviewBody implements SellerReviewBody {
  const _SellerReviewBody({required this.createdAt, required this.customerName, required this.orderId, required this.orderNumber, required this.stars, required  List<String> tags, this.comment, this.dishes}): _tags = tags;
  factory _SellerReviewBody.fromJson(Map<String, dynamic> json) => _$SellerReviewBodyFromJson(json);

/// When the customer rated the order
@override final  DateTime createdAt;
/// Who collected, as given with the order; empty once the customer deleted their account
@override final  String customerName;
/// The order reviewed, which names its review
@override final  String orderId;
/// SB- and a number
@override final  String orderNumber;
@override final  int stars;
 final  List<String> _tags;
@override List<String> get tags {
  if (_tags is EqualUnmodifiableListView) return _tags;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_tags);
}

@override final  String? comment;
/// The names of the order's dishes, joined by commas
@override final  String? dishes;

/// Create a copy of SellerReviewBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$SellerReviewBodyCopyWith<_SellerReviewBody> get copyWith => __$SellerReviewBodyCopyWithImpl<_SellerReviewBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$SellerReviewBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _SellerReviewBody&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.customerName, customerName) || other.customerName == customerName)&&(identical(other.orderId, orderId) || other.orderId == orderId)&&(identical(other.orderNumber, orderNumber) || other.orderNumber == orderNumber)&&(identical(other.stars, stars) || other.stars == stars)&&const DeepCollectionEquality().equals(other.tags, _tags)&&(identical(other.comment, comment) || other.comment == comment)&&(identical(other.dishes, dishes) || other.dishes == dishes));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,createdAt,customerName,orderId,orderNumber,stars,const DeepCollectionEquality().hash(_tags),comment,dishes);
}

@override
String toString() {
    return 'SellerReviewBody(createdAt: $createdAt, customerName: $customerName, orderId: $orderId, orderNumber: $orderNumber, stars: $stars, tags: $tags, comment: $comment, dishes: $dishes)';
}


}

/// @nodoc
abstract mixin class _$SellerReviewBodyCopyWith<$Res> implements $SellerReviewBodyCopyWith<$Res> {
  factory _$SellerReviewBodyCopyWith(_SellerReviewBody value, $Res Function(_SellerReviewBody) _then) = __$SellerReviewBodyCopyWithImpl;
@override @useResult
$Res call({
 DateTime createdAt, String customerName, String orderId, String orderNumber, int stars, List<String> tags, String? comment, String? dishes
});




}
/// @nodoc
class __$SellerReviewBodyCopyWithImpl<$Res>
    implements _$SellerReviewBodyCopyWith<$Res> {
  __$SellerReviewBodyCopyWithImpl(this._self, this._then);

  final _SellerReviewBody _self;
  final $Res Function(_SellerReviewBody) _then;

/// Create a copy of SellerReviewBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? createdAt = null,Object? customerName = null,Object? orderId = null,Object? orderNumber = null,Object? stars = null,Object? tags = null,Object? comment = freezed,Object? dishes = freezed,}) {
  return _then(_SellerReviewBody(
createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,customerName: null == customerName ? _self.customerName : customerName // ignore: cast_nullable_to_non_nullable
as String,orderId: null == orderId ? _self.orderId : orderId // ignore: cast_nullable_to_non_nullable
as String,orderNumber: null == orderNumber ? _self.orderNumber : orderNumber // ignore: cast_nullable_to_non_nullable
as String,stars: null == stars ? _self.stars : stars // ignore: cast_nullable_to_non_nullable
as int,tags: null == tags ? _self._tags : tags // ignore: cast_nullable_to_non_nullable
as List<String>,comment: freezed == comment ? _self.comment : comment // ignore: cast_nullable_to_non_nullable
as String?,dishes: freezed == dishes ? _self.dishes : dishes // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
