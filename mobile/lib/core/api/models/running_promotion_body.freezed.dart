// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'running_promotion_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$RunningPromotionBody {

 bool get allSellers; DateTime get endsAt; String get id; String get name;/// 0 for no limit
 int get perPhonePerDay; List<PromotionRuleBody> get rules; List<String> get sellerIds;
/// Create a copy of RunningPromotionBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$RunningPromotionBodyCopyWith<RunningPromotionBody> get copyWith => _$RunningPromotionBodyCopyWithImpl<RunningPromotionBody>(this as RunningPromotionBody, _$identity);

  /// Serializes this RunningPromotionBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as RunningPromotionBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is RunningPromotionBody&&(identical(other.allSellers, _this.allSellers) || other.allSellers == _this.allSellers)&&(identical(other.endsAt, _this.endsAt) || other.endsAt == _this.endsAt)&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.perPhonePerDay, _this.perPhonePerDay) || other.perPhonePerDay == _this.perPhonePerDay)&&const DeepCollectionEquality().equals(other.rules, _this.rules)&&const DeepCollectionEquality().equals(other.sellerIds, _this.sellerIds));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as RunningPromotionBody;
  return Object.hash(runtimeType,_this.allSellers,_this.endsAt,_this.id,_this.name,_this.perPhonePerDay,const DeepCollectionEquality().hash(_this.rules),const DeepCollectionEquality().hash(_this.sellerIds));
}

@override
String toString() {
  final _this = this as RunningPromotionBody;
  return 'RunningPromotionBody(allSellers: ${_this.allSellers}, endsAt: ${_this.endsAt}, id: ${_this.id}, name: ${_this.name}, perPhonePerDay: ${_this.perPhonePerDay}, rules: ${_this.rules}, sellerIds: ${_this.sellerIds})';
}


}

/// @nodoc
abstract mixin class $RunningPromotionBodyCopyWith<$Res>  {
  factory $RunningPromotionBodyCopyWith(RunningPromotionBody value, $Res Function(RunningPromotionBody) _then) = _$RunningPromotionBodyCopyWithImpl;
@useResult
$Res call({
 bool allSellers, DateTime endsAt, String id, String name, int perPhonePerDay, List<PromotionRuleBody> rules, List<String> sellerIds
});




}
/// @nodoc
class _$RunningPromotionBodyCopyWithImpl<$Res>
    implements $RunningPromotionBodyCopyWith<$Res> {
  _$RunningPromotionBodyCopyWithImpl(this._self, this._then);

  final RunningPromotionBody _self;
  final $Res Function(RunningPromotionBody) _then;

/// Create a copy of RunningPromotionBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? allSellers = null,Object? endsAt = null,Object? id = null,Object? name = null,Object? perPhonePerDay = null,Object? rules = null,Object? sellerIds = null,}) {
  return _then(RunningPromotionBody(
allSellers: null == allSellers ? _self.allSellers : allSellers // ignore: cast_nullable_to_non_nullable
as bool,endsAt: null == endsAt ? _self.endsAt : endsAt // ignore: cast_nullable_to_non_nullable
as DateTime,id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,perPhonePerDay: null == perPhonePerDay ? _self.perPhonePerDay : perPhonePerDay // ignore: cast_nullable_to_non_nullable
as int,rules: null == rules ? _self.rules : rules // ignore: cast_nullable_to_non_nullable
as List<PromotionRuleBody>,sellerIds: null == sellerIds ? _self.sellerIds : sellerIds // ignore: cast_nullable_to_non_nullable
as List<String>,
  ));
}

}


/// Adds pattern-matching-related methods to [RunningPromotionBody].
extension RunningPromotionBodyPatterns on RunningPromotionBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _RunningPromotionBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _RunningPromotionBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _RunningPromotionBody value)  $default,){
final _that = this;
switch (_that) {
case _RunningPromotionBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _RunningPromotionBody value)?  $default,){
final _that = this;
switch (_that) {
case _RunningPromotionBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( bool allSellers,  DateTime endsAt,  String id,  String name,  int perPhonePerDay,  List<PromotionRuleBody> rules,  List<String> sellerIds)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _RunningPromotionBody() when $default != null:
return $default(_that.allSellers,_that.endsAt,_that.id,_that.name,_that.perPhonePerDay,_that.rules,_that.sellerIds);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( bool allSellers,  DateTime endsAt,  String id,  String name,  int perPhonePerDay,  List<PromotionRuleBody> rules,  List<String> sellerIds)  $default,) {final _that = this;
switch (_that) {
case _RunningPromotionBody():
return $default(_that.allSellers,_that.endsAt,_that.id,_that.name,_that.perPhonePerDay,_that.rules,_that.sellerIds);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( bool allSellers,  DateTime endsAt,  String id,  String name,  int perPhonePerDay,  List<PromotionRuleBody> rules,  List<String> sellerIds)?  $default,) {final _that = this;
switch (_that) {
case _RunningPromotionBody() when $default != null:
return $default(_that.allSellers,_that.endsAt,_that.id,_that.name,_that.perPhonePerDay,_that.rules,_that.sellerIds);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _RunningPromotionBody implements RunningPromotionBody {
  const _RunningPromotionBody({required this.allSellers, required this.endsAt, required this.id, required this.name, required this.perPhonePerDay, required  List<PromotionRuleBody> rules, required  List<String> sellerIds}): _rules = rules,_sellerIds = sellerIds;
  factory _RunningPromotionBody.fromJson(Map<String, dynamic> json) => _$RunningPromotionBodyFromJson(json);

@override final  bool allSellers;
@override final  DateTime endsAt;
@override final  String id;
@override final  String name;
/// 0 for no limit
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


/// Create a copy of RunningPromotionBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$RunningPromotionBodyCopyWith<_RunningPromotionBody> get copyWith => __$RunningPromotionBodyCopyWithImpl<_RunningPromotionBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$RunningPromotionBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _RunningPromotionBody&&(identical(other.allSellers, allSellers) || other.allSellers == allSellers)&&(identical(other.endsAt, endsAt) || other.endsAt == endsAt)&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.perPhonePerDay, perPhonePerDay) || other.perPhonePerDay == perPhonePerDay)&&const DeepCollectionEquality().equals(other.rules, _rules)&&const DeepCollectionEquality().equals(other.sellerIds, _sellerIds));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,allSellers,endsAt,id,name,perPhonePerDay,const DeepCollectionEquality().hash(_rules),const DeepCollectionEquality().hash(_sellerIds));
}

@override
String toString() {
    return 'RunningPromotionBody(allSellers: $allSellers, endsAt: $endsAt, id: $id, name: $name, perPhonePerDay: $perPhonePerDay, rules: $rules, sellerIds: $sellerIds)';
}


}

/// @nodoc
abstract mixin class _$RunningPromotionBodyCopyWith<$Res> implements $RunningPromotionBodyCopyWith<$Res> {
  factory _$RunningPromotionBodyCopyWith(_RunningPromotionBody value, $Res Function(_RunningPromotionBody) _then) = __$RunningPromotionBodyCopyWithImpl;
@override @useResult
$Res call({
 bool allSellers, DateTime endsAt, String id, String name, int perPhonePerDay, List<PromotionRuleBody> rules, List<String> sellerIds
});




}
/// @nodoc
class __$RunningPromotionBodyCopyWithImpl<$Res>
    implements _$RunningPromotionBodyCopyWith<$Res> {
  __$RunningPromotionBodyCopyWithImpl(this._self, this._then);

  final _RunningPromotionBody _self;
  final $Res Function(_RunningPromotionBody) _then;

/// Create a copy of RunningPromotionBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? allSellers = null,Object? endsAt = null,Object? id = null,Object? name = null,Object? perPhonePerDay = null,Object? rules = null,Object? sellerIds = null,}) {
  return _then(_RunningPromotionBody(
allSellers: null == allSellers ? _self.allSellers : allSellers // ignore: cast_nullable_to_non_nullable
as bool,endsAt: null == endsAt ? _self.endsAt : endsAt // ignore: cast_nullable_to_non_nullable
as DateTime,id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,perPhonePerDay: null == perPhonePerDay ? _self.perPhonePerDay : perPhonePerDay // ignore: cast_nullable_to_non_nullable
as int,rules: null == rules ? _self._rules : rules // ignore: cast_nullable_to_non_nullable
as List<PromotionRuleBody>,sellerIds: null == sellerIds ? _self._sellerIds : sellerIds // ignore: cast_nullable_to_non_nullable
as List<String>,
  ));
}


}

// dart format on
