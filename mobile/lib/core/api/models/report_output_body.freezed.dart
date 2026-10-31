// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'report_output_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$ReportOutputBody {

/// The accounts there are at the end of the range
 int get accounts;/// Every day of the range, in order
 List<ReportDayBody>? get days; DateTime get since;/// Each store on each day it has numbers, by day then name
 List<ReportStoreDayBody>? get storeDays;/// Each store with numbers in the range, the most orders first
 List<ReportStoreBody>? get stores; CountsBody get totals; DateTime get until;
/// Create a copy of ReportOutputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ReportOutputBodyCopyWith<ReportOutputBody> get copyWith => _$ReportOutputBodyCopyWithImpl<ReportOutputBody>(this as ReportOutputBody, _$identity);

  /// Serializes this ReportOutputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as ReportOutputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ReportOutputBody&&(identical(other.accounts, _this.accounts) || other.accounts == _this.accounts)&&const DeepCollectionEquality().equals(other.days, _this.days)&&(identical(other.since, _this.since) || other.since == _this.since)&&const DeepCollectionEquality().equals(other.storeDays, _this.storeDays)&&const DeepCollectionEquality().equals(other.stores, _this.stores)&&(identical(other.totals, _this.totals) || other.totals == _this.totals)&&(identical(other.until, _this.until) || other.until == _this.until));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as ReportOutputBody;
  return Object.hash(runtimeType,_this.accounts,const DeepCollectionEquality().hash(_this.days),_this.since,const DeepCollectionEquality().hash(_this.storeDays),const DeepCollectionEquality().hash(_this.stores),_this.totals,_this.until);
}

@override
String toString() {
  final _this = this as ReportOutputBody;
  return 'ReportOutputBody(accounts: ${_this.accounts}, days: ${_this.days}, since: ${_this.since}, storeDays: ${_this.storeDays}, stores: ${_this.stores}, totals: ${_this.totals}, until: ${_this.until})';
}


}

/// @nodoc
abstract mixin class $ReportOutputBodyCopyWith<$Res>  {
  factory $ReportOutputBodyCopyWith(ReportOutputBody value, $Res Function(ReportOutputBody) _then) = _$ReportOutputBodyCopyWithImpl;
@useResult
$Res call({
 int accounts, List<ReportDayBody>? days, DateTime since, List<ReportStoreDayBody>? storeDays, List<ReportStoreBody>? stores, CountsBody totals, DateTime until
});


$CountsBodyCopyWith<$Res> get totals;

}
/// @nodoc
class _$ReportOutputBodyCopyWithImpl<$Res>
    implements $ReportOutputBodyCopyWith<$Res> {
  _$ReportOutputBodyCopyWithImpl(this._self, this._then);

  final ReportOutputBody _self;
  final $Res Function(ReportOutputBody) _then;

/// Create a copy of ReportOutputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? accounts = null,Object? days = freezed,Object? since = null,Object? storeDays = freezed,Object? stores = freezed,Object? totals = null,Object? until = null,}) {
  return _then(ReportOutputBody(
accounts: null == accounts ? _self.accounts : accounts // ignore: cast_nullable_to_non_nullable
as int,days: freezed == days ? _self.days : days // ignore: cast_nullable_to_non_nullable
as List<ReportDayBody>?,since: null == since ? _self.since : since // ignore: cast_nullable_to_non_nullable
as DateTime,storeDays: freezed == storeDays ? _self.storeDays : storeDays // ignore: cast_nullable_to_non_nullable
as List<ReportStoreDayBody>?,stores: freezed == stores ? _self.stores : stores // ignore: cast_nullable_to_non_nullable
as List<ReportStoreBody>?,totals: null == totals ? _self.totals : totals // ignore: cast_nullable_to_non_nullable
as CountsBody,until: null == until ? _self.until : until // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}
/// Create a copy of ReportOutputBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$CountsBodyCopyWith<$Res> get totals {
  
  return $CountsBodyCopyWith<$Res>(_self.totals, (value) {
    return _then(_self.copyWith(totals: value));
  });
}
}


/// Adds pattern-matching-related methods to [ReportOutputBody].
extension ReportOutputBodyPatterns on ReportOutputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ReportOutputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ReportOutputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ReportOutputBody value)  $default,){
final _that = this;
switch (_that) {
case _ReportOutputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ReportOutputBody value)?  $default,){
final _that = this;
switch (_that) {
case _ReportOutputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int accounts,  List<ReportDayBody>? days,  DateTime since,  List<ReportStoreDayBody>? storeDays,  List<ReportStoreBody>? stores,  CountsBody totals,  DateTime until)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ReportOutputBody() when $default != null:
return $default(_that.accounts,_that.days,_that.since,_that.storeDays,_that.stores,_that.totals,_that.until);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int accounts,  List<ReportDayBody>? days,  DateTime since,  List<ReportStoreDayBody>? storeDays,  List<ReportStoreBody>? stores,  CountsBody totals,  DateTime until)  $default,) {final _that = this;
switch (_that) {
case _ReportOutputBody():
return $default(_that.accounts,_that.days,_that.since,_that.storeDays,_that.stores,_that.totals,_that.until);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int accounts,  List<ReportDayBody>? days,  DateTime since,  List<ReportStoreDayBody>? storeDays,  List<ReportStoreBody>? stores,  CountsBody totals,  DateTime until)?  $default,) {final _that = this;
switch (_that) {
case _ReportOutputBody() when $default != null:
return $default(_that.accounts,_that.days,_that.since,_that.storeDays,_that.stores,_that.totals,_that.until);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ReportOutputBody implements ReportOutputBody {
  const _ReportOutputBody({required this.accounts, required  List<ReportDayBody>? days, required this.since, required  List<ReportStoreDayBody>? storeDays, required  List<ReportStoreBody>? stores, required this.totals, required this.until}): _days = days,_storeDays = storeDays,_stores = stores;
  factory _ReportOutputBody.fromJson(Map<String, dynamic> json) => _$ReportOutputBodyFromJson(json);

/// The accounts there are at the end of the range
@override final  int accounts;
/// Every day of the range, in order
 final  List<ReportDayBody>? _days;
/// Every day of the range, in order
@override List<ReportDayBody>? get days {
  final value = _days;
  if (value == null) return null;
  if (_days is EqualUnmodifiableListView) return _days;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(value);
}

@override final  DateTime since;
/// Each store on each day it has numbers, by day then name
 final  List<ReportStoreDayBody>? _storeDays;
/// Each store on each day it has numbers, by day then name
@override List<ReportStoreDayBody>? get storeDays {
  final value = _storeDays;
  if (value == null) return null;
  if (_storeDays is EqualUnmodifiableListView) return _storeDays;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(value);
}

/// Each store with numbers in the range, the most orders first
 final  List<ReportStoreBody>? _stores;
/// Each store with numbers in the range, the most orders first
@override List<ReportStoreBody>? get stores {
  final value = _stores;
  if (value == null) return null;
  if (_stores is EqualUnmodifiableListView) return _stores;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(value);
}

@override final  CountsBody totals;
@override final  DateTime until;

/// Create a copy of ReportOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ReportOutputBodyCopyWith<_ReportOutputBody> get copyWith => __$ReportOutputBodyCopyWithImpl<_ReportOutputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ReportOutputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _ReportOutputBody&&(identical(other.accounts, accounts) || other.accounts == accounts)&&const DeepCollectionEquality().equals(other.days, _days)&&(identical(other.since, since) || other.since == since)&&const DeepCollectionEquality().equals(other.storeDays, _storeDays)&&const DeepCollectionEquality().equals(other.stores, _stores)&&(identical(other.totals, totals) || other.totals == totals)&&(identical(other.until, until) || other.until == until));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,accounts,const DeepCollectionEquality().hash(_days),since,const DeepCollectionEquality().hash(_storeDays),const DeepCollectionEquality().hash(_stores),totals,until);
}

@override
String toString() {
    return 'ReportOutputBody(accounts: $accounts, days: $days, since: $since, storeDays: $storeDays, stores: $stores, totals: $totals, until: $until)';
}


}

/// @nodoc
abstract mixin class _$ReportOutputBodyCopyWith<$Res> implements $ReportOutputBodyCopyWith<$Res> {
  factory _$ReportOutputBodyCopyWith(_ReportOutputBody value, $Res Function(_ReportOutputBody) _then) = __$ReportOutputBodyCopyWithImpl;
@override @useResult
$Res call({
 int accounts, List<ReportDayBody>? days, DateTime since, List<ReportStoreDayBody>? storeDays, List<ReportStoreBody>? stores, CountsBody totals, DateTime until
});


@override $CountsBodyCopyWith<$Res> get totals;

}
/// @nodoc
class __$ReportOutputBodyCopyWithImpl<$Res>
    implements _$ReportOutputBodyCopyWith<$Res> {
  __$ReportOutputBodyCopyWithImpl(this._self, this._then);

  final _ReportOutputBody _self;
  final $Res Function(_ReportOutputBody) _then;

/// Create a copy of ReportOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? accounts = null,Object? days = freezed,Object? since = null,Object? storeDays = freezed,Object? stores = freezed,Object? totals = null,Object? until = null,}) {
  return _then(_ReportOutputBody(
accounts: null == accounts ? _self.accounts : accounts // ignore: cast_nullable_to_non_nullable
as int,days: freezed == days ? _self._days : days // ignore: cast_nullable_to_non_nullable
as List<ReportDayBody>?,since: null == since ? _self.since : since // ignore: cast_nullable_to_non_nullable
as DateTime,storeDays: freezed == storeDays ? _self._storeDays : storeDays // ignore: cast_nullable_to_non_nullable
as List<ReportStoreDayBody>?,stores: freezed == stores ? _self._stores : stores // ignore: cast_nullable_to_non_nullable
as List<ReportStoreBody>?,totals: null == totals ? _self.totals : totals // ignore: cast_nullable_to_non_nullable
as CountsBody,until: null == until ? _self.until : until // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}

/// Create a copy of ReportOutputBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$CountsBodyCopyWith<$Res> get totals {
  
  return $CountsBodyCopyWith<$Res>(_self.totals, (value) {
    return _then(_self.copyWith(totals: value));
  });
}
}

// dart format on
