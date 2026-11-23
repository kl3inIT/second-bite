// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'counts_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$CountsBody {

 int get cancelled; int get collected;/// Collected orders whose customer confirmed the collection, the store not having handed them over first
 int get collectedByCustomer;/// What the collected orders came to at the counter
 int get collectedVnd;/// Collected orders that took a discount
 int get discountOrders;/// The discounts Second Bite paid back on the collected orders
 int get discountVnd;/// Orders the customer did not come for
 int get expired;/// Grams of the units collected whose dish gives a weight
 int get gramsCollected;/// Orders, however they ended
 int get held;/// Opens of the home; none for a store
 int get homeViews;/// Accounts created, the site's whatever store is chosen; none on a store's numbers
 int get newAccounts;/// Customers whose first order, by phone number, is collected then; the site's, as newAccounts
 int get newCustomers;/// Offers posted for the day
 int get offers;/// What the collected orders' dishes cost at their original price
 int get originalVnd;/// Browsers that opened them, each counted once a day
 int get people;/// Opens the poster's code brought (utm_source=qr)
 int get qrViews; int get refused; int get unitsCollected; int get unitsHeld; int get unitsPosted;/// The units collected whose dish gives a weight
 int get unitsWeighed;/// Pages opened
 int get views;
/// Create a copy of CountsBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$CountsBodyCopyWith<CountsBody> get copyWith => _$CountsBodyCopyWithImpl<CountsBody>(this as CountsBody, _$identity);

  /// Serializes this CountsBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as CountsBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is CountsBody&&(identical(other.cancelled, _this.cancelled) || other.cancelled == _this.cancelled)&&(identical(other.collected, _this.collected) || other.collected == _this.collected)&&(identical(other.collectedByCustomer, _this.collectedByCustomer) || other.collectedByCustomer == _this.collectedByCustomer)&&(identical(other.collectedVnd, _this.collectedVnd) || other.collectedVnd == _this.collectedVnd)&&(identical(other.discountOrders, _this.discountOrders) || other.discountOrders == _this.discountOrders)&&(identical(other.discountVnd, _this.discountVnd) || other.discountVnd == _this.discountVnd)&&(identical(other.expired, _this.expired) || other.expired == _this.expired)&&(identical(other.gramsCollected, _this.gramsCollected) || other.gramsCollected == _this.gramsCollected)&&(identical(other.held, _this.held) || other.held == _this.held)&&(identical(other.homeViews, _this.homeViews) || other.homeViews == _this.homeViews)&&(identical(other.newAccounts, _this.newAccounts) || other.newAccounts == _this.newAccounts)&&(identical(other.newCustomers, _this.newCustomers) || other.newCustomers == _this.newCustomers)&&(identical(other.offers, _this.offers) || other.offers == _this.offers)&&(identical(other.originalVnd, _this.originalVnd) || other.originalVnd == _this.originalVnd)&&(identical(other.people, _this.people) || other.people == _this.people)&&(identical(other.qrViews, _this.qrViews) || other.qrViews == _this.qrViews)&&(identical(other.refused, _this.refused) || other.refused == _this.refused)&&(identical(other.unitsCollected, _this.unitsCollected) || other.unitsCollected == _this.unitsCollected)&&(identical(other.unitsHeld, _this.unitsHeld) || other.unitsHeld == _this.unitsHeld)&&(identical(other.unitsPosted, _this.unitsPosted) || other.unitsPosted == _this.unitsPosted)&&(identical(other.unitsWeighed, _this.unitsWeighed) || other.unitsWeighed == _this.unitsWeighed)&&(identical(other.views, _this.views) || other.views == _this.views));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as CountsBody;
  return Object.hashAll([runtimeType,_this.cancelled,_this.collected,_this.collectedByCustomer,_this.collectedVnd,_this.discountOrders,_this.discountVnd,_this.expired,_this.gramsCollected,_this.held,_this.homeViews,_this.newAccounts,_this.newCustomers,_this.offers,_this.originalVnd,_this.people,_this.qrViews,_this.refused,_this.unitsCollected,_this.unitsHeld,_this.unitsPosted,_this.unitsWeighed,_this.views]);
}

@override
String toString() {
  final _this = this as CountsBody;
  return 'CountsBody(cancelled: ${_this.cancelled}, collected: ${_this.collected}, collectedByCustomer: ${_this.collectedByCustomer}, collectedVnd: ${_this.collectedVnd}, discountOrders: ${_this.discountOrders}, discountVnd: ${_this.discountVnd}, expired: ${_this.expired}, gramsCollected: ${_this.gramsCollected}, held: ${_this.held}, homeViews: ${_this.homeViews}, newAccounts: ${_this.newAccounts}, newCustomers: ${_this.newCustomers}, offers: ${_this.offers}, originalVnd: ${_this.originalVnd}, people: ${_this.people}, qrViews: ${_this.qrViews}, refused: ${_this.refused}, unitsCollected: ${_this.unitsCollected}, unitsHeld: ${_this.unitsHeld}, unitsPosted: ${_this.unitsPosted}, unitsWeighed: ${_this.unitsWeighed}, views: ${_this.views})';
}


}

/// @nodoc
abstract mixin class $CountsBodyCopyWith<$Res>  {
  factory $CountsBodyCopyWith(CountsBody value, $Res Function(CountsBody) _then) = _$CountsBodyCopyWithImpl;
@useResult
$Res call({
 int cancelled, int collected, int collectedByCustomer, int collectedVnd, int discountOrders, int discountVnd, int expired, int gramsCollected, int held, int homeViews, int newAccounts, int newCustomers, int offers, int originalVnd, int people, int qrViews, int refused, int unitsCollected, int unitsHeld, int unitsPosted, int unitsWeighed, int views
});




}
/// @nodoc
class _$CountsBodyCopyWithImpl<$Res>
    implements $CountsBodyCopyWith<$Res> {
  _$CountsBodyCopyWithImpl(this._self, this._then);

  final CountsBody _self;
  final $Res Function(CountsBody) _then;

/// Create a copy of CountsBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? cancelled = null,Object? collected = null,Object? collectedByCustomer = null,Object? collectedVnd = null,Object? discountOrders = null,Object? discountVnd = null,Object? expired = null,Object? gramsCollected = null,Object? held = null,Object? homeViews = null,Object? newAccounts = null,Object? newCustomers = null,Object? offers = null,Object? originalVnd = null,Object? people = null,Object? qrViews = null,Object? refused = null,Object? unitsCollected = null,Object? unitsHeld = null,Object? unitsPosted = null,Object? unitsWeighed = null,Object? views = null,}) {
  return _then(CountsBody(
cancelled: null == cancelled ? _self.cancelled : cancelled // ignore: cast_nullable_to_non_nullable
as int,collected: null == collected ? _self.collected : collected // ignore: cast_nullable_to_non_nullable
as int,collectedByCustomer: null == collectedByCustomer ? _self.collectedByCustomer : collectedByCustomer // ignore: cast_nullable_to_non_nullable
as int,collectedVnd: null == collectedVnd ? _self.collectedVnd : collectedVnd // ignore: cast_nullable_to_non_nullable
as int,discountOrders: null == discountOrders ? _self.discountOrders : discountOrders // ignore: cast_nullable_to_non_nullable
as int,discountVnd: null == discountVnd ? _self.discountVnd : discountVnd // ignore: cast_nullable_to_non_nullable
as int,expired: null == expired ? _self.expired : expired // ignore: cast_nullable_to_non_nullable
as int,gramsCollected: null == gramsCollected ? _self.gramsCollected : gramsCollected // ignore: cast_nullable_to_non_nullable
as int,held: null == held ? _self.held : held // ignore: cast_nullable_to_non_nullable
as int,homeViews: null == homeViews ? _self.homeViews : homeViews // ignore: cast_nullable_to_non_nullable
as int,newAccounts: null == newAccounts ? _self.newAccounts : newAccounts // ignore: cast_nullable_to_non_nullable
as int,newCustomers: null == newCustomers ? _self.newCustomers : newCustomers // ignore: cast_nullable_to_non_nullable
as int,offers: null == offers ? _self.offers : offers // ignore: cast_nullable_to_non_nullable
as int,originalVnd: null == originalVnd ? _self.originalVnd : originalVnd // ignore: cast_nullable_to_non_nullable
as int,people: null == people ? _self.people : people // ignore: cast_nullable_to_non_nullable
as int,qrViews: null == qrViews ? _self.qrViews : qrViews // ignore: cast_nullable_to_non_nullable
as int,refused: null == refused ? _self.refused : refused // ignore: cast_nullable_to_non_nullable
as int,unitsCollected: null == unitsCollected ? _self.unitsCollected : unitsCollected // ignore: cast_nullable_to_non_nullable
as int,unitsHeld: null == unitsHeld ? _self.unitsHeld : unitsHeld // ignore: cast_nullable_to_non_nullable
as int,unitsPosted: null == unitsPosted ? _self.unitsPosted : unitsPosted // ignore: cast_nullable_to_non_nullable
as int,unitsWeighed: null == unitsWeighed ? _self.unitsWeighed : unitsWeighed // ignore: cast_nullable_to_non_nullable
as int,views: null == views ? _self.views : views // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [CountsBody].
extension CountsBodyPatterns on CountsBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _CountsBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _CountsBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _CountsBody value)  $default,){
final _that = this;
switch (_that) {
case _CountsBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _CountsBody value)?  $default,){
final _that = this;
switch (_that) {
case _CountsBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int cancelled,  int collected,  int collectedByCustomer,  int collectedVnd,  int discountOrders,  int discountVnd,  int expired,  int gramsCollected,  int held,  int homeViews,  int newAccounts,  int newCustomers,  int offers,  int originalVnd,  int people,  int qrViews,  int refused,  int unitsCollected,  int unitsHeld,  int unitsPosted,  int unitsWeighed,  int views)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _CountsBody() when $default != null:
return $default(_that.cancelled,_that.collected,_that.collectedByCustomer,_that.collectedVnd,_that.discountOrders,_that.discountVnd,_that.expired,_that.gramsCollected,_that.held,_that.homeViews,_that.newAccounts,_that.newCustomers,_that.offers,_that.originalVnd,_that.people,_that.qrViews,_that.refused,_that.unitsCollected,_that.unitsHeld,_that.unitsPosted,_that.unitsWeighed,_that.views);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int cancelled,  int collected,  int collectedByCustomer,  int collectedVnd,  int discountOrders,  int discountVnd,  int expired,  int gramsCollected,  int held,  int homeViews,  int newAccounts,  int newCustomers,  int offers,  int originalVnd,  int people,  int qrViews,  int refused,  int unitsCollected,  int unitsHeld,  int unitsPosted,  int unitsWeighed,  int views)  $default,) {final _that = this;
switch (_that) {
case _CountsBody():
return $default(_that.cancelled,_that.collected,_that.collectedByCustomer,_that.collectedVnd,_that.discountOrders,_that.discountVnd,_that.expired,_that.gramsCollected,_that.held,_that.homeViews,_that.newAccounts,_that.newCustomers,_that.offers,_that.originalVnd,_that.people,_that.qrViews,_that.refused,_that.unitsCollected,_that.unitsHeld,_that.unitsPosted,_that.unitsWeighed,_that.views);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int cancelled,  int collected,  int collectedByCustomer,  int collectedVnd,  int discountOrders,  int discountVnd,  int expired,  int gramsCollected,  int held,  int homeViews,  int newAccounts,  int newCustomers,  int offers,  int originalVnd,  int people,  int qrViews,  int refused,  int unitsCollected,  int unitsHeld,  int unitsPosted,  int unitsWeighed,  int views)?  $default,) {final _that = this;
switch (_that) {
case _CountsBody() when $default != null:
return $default(_that.cancelled,_that.collected,_that.collectedByCustomer,_that.collectedVnd,_that.discountOrders,_that.discountVnd,_that.expired,_that.gramsCollected,_that.held,_that.homeViews,_that.newAccounts,_that.newCustomers,_that.offers,_that.originalVnd,_that.people,_that.qrViews,_that.refused,_that.unitsCollected,_that.unitsHeld,_that.unitsPosted,_that.unitsWeighed,_that.views);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _CountsBody implements CountsBody {
  const _CountsBody({required this.cancelled, required this.collected, required this.collectedByCustomer, required this.collectedVnd, required this.discountOrders, required this.discountVnd, required this.expired, required this.gramsCollected, required this.held, required this.homeViews, required this.newAccounts, required this.newCustomers, required this.offers, required this.originalVnd, required this.people, required this.qrViews, required this.refused, required this.unitsCollected, required this.unitsHeld, required this.unitsPosted, required this.unitsWeighed, required this.views});
  factory _CountsBody.fromJson(Map<String, dynamic> json) => _$CountsBodyFromJson(json);

@override final  int cancelled;
@override final  int collected;
/// Collected orders whose customer confirmed the collection, the store not having handed them over first
@override final  int collectedByCustomer;
/// What the collected orders came to at the counter
@override final  int collectedVnd;
/// Collected orders that took a discount
@override final  int discountOrders;
/// The discounts Second Bite paid back on the collected orders
@override final  int discountVnd;
/// Orders the customer did not come for
@override final  int expired;
/// Grams of the units collected whose dish gives a weight
@override final  int gramsCollected;
/// Orders, however they ended
@override final  int held;
/// Opens of the home; none for a store
@override final  int homeViews;
/// Accounts created, the site's whatever store is chosen; none on a store's numbers
@override final  int newAccounts;
/// Customers whose first order, by phone number, is collected then; the site's, as newAccounts
@override final  int newCustomers;
/// Offers posted for the day
@override final  int offers;
/// What the collected orders' dishes cost at their original price
@override final  int originalVnd;
/// Browsers that opened them, each counted once a day
@override final  int people;
/// Opens the poster's code brought (utm_source=qr)
@override final  int qrViews;
@override final  int refused;
@override final  int unitsCollected;
@override final  int unitsHeld;
@override final  int unitsPosted;
/// The units collected whose dish gives a weight
@override final  int unitsWeighed;
/// Pages opened
@override final  int views;

/// Create a copy of CountsBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$CountsBodyCopyWith<_CountsBody> get copyWith => __$CountsBodyCopyWithImpl<_CountsBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$CountsBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _CountsBody&&(identical(other.cancelled, cancelled) || other.cancelled == cancelled)&&(identical(other.collected, collected) || other.collected == collected)&&(identical(other.collectedByCustomer, collectedByCustomer) || other.collectedByCustomer == collectedByCustomer)&&(identical(other.collectedVnd, collectedVnd) || other.collectedVnd == collectedVnd)&&(identical(other.discountOrders, discountOrders) || other.discountOrders == discountOrders)&&(identical(other.discountVnd, discountVnd) || other.discountVnd == discountVnd)&&(identical(other.expired, expired) || other.expired == expired)&&(identical(other.gramsCollected, gramsCollected) || other.gramsCollected == gramsCollected)&&(identical(other.held, held) || other.held == held)&&(identical(other.homeViews, homeViews) || other.homeViews == homeViews)&&(identical(other.newAccounts, newAccounts) || other.newAccounts == newAccounts)&&(identical(other.newCustomers, newCustomers) || other.newCustomers == newCustomers)&&(identical(other.offers, offers) || other.offers == offers)&&(identical(other.originalVnd, originalVnd) || other.originalVnd == originalVnd)&&(identical(other.people, people) || other.people == people)&&(identical(other.qrViews, qrViews) || other.qrViews == qrViews)&&(identical(other.refused, refused) || other.refused == refused)&&(identical(other.unitsCollected, unitsCollected) || other.unitsCollected == unitsCollected)&&(identical(other.unitsHeld, unitsHeld) || other.unitsHeld == unitsHeld)&&(identical(other.unitsPosted, unitsPosted) || other.unitsPosted == unitsPosted)&&(identical(other.unitsWeighed, unitsWeighed) || other.unitsWeighed == unitsWeighed)&&(identical(other.views, views) || other.views == views));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hashAll([runtimeType,cancelled,collected,collectedByCustomer,collectedVnd,discountOrders,discountVnd,expired,gramsCollected,held,homeViews,newAccounts,newCustomers,offers,originalVnd,people,qrViews,refused,unitsCollected,unitsHeld,unitsPosted,unitsWeighed,views]);
}

@override
String toString() {
    return 'CountsBody(cancelled: $cancelled, collected: $collected, collectedByCustomer: $collectedByCustomer, collectedVnd: $collectedVnd, discountOrders: $discountOrders, discountVnd: $discountVnd, expired: $expired, gramsCollected: $gramsCollected, held: $held, homeViews: $homeViews, newAccounts: $newAccounts, newCustomers: $newCustomers, offers: $offers, originalVnd: $originalVnd, people: $people, qrViews: $qrViews, refused: $refused, unitsCollected: $unitsCollected, unitsHeld: $unitsHeld, unitsPosted: $unitsPosted, unitsWeighed: $unitsWeighed, views: $views)';
}


}

/// @nodoc
abstract mixin class _$CountsBodyCopyWith<$Res> implements $CountsBodyCopyWith<$Res> {
  factory _$CountsBodyCopyWith(_CountsBody value, $Res Function(_CountsBody) _then) = __$CountsBodyCopyWithImpl;
@override @useResult
$Res call({
 int cancelled, int collected, int collectedByCustomer, int collectedVnd, int discountOrders, int discountVnd, int expired, int gramsCollected, int held, int homeViews, int newAccounts, int newCustomers, int offers, int originalVnd, int people, int qrViews, int refused, int unitsCollected, int unitsHeld, int unitsPosted, int unitsWeighed, int views
});




}
/// @nodoc
class __$CountsBodyCopyWithImpl<$Res>
    implements _$CountsBodyCopyWith<$Res> {
  __$CountsBodyCopyWithImpl(this._self, this._then);

  final _CountsBody _self;
  final $Res Function(_CountsBody) _then;

/// Create a copy of CountsBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? cancelled = null,Object? collected = null,Object? collectedByCustomer = null,Object? collectedVnd = null,Object? discountOrders = null,Object? discountVnd = null,Object? expired = null,Object? gramsCollected = null,Object? held = null,Object? homeViews = null,Object? newAccounts = null,Object? newCustomers = null,Object? offers = null,Object? originalVnd = null,Object? people = null,Object? qrViews = null,Object? refused = null,Object? unitsCollected = null,Object? unitsHeld = null,Object? unitsPosted = null,Object? unitsWeighed = null,Object? views = null,}) {
  return _then(_CountsBody(
cancelled: null == cancelled ? _self.cancelled : cancelled // ignore: cast_nullable_to_non_nullable
as int,collected: null == collected ? _self.collected : collected // ignore: cast_nullable_to_non_nullable
as int,collectedByCustomer: null == collectedByCustomer ? _self.collectedByCustomer : collectedByCustomer // ignore: cast_nullable_to_non_nullable
as int,collectedVnd: null == collectedVnd ? _self.collectedVnd : collectedVnd // ignore: cast_nullable_to_non_nullable
as int,discountOrders: null == discountOrders ? _self.discountOrders : discountOrders // ignore: cast_nullable_to_non_nullable
as int,discountVnd: null == discountVnd ? _self.discountVnd : discountVnd // ignore: cast_nullable_to_non_nullable
as int,expired: null == expired ? _self.expired : expired // ignore: cast_nullable_to_non_nullable
as int,gramsCollected: null == gramsCollected ? _self.gramsCollected : gramsCollected // ignore: cast_nullable_to_non_nullable
as int,held: null == held ? _self.held : held // ignore: cast_nullable_to_non_nullable
as int,homeViews: null == homeViews ? _self.homeViews : homeViews // ignore: cast_nullable_to_non_nullable
as int,newAccounts: null == newAccounts ? _self.newAccounts : newAccounts // ignore: cast_nullable_to_non_nullable
as int,newCustomers: null == newCustomers ? _self.newCustomers : newCustomers // ignore: cast_nullable_to_non_nullable
as int,offers: null == offers ? _self.offers : offers // ignore: cast_nullable_to_non_nullable
as int,originalVnd: null == originalVnd ? _self.originalVnd : originalVnd // ignore: cast_nullable_to_non_nullable
as int,people: null == people ? _self.people : people // ignore: cast_nullable_to_non_nullable
as int,qrViews: null == qrViews ? _self.qrViews : qrViews // ignore: cast_nullable_to_non_nullable
as int,refused: null == refused ? _self.refused : refused // ignore: cast_nullable_to_non_nullable
as int,unitsCollected: null == unitsCollected ? _self.unitsCollected : unitsCollected // ignore: cast_nullable_to_non_nullable
as int,unitsHeld: null == unitsHeld ? _self.unitsHeld : unitsHeld // ignore: cast_nullable_to_non_nullable
as int,unitsPosted: null == unitsPosted ? _self.unitsPosted : unitsPosted // ignore: cast_nullable_to_non_nullable
as int,unitsWeighed: null == unitsWeighed ? _self.unitsWeighed : unitsWeighed // ignore: cast_nullable_to_non_nullable
as int,views: null == views ? _self.views : views // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
