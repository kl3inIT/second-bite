// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'analysis_output_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$AnalysisOutputBody {

/// The same by discount band, from food given away to the smallest discount
 List<AnalysisDiscountBody> get discounts;/// The orders not collected by ending: cancelled, expired, or refused_ and the reason; the most first
 List<AnalysisCountBody> get failures;/// The portions posted and collected by kind of dish, the most posted first
 List<AnalysisKindBody> get kinds;/// How long before the window opened the orders were placed
 LeadTimesStruct get leadTimes;/// The orders reported for each kind of problem
 List<AnalysisCountBody> get problems;/// How long the posts took from posting to their last unit ordered
 SellOutStruct get sellOut; DateTime get since;/// The orders by weekday and hour of their window's start
 List<AnalysisSlotBody> get slots;/// The views by utm_source, empty for none; the site's whatever store is chosen
 List<AnalysisCountBody> get sources;/// The reviews praising each tag
 List<AnalysisCountBody> get tags;/// The five ended dishes with the most portions not collected
 List<AnalysisDishBody> get topLeftover;/// The five dishes most collected
 List<AnalysisDishBody> get topSold; DateTime get until;/// The customers by orders handed over: 1, 2, and 3 for three or more
 List<AnalysisCountBody> get visits;
/// Create a copy of AnalysisOutputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AnalysisOutputBodyCopyWith<AnalysisOutputBody> get copyWith => _$AnalysisOutputBodyCopyWithImpl<AnalysisOutputBody>(this as AnalysisOutputBody, _$identity);

  /// Serializes this AnalysisOutputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as AnalysisOutputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AnalysisOutputBody&&const DeepCollectionEquality().equals(other.discounts, _this.discounts)&&const DeepCollectionEquality().equals(other.failures, _this.failures)&&const DeepCollectionEquality().equals(other.kinds, _this.kinds)&&(identical(other.leadTimes, _this.leadTimes) || other.leadTimes == _this.leadTimes)&&const DeepCollectionEquality().equals(other.problems, _this.problems)&&(identical(other.sellOut, _this.sellOut) || other.sellOut == _this.sellOut)&&(identical(other.since, _this.since) || other.since == _this.since)&&const DeepCollectionEquality().equals(other.slots, _this.slots)&&const DeepCollectionEquality().equals(other.sources, _this.sources)&&const DeepCollectionEquality().equals(other.tags, _this.tags)&&const DeepCollectionEquality().equals(other.topLeftover, _this.topLeftover)&&const DeepCollectionEquality().equals(other.topSold, _this.topSold)&&(identical(other.until, _this.until) || other.until == _this.until)&&const DeepCollectionEquality().equals(other.visits, _this.visits));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as AnalysisOutputBody;
  return Object.hash(runtimeType,const DeepCollectionEquality().hash(_this.discounts),const DeepCollectionEquality().hash(_this.failures),const DeepCollectionEquality().hash(_this.kinds),_this.leadTimes,const DeepCollectionEquality().hash(_this.problems),_this.sellOut,_this.since,const DeepCollectionEquality().hash(_this.slots),const DeepCollectionEquality().hash(_this.sources),const DeepCollectionEquality().hash(_this.tags),const DeepCollectionEquality().hash(_this.topLeftover),const DeepCollectionEquality().hash(_this.topSold),_this.until,const DeepCollectionEquality().hash(_this.visits));
}

@override
String toString() {
  final _this = this as AnalysisOutputBody;
  return 'AnalysisOutputBody(discounts: ${_this.discounts}, failures: ${_this.failures}, kinds: ${_this.kinds}, leadTimes: ${_this.leadTimes}, problems: ${_this.problems}, sellOut: ${_this.sellOut}, since: ${_this.since}, slots: ${_this.slots}, sources: ${_this.sources}, tags: ${_this.tags}, topLeftover: ${_this.topLeftover}, topSold: ${_this.topSold}, until: ${_this.until}, visits: ${_this.visits})';
}


}

/// @nodoc
abstract mixin class $AnalysisOutputBodyCopyWith<$Res>  {
  factory $AnalysisOutputBodyCopyWith(AnalysisOutputBody value, $Res Function(AnalysisOutputBody) _then) = _$AnalysisOutputBodyCopyWithImpl;
@useResult
$Res call({
 List<AnalysisDiscountBody> discounts, List<AnalysisCountBody> failures, List<AnalysisKindBody> kinds, LeadTimesStruct leadTimes, List<AnalysisCountBody> problems, SellOutStruct sellOut, DateTime since, List<AnalysisSlotBody> slots, List<AnalysisCountBody> sources, List<AnalysisCountBody> tags, List<AnalysisDishBody> topLeftover, List<AnalysisDishBody> topSold, DateTime until, List<AnalysisCountBody> visits
});


$LeadTimesStructCopyWith<$Res> get leadTimes;$SellOutStructCopyWith<$Res> get sellOut;

}
/// @nodoc
class _$AnalysisOutputBodyCopyWithImpl<$Res>
    implements $AnalysisOutputBodyCopyWith<$Res> {
  _$AnalysisOutputBodyCopyWithImpl(this._self, this._then);

  final AnalysisOutputBody _self;
  final $Res Function(AnalysisOutputBody) _then;

/// Create a copy of AnalysisOutputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? discounts = null,Object? failures = null,Object? kinds = null,Object? leadTimes = null,Object? problems = null,Object? sellOut = null,Object? since = null,Object? slots = null,Object? sources = null,Object? tags = null,Object? topLeftover = null,Object? topSold = null,Object? until = null,Object? visits = null,}) {
  return _then(AnalysisOutputBody(
discounts: null == discounts ? _self.discounts : discounts // ignore: cast_nullable_to_non_nullable
as List<AnalysisDiscountBody>,failures: null == failures ? _self.failures : failures // ignore: cast_nullable_to_non_nullable
as List<AnalysisCountBody>,kinds: null == kinds ? _self.kinds : kinds // ignore: cast_nullable_to_non_nullable
as List<AnalysisKindBody>,leadTimes: null == leadTimes ? _self.leadTimes : leadTimes // ignore: cast_nullable_to_non_nullable
as LeadTimesStruct,problems: null == problems ? _self.problems : problems // ignore: cast_nullable_to_non_nullable
as List<AnalysisCountBody>,sellOut: null == sellOut ? _self.sellOut : sellOut // ignore: cast_nullable_to_non_nullable
as SellOutStruct,since: null == since ? _self.since : since // ignore: cast_nullable_to_non_nullable
as DateTime,slots: null == slots ? _self.slots : slots // ignore: cast_nullable_to_non_nullable
as List<AnalysisSlotBody>,sources: null == sources ? _self.sources : sources // ignore: cast_nullable_to_non_nullable
as List<AnalysisCountBody>,tags: null == tags ? _self.tags : tags // ignore: cast_nullable_to_non_nullable
as List<AnalysisCountBody>,topLeftover: null == topLeftover ? _self.topLeftover : topLeftover // ignore: cast_nullable_to_non_nullable
as List<AnalysisDishBody>,topSold: null == topSold ? _self.topSold : topSold // ignore: cast_nullable_to_non_nullable
as List<AnalysisDishBody>,until: null == until ? _self.until : until // ignore: cast_nullable_to_non_nullable
as DateTime,visits: null == visits ? _self.visits : visits // ignore: cast_nullable_to_non_nullable
as List<AnalysisCountBody>,
  ));
}
/// Create a copy of AnalysisOutputBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$LeadTimesStructCopyWith<$Res> get leadTimes {
  
  return $LeadTimesStructCopyWith<$Res>(_self.leadTimes, (value) {
    return _then(_self.copyWith(leadTimes: value));
  });
}/// Create a copy of AnalysisOutputBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$SellOutStructCopyWith<$Res> get sellOut {
  
  return $SellOutStructCopyWith<$Res>(_self.sellOut, (value) {
    return _then(_self.copyWith(sellOut: value));
  });
}
}


/// Adds pattern-matching-related methods to [AnalysisOutputBody].
extension AnalysisOutputBodyPatterns on AnalysisOutputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AnalysisOutputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AnalysisOutputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AnalysisOutputBody value)  $default,){
final _that = this;
switch (_that) {
case _AnalysisOutputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AnalysisOutputBody value)?  $default,){
final _that = this;
switch (_that) {
case _AnalysisOutputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( List<AnalysisDiscountBody> discounts,  List<AnalysisCountBody> failures,  List<AnalysisKindBody> kinds,  LeadTimesStruct leadTimes,  List<AnalysisCountBody> problems,  SellOutStruct sellOut,  DateTime since,  List<AnalysisSlotBody> slots,  List<AnalysisCountBody> sources,  List<AnalysisCountBody> tags,  List<AnalysisDishBody> topLeftover,  List<AnalysisDishBody> topSold,  DateTime until,  List<AnalysisCountBody> visits)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AnalysisOutputBody() when $default != null:
return $default(_that.discounts,_that.failures,_that.kinds,_that.leadTimes,_that.problems,_that.sellOut,_that.since,_that.slots,_that.sources,_that.tags,_that.topLeftover,_that.topSold,_that.until,_that.visits);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( List<AnalysisDiscountBody> discounts,  List<AnalysisCountBody> failures,  List<AnalysisKindBody> kinds,  LeadTimesStruct leadTimes,  List<AnalysisCountBody> problems,  SellOutStruct sellOut,  DateTime since,  List<AnalysisSlotBody> slots,  List<AnalysisCountBody> sources,  List<AnalysisCountBody> tags,  List<AnalysisDishBody> topLeftover,  List<AnalysisDishBody> topSold,  DateTime until,  List<AnalysisCountBody> visits)  $default,) {final _that = this;
switch (_that) {
case _AnalysisOutputBody():
return $default(_that.discounts,_that.failures,_that.kinds,_that.leadTimes,_that.problems,_that.sellOut,_that.since,_that.slots,_that.sources,_that.tags,_that.topLeftover,_that.topSold,_that.until,_that.visits);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( List<AnalysisDiscountBody> discounts,  List<AnalysisCountBody> failures,  List<AnalysisKindBody> kinds,  LeadTimesStruct leadTimes,  List<AnalysisCountBody> problems,  SellOutStruct sellOut,  DateTime since,  List<AnalysisSlotBody> slots,  List<AnalysisCountBody> sources,  List<AnalysisCountBody> tags,  List<AnalysisDishBody> topLeftover,  List<AnalysisDishBody> topSold,  DateTime until,  List<AnalysisCountBody> visits)?  $default,) {final _that = this;
switch (_that) {
case _AnalysisOutputBody() when $default != null:
return $default(_that.discounts,_that.failures,_that.kinds,_that.leadTimes,_that.problems,_that.sellOut,_that.since,_that.slots,_that.sources,_that.tags,_that.topLeftover,_that.topSold,_that.until,_that.visits);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _AnalysisOutputBody implements AnalysisOutputBody {
  const _AnalysisOutputBody({required  List<AnalysisDiscountBody> discounts, required  List<AnalysisCountBody> failures, required  List<AnalysisKindBody> kinds, required this.leadTimes, required  List<AnalysisCountBody> problems, required this.sellOut, required this.since, required  List<AnalysisSlotBody> slots, required  List<AnalysisCountBody> sources, required  List<AnalysisCountBody> tags, required  List<AnalysisDishBody> topLeftover, required  List<AnalysisDishBody> topSold, required this.until, required  List<AnalysisCountBody> visits}): _discounts = discounts,_failures = failures,_kinds = kinds,_problems = problems,_slots = slots,_sources = sources,_tags = tags,_topLeftover = topLeftover,_topSold = topSold,_visits = visits;
  factory _AnalysisOutputBody.fromJson(Map<String, dynamic> json) => _$AnalysisOutputBodyFromJson(json);

/// The same by discount band, from food given away to the smallest discount
 final  List<AnalysisDiscountBody> _discounts;
/// The same by discount band, from food given away to the smallest discount
@override List<AnalysisDiscountBody> get discounts {
  if (_discounts is EqualUnmodifiableListView) return _discounts;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_discounts);
}

/// The orders not collected by ending: cancelled, expired, or refused_ and the reason; the most first
 final  List<AnalysisCountBody> _failures;
/// The orders not collected by ending: cancelled, expired, or refused_ and the reason; the most first
@override List<AnalysisCountBody> get failures {
  if (_failures is EqualUnmodifiableListView) return _failures;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_failures);
}

/// The portions posted and collected by kind of dish, the most posted first
 final  List<AnalysisKindBody> _kinds;
/// The portions posted and collected by kind of dish, the most posted first
@override List<AnalysisKindBody> get kinds {
  if (_kinds is EqualUnmodifiableListView) return _kinds;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_kinds);
}

/// How long before the window opened the orders were placed
@override final  LeadTimesStruct leadTimes;
/// The orders reported for each kind of problem
 final  List<AnalysisCountBody> _problems;
/// The orders reported for each kind of problem
@override List<AnalysisCountBody> get problems {
  if (_problems is EqualUnmodifiableListView) return _problems;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_problems);
}

/// How long the posts took from posting to their last unit ordered
@override final  SellOutStruct sellOut;
@override final  DateTime since;
/// The orders by weekday and hour of their window's start
 final  List<AnalysisSlotBody> _slots;
/// The orders by weekday and hour of their window's start
@override List<AnalysisSlotBody> get slots {
  if (_slots is EqualUnmodifiableListView) return _slots;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_slots);
}

/// The views by utm_source, empty for none; the site's whatever store is chosen
 final  List<AnalysisCountBody> _sources;
/// The views by utm_source, empty for none; the site's whatever store is chosen
@override List<AnalysisCountBody> get sources {
  if (_sources is EqualUnmodifiableListView) return _sources;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_sources);
}

/// The reviews praising each tag
 final  List<AnalysisCountBody> _tags;
/// The reviews praising each tag
@override List<AnalysisCountBody> get tags {
  if (_tags is EqualUnmodifiableListView) return _tags;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_tags);
}

/// The five ended dishes with the most portions not collected
 final  List<AnalysisDishBody> _topLeftover;
/// The five ended dishes with the most portions not collected
@override List<AnalysisDishBody> get topLeftover {
  if (_topLeftover is EqualUnmodifiableListView) return _topLeftover;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_topLeftover);
}

/// The five dishes most collected
 final  List<AnalysisDishBody> _topSold;
/// The five dishes most collected
@override List<AnalysisDishBody> get topSold {
  if (_topSold is EqualUnmodifiableListView) return _topSold;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_topSold);
}

@override final  DateTime until;
/// The customers by orders handed over: 1, 2, and 3 for three or more
 final  List<AnalysisCountBody> _visits;
/// The customers by orders handed over: 1, 2, and 3 for three or more
@override List<AnalysisCountBody> get visits {
  if (_visits is EqualUnmodifiableListView) return _visits;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_visits);
}


/// Create a copy of AnalysisOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AnalysisOutputBodyCopyWith<_AnalysisOutputBody> get copyWith => __$AnalysisOutputBodyCopyWithImpl<_AnalysisOutputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AnalysisOutputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _AnalysisOutputBody&&const DeepCollectionEquality().equals(other.discounts, _discounts)&&const DeepCollectionEquality().equals(other.failures, _failures)&&const DeepCollectionEquality().equals(other.kinds, _kinds)&&(identical(other.leadTimes, leadTimes) || other.leadTimes == leadTimes)&&const DeepCollectionEquality().equals(other.problems, _problems)&&(identical(other.sellOut, sellOut) || other.sellOut == sellOut)&&(identical(other.since, since) || other.since == since)&&const DeepCollectionEquality().equals(other.slots, _slots)&&const DeepCollectionEquality().equals(other.sources, _sources)&&const DeepCollectionEquality().equals(other.tags, _tags)&&const DeepCollectionEquality().equals(other.topLeftover, _topLeftover)&&const DeepCollectionEquality().equals(other.topSold, _topSold)&&(identical(other.until, until) || other.until == until)&&const DeepCollectionEquality().equals(other.visits, _visits));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,const DeepCollectionEquality().hash(_discounts),const DeepCollectionEquality().hash(_failures),const DeepCollectionEquality().hash(_kinds),leadTimes,const DeepCollectionEquality().hash(_problems),sellOut,since,const DeepCollectionEquality().hash(_slots),const DeepCollectionEquality().hash(_sources),const DeepCollectionEquality().hash(_tags),const DeepCollectionEquality().hash(_topLeftover),const DeepCollectionEquality().hash(_topSold),until,const DeepCollectionEquality().hash(_visits));
}

@override
String toString() {
    return 'AnalysisOutputBody(discounts: $discounts, failures: $failures, kinds: $kinds, leadTimes: $leadTimes, problems: $problems, sellOut: $sellOut, since: $since, slots: $slots, sources: $sources, tags: $tags, topLeftover: $topLeftover, topSold: $topSold, until: $until, visits: $visits)';
}


}

/// @nodoc
abstract mixin class _$AnalysisOutputBodyCopyWith<$Res> implements $AnalysisOutputBodyCopyWith<$Res> {
  factory _$AnalysisOutputBodyCopyWith(_AnalysisOutputBody value, $Res Function(_AnalysisOutputBody) _then) = __$AnalysisOutputBodyCopyWithImpl;
@override @useResult
$Res call({
 List<AnalysisDiscountBody> discounts, List<AnalysisCountBody> failures, List<AnalysisKindBody> kinds, LeadTimesStruct leadTimes, List<AnalysisCountBody> problems, SellOutStruct sellOut, DateTime since, List<AnalysisSlotBody> slots, List<AnalysisCountBody> sources, List<AnalysisCountBody> tags, List<AnalysisDishBody> topLeftover, List<AnalysisDishBody> topSold, DateTime until, List<AnalysisCountBody> visits
});


@override $LeadTimesStructCopyWith<$Res> get leadTimes;@override $SellOutStructCopyWith<$Res> get sellOut;

}
/// @nodoc
class __$AnalysisOutputBodyCopyWithImpl<$Res>
    implements _$AnalysisOutputBodyCopyWith<$Res> {
  __$AnalysisOutputBodyCopyWithImpl(this._self, this._then);

  final _AnalysisOutputBody _self;
  final $Res Function(_AnalysisOutputBody) _then;

/// Create a copy of AnalysisOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? discounts = null,Object? failures = null,Object? kinds = null,Object? leadTimes = null,Object? problems = null,Object? sellOut = null,Object? since = null,Object? slots = null,Object? sources = null,Object? tags = null,Object? topLeftover = null,Object? topSold = null,Object? until = null,Object? visits = null,}) {
  return _then(_AnalysisOutputBody(
discounts: null == discounts ? _self._discounts : discounts // ignore: cast_nullable_to_non_nullable
as List<AnalysisDiscountBody>,failures: null == failures ? _self._failures : failures // ignore: cast_nullable_to_non_nullable
as List<AnalysisCountBody>,kinds: null == kinds ? _self._kinds : kinds // ignore: cast_nullable_to_non_nullable
as List<AnalysisKindBody>,leadTimes: null == leadTimes ? _self.leadTimes : leadTimes // ignore: cast_nullable_to_non_nullable
as LeadTimesStruct,problems: null == problems ? _self._problems : problems // ignore: cast_nullable_to_non_nullable
as List<AnalysisCountBody>,sellOut: null == sellOut ? _self.sellOut : sellOut // ignore: cast_nullable_to_non_nullable
as SellOutStruct,since: null == since ? _self.since : since // ignore: cast_nullable_to_non_nullable
as DateTime,slots: null == slots ? _self._slots : slots // ignore: cast_nullable_to_non_nullable
as List<AnalysisSlotBody>,sources: null == sources ? _self._sources : sources // ignore: cast_nullable_to_non_nullable
as List<AnalysisCountBody>,tags: null == tags ? _self._tags : tags // ignore: cast_nullable_to_non_nullable
as List<AnalysisCountBody>,topLeftover: null == topLeftover ? _self._topLeftover : topLeftover // ignore: cast_nullable_to_non_nullable
as List<AnalysisDishBody>,topSold: null == topSold ? _self._topSold : topSold // ignore: cast_nullable_to_non_nullable
as List<AnalysisDishBody>,until: null == until ? _self.until : until // ignore: cast_nullable_to_non_nullable
as DateTime,visits: null == visits ? _self._visits : visits // ignore: cast_nullable_to_non_nullable
as List<AnalysisCountBody>,
  ));
}

/// Create a copy of AnalysisOutputBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$LeadTimesStructCopyWith<$Res> get leadTimes {
  
  return $LeadTimesStructCopyWith<$Res>(_self.leadTimes, (value) {
    return _then(_self.copyWith(leadTimes: value));
  });
}/// Create a copy of AnalysisOutputBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$SellOutStructCopyWith<$Res> get sellOut {
  
  return $SellOutStructCopyWith<$Res>(_self.sellOut, (value) {
    return _then(_self.copyWith(sellOut: value));
  });
}
}

// dart format on
