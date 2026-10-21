// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'order_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$OrderBody {

/// Shared by the orders placed together from one cart
 String get checkoutId; DateTime get createdAt;/// Who collects, as given with the order
 String get customerName;/// Their phone number, 0 and nine digits
 String get customerPhone; String get id; List<OrderLineBody> get lines;/// What people read aloud, SB- and a number
 String get number;/// Where the order is collected, copied when it was placed
 OrderSellerBody get seller;/// expired is read from the window's end
 OrderBodyStatus get status;/// Paid to the seller at the counter
 int get totalVnd; DateTime get windowEnd; DateTime get windowStart;/// To its customer: proves the order is theirs without signing in, sent back as Order-Access
 String? get access; String? get cancelReason; DateTime? get cancelledAt; DateTime? get collectedAt;/// Messages its chat holds, with unreadMessages; none for admins
 int? get messageCount; DateTime? get readyAt; String? get refuseNote; OrderBodyRefuseReason? get refuseReason; DateTime? get refusedAt;/// The customer's rating of the collected order; none until they rate it
 ReviewBody? get review;/// Messages of its chat the reader has not read: from the seller for the customer, from the customer for the seller's people; none for admins
 int? get unreadMessages;
/// Create a copy of OrderBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$OrderBodyCopyWith<OrderBody> get copyWith => _$OrderBodyCopyWithImpl<OrderBody>(this as OrderBody, _$identity);

  /// Serializes this OrderBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as OrderBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is OrderBody&&(identical(other.checkoutId, _this.checkoutId) || other.checkoutId == _this.checkoutId)&&(identical(other.createdAt, _this.createdAt) || other.createdAt == _this.createdAt)&&(identical(other.customerName, _this.customerName) || other.customerName == _this.customerName)&&(identical(other.customerPhone, _this.customerPhone) || other.customerPhone == _this.customerPhone)&&(identical(other.id, _this.id) || other.id == _this.id)&&const DeepCollectionEquality().equals(other.lines, _this.lines)&&(identical(other.number, _this.number) || other.number == _this.number)&&(identical(other.seller, _this.seller) || other.seller == _this.seller)&&(identical(other.status, _this.status) || other.status == _this.status)&&(identical(other.totalVnd, _this.totalVnd) || other.totalVnd == _this.totalVnd)&&(identical(other.windowEnd, _this.windowEnd) || other.windowEnd == _this.windowEnd)&&(identical(other.windowStart, _this.windowStart) || other.windowStart == _this.windowStart)&&(identical(other.access, _this.access) || other.access == _this.access)&&(identical(other.cancelReason, _this.cancelReason) || other.cancelReason == _this.cancelReason)&&(identical(other.cancelledAt, _this.cancelledAt) || other.cancelledAt == _this.cancelledAt)&&(identical(other.collectedAt, _this.collectedAt) || other.collectedAt == _this.collectedAt)&&(identical(other.messageCount, _this.messageCount) || other.messageCount == _this.messageCount)&&(identical(other.readyAt, _this.readyAt) || other.readyAt == _this.readyAt)&&(identical(other.refuseNote, _this.refuseNote) || other.refuseNote == _this.refuseNote)&&(identical(other.refuseReason, _this.refuseReason) || other.refuseReason == _this.refuseReason)&&(identical(other.refusedAt, _this.refusedAt) || other.refusedAt == _this.refusedAt)&&(identical(other.review, _this.review) || other.review == _this.review)&&(identical(other.unreadMessages, _this.unreadMessages) || other.unreadMessages == _this.unreadMessages));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as OrderBody;
  return Object.hashAll([runtimeType,_this.checkoutId,_this.createdAt,_this.customerName,_this.customerPhone,_this.id,const DeepCollectionEquality().hash(_this.lines),_this.number,_this.seller,_this.status,_this.totalVnd,_this.windowEnd,_this.windowStart,_this.access,_this.cancelReason,_this.cancelledAt,_this.collectedAt,_this.messageCount,_this.readyAt,_this.refuseNote,_this.refuseReason,_this.refusedAt,_this.review,_this.unreadMessages]);
}

@override
String toString() {
  final _this = this as OrderBody;
  return 'OrderBody(checkoutId: ${_this.checkoutId}, createdAt: ${_this.createdAt}, customerName: ${_this.customerName}, customerPhone: ${_this.customerPhone}, id: ${_this.id}, lines: ${_this.lines}, number: ${_this.number}, seller: ${_this.seller}, status: ${_this.status}, totalVnd: ${_this.totalVnd}, windowEnd: ${_this.windowEnd}, windowStart: ${_this.windowStart}, access: ${_this.access}, cancelReason: ${_this.cancelReason}, cancelledAt: ${_this.cancelledAt}, collectedAt: ${_this.collectedAt}, messageCount: ${_this.messageCount}, readyAt: ${_this.readyAt}, refuseNote: ${_this.refuseNote}, refuseReason: ${_this.refuseReason}, refusedAt: ${_this.refusedAt}, review: ${_this.review}, unreadMessages: ${_this.unreadMessages})';
}


}

/// @nodoc
abstract mixin class $OrderBodyCopyWith<$Res>  {
  factory $OrderBodyCopyWith(OrderBody value, $Res Function(OrderBody) _then) = _$OrderBodyCopyWithImpl;
@useResult
$Res call({
 String checkoutId, DateTime createdAt, String customerName, String customerPhone, String id, List<OrderLineBody> lines, String number, OrderSellerBody seller, OrderBodyStatus status, int totalVnd, DateTime windowEnd, DateTime windowStart, String? access, String? cancelReason, DateTime? cancelledAt, DateTime? collectedAt, int? messageCount, DateTime? readyAt, String? refuseNote, OrderBodyRefuseReason? refuseReason, DateTime? refusedAt, ReviewBody? review, int? unreadMessages
});


$OrderSellerBodyCopyWith<$Res> get seller;$ReviewBodyCopyWith<$Res>? get review;

}
/// @nodoc
class _$OrderBodyCopyWithImpl<$Res>
    implements $OrderBodyCopyWith<$Res> {
  _$OrderBodyCopyWithImpl(this._self, this._then);

  final OrderBody _self;
  final $Res Function(OrderBody) _then;

/// Create a copy of OrderBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? checkoutId = null,Object? createdAt = null,Object? customerName = null,Object? customerPhone = null,Object? id = null,Object? lines = null,Object? number = null,Object? seller = null,Object? status = null,Object? totalVnd = null,Object? windowEnd = null,Object? windowStart = null,Object? access = freezed,Object? cancelReason = freezed,Object? cancelledAt = freezed,Object? collectedAt = freezed,Object? messageCount = freezed,Object? readyAt = freezed,Object? refuseNote = freezed,Object? refuseReason = freezed,Object? refusedAt = freezed,Object? review = freezed,Object? unreadMessages = freezed,}) {
  return _then(OrderBody(
checkoutId: null == checkoutId ? _self.checkoutId : checkoutId // ignore: cast_nullable_to_non_nullable
as String,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,customerName: null == customerName ? _self.customerName : customerName // ignore: cast_nullable_to_non_nullable
as String,customerPhone: null == customerPhone ? _self.customerPhone : customerPhone // ignore: cast_nullable_to_non_nullable
as String,id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,lines: null == lines ? _self.lines : lines // ignore: cast_nullable_to_non_nullable
as List<OrderLineBody>,number: null == number ? _self.number : number // ignore: cast_nullable_to_non_nullable
as String,seller: null == seller ? _self.seller : seller // ignore: cast_nullable_to_non_nullable
as OrderSellerBody,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as OrderBodyStatus,totalVnd: null == totalVnd ? _self.totalVnd : totalVnd // ignore: cast_nullable_to_non_nullable
as int,windowEnd: null == windowEnd ? _self.windowEnd : windowEnd // ignore: cast_nullable_to_non_nullable
as DateTime,windowStart: null == windowStart ? _self.windowStart : windowStart // ignore: cast_nullable_to_non_nullable
as DateTime,access: freezed == access ? _self.access : access // ignore: cast_nullable_to_non_nullable
as String?,cancelReason: freezed == cancelReason ? _self.cancelReason : cancelReason // ignore: cast_nullable_to_non_nullable
as String?,cancelledAt: freezed == cancelledAt ? _self.cancelledAt : cancelledAt // ignore: cast_nullable_to_non_nullable
as DateTime?,collectedAt: freezed == collectedAt ? _self.collectedAt : collectedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,messageCount: freezed == messageCount ? _self.messageCount : messageCount // ignore: cast_nullable_to_non_nullable
as int?,readyAt: freezed == readyAt ? _self.readyAt : readyAt // ignore: cast_nullable_to_non_nullable
as DateTime?,refuseNote: freezed == refuseNote ? _self.refuseNote : refuseNote // ignore: cast_nullable_to_non_nullable
as String?,refuseReason: freezed == refuseReason ? _self.refuseReason : refuseReason // ignore: cast_nullable_to_non_nullable
as OrderBodyRefuseReason?,refusedAt: freezed == refusedAt ? _self.refusedAt : refusedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,review: freezed == review ? _self.review : review // ignore: cast_nullable_to_non_nullable
as ReviewBody?,unreadMessages: freezed == unreadMessages ? _self.unreadMessages : unreadMessages // ignore: cast_nullable_to_non_nullable
as int?,
  ));
}
/// Create a copy of OrderBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$OrderSellerBodyCopyWith<$Res> get seller {
  
  return $OrderSellerBodyCopyWith<$Res>(_self.seller, (value) {
    return _then(_self.copyWith(seller: value));
  });
}/// Create a copy of OrderBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$ReviewBodyCopyWith<$Res>? get review {
    if (_self.review == null) {
    return null;
  }

  return $ReviewBodyCopyWith<$Res>(_self.review!, (value) {
    return _then(_self.copyWith(review: value));
  });
}
}


/// Adds pattern-matching-related methods to [OrderBody].
extension OrderBodyPatterns on OrderBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _OrderBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _OrderBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _OrderBody value)  $default,){
final _that = this;
switch (_that) {
case _OrderBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _OrderBody value)?  $default,){
final _that = this;
switch (_that) {
case _OrderBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String checkoutId,  DateTime createdAt,  String customerName,  String customerPhone,  String id,  List<OrderLineBody> lines,  String number,  OrderSellerBody seller,  OrderBodyStatus status,  int totalVnd,  DateTime windowEnd,  DateTime windowStart,  String? access,  String? cancelReason,  DateTime? cancelledAt,  DateTime? collectedAt,  int? messageCount,  DateTime? readyAt,  String? refuseNote,  OrderBodyRefuseReason? refuseReason,  DateTime? refusedAt,  ReviewBody? review,  int? unreadMessages)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _OrderBody() when $default != null:
return $default(_that.checkoutId,_that.createdAt,_that.customerName,_that.customerPhone,_that.id,_that.lines,_that.number,_that.seller,_that.status,_that.totalVnd,_that.windowEnd,_that.windowStart,_that.access,_that.cancelReason,_that.cancelledAt,_that.collectedAt,_that.messageCount,_that.readyAt,_that.refuseNote,_that.refuseReason,_that.refusedAt,_that.review,_that.unreadMessages);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String checkoutId,  DateTime createdAt,  String customerName,  String customerPhone,  String id,  List<OrderLineBody> lines,  String number,  OrderSellerBody seller,  OrderBodyStatus status,  int totalVnd,  DateTime windowEnd,  DateTime windowStart,  String? access,  String? cancelReason,  DateTime? cancelledAt,  DateTime? collectedAt,  int? messageCount,  DateTime? readyAt,  String? refuseNote,  OrderBodyRefuseReason? refuseReason,  DateTime? refusedAt,  ReviewBody? review,  int? unreadMessages)  $default,) {final _that = this;
switch (_that) {
case _OrderBody():
return $default(_that.checkoutId,_that.createdAt,_that.customerName,_that.customerPhone,_that.id,_that.lines,_that.number,_that.seller,_that.status,_that.totalVnd,_that.windowEnd,_that.windowStart,_that.access,_that.cancelReason,_that.cancelledAt,_that.collectedAt,_that.messageCount,_that.readyAt,_that.refuseNote,_that.refuseReason,_that.refusedAt,_that.review,_that.unreadMessages);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String checkoutId,  DateTime createdAt,  String customerName,  String customerPhone,  String id,  List<OrderLineBody> lines,  String number,  OrderSellerBody seller,  OrderBodyStatus status,  int totalVnd,  DateTime windowEnd,  DateTime windowStart,  String? access,  String? cancelReason,  DateTime? cancelledAt,  DateTime? collectedAt,  int? messageCount,  DateTime? readyAt,  String? refuseNote,  OrderBodyRefuseReason? refuseReason,  DateTime? refusedAt,  ReviewBody? review,  int? unreadMessages)?  $default,) {final _that = this;
switch (_that) {
case _OrderBody() when $default != null:
return $default(_that.checkoutId,_that.createdAt,_that.customerName,_that.customerPhone,_that.id,_that.lines,_that.number,_that.seller,_that.status,_that.totalVnd,_that.windowEnd,_that.windowStart,_that.access,_that.cancelReason,_that.cancelledAt,_that.collectedAt,_that.messageCount,_that.readyAt,_that.refuseNote,_that.refuseReason,_that.refusedAt,_that.review,_that.unreadMessages);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _OrderBody implements OrderBody {
  const _OrderBody({required this.checkoutId, required this.createdAt, required this.customerName, required this.customerPhone, required this.id, required  List<OrderLineBody> lines, required this.number, required this.seller, required this.status, required this.totalVnd, required this.windowEnd, required this.windowStart, this.access, this.cancelReason, this.cancelledAt, this.collectedAt, this.messageCount, this.readyAt, this.refuseNote, this.refuseReason, this.refusedAt, this.review, this.unreadMessages}): _lines = lines;
  factory _OrderBody.fromJson(Map<String, dynamic> json) => _$OrderBodyFromJson(json);

/// Shared by the orders placed together from one cart
@override final  String checkoutId;
@override final  DateTime createdAt;
/// Who collects, as given with the order
@override final  String customerName;
/// Their phone number, 0 and nine digits
@override final  String customerPhone;
@override final  String id;
 final  List<OrderLineBody> _lines;
@override List<OrderLineBody> get lines {
  if (_lines is EqualUnmodifiableListView) return _lines;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_lines);
}

/// What people read aloud, SB- and a number
@override final  String number;
/// Where the order is collected, copied when it was placed
@override final  OrderSellerBody seller;
/// expired is read from the window's end
@override final  OrderBodyStatus status;
/// Paid to the seller at the counter
@override final  int totalVnd;
@override final  DateTime windowEnd;
@override final  DateTime windowStart;
/// To its customer: proves the order is theirs without signing in, sent back as Order-Access
@override final  String? access;
@override final  String? cancelReason;
@override final  DateTime? cancelledAt;
@override final  DateTime? collectedAt;
/// Messages its chat holds, with unreadMessages; none for admins
@override final  int? messageCount;
@override final  DateTime? readyAt;
@override final  String? refuseNote;
@override final  OrderBodyRefuseReason? refuseReason;
@override final  DateTime? refusedAt;
/// The customer's rating of the collected order; none until they rate it
@override final  ReviewBody? review;
/// Messages of its chat the reader has not read: from the seller for the customer, from the customer for the seller's people; none for admins
@override final  int? unreadMessages;

/// Create a copy of OrderBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$OrderBodyCopyWith<_OrderBody> get copyWith => __$OrderBodyCopyWithImpl<_OrderBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$OrderBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _OrderBody&&(identical(other.checkoutId, checkoutId) || other.checkoutId == checkoutId)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.customerName, customerName) || other.customerName == customerName)&&(identical(other.customerPhone, customerPhone) || other.customerPhone == customerPhone)&&(identical(other.id, id) || other.id == id)&&const DeepCollectionEquality().equals(other.lines, _lines)&&(identical(other.number, number) || other.number == number)&&(identical(other.seller, seller) || other.seller == seller)&&(identical(other.status, status) || other.status == status)&&(identical(other.totalVnd, totalVnd) || other.totalVnd == totalVnd)&&(identical(other.windowEnd, windowEnd) || other.windowEnd == windowEnd)&&(identical(other.windowStart, windowStart) || other.windowStart == windowStart)&&(identical(other.access, access) || other.access == access)&&(identical(other.cancelReason, cancelReason) || other.cancelReason == cancelReason)&&(identical(other.cancelledAt, cancelledAt) || other.cancelledAt == cancelledAt)&&(identical(other.collectedAt, collectedAt) || other.collectedAt == collectedAt)&&(identical(other.messageCount, messageCount) || other.messageCount == messageCount)&&(identical(other.readyAt, readyAt) || other.readyAt == readyAt)&&(identical(other.refuseNote, refuseNote) || other.refuseNote == refuseNote)&&(identical(other.refuseReason, refuseReason) || other.refuseReason == refuseReason)&&(identical(other.refusedAt, refusedAt) || other.refusedAt == refusedAt)&&(identical(other.review, review) || other.review == review)&&(identical(other.unreadMessages, unreadMessages) || other.unreadMessages == unreadMessages));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hashAll([runtimeType,checkoutId,createdAt,customerName,customerPhone,id,const DeepCollectionEquality().hash(_lines),number,seller,status,totalVnd,windowEnd,windowStart,access,cancelReason,cancelledAt,collectedAt,messageCount,readyAt,refuseNote,refuseReason,refusedAt,review,unreadMessages]);
}

@override
String toString() {
    return 'OrderBody(checkoutId: $checkoutId, createdAt: $createdAt, customerName: $customerName, customerPhone: $customerPhone, id: $id, lines: $lines, number: $number, seller: $seller, status: $status, totalVnd: $totalVnd, windowEnd: $windowEnd, windowStart: $windowStart, access: $access, cancelReason: $cancelReason, cancelledAt: $cancelledAt, collectedAt: $collectedAt, messageCount: $messageCount, readyAt: $readyAt, refuseNote: $refuseNote, refuseReason: $refuseReason, refusedAt: $refusedAt, review: $review, unreadMessages: $unreadMessages)';
}


}

/// @nodoc
abstract mixin class _$OrderBodyCopyWith<$Res> implements $OrderBodyCopyWith<$Res> {
  factory _$OrderBodyCopyWith(_OrderBody value, $Res Function(_OrderBody) _then) = __$OrderBodyCopyWithImpl;
@override @useResult
$Res call({
 String checkoutId, DateTime createdAt, String customerName, String customerPhone, String id, List<OrderLineBody> lines, String number, OrderSellerBody seller, OrderBodyStatus status, int totalVnd, DateTime windowEnd, DateTime windowStart, String? access, String? cancelReason, DateTime? cancelledAt, DateTime? collectedAt, int? messageCount, DateTime? readyAt, String? refuseNote, OrderBodyRefuseReason? refuseReason, DateTime? refusedAt, ReviewBody? review, int? unreadMessages
});


@override $OrderSellerBodyCopyWith<$Res> get seller;@override $ReviewBodyCopyWith<$Res>? get review;

}
/// @nodoc
class __$OrderBodyCopyWithImpl<$Res>
    implements _$OrderBodyCopyWith<$Res> {
  __$OrderBodyCopyWithImpl(this._self, this._then);

  final _OrderBody _self;
  final $Res Function(_OrderBody) _then;

/// Create a copy of OrderBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? checkoutId = null,Object? createdAt = null,Object? customerName = null,Object? customerPhone = null,Object? id = null,Object? lines = null,Object? number = null,Object? seller = null,Object? status = null,Object? totalVnd = null,Object? windowEnd = null,Object? windowStart = null,Object? access = freezed,Object? cancelReason = freezed,Object? cancelledAt = freezed,Object? collectedAt = freezed,Object? messageCount = freezed,Object? readyAt = freezed,Object? refuseNote = freezed,Object? refuseReason = freezed,Object? refusedAt = freezed,Object? review = freezed,Object? unreadMessages = freezed,}) {
  return _then(_OrderBody(
checkoutId: null == checkoutId ? _self.checkoutId : checkoutId // ignore: cast_nullable_to_non_nullable
as String,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,customerName: null == customerName ? _self.customerName : customerName // ignore: cast_nullable_to_non_nullable
as String,customerPhone: null == customerPhone ? _self.customerPhone : customerPhone // ignore: cast_nullable_to_non_nullable
as String,id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,lines: null == lines ? _self._lines : lines // ignore: cast_nullable_to_non_nullable
as List<OrderLineBody>,number: null == number ? _self.number : number // ignore: cast_nullable_to_non_nullable
as String,seller: null == seller ? _self.seller : seller // ignore: cast_nullable_to_non_nullable
as OrderSellerBody,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as OrderBodyStatus,totalVnd: null == totalVnd ? _self.totalVnd : totalVnd // ignore: cast_nullable_to_non_nullable
as int,windowEnd: null == windowEnd ? _self.windowEnd : windowEnd // ignore: cast_nullable_to_non_nullable
as DateTime,windowStart: null == windowStart ? _self.windowStart : windowStart // ignore: cast_nullable_to_non_nullable
as DateTime,access: freezed == access ? _self.access : access // ignore: cast_nullable_to_non_nullable
as String?,cancelReason: freezed == cancelReason ? _self.cancelReason : cancelReason // ignore: cast_nullable_to_non_nullable
as String?,cancelledAt: freezed == cancelledAt ? _self.cancelledAt : cancelledAt // ignore: cast_nullable_to_non_nullable
as DateTime?,collectedAt: freezed == collectedAt ? _self.collectedAt : collectedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,messageCount: freezed == messageCount ? _self.messageCount : messageCount // ignore: cast_nullable_to_non_nullable
as int?,readyAt: freezed == readyAt ? _self.readyAt : readyAt // ignore: cast_nullable_to_non_nullable
as DateTime?,refuseNote: freezed == refuseNote ? _self.refuseNote : refuseNote // ignore: cast_nullable_to_non_nullable
as String?,refuseReason: freezed == refuseReason ? _self.refuseReason : refuseReason // ignore: cast_nullable_to_non_nullable
as OrderBodyRefuseReason?,refusedAt: freezed == refusedAt ? _self.refusedAt : refusedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,review: freezed == review ? _self.review : review // ignore: cast_nullable_to_non_nullable
as ReviewBody?,unreadMessages: freezed == unreadMessages ? _self.unreadMessages : unreadMessages // ignore: cast_nullable_to_non_nullable
as int?,
  ));
}

/// Create a copy of OrderBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$OrderSellerBodyCopyWith<$Res> get seller {
  
  return $OrderSellerBodyCopyWith<$Res>(_self.seller, (value) {
    return _then(_self.copyWith(seller: value));
  });
}/// Create a copy of OrderBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$ReviewBodyCopyWith<$Res>? get review {
    if (_self.review == null) {
    return null;
  }

  return $ReviewBodyCopyWith<$Res>(_self.review!, (value) {
    return _then(_self.copyWith(review: value));
  });
}
}

// dart format on
