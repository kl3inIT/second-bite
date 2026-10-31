// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'promotion_input_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$PromotionInputBody {

/// Runs for every seller; otherwise for sellerIds
 bool get allSellers;/// Bounds the discounts of its orders still to collect and handed over
 int get budgetVnd;/// false pauses it
 bool get enabled;/// After startsAt
 DateTime get endsAt; String get name;/// Discounts one phone number takes in a day, Vietnam time; 0 for no limit
 int get perPhonePerDay;/// Each an alternative; an order takes the one taking the most off
 List<PromotionRuleBody> get rules; DateTime get startsAt; List<String>? get sellerIds;
/// Create a copy of PromotionInputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$PromotionInputBodyCopyWith<PromotionInputBody> get copyWith => _$PromotionInputBodyCopyWithImpl<PromotionInputBody>(this as PromotionInputBody, _$identity);

  /// Serializes this PromotionInputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as PromotionInputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is PromotionInputBody&&(identical(other.allSellers, _this.allSellers) || other.allSellers == _this.allSellers)&&(identical(other.budgetVnd, _this.budgetVnd) || other.budgetVnd == _this.budgetVnd)&&(identical(other.enabled, _this.enabled) || other.enabled == _this.enabled)&&(identical(other.endsAt, _this.endsAt) || other.endsAt == _this.endsAt)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.perPhonePerDay, _this.perPhonePerDay) || other.perPhonePerDay == _this.perPhonePerDay)&&const DeepCollectionEquality().equals(other.rules, _this.rules)&&(identical(other.startsAt, _this.startsAt) || other.startsAt == _this.startsAt)&&const DeepCollectionEquality().equals(other.sellerIds, _this.sellerIds));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as PromotionInputBody;
  return Object.hash(runtimeType,_this.allSellers,_this.budgetVnd,_this.enabled,_this.endsAt,_this.name,_this.perPhonePerDay,const DeepCollectionEquality().hash(_this.rules),_this.startsAt,const DeepCollectionEquality().hash(_this.sellerIds));
}

@override
String toString() {
  final _this = this as PromotionInputBody;
  return 'PromotionInputBody(allSellers: ${_this.allSellers}, budgetVnd: ${_this.budgetVnd}, enabled: ${_this.enabled}, endsAt: ${_this.endsAt}, name: ${_this.name}, perPhonePerDay: ${_this.perPhonePerDay}, rules: ${_this.rules}, startsAt: ${_this.startsAt}, sellerIds: ${_this.sellerIds})';
}


}

/// @nodoc
abstract mixin class $PromotionInputBodyCopyWith<$Res>  {
  factory $PromotionInputBodyCopyWith(PromotionInputBody value, $Res Function(PromotionInputBody) _then) = _$PromotionInputBodyCopyWithImpl;
@useResult
$Res call({
 bool allSellers, int budgetVnd, bool enabled, DateTime endsAt, String name, int perPhonePerDay, List<PromotionRuleBody> rules, DateTime startsAt, List<String>? sellerIds
});




}
/// @nodoc
class _$PromotionInputBodyCopyWithImpl<$Res>
    implements $PromotionInputBodyCopyWith<$Res> {
  _$PromotionInputBodyCopyWithImpl(this._self, this._then);

  final PromotionInputBody _self;
  final $Res Function(PromotionInputBody) _then;

/// Create a copy of PromotionInputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? allSellers = null,Object? budgetVnd = null,Object? enabled = null,Object? endsAt = null,Object? name = null,Object? perPhonePerDay = null,Object? rules = null,Object? startsAt = null,Object? sellerIds = freezed,}) {
  return _then(PromotionInputBody(
allSellers: null == allSellers ? _self.allSellers : allSellers // ignore: cast_nullable_to_non_nullable
as bool,budgetVnd: null == budgetVnd ? _self.budgetVnd : budgetVnd // ignore: cast_nullable_to_non_nullable
as int,enabled: null == enabled ? _self.enabled : enabled // ignore: cast_nullable_to_non_nullable
as bool,endsAt: null == endsAt ? _self.endsAt : endsAt // ignore: cast_nullable_to_non_nullable
as DateTime,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,perPhonePerDay: null == perPhonePerDay ? _self.perPhonePerDay : perPhonePerDay // ignore: cast_nullable_to_non_nullable
as int,rules: null == rules ? _self.rules : rules // ignore: cast_nullable_to_non_nullable
as List<PromotionRuleBody>,startsAt: null == startsAt ? _self.startsAt : startsAt // ignore: cast_nullable_to_non_nullable
as DateTime,sellerIds: freezed == sellerIds ? _self.sellerIds : sellerIds // ignore: cast_nullable_to_non_nullable
as List<String>?,
  ));
}

}


/// Adds pattern-matching-related methods to [PromotionInputBody].
extension PromotionInputBodyPatterns on PromotionInputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _PromotionInputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _PromotionInputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _PromotionInputBody value)  $default,){
final _that = this;
switch (_that) {
case _PromotionInputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _PromotionInputBody value)?  $default,){
final _that = this;
switch (_that) {
case _PromotionInputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( bool allSellers,  int budgetVnd,  bool enabled,  DateTime endsAt,  String name,  int perPhonePerDay,  List<PromotionRuleBody> rules,  DateTime startsAt,  List<String>? sellerIds)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _PromotionInputBody() when $default != null:
return $default(_that.allSellers,_that.budgetVnd,_that.enabled,_that.endsAt,_that.name,_that.perPhonePerDay,_that.rules,_that.startsAt,_that.sellerIds);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( bool allSellers,  int budgetVnd,  bool enabled,  DateTime endsAt,  String name,  int perPhonePerDay,  List<PromotionRuleBody> rules,  DateTime startsAt,  List<String>? sellerIds)  $default,) {final _that = this;
switch (_that) {
case _PromotionInputBody():
return $default(_that.allSellers,_that.budgetVnd,_that.enabled,_that.endsAt,_that.name,_that.perPhonePerDay,_that.rules,_that.startsAt,_that.sellerIds);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( bool allSellers,  int budgetVnd,  bool enabled,  DateTime endsAt,  String name,  int perPhonePerDay,  List<PromotionRuleBody> rules,  DateTime startsAt,  List<String>? sellerIds)?  $default,) {final _that = this;
switch (_that) {
case _PromotionInputBody() when $default != null:
return $default(_that.allSellers,_that.budgetVnd,_that.enabled,_that.endsAt,_that.name,_that.perPhonePerDay,_that.rules,_that.startsAt,_that.sellerIds);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _PromotionInputBody implements PromotionInputBody {
  const _PromotionInputBody({required this.allSellers, required this.budgetVnd, required this.enabled, required this.endsAt, required this.name, required this.perPhonePerDay, required  List<PromotionRuleBody> rules, required this.startsAt,  List<String>? sellerIds}): _rules = rules,_sellerIds = sellerIds;
  factory _PromotionInputBody.fromJson(Map<String, dynamic> json) => _$PromotionInputBodyFromJson(json);

/// Runs for every seller; otherwise for sellerIds
@override final  bool allSellers;
/// Bounds the discounts of its orders still to collect and handed over
@override final  int budgetVnd;
/// false pauses it
@override final  bool enabled;
/// After startsAt
@override final  DateTime endsAt;
@override final  String name;
/// Discounts one phone number takes in a day, Vietnam time; 0 for no limit
@override final  int perPhonePerDay;
/// Each an alternative; an order takes the one taking the most off
 final  List<PromotionRuleBody> _rules;
/// Each an alternative; an order takes the one taking the most off
@override List<PromotionRuleBody> get rules {
  if (_rules is EqualUnmodifiableListView) return _rules;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_rules);
}

@override final  DateTime startsAt;
 final  List<String>? _sellerIds;
@override List<String>? get sellerIds {
  final value = _sellerIds;
  if (value == null) return null;
  if (_sellerIds is EqualUnmodifiableListView) return _sellerIds;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(value);
}


/// Create a copy of PromotionInputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$PromotionInputBodyCopyWith<_PromotionInputBody> get copyWith => __$PromotionInputBodyCopyWithImpl<_PromotionInputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$PromotionInputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _PromotionInputBody&&(identical(other.allSellers, allSellers) || other.allSellers == allSellers)&&(identical(other.budgetVnd, budgetVnd) || other.budgetVnd == budgetVnd)&&(identical(other.enabled, enabled) || other.enabled == enabled)&&(identical(other.endsAt, endsAt) || other.endsAt == endsAt)&&(identical(other.name, name) || other.name == name)&&(identical(other.perPhonePerDay, perPhonePerDay) || other.perPhonePerDay == perPhonePerDay)&&const DeepCollectionEquality().equals(other.rules, _rules)&&(identical(other.startsAt, startsAt) || other.startsAt == startsAt)&&const DeepCollectionEquality().equals(other.sellerIds, _sellerIds));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,allSellers,budgetVnd,enabled,endsAt,name,perPhonePerDay,const DeepCollectionEquality().hash(_rules),startsAt,const DeepCollectionEquality().hash(_sellerIds));
}

@override
String toString() {
    return 'PromotionInputBody(allSellers: $allSellers, budgetVnd: $budgetVnd, enabled: $enabled, endsAt: $endsAt, name: $name, perPhonePerDay: $perPhonePerDay, rules: $rules, startsAt: $startsAt, sellerIds: $sellerIds)';
}


}

/// @nodoc
abstract mixin class _$PromotionInputBodyCopyWith<$Res> implements $PromotionInputBodyCopyWith<$Res> {
  factory _$PromotionInputBodyCopyWith(_PromotionInputBody value, $Res Function(_PromotionInputBody) _then) = __$PromotionInputBodyCopyWithImpl;
@override @useResult
$Res call({
 bool allSellers, int budgetVnd, bool enabled, DateTime endsAt, String name, int perPhonePerDay, List<PromotionRuleBody> rules, DateTime startsAt, List<String>? sellerIds
});




}
/// @nodoc
class __$PromotionInputBodyCopyWithImpl<$Res>
    implements _$PromotionInputBodyCopyWith<$Res> {
  __$PromotionInputBodyCopyWithImpl(this._self, this._then);

  final _PromotionInputBody _self;
  final $Res Function(_PromotionInputBody) _then;

/// Create a copy of PromotionInputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? allSellers = null,Object? budgetVnd = null,Object? enabled = null,Object? endsAt = null,Object? name = null,Object? perPhonePerDay = null,Object? rules = null,Object? startsAt = null,Object? sellerIds = freezed,}) {
  return _then(_PromotionInputBody(
allSellers: null == allSellers ? _self.allSellers : allSellers // ignore: cast_nullable_to_non_nullable
as bool,budgetVnd: null == budgetVnd ? _self.budgetVnd : budgetVnd // ignore: cast_nullable_to_non_nullable
as int,enabled: null == enabled ? _self.enabled : enabled // ignore: cast_nullable_to_non_nullable
as bool,endsAt: null == endsAt ? _self.endsAt : endsAt // ignore: cast_nullable_to_non_nullable
as DateTime,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,perPhonePerDay: null == perPhonePerDay ? _self.perPhonePerDay : perPhonePerDay // ignore: cast_nullable_to_non_nullable
as int,rules: null == rules ? _self._rules : rules // ignore: cast_nullable_to_non_nullable
as List<PromotionRuleBody>,startsAt: null == startsAt ? _self.startsAt : startsAt // ignore: cast_nullable_to_non_nullable
as DateTime,sellerIds: freezed == sellerIds ? _self._sellerIds : sellerIds // ignore: cast_nullable_to_non_nullable
as List<String>?,
  ));
}


}

// dart format on
