// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'offer_units_output_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$OfferUnitsOutputBody {

/// Units handed over
 int get collected;/// Orders handed over that hold them
 int get collectedOrders;/// Units of orders still to collect, their window not over
 int get held;/// Orders still to collect that hold them
 int get heldOrders;/// Units nobody holds: units_left of the offers
 int get left;/// Of left, those on offers closed, withdrawn or whose window is over
 int get leftover;/// Units of orders ended without a hand-over that did not come back: expired, or refused for anything but the customer not coming
 int get missed;/// Orders that lost them
 int get missedOrders;/// Their units
 int get posted;/// Offers matching the filters
 int get posts;
/// Create a copy of OfferUnitsOutputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$OfferUnitsOutputBodyCopyWith<OfferUnitsOutputBody> get copyWith => _$OfferUnitsOutputBodyCopyWithImpl<OfferUnitsOutputBody>(this as OfferUnitsOutputBody, _$identity);

  /// Serializes this OfferUnitsOutputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as OfferUnitsOutputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is OfferUnitsOutputBody&&(identical(other.collected, _this.collected) || other.collected == _this.collected)&&(identical(other.collectedOrders, _this.collectedOrders) || other.collectedOrders == _this.collectedOrders)&&(identical(other.held, _this.held) || other.held == _this.held)&&(identical(other.heldOrders, _this.heldOrders) || other.heldOrders == _this.heldOrders)&&(identical(other.left, _this.left) || other.left == _this.left)&&(identical(other.leftover, _this.leftover) || other.leftover == _this.leftover)&&(identical(other.missed, _this.missed) || other.missed == _this.missed)&&(identical(other.missedOrders, _this.missedOrders) || other.missedOrders == _this.missedOrders)&&(identical(other.posted, _this.posted) || other.posted == _this.posted)&&(identical(other.posts, _this.posts) || other.posts == _this.posts));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as OfferUnitsOutputBody;
  return Object.hash(runtimeType,_this.collected,_this.collectedOrders,_this.held,_this.heldOrders,_this.left,_this.leftover,_this.missed,_this.missedOrders,_this.posted,_this.posts);
}

@override
String toString() {
  final _this = this as OfferUnitsOutputBody;
  return 'OfferUnitsOutputBody(collected: ${_this.collected}, collectedOrders: ${_this.collectedOrders}, held: ${_this.held}, heldOrders: ${_this.heldOrders}, left: ${_this.left}, leftover: ${_this.leftover}, missed: ${_this.missed}, missedOrders: ${_this.missedOrders}, posted: ${_this.posted}, posts: ${_this.posts})';
}


}

/// @nodoc
abstract mixin class $OfferUnitsOutputBodyCopyWith<$Res>  {
  factory $OfferUnitsOutputBodyCopyWith(OfferUnitsOutputBody value, $Res Function(OfferUnitsOutputBody) _then) = _$OfferUnitsOutputBodyCopyWithImpl;
@useResult
$Res call({
 int collected, int collectedOrders, int held, int heldOrders, int left, int leftover, int missed, int missedOrders, int posted, int posts
});




}
/// @nodoc
class _$OfferUnitsOutputBodyCopyWithImpl<$Res>
    implements $OfferUnitsOutputBodyCopyWith<$Res> {
  _$OfferUnitsOutputBodyCopyWithImpl(this._self, this._then);

  final OfferUnitsOutputBody _self;
  final $Res Function(OfferUnitsOutputBody) _then;

/// Create a copy of OfferUnitsOutputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? collected = null,Object? collectedOrders = null,Object? held = null,Object? heldOrders = null,Object? left = null,Object? leftover = null,Object? missed = null,Object? missedOrders = null,Object? posted = null,Object? posts = null,}) {
  return _then(OfferUnitsOutputBody(
collected: null == collected ? _self.collected : collected // ignore: cast_nullable_to_non_nullable
as int,collectedOrders: null == collectedOrders ? _self.collectedOrders : collectedOrders // ignore: cast_nullable_to_non_nullable
as int,held: null == held ? _self.held : held // ignore: cast_nullable_to_non_nullable
as int,heldOrders: null == heldOrders ? _self.heldOrders : heldOrders // ignore: cast_nullable_to_non_nullable
as int,left: null == left ? _self.left : left // ignore: cast_nullable_to_non_nullable
as int,leftover: null == leftover ? _self.leftover : leftover // ignore: cast_nullable_to_non_nullable
as int,missed: null == missed ? _self.missed : missed // ignore: cast_nullable_to_non_nullable
as int,missedOrders: null == missedOrders ? _self.missedOrders : missedOrders // ignore: cast_nullable_to_non_nullable
as int,posted: null == posted ? _self.posted : posted // ignore: cast_nullable_to_non_nullable
as int,posts: null == posts ? _self.posts : posts // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [OfferUnitsOutputBody].
extension OfferUnitsOutputBodyPatterns on OfferUnitsOutputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _OfferUnitsOutputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _OfferUnitsOutputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _OfferUnitsOutputBody value)  $default,){
final _that = this;
switch (_that) {
case _OfferUnitsOutputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _OfferUnitsOutputBody value)?  $default,){
final _that = this;
switch (_that) {
case _OfferUnitsOutputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int collected,  int collectedOrders,  int held,  int heldOrders,  int left,  int leftover,  int missed,  int missedOrders,  int posted,  int posts)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _OfferUnitsOutputBody() when $default != null:
return $default(_that.collected,_that.collectedOrders,_that.held,_that.heldOrders,_that.left,_that.leftover,_that.missed,_that.missedOrders,_that.posted,_that.posts);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int collected,  int collectedOrders,  int held,  int heldOrders,  int left,  int leftover,  int missed,  int missedOrders,  int posted,  int posts)  $default,) {final _that = this;
switch (_that) {
case _OfferUnitsOutputBody():
return $default(_that.collected,_that.collectedOrders,_that.held,_that.heldOrders,_that.left,_that.leftover,_that.missed,_that.missedOrders,_that.posted,_that.posts);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int collected,  int collectedOrders,  int held,  int heldOrders,  int left,  int leftover,  int missed,  int missedOrders,  int posted,  int posts)?  $default,) {final _that = this;
switch (_that) {
case _OfferUnitsOutputBody() when $default != null:
return $default(_that.collected,_that.collectedOrders,_that.held,_that.heldOrders,_that.left,_that.leftover,_that.missed,_that.missedOrders,_that.posted,_that.posts);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _OfferUnitsOutputBody implements OfferUnitsOutputBody {
  const _OfferUnitsOutputBody({required this.collected, required this.collectedOrders, required this.held, required this.heldOrders, required this.left, required this.leftover, required this.missed, required this.missedOrders, required this.posted, required this.posts});
  factory _OfferUnitsOutputBody.fromJson(Map<String, dynamic> json) => _$OfferUnitsOutputBodyFromJson(json);

/// Units handed over
@override final  int collected;
/// Orders handed over that hold them
@override final  int collectedOrders;
/// Units of orders still to collect, their window not over
@override final  int held;
/// Orders still to collect that hold them
@override final  int heldOrders;
/// Units nobody holds: units_left of the offers
@override final  int left;
/// Of left, those on offers closed, withdrawn or whose window is over
@override final  int leftover;
/// Units of orders ended without a hand-over that did not come back: expired, or refused for anything but the customer not coming
@override final  int missed;
/// Orders that lost them
@override final  int missedOrders;
/// Their units
@override final  int posted;
/// Offers matching the filters
@override final  int posts;

/// Create a copy of OfferUnitsOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$OfferUnitsOutputBodyCopyWith<_OfferUnitsOutputBody> get copyWith => __$OfferUnitsOutputBodyCopyWithImpl<_OfferUnitsOutputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$OfferUnitsOutputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _OfferUnitsOutputBody&&(identical(other.collected, collected) || other.collected == collected)&&(identical(other.collectedOrders, collectedOrders) || other.collectedOrders == collectedOrders)&&(identical(other.held, held) || other.held == held)&&(identical(other.heldOrders, heldOrders) || other.heldOrders == heldOrders)&&(identical(other.left, left) || other.left == left)&&(identical(other.leftover, leftover) || other.leftover == leftover)&&(identical(other.missed, missed) || other.missed == missed)&&(identical(other.missedOrders, missedOrders) || other.missedOrders == missedOrders)&&(identical(other.posted, posted) || other.posted == posted)&&(identical(other.posts, posts) || other.posts == posts));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,collected,collectedOrders,held,heldOrders,left,leftover,missed,missedOrders,posted,posts);
}

@override
String toString() {
    return 'OfferUnitsOutputBody(collected: $collected, collectedOrders: $collectedOrders, held: $held, heldOrders: $heldOrders, left: $left, leftover: $leftover, missed: $missed, missedOrders: $missedOrders, posted: $posted, posts: $posts)';
}


}

/// @nodoc
abstract mixin class _$OfferUnitsOutputBodyCopyWith<$Res> implements $OfferUnitsOutputBodyCopyWith<$Res> {
  factory _$OfferUnitsOutputBodyCopyWith(_OfferUnitsOutputBody value, $Res Function(_OfferUnitsOutputBody) _then) = __$OfferUnitsOutputBodyCopyWithImpl;
@override @useResult
$Res call({
 int collected, int collectedOrders, int held, int heldOrders, int left, int leftover, int missed, int missedOrders, int posted, int posts
});




}
/// @nodoc
class __$OfferUnitsOutputBodyCopyWithImpl<$Res>
    implements _$OfferUnitsOutputBodyCopyWith<$Res> {
  __$OfferUnitsOutputBodyCopyWithImpl(this._self, this._then);

  final _OfferUnitsOutputBody _self;
  final $Res Function(_OfferUnitsOutputBody) _then;

/// Create a copy of OfferUnitsOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? collected = null,Object? collectedOrders = null,Object? held = null,Object? heldOrders = null,Object? left = null,Object? leftover = null,Object? missed = null,Object? missedOrders = null,Object? posted = null,Object? posts = null,}) {
  return _then(_OfferUnitsOutputBody(
collected: null == collected ? _self.collected : collected // ignore: cast_nullable_to_non_nullable
as int,collectedOrders: null == collectedOrders ? _self.collectedOrders : collectedOrders // ignore: cast_nullable_to_non_nullable
as int,held: null == held ? _self.held : held // ignore: cast_nullable_to_non_nullable
as int,heldOrders: null == heldOrders ? _self.heldOrders : heldOrders // ignore: cast_nullable_to_non_nullable
as int,left: null == left ? _self.left : left // ignore: cast_nullable_to_non_nullable
as int,leftover: null == leftover ? _self.leftover : leftover // ignore: cast_nullable_to_non_nullable
as int,missed: null == missed ? _self.missed : missed // ignore: cast_nullable_to_non_nullable
as int,missedOrders: null == missedOrders ? _self.missedOrders : missedOrders // ignore: cast_nullable_to_non_nullable
as int,posted: null == posted ? _self.posted : posted // ignore: cast_nullable_to_non_nullable
as int,posts: null == posts ? _self.posts : posts // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
