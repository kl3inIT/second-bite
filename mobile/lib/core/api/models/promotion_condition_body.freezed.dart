// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'promotion_condition_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$PromotionConditionBody {

 PromotionConditionBodyAttribute get attribute;/// eq for customer; in or not_in for seller; gte or lt for subtotal.
/// The name has been replaced because it contains a keyword. Original name: `operator`.
@JsonKey(name: 'operator') PromotionConditionBodyOperatorEnum get operatorEnum;/// new or returning for customer; seller identifiers; one amount in VND for subtotal
 List<String> get values;
/// Create a copy of PromotionConditionBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$PromotionConditionBodyCopyWith<PromotionConditionBody> get copyWith => _$PromotionConditionBodyCopyWithImpl<PromotionConditionBody>(this as PromotionConditionBody, _$identity);

  /// Serializes this PromotionConditionBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as PromotionConditionBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is PromotionConditionBody&&(identical(other.attribute, _this.attribute) || other.attribute == _this.attribute)&&(identical(other.operatorEnum, _this.operatorEnum) || other.operatorEnum == _this.operatorEnum)&&const DeepCollectionEquality().equals(other.values, _this.values));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as PromotionConditionBody;
  return Object.hash(runtimeType,_this.attribute,_this.operatorEnum,const DeepCollectionEquality().hash(_this.values));
}

@override
String toString() {
  final _this = this as PromotionConditionBody;
  return 'PromotionConditionBody(attribute: ${_this.attribute}, operatorEnum: ${_this.operatorEnum}, values: ${_this.values})';
}


}

/// @nodoc
abstract mixin class $PromotionConditionBodyCopyWith<$Res>  {
  factory $PromotionConditionBodyCopyWith(PromotionConditionBody value, $Res Function(PromotionConditionBody) _then) = _$PromotionConditionBodyCopyWithImpl;
@useResult
$Res call({
 PromotionConditionBodyAttribute attribute,@JsonKey(name: 'operator') PromotionConditionBodyOperatorEnum operatorEnum, List<String> values
});




}
/// @nodoc
class _$PromotionConditionBodyCopyWithImpl<$Res>
    implements $PromotionConditionBodyCopyWith<$Res> {
  _$PromotionConditionBodyCopyWithImpl(this._self, this._then);

  final PromotionConditionBody _self;
  final $Res Function(PromotionConditionBody) _then;

/// Create a copy of PromotionConditionBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? attribute = null,Object? operatorEnum = null,Object? values = null,}) {
  return _then(PromotionConditionBody(
attribute: null == attribute ? _self.attribute : attribute // ignore: cast_nullable_to_non_nullable
as PromotionConditionBodyAttribute,operatorEnum: null == operatorEnum ? _self.operatorEnum : operatorEnum // ignore: cast_nullable_to_non_nullable
as PromotionConditionBodyOperatorEnum,values: null == values ? _self.values : values // ignore: cast_nullable_to_non_nullable
as List<String>,
  ));
}

}


/// Adds pattern-matching-related methods to [PromotionConditionBody].
extension PromotionConditionBodyPatterns on PromotionConditionBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _PromotionConditionBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _PromotionConditionBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _PromotionConditionBody value)  $default,){
final _that = this;
switch (_that) {
case _PromotionConditionBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _PromotionConditionBody value)?  $default,){
final _that = this;
switch (_that) {
case _PromotionConditionBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( PromotionConditionBodyAttribute attribute, @JsonKey(name: 'operator')  PromotionConditionBodyOperatorEnum operatorEnum,  List<String> values)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _PromotionConditionBody() when $default != null:
return $default(_that.attribute,_that.operatorEnum,_that.values);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( PromotionConditionBodyAttribute attribute, @JsonKey(name: 'operator')  PromotionConditionBodyOperatorEnum operatorEnum,  List<String> values)  $default,) {final _that = this;
switch (_that) {
case _PromotionConditionBody():
return $default(_that.attribute,_that.operatorEnum,_that.values);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( PromotionConditionBodyAttribute attribute, @JsonKey(name: 'operator')  PromotionConditionBodyOperatorEnum operatorEnum,  List<String> values)?  $default,) {final _that = this;
switch (_that) {
case _PromotionConditionBody() when $default != null:
return $default(_that.attribute,_that.operatorEnum,_that.values);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _PromotionConditionBody implements PromotionConditionBody {
  const _PromotionConditionBody({required this.attribute, @JsonKey(name: 'operator') required this.operatorEnum, required  List<String> values}): _values = values;
  factory _PromotionConditionBody.fromJson(Map<String, dynamic> json) => _$PromotionConditionBodyFromJson(json);

@override final  PromotionConditionBodyAttribute attribute;
/// eq for customer; in or not_in for seller; gte or lt for subtotal.
/// The name has been replaced because it contains a keyword. Original name: `operator`.
@override@JsonKey(name: 'operator') final  PromotionConditionBodyOperatorEnum operatorEnum;
/// new or returning for customer; seller identifiers; one amount in VND for subtotal
 final  List<String> _values;
/// new or returning for customer; seller identifiers; one amount in VND for subtotal
@override List<String> get values {
  if (_values is EqualUnmodifiableListView) return _values;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_values);
}


/// Create a copy of PromotionConditionBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$PromotionConditionBodyCopyWith<_PromotionConditionBody> get copyWith => __$PromotionConditionBodyCopyWithImpl<_PromotionConditionBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$PromotionConditionBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _PromotionConditionBody&&(identical(other.attribute, attribute) || other.attribute == attribute)&&(identical(other.operatorEnum, operatorEnum) || other.operatorEnum == operatorEnum)&&const DeepCollectionEquality().equals(other.values, _values));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,attribute,operatorEnum,const DeepCollectionEquality().hash(_values));
}

@override
String toString() {
    return 'PromotionConditionBody(attribute: $attribute, operatorEnum: $operatorEnum, values: $values)';
}


}

/// @nodoc
abstract mixin class _$PromotionConditionBodyCopyWith<$Res> implements $PromotionConditionBodyCopyWith<$Res> {
  factory _$PromotionConditionBodyCopyWith(_PromotionConditionBody value, $Res Function(_PromotionConditionBody) _then) = __$PromotionConditionBodyCopyWithImpl;
@override @useResult
$Res call({
 PromotionConditionBodyAttribute attribute,@JsonKey(name: 'operator') PromotionConditionBodyOperatorEnum operatorEnum, List<String> values
});




}
/// @nodoc
class __$PromotionConditionBodyCopyWithImpl<$Res>
    implements _$PromotionConditionBodyCopyWith<$Res> {
  __$PromotionConditionBodyCopyWithImpl(this._self, this._then);

  final _PromotionConditionBody _self;
  final $Res Function(_PromotionConditionBody) _then;

/// Create a copy of PromotionConditionBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? attribute = null,Object? operatorEnum = null,Object? values = null,}) {
  return _then(_PromotionConditionBody(
attribute: null == attribute ? _self.attribute : attribute // ignore: cast_nullable_to_non_nullable
as PromotionConditionBodyAttribute,operatorEnum: null == operatorEnum ? _self.operatorEnum : operatorEnum // ignore: cast_nullable_to_non_nullable
as PromotionConditionBodyOperatorEnum,values: null == values ? _self._values : values // ignore: cast_nullable_to_non_nullable
as List<String>,
  ));
}


}

// dart format on
