// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'offers_summary_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$OffersSummaryBody {

/// The five offers posted last, newest first, whenever that was
 List<LatestOfferBody> get latest;/// Offers customers can order now; a blocked seller's are left out
 int get onSaleNow;/// Offers posted in the range, whatever became of them
 int get postedInRange;/// Offers posted on every day of the range, in order
 List<DayCountBody> get postedPerDay;/// Offers customers see sold out now; a blocked seller's are left out
 int get soldOutNow;/// The five sellers that posted most in the range
 List<TopSellerBody> get topSellers;/// The units those offers put up
 int get unitsPostedInRange;
/// Create a copy of OffersSummaryBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$OffersSummaryBodyCopyWith<OffersSummaryBody> get copyWith => _$OffersSummaryBodyCopyWithImpl<OffersSummaryBody>(this as OffersSummaryBody, _$identity);

  /// Serializes this OffersSummaryBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as OffersSummaryBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is OffersSummaryBody&&const DeepCollectionEquality().equals(other.latest, _this.latest)&&(identical(other.onSaleNow, _this.onSaleNow) || other.onSaleNow == _this.onSaleNow)&&(identical(other.postedInRange, _this.postedInRange) || other.postedInRange == _this.postedInRange)&&const DeepCollectionEquality().equals(other.postedPerDay, _this.postedPerDay)&&(identical(other.soldOutNow, _this.soldOutNow) || other.soldOutNow == _this.soldOutNow)&&const DeepCollectionEquality().equals(other.topSellers, _this.topSellers)&&(identical(other.unitsPostedInRange, _this.unitsPostedInRange) || other.unitsPostedInRange == _this.unitsPostedInRange));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as OffersSummaryBody;
  return Object.hash(runtimeType,const DeepCollectionEquality().hash(_this.latest),_this.onSaleNow,_this.postedInRange,const DeepCollectionEquality().hash(_this.postedPerDay),_this.soldOutNow,const DeepCollectionEquality().hash(_this.topSellers),_this.unitsPostedInRange);
}

@override
String toString() {
  final _this = this as OffersSummaryBody;
  return 'OffersSummaryBody(latest: ${_this.latest}, onSaleNow: ${_this.onSaleNow}, postedInRange: ${_this.postedInRange}, postedPerDay: ${_this.postedPerDay}, soldOutNow: ${_this.soldOutNow}, topSellers: ${_this.topSellers}, unitsPostedInRange: ${_this.unitsPostedInRange})';
}


}

/// @nodoc
abstract mixin class $OffersSummaryBodyCopyWith<$Res>  {
  factory $OffersSummaryBodyCopyWith(OffersSummaryBody value, $Res Function(OffersSummaryBody) _then) = _$OffersSummaryBodyCopyWithImpl;
@useResult
$Res call({
 List<LatestOfferBody> latest, int onSaleNow, int postedInRange, List<DayCountBody> postedPerDay, int soldOutNow, List<TopSellerBody> topSellers, int unitsPostedInRange
});




}
/// @nodoc
class _$OffersSummaryBodyCopyWithImpl<$Res>
    implements $OffersSummaryBodyCopyWith<$Res> {
  _$OffersSummaryBodyCopyWithImpl(this._self, this._then);

  final OffersSummaryBody _self;
  final $Res Function(OffersSummaryBody) _then;

/// Create a copy of OffersSummaryBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? latest = null,Object? onSaleNow = null,Object? postedInRange = null,Object? postedPerDay = null,Object? soldOutNow = null,Object? topSellers = null,Object? unitsPostedInRange = null,}) {
  return _then(OffersSummaryBody(
latest: null == latest ? _self.latest : latest // ignore: cast_nullable_to_non_nullable
as List<LatestOfferBody>,onSaleNow: null == onSaleNow ? _self.onSaleNow : onSaleNow // ignore: cast_nullable_to_non_nullable
as int,postedInRange: null == postedInRange ? _self.postedInRange : postedInRange // ignore: cast_nullable_to_non_nullable
as int,postedPerDay: null == postedPerDay ? _self.postedPerDay : postedPerDay // ignore: cast_nullable_to_non_nullable
as List<DayCountBody>,soldOutNow: null == soldOutNow ? _self.soldOutNow : soldOutNow // ignore: cast_nullable_to_non_nullable
as int,topSellers: null == topSellers ? _self.topSellers : topSellers // ignore: cast_nullable_to_non_nullable
as List<TopSellerBody>,unitsPostedInRange: null == unitsPostedInRange ? _self.unitsPostedInRange : unitsPostedInRange // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [OffersSummaryBody].
extension OffersSummaryBodyPatterns on OffersSummaryBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _OffersSummaryBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _OffersSummaryBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _OffersSummaryBody value)  $default,){
final _that = this;
switch (_that) {
case _OffersSummaryBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _OffersSummaryBody value)?  $default,){
final _that = this;
switch (_that) {
case _OffersSummaryBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( List<LatestOfferBody> latest,  int onSaleNow,  int postedInRange,  List<DayCountBody> postedPerDay,  int soldOutNow,  List<TopSellerBody> topSellers,  int unitsPostedInRange)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _OffersSummaryBody() when $default != null:
return $default(_that.latest,_that.onSaleNow,_that.postedInRange,_that.postedPerDay,_that.soldOutNow,_that.topSellers,_that.unitsPostedInRange);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( List<LatestOfferBody> latest,  int onSaleNow,  int postedInRange,  List<DayCountBody> postedPerDay,  int soldOutNow,  List<TopSellerBody> topSellers,  int unitsPostedInRange)  $default,) {final _that = this;
switch (_that) {
case _OffersSummaryBody():
return $default(_that.latest,_that.onSaleNow,_that.postedInRange,_that.postedPerDay,_that.soldOutNow,_that.topSellers,_that.unitsPostedInRange);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( List<LatestOfferBody> latest,  int onSaleNow,  int postedInRange,  List<DayCountBody> postedPerDay,  int soldOutNow,  List<TopSellerBody> topSellers,  int unitsPostedInRange)?  $default,) {final _that = this;
switch (_that) {
case _OffersSummaryBody() when $default != null:
return $default(_that.latest,_that.onSaleNow,_that.postedInRange,_that.postedPerDay,_that.soldOutNow,_that.topSellers,_that.unitsPostedInRange);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _OffersSummaryBody implements OffersSummaryBody {
  const _OffersSummaryBody({required  List<LatestOfferBody> latest, required this.onSaleNow, required this.postedInRange, required  List<DayCountBody> postedPerDay, required this.soldOutNow, required  List<TopSellerBody> topSellers, required this.unitsPostedInRange}): _latest = latest,_postedPerDay = postedPerDay,_topSellers = topSellers;
  factory _OffersSummaryBody.fromJson(Map<String, dynamic> json) => _$OffersSummaryBodyFromJson(json);

/// The five offers posted last, newest first, whenever that was
 final  List<LatestOfferBody> _latest;
/// The five offers posted last, newest first, whenever that was
@override List<LatestOfferBody> get latest {
  if (_latest is EqualUnmodifiableListView) return _latest;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_latest);
}

/// Offers customers can order now; a blocked seller's are left out
@override final  int onSaleNow;
/// Offers posted in the range, whatever became of them
@override final  int postedInRange;
/// Offers posted on every day of the range, in order
 final  List<DayCountBody> _postedPerDay;
/// Offers posted on every day of the range, in order
@override List<DayCountBody> get postedPerDay {
  if (_postedPerDay is EqualUnmodifiableListView) return _postedPerDay;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_postedPerDay);
}

/// Offers customers see sold out now; a blocked seller's are left out
@override final  int soldOutNow;
/// The five sellers that posted most in the range
 final  List<TopSellerBody> _topSellers;
/// The five sellers that posted most in the range
@override List<TopSellerBody> get topSellers {
  if (_topSellers is EqualUnmodifiableListView) return _topSellers;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_topSellers);
}

/// The units those offers put up
@override final  int unitsPostedInRange;

/// Create a copy of OffersSummaryBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$OffersSummaryBodyCopyWith<_OffersSummaryBody> get copyWith => __$OffersSummaryBodyCopyWithImpl<_OffersSummaryBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$OffersSummaryBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _OffersSummaryBody&&const DeepCollectionEquality().equals(other.latest, _latest)&&(identical(other.onSaleNow, onSaleNow) || other.onSaleNow == onSaleNow)&&(identical(other.postedInRange, postedInRange) || other.postedInRange == postedInRange)&&const DeepCollectionEquality().equals(other.postedPerDay, _postedPerDay)&&(identical(other.soldOutNow, soldOutNow) || other.soldOutNow == soldOutNow)&&const DeepCollectionEquality().equals(other.topSellers, _topSellers)&&(identical(other.unitsPostedInRange, unitsPostedInRange) || other.unitsPostedInRange == unitsPostedInRange));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,const DeepCollectionEquality().hash(_latest),onSaleNow,postedInRange,const DeepCollectionEquality().hash(_postedPerDay),soldOutNow,const DeepCollectionEquality().hash(_topSellers),unitsPostedInRange);
}

@override
String toString() {
    return 'OffersSummaryBody(latest: $latest, onSaleNow: $onSaleNow, postedInRange: $postedInRange, postedPerDay: $postedPerDay, soldOutNow: $soldOutNow, topSellers: $topSellers, unitsPostedInRange: $unitsPostedInRange)';
}


}

/// @nodoc
abstract mixin class _$OffersSummaryBodyCopyWith<$Res> implements $OffersSummaryBodyCopyWith<$Res> {
  factory _$OffersSummaryBodyCopyWith(_OffersSummaryBody value, $Res Function(_OffersSummaryBody) _then) = __$OffersSummaryBodyCopyWithImpl;
@override @useResult
$Res call({
 List<LatestOfferBody> latest, int onSaleNow, int postedInRange, List<DayCountBody> postedPerDay, int soldOutNow, List<TopSellerBody> topSellers, int unitsPostedInRange
});




}
/// @nodoc
class __$OffersSummaryBodyCopyWithImpl<$Res>
    implements _$OffersSummaryBodyCopyWith<$Res> {
  __$OffersSummaryBodyCopyWithImpl(this._self, this._then);

  final _OffersSummaryBody _self;
  final $Res Function(_OffersSummaryBody) _then;

/// Create a copy of OffersSummaryBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? latest = null,Object? onSaleNow = null,Object? postedInRange = null,Object? postedPerDay = null,Object? soldOutNow = null,Object? topSellers = null,Object? unitsPostedInRange = null,}) {
  return _then(_OffersSummaryBody(
latest: null == latest ? _self._latest : latest // ignore: cast_nullable_to_non_nullable
as List<LatestOfferBody>,onSaleNow: null == onSaleNow ? _self.onSaleNow : onSaleNow // ignore: cast_nullable_to_non_nullable
as int,postedInRange: null == postedInRange ? _self.postedInRange : postedInRange // ignore: cast_nullable_to_non_nullable
as int,postedPerDay: null == postedPerDay ? _self._postedPerDay : postedPerDay // ignore: cast_nullable_to_non_nullable
as List<DayCountBody>,soldOutNow: null == soldOutNow ? _self.soldOutNow : soldOutNow // ignore: cast_nullable_to_non_nullable
as int,topSellers: null == topSellers ? _self._topSellers : topSellers // ignore: cast_nullable_to_non_nullable
as List<TopSellerBody>,unitsPostedInRange: null == unitsPostedInRange ? _self.unitsPostedInRange : unitsPostedInRange // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
