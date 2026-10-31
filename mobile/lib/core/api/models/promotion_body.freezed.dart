// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'promotion_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$PromotionBody {

 bool get allSellers; int get budgetVnd; DateTime get createdAt; bool get enabled; DateTime get endsAt; String get id; String get name; int get perPhonePerDay; List<PromotionRuleBody> get rules; List<String> get sellerIds; DateTime get startsAt;/// Read from its times and whether it is enabled
 PromotionBodyStatus get status; DateTime get updatedAt; PromotionUseBody get use;
/// Create a copy of PromotionBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$PromotionBodyCopyWith<PromotionBody> get copyWith => _$PromotionBodyCopyWithImpl<PromotionBody>(this as PromotionBody, _$identity);

  /// Serializes this PromotionBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as PromotionBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is PromotionBody&&(identical(other.allSellers, _this.allSellers) || other.allSellers == _this.allSellers)&&(identical(other.budgetVnd, _this.budgetVnd) || other.budgetVnd == _this.budgetVnd)&&(identical(other.createdAt, _this.createdAt) || other.createdAt == _this.createdAt)&&(identical(other.enabled, _this.enabled) || other.enabled == _this.enabled)&&(identical(other.endsAt, _this.endsAt) || other.endsAt == _this.endsAt)&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.perPhonePerDay, _this.perPhonePerDay) || other.perPhonePerDay == _this.perPhonePerDay)&&const DeepCollectionEquality().equals(other.rules, _this.rules)&&const DeepCollectionEquality().equals(other.sellerIds, _this.sellerIds)&&(identical(other.startsAt, _this.startsAt) || other.startsAt == _this.startsAt)&&(identical(other.status, _this.status) || other.status == _this.status)&&(identical(other.updatedAt, _this.updatedAt) || other.updatedAt == _this.updatedAt)&&(identical(other.use, _this.use) || other.use == _this.use));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as PromotionBody;
  return Object.hash(runtimeType,_this.allSellers,_this.budgetVnd,_this.createdAt,_this.enabled,_this.endsAt,_this.id,_this.name,_this.perPhonePerDay,const DeepCollectionEquality().hash(_this.rules),const DeepCollectionEquality().hash(_this.sellerIds),_this.startsAt,_this.status,_this.updatedAt,_this.use);
}

@override
String toString() {
  final _this = this as PromotionBody;
  return 'PromotionBody(allSellers: ${_this.allSellers}, budgetVnd: ${_this.budgetVnd}, createdAt: ${_this.createdAt}, enabled: ${_this.enabled}, endsAt: ${_this.endsAt}, id: ${_this.id}, name: ${_this.name}, perPhonePerDay: ${_this.perPhonePerDay}, rules: ${_this.rules}, sellerIds: ${_this.sellerIds}, startsAt: ${_this.startsAt}, status: ${_this.status}, updatedAt: ${_this.updatedAt}, use: ${_this.use})';
}


}

/// @nodoc
abstract mixin class $PromotionBodyCopyWith<$Res>  {
  factory $PromotionBodyCopyWith(PromotionBody value, $Res Function(PromotionBody) _then) = _$PromotionBodyCopyWithImpl;
@useResult
$Res call({
 bool allSellers, int budgetVnd, DateTime createdAt, bool enabled, DateTime endsAt, String id, String name, int perPhonePerDay, List<PromotionRuleBody> rules, List<String> sellerIds, DateTime startsAt, PromotionBodyStatus status, DateTime updatedAt, PromotionUseBody use
});


$PromotionUseBodyCopyWith<$Res> get use;

}
/// @nodoc
class _$PromotionBodyCopyWithImpl<$Res>
    implements $PromotionBodyCopyWith<$Res> {
  _$PromotionBodyCopyWithImpl(this._self, this._then);

  final PromotionBody _self;
  final $Res Function(PromotionBody) _then;

/// Create a copy of PromotionBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? allSellers = null,Object? budgetVnd = null,Object? createdAt = null,Object? enabled = null,Object? endsAt = null,Object? id = null,Object? name = null,Object? perPhonePerDay = null,Object? rules = null,Object? sellerIds = null,Object? startsAt = null,Object? status = null,Object? updatedAt = null,Object? use = null,}) {
  return _then(PromotionBody(
allSellers: null == allSellers ? _self.allSellers : allSellers // ignore: cast_nullable_to_non_nullable
as bool,budgetVnd: null == budgetVnd ? _self.budgetVnd : budgetVnd // ignore: cast_nullable_to_non_nullable
as int,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,enabled: null == enabled ? _self.enabled : enabled // ignore: cast_nullable_to_non_nullable
as bool,endsAt: null == endsAt ? _self.endsAt : endsAt // ignore: cast_nullable_to_non_nullable
as DateTime,id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,perPhonePerDay: null == perPhonePerDay ? _self.perPhonePerDay : perPhonePerDay // ignore: cast_nullable_to_non_nullable
as int,rules: null == rules ? _self.rules : rules // ignore: cast_nullable_to_non_nullable
as List<PromotionRuleBody>,sellerIds: null == sellerIds ? _self.sellerIds : sellerIds // ignore: cast_nullable_to_non_nullable
as List<String>,startsAt: null == startsAt ? _self.startsAt : startsAt // ignore: cast_nullable_to_non_nullable
as DateTime,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as PromotionBodyStatus,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,use: null == use ? _self.use : use // ignore: cast_nullable_to_non_nullable
as PromotionUseBody,
  ));
}
/// Create a copy of PromotionBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$PromotionUseBodyCopyWith<$Res> get use {
  
  return $PromotionUseBodyCopyWith<$Res>(_self.use, (value) {
    return _then(_self.copyWith(use: value));
  });
}
}


/// Adds pattern-matching-related methods to [PromotionBody].
extension PromotionBodyPatterns on PromotionBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _PromotionBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _PromotionBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _PromotionBody value)  $default,){
final _that = this;
switch (_that) {
case _PromotionBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _PromotionBody value)?  $default,){
final _that = this;
switch (_that) {
case _PromotionBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( bool allSellers,  int budgetVnd,  DateTime createdAt,  bool enabled,  DateTime endsAt,  String id,  String name,  int perPhonePerDay,  List<PromotionRuleBody> rules,  List<String> sellerIds,  DateTime startsAt,  PromotionBodyStatus status,  DateTime updatedAt,  PromotionUseBody use)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _PromotionBody() when $default != null:
return $default(_that.allSellers,_that.budgetVnd,_that.createdAt,_that.enabled,_that.endsAt,_that.id,_that.name,_that.perPhonePerDay,_that.rules,_that.sellerIds,_that.startsAt,_that.status,_that.updatedAt,_that.use);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( bool allSellers,  int budgetVnd,  DateTime createdAt,  bool enabled,  DateTime endsAt,  String id,  String name,  int perPhonePerDay,  List<PromotionRuleBody> rules,  List<String> sellerIds,  DateTime startsAt,  PromotionBodyStatus status,  DateTime updatedAt,  PromotionUseBody use)  $default,) {final _that = this;
switch (_that) {
case _PromotionBody():
return $default(_that.allSellers,_that.budgetVnd,_that.createdAt,_that.enabled,_that.endsAt,_that.id,_that.name,_that.perPhonePerDay,_that.rules,_that.sellerIds,_that.startsAt,_that.status,_that.updatedAt,_that.use);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( bool allSellers,  int budgetVnd,  DateTime createdAt,  bool enabled,  DateTime endsAt,  String id,  String name,  int perPhonePerDay,  List<PromotionRuleBody> rules,  List<String> sellerIds,  DateTime startsAt,  PromotionBodyStatus status,  DateTime updatedAt,  PromotionUseBody use)?  $default,) {final _that = this;
switch (_that) {
case _PromotionBody() when $default != null:
return $default(_that.allSellers,_that.budgetVnd,_that.createdAt,_that.enabled,_that.endsAt,_that.id,_that.name,_that.perPhonePerDay,_that.rules,_that.sellerIds,_that.startsAt,_that.status,_that.updatedAt,_that.use);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _PromotionBody implements PromotionBody {
  const _PromotionBody({required this.allSellers, required this.budgetVnd, required this.createdAt, required this.enabled, required this.endsAt, required this.id, required this.name, required this.perPhonePerDay, required  List<PromotionRuleBody> rules, required  List<String> sellerIds, required this.startsAt, required this.status, required this.updatedAt, required this.use}): _rules = rules,_sellerIds = sellerIds;
  factory _PromotionBody.fromJson(Map<String, dynamic> json) => _$PromotionBodyFromJson(json);

@override final  bool allSellers;
@override final  int budgetVnd;
@override final  DateTime createdAt;
@override final  bool enabled;
@override final  DateTime endsAt;
@override final  String id;
@override final  String name;
@override final  int perPhonePerDay;
 final  List<PromotionRuleBody> _rules;
@override List<PromotionRuleBody> get rules {
  if (_rules is EqualUnmodifiableListView) return _rules;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_rules);
}

 final  List<String> _sellerIds;
@override List<String> get sellerIds {
  if (_sellerIds is EqualUnmodifiableListView) return _sellerIds;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_sellerIds);
}

@override final  DateTime startsAt;
/// Read from its times and whether it is enabled
@override final  PromotionBodyStatus status;
@override final  DateTime updatedAt;
@override final  PromotionUseBody use;

/// Create a copy of PromotionBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$PromotionBodyCopyWith<_PromotionBody> get copyWith => __$PromotionBodyCopyWithImpl<_PromotionBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$PromotionBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _PromotionBody&&(identical(other.allSellers, allSellers) || other.allSellers == allSellers)&&(identical(other.budgetVnd, budgetVnd) || other.budgetVnd == budgetVnd)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.enabled, enabled) || other.enabled == enabled)&&(identical(other.endsAt, endsAt) || other.endsAt == endsAt)&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.perPhonePerDay, perPhonePerDay) || other.perPhonePerDay == perPhonePerDay)&&const DeepCollectionEquality().equals(other.rules, _rules)&&const DeepCollectionEquality().equals(other.sellerIds, _sellerIds)&&(identical(other.startsAt, startsAt) || other.startsAt == startsAt)&&(identical(other.status, status) || other.status == status)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt)&&(identical(other.use, use) || other.use == use));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,allSellers,budgetVnd,createdAt,enabled,endsAt,id,name,perPhonePerDay,const DeepCollectionEquality().hash(_rules),const DeepCollectionEquality().hash(_sellerIds),startsAt,status,updatedAt,use);
}

@override
String toString() {
    return 'PromotionBody(allSellers: $allSellers, budgetVnd: $budgetVnd, createdAt: $createdAt, enabled: $enabled, endsAt: $endsAt, id: $id, name: $name, perPhonePerDay: $perPhonePerDay, rules: $rules, sellerIds: $sellerIds, startsAt: $startsAt, status: $status, updatedAt: $updatedAt, use: $use)';
}


}

/// @nodoc
abstract mixin class _$PromotionBodyCopyWith<$Res> implements $PromotionBodyCopyWith<$Res> {
  factory _$PromotionBodyCopyWith(_PromotionBody value, $Res Function(_PromotionBody) _then) = __$PromotionBodyCopyWithImpl;
@override @useResult
$Res call({
 bool allSellers, int budgetVnd, DateTime createdAt, bool enabled, DateTime endsAt, String id, String name, int perPhonePerDay, List<PromotionRuleBody> rules, List<String> sellerIds, DateTime startsAt, PromotionBodyStatus status, DateTime updatedAt, PromotionUseBody use
});


@override $PromotionUseBodyCopyWith<$Res> get use;

}
/// @nodoc
class __$PromotionBodyCopyWithImpl<$Res>
    implements _$PromotionBodyCopyWith<$Res> {
  __$PromotionBodyCopyWithImpl(this._self, this._then);

  final _PromotionBody _self;
  final $Res Function(_PromotionBody) _then;

/// Create a copy of PromotionBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? allSellers = null,Object? budgetVnd = null,Object? createdAt = null,Object? enabled = null,Object? endsAt = null,Object? id = null,Object? name = null,Object? perPhonePerDay = null,Object? rules = null,Object? sellerIds = null,Object? startsAt = null,Object? status = null,Object? updatedAt = null,Object? use = null,}) {
  return _then(_PromotionBody(
allSellers: null == allSellers ? _self.allSellers : allSellers // ignore: cast_nullable_to_non_nullable
as bool,budgetVnd: null == budgetVnd ? _self.budgetVnd : budgetVnd // ignore: cast_nullable_to_non_nullable
as int,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,enabled: null == enabled ? _self.enabled : enabled // ignore: cast_nullable_to_non_nullable
as bool,endsAt: null == endsAt ? _self.endsAt : endsAt // ignore: cast_nullable_to_non_nullable
as DateTime,id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,perPhonePerDay: null == perPhonePerDay ? _self.perPhonePerDay : perPhonePerDay // ignore: cast_nullable_to_non_nullable
as int,rules: null == rules ? _self._rules : rules // ignore: cast_nullable_to_non_nullable
as List<PromotionRuleBody>,sellerIds: null == sellerIds ? _self._sellerIds : sellerIds // ignore: cast_nullable_to_non_nullable
as List<String>,startsAt: null == startsAt ? _self.startsAt : startsAt // ignore: cast_nullable_to_non_nullable
as DateTime,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as PromotionBodyStatus,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,use: null == use ? _self.use : use // ignore: cast_nullable_to_non_nullable
as PromotionUseBody,
  ));
}

/// Create a copy of PromotionBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$PromotionUseBodyCopyWith<$Res> get use {
  
  return $PromotionUseBodyCopyWith<$Res>(_self.use, (value) {
    return _then(_self.copyWith(use: value));
  });
}
}

// dart format on
