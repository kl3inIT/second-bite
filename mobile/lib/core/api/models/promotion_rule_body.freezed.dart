// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'promotion_rule_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$PromotionRuleBody {

/// All must hold; none means every order
 List<PromotionConditionBody> get conditions; String get name;/// Taken off the order's dishes, never more than they cost
 PromotionRewardBody get reward;
/// Create a copy of PromotionRuleBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$PromotionRuleBodyCopyWith<PromotionRuleBody> get copyWith => _$PromotionRuleBodyCopyWithImpl<PromotionRuleBody>(this as PromotionRuleBody, _$identity);

  /// Serializes this PromotionRuleBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as PromotionRuleBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is PromotionRuleBody&&const DeepCollectionEquality().equals(other.conditions, _this.conditions)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.reward, _this.reward) || other.reward == _this.reward));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as PromotionRuleBody;
  return Object.hash(runtimeType,const DeepCollectionEquality().hash(_this.conditions),_this.name,_this.reward);
}

@override
String toString() {
  final _this = this as PromotionRuleBody;
  return 'PromotionRuleBody(conditions: ${_this.conditions}, name: ${_this.name}, reward: ${_this.reward})';
}


}

/// @nodoc
abstract mixin class $PromotionRuleBodyCopyWith<$Res>  {
  factory $PromotionRuleBodyCopyWith(PromotionRuleBody value, $Res Function(PromotionRuleBody) _then) = _$PromotionRuleBodyCopyWithImpl;
@useResult
$Res call({
 List<PromotionConditionBody> conditions, String name, PromotionRewardBody reward
});


$PromotionRewardBodyCopyWith<$Res> get reward;

}
/// @nodoc
class _$PromotionRuleBodyCopyWithImpl<$Res>
    implements $PromotionRuleBodyCopyWith<$Res> {
  _$PromotionRuleBodyCopyWithImpl(this._self, this._then);

  final PromotionRuleBody _self;
  final $Res Function(PromotionRuleBody) _then;

/// Create a copy of PromotionRuleBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? conditions = null,Object? name = null,Object? reward = null,}) {
  return _then(PromotionRuleBody(
conditions: null == conditions ? _self.conditions : conditions // ignore: cast_nullable_to_non_nullable
as List<PromotionConditionBody>,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,reward: null == reward ? _self.reward : reward // ignore: cast_nullable_to_non_nullable
as PromotionRewardBody,
  ));
}
/// Create a copy of PromotionRuleBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$PromotionRewardBodyCopyWith<$Res> get reward {
  
  return $PromotionRewardBodyCopyWith<$Res>(_self.reward, (value) {
    return _then(_self.copyWith(reward: value));
  });
}
}


/// Adds pattern-matching-related methods to [PromotionRuleBody].
extension PromotionRuleBodyPatterns on PromotionRuleBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _PromotionRuleBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _PromotionRuleBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _PromotionRuleBody value)  $default,){
final _that = this;
switch (_that) {
case _PromotionRuleBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _PromotionRuleBody value)?  $default,){
final _that = this;
switch (_that) {
case _PromotionRuleBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( List<PromotionConditionBody> conditions,  String name,  PromotionRewardBody reward)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _PromotionRuleBody() when $default != null:
return $default(_that.conditions,_that.name,_that.reward);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( List<PromotionConditionBody> conditions,  String name,  PromotionRewardBody reward)  $default,) {final _that = this;
switch (_that) {
case _PromotionRuleBody():
return $default(_that.conditions,_that.name,_that.reward);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( List<PromotionConditionBody> conditions,  String name,  PromotionRewardBody reward)?  $default,) {final _that = this;
switch (_that) {
case _PromotionRuleBody() when $default != null:
return $default(_that.conditions,_that.name,_that.reward);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _PromotionRuleBody implements PromotionRuleBody {
  const _PromotionRuleBody({required  List<PromotionConditionBody> conditions, required this.name, required this.reward}): _conditions = conditions;
  factory _PromotionRuleBody.fromJson(Map<String, dynamic> json) => _$PromotionRuleBodyFromJson(json);

/// All must hold; none means every order
 final  List<PromotionConditionBody> _conditions;
/// All must hold; none means every order
@override List<PromotionConditionBody> get conditions {
  if (_conditions is EqualUnmodifiableListView) return _conditions;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_conditions);
}

@override final  String name;
/// Taken off the order's dishes, never more than they cost
@override final  PromotionRewardBody reward;

/// Create a copy of PromotionRuleBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$PromotionRuleBodyCopyWith<_PromotionRuleBody> get copyWith => __$PromotionRuleBodyCopyWithImpl<_PromotionRuleBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$PromotionRuleBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _PromotionRuleBody&&const DeepCollectionEquality().equals(other.conditions, _conditions)&&(identical(other.name, name) || other.name == name)&&(identical(other.reward, reward) || other.reward == reward));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,const DeepCollectionEquality().hash(_conditions),name,reward);
}

@override
String toString() {
    return 'PromotionRuleBody(conditions: $conditions, name: $name, reward: $reward)';
}


}

/// @nodoc
abstract mixin class _$PromotionRuleBodyCopyWith<$Res> implements $PromotionRuleBodyCopyWith<$Res> {
  factory _$PromotionRuleBodyCopyWith(_PromotionRuleBody value, $Res Function(_PromotionRuleBody) _then) = __$PromotionRuleBodyCopyWithImpl;
@override @useResult
$Res call({
 List<PromotionConditionBody> conditions, String name, PromotionRewardBody reward
});


@override $PromotionRewardBodyCopyWith<$Res> get reward;

}
/// @nodoc
class __$PromotionRuleBodyCopyWithImpl<$Res>
    implements _$PromotionRuleBodyCopyWith<$Res> {
  __$PromotionRuleBodyCopyWithImpl(this._self, this._then);

  final _PromotionRuleBody _self;
  final $Res Function(_PromotionRuleBody) _then;

/// Create a copy of PromotionRuleBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? conditions = null,Object? name = null,Object? reward = null,}) {
  return _then(_PromotionRuleBody(
conditions: null == conditions ? _self._conditions : conditions // ignore: cast_nullable_to_non_nullable
as List<PromotionConditionBody>,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,reward: null == reward ? _self.reward : reward // ignore: cast_nullable_to_non_nullable
as PromotionRewardBody,
  ));
}

/// Create a copy of PromotionRuleBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$PromotionRewardBodyCopyWith<$Res> get reward {
  
  return $PromotionRewardBodyCopyWith<$Res>(_self.reward, (value) {
    return _then(_self.copyWith(reward: value));
  });
}
}

// dart format on
