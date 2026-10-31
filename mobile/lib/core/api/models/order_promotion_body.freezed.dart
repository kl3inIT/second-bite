// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'order_promotion_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$OrderPromotionBody {

 String get id;/// The promotion's name when the order was placed
 String get name;/// The phone number had no order handed over when this one was placed
 bool get newCustomer;/// The rule's name when the order was placed
 String get rule;
/// Create a copy of OrderPromotionBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$OrderPromotionBodyCopyWith<OrderPromotionBody> get copyWith => _$OrderPromotionBodyCopyWithImpl<OrderPromotionBody>(this as OrderPromotionBody, _$identity);

  /// Serializes this OrderPromotionBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as OrderPromotionBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is OrderPromotionBody&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.newCustomer, _this.newCustomer) || other.newCustomer == _this.newCustomer)&&(identical(other.rule, _this.rule) || other.rule == _this.rule));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as OrderPromotionBody;
  return Object.hash(runtimeType,_this.id,_this.name,_this.newCustomer,_this.rule);
}

@override
String toString() {
  final _this = this as OrderPromotionBody;
  return 'OrderPromotionBody(id: ${_this.id}, name: ${_this.name}, newCustomer: ${_this.newCustomer}, rule: ${_this.rule})';
}


}

/// @nodoc
abstract mixin class $OrderPromotionBodyCopyWith<$Res>  {
  factory $OrderPromotionBodyCopyWith(OrderPromotionBody value, $Res Function(OrderPromotionBody) _then) = _$OrderPromotionBodyCopyWithImpl;
@useResult
$Res call({
 String id, String name, bool newCustomer, String rule
});




}
/// @nodoc
class _$OrderPromotionBodyCopyWithImpl<$Res>
    implements $OrderPromotionBodyCopyWith<$Res> {
  _$OrderPromotionBodyCopyWithImpl(this._self, this._then);

  final OrderPromotionBody _self;
  final $Res Function(OrderPromotionBody) _then;

/// Create a copy of OrderPromotionBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? name = null,Object? newCustomer = null,Object? rule = null,}) {
  return _then(OrderPromotionBody(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,newCustomer: null == newCustomer ? _self.newCustomer : newCustomer // ignore: cast_nullable_to_non_nullable
as bool,rule: null == rule ? _self.rule : rule // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [OrderPromotionBody].
extension OrderPromotionBodyPatterns on OrderPromotionBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _OrderPromotionBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _OrderPromotionBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _OrderPromotionBody value)  $default,){
final _that = this;
switch (_that) {
case _OrderPromotionBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _OrderPromotionBody value)?  $default,){
final _that = this;
switch (_that) {
case _OrderPromotionBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String name,  bool newCustomer,  String rule)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _OrderPromotionBody() when $default != null:
return $default(_that.id,_that.name,_that.newCustomer,_that.rule);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String name,  bool newCustomer,  String rule)  $default,) {final _that = this;
switch (_that) {
case _OrderPromotionBody():
return $default(_that.id,_that.name,_that.newCustomer,_that.rule);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String name,  bool newCustomer,  String rule)?  $default,) {final _that = this;
switch (_that) {
case _OrderPromotionBody() when $default != null:
return $default(_that.id,_that.name,_that.newCustomer,_that.rule);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _OrderPromotionBody implements OrderPromotionBody {
  const _OrderPromotionBody({required this.id, required this.name, required this.newCustomer, required this.rule});
  factory _OrderPromotionBody.fromJson(Map<String, dynamic> json) => _$OrderPromotionBodyFromJson(json);

@override final  String id;
/// The promotion's name when the order was placed
@override final  String name;
/// The phone number had no order handed over when this one was placed
@override final  bool newCustomer;
/// The rule's name when the order was placed
@override final  String rule;

/// Create a copy of OrderPromotionBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$OrderPromotionBodyCopyWith<_OrderPromotionBody> get copyWith => __$OrderPromotionBodyCopyWithImpl<_OrderPromotionBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$OrderPromotionBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _OrderPromotionBody&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.newCustomer, newCustomer) || other.newCustomer == newCustomer)&&(identical(other.rule, rule) || other.rule == rule));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,id,name,newCustomer,rule);
}

@override
String toString() {
    return 'OrderPromotionBody(id: $id, name: $name, newCustomer: $newCustomer, rule: $rule)';
}


}

/// @nodoc
abstract mixin class _$OrderPromotionBodyCopyWith<$Res> implements $OrderPromotionBodyCopyWith<$Res> {
  factory _$OrderPromotionBodyCopyWith(_OrderPromotionBody value, $Res Function(_OrderPromotionBody) _then) = __$OrderPromotionBodyCopyWithImpl;
@override @useResult
$Res call({
 String id, String name, bool newCustomer, String rule
});




}
/// @nodoc
class __$OrderPromotionBodyCopyWithImpl<$Res>
    implements _$OrderPromotionBodyCopyWith<$Res> {
  __$OrderPromotionBodyCopyWithImpl(this._self, this._then);

  final _OrderPromotionBody _self;
  final $Res Function(_OrderPromotionBody) _then;

/// Create a copy of OrderPromotionBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? name = null,Object? newCustomer = null,Object? rule = null,}) {
  return _then(_OrderPromotionBody(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,newCustomer: null == newCustomer ? _self.newCustomer : newCustomer // ignore: cast_nullable_to_non_nullable
as bool,rule: null == rule ? _self.rule : rule // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
