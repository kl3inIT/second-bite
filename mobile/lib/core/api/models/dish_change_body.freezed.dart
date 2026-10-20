// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'dish_change_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$DishChangeBody {

 String? get description; bool? get hidden; String? get ingredients; DishChangeBodyKind? get kind; String? get name; int? get originalPriceVnd; String? get photoId; String? get unit;
/// Create a copy of DishChangeBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$DishChangeBodyCopyWith<DishChangeBody> get copyWith => _$DishChangeBodyCopyWithImpl<DishChangeBody>(this as DishChangeBody, _$identity);

  /// Serializes this DishChangeBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as DishChangeBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is DishChangeBody&&(identical(other.description, _this.description) || other.description == _this.description)&&(identical(other.hidden, _this.hidden) || other.hidden == _this.hidden)&&(identical(other.ingredients, _this.ingredients) || other.ingredients == _this.ingredients)&&(identical(other.kind, _this.kind) || other.kind == _this.kind)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.originalPriceVnd, _this.originalPriceVnd) || other.originalPriceVnd == _this.originalPriceVnd)&&(identical(other.photoId, _this.photoId) || other.photoId == _this.photoId)&&(identical(other.unit, _this.unit) || other.unit == _this.unit));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as DishChangeBody;
  return Object.hash(runtimeType,_this.description,_this.hidden,_this.ingredients,_this.kind,_this.name,_this.originalPriceVnd,_this.photoId,_this.unit);
}

@override
String toString() {
  final _this = this as DishChangeBody;
  return 'DishChangeBody(description: ${_this.description}, hidden: ${_this.hidden}, ingredients: ${_this.ingredients}, kind: ${_this.kind}, name: ${_this.name}, originalPriceVnd: ${_this.originalPriceVnd}, photoId: ${_this.photoId}, unit: ${_this.unit})';
}


}

/// @nodoc
abstract mixin class $DishChangeBodyCopyWith<$Res>  {
  factory $DishChangeBodyCopyWith(DishChangeBody value, $Res Function(DishChangeBody) _then) = _$DishChangeBodyCopyWithImpl;
@useResult
$Res call({
 String? description, bool? hidden, String? ingredients, DishChangeBodyKind? kind, String? name, int? originalPriceVnd, String? photoId, String? unit
});




}
/// @nodoc
class _$DishChangeBodyCopyWithImpl<$Res>
    implements $DishChangeBodyCopyWith<$Res> {
  _$DishChangeBodyCopyWithImpl(this._self, this._then);

  final DishChangeBody _self;
  final $Res Function(DishChangeBody) _then;

/// Create a copy of DishChangeBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? description = freezed,Object? hidden = freezed,Object? ingredients = freezed,Object? kind = freezed,Object? name = freezed,Object? originalPriceVnd = freezed,Object? photoId = freezed,Object? unit = freezed,}) {
  return _then(DishChangeBody(
description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,hidden: freezed == hidden ? _self.hidden : hidden // ignore: cast_nullable_to_non_nullable
as bool?,ingredients: freezed == ingredients ? _self.ingredients : ingredients // ignore: cast_nullable_to_non_nullable
as String?,kind: freezed == kind ? _self.kind : kind // ignore: cast_nullable_to_non_nullable
as DishChangeBodyKind?,name: freezed == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String?,originalPriceVnd: freezed == originalPriceVnd ? _self.originalPriceVnd : originalPriceVnd // ignore: cast_nullable_to_non_nullable
as int?,photoId: freezed == photoId ? _self.photoId : photoId // ignore: cast_nullable_to_non_nullable
as String?,unit: freezed == unit ? _self.unit : unit // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [DishChangeBody].
extension DishChangeBodyPatterns on DishChangeBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _DishChangeBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _DishChangeBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _DishChangeBody value)  $default,){
final _that = this;
switch (_that) {
case _DishChangeBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _DishChangeBody value)?  $default,){
final _that = this;
switch (_that) {
case _DishChangeBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String? description,  bool? hidden,  String? ingredients,  DishChangeBodyKind? kind,  String? name,  int? originalPriceVnd,  String? photoId,  String? unit)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _DishChangeBody() when $default != null:
return $default(_that.description,_that.hidden,_that.ingredients,_that.kind,_that.name,_that.originalPriceVnd,_that.photoId,_that.unit);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String? description,  bool? hidden,  String? ingredients,  DishChangeBodyKind? kind,  String? name,  int? originalPriceVnd,  String? photoId,  String? unit)  $default,) {final _that = this;
switch (_that) {
case _DishChangeBody():
return $default(_that.description,_that.hidden,_that.ingredients,_that.kind,_that.name,_that.originalPriceVnd,_that.photoId,_that.unit);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String? description,  bool? hidden,  String? ingredients,  DishChangeBodyKind? kind,  String? name,  int? originalPriceVnd,  String? photoId,  String? unit)?  $default,) {final _that = this;
switch (_that) {
case _DishChangeBody() when $default != null:
return $default(_that.description,_that.hidden,_that.ingredients,_that.kind,_that.name,_that.originalPriceVnd,_that.photoId,_that.unit);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _DishChangeBody implements DishChangeBody {
  const _DishChangeBody({this.description, this.hidden, this.ingredients, this.kind, this.name, this.originalPriceVnd, this.photoId, this.unit});
  factory _DishChangeBody.fromJson(Map<String, dynamic> json) => _$DishChangeBodyFromJson(json);

@override final  String? description;
@override final  bool? hidden;
@override final  String? ingredients;
@override final  DishChangeBodyKind? kind;
@override final  String? name;
@override final  int? originalPriceVnd;
@override final  String? photoId;
@override final  String? unit;

/// Create a copy of DishChangeBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$DishChangeBodyCopyWith<_DishChangeBody> get copyWith => __$DishChangeBodyCopyWithImpl<_DishChangeBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$DishChangeBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _DishChangeBody&&(identical(other.description, description) || other.description == description)&&(identical(other.hidden, hidden) || other.hidden == hidden)&&(identical(other.ingredients, ingredients) || other.ingredients == ingredients)&&(identical(other.kind, kind) || other.kind == kind)&&(identical(other.name, name) || other.name == name)&&(identical(other.originalPriceVnd, originalPriceVnd) || other.originalPriceVnd == originalPriceVnd)&&(identical(other.photoId, photoId) || other.photoId == photoId)&&(identical(other.unit, unit) || other.unit == unit));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,description,hidden,ingredients,kind,name,originalPriceVnd,photoId,unit);
}

@override
String toString() {
    return 'DishChangeBody(description: $description, hidden: $hidden, ingredients: $ingredients, kind: $kind, name: $name, originalPriceVnd: $originalPriceVnd, photoId: $photoId, unit: $unit)';
}


}

/// @nodoc
abstract mixin class _$DishChangeBodyCopyWith<$Res> implements $DishChangeBodyCopyWith<$Res> {
  factory _$DishChangeBodyCopyWith(_DishChangeBody value, $Res Function(_DishChangeBody) _then) = __$DishChangeBodyCopyWithImpl;
@override @useResult
$Res call({
 String? description, bool? hidden, String? ingredients, DishChangeBodyKind? kind, String? name, int? originalPriceVnd, String? photoId, String? unit
});




}
/// @nodoc
class __$DishChangeBodyCopyWithImpl<$Res>
    implements _$DishChangeBodyCopyWith<$Res> {
  __$DishChangeBodyCopyWithImpl(this._self, this._then);

  final _DishChangeBody _self;
  final $Res Function(_DishChangeBody) _then;

/// Create a copy of DishChangeBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? description = freezed,Object? hidden = freezed,Object? ingredients = freezed,Object? kind = freezed,Object? name = freezed,Object? originalPriceVnd = freezed,Object? photoId = freezed,Object? unit = freezed,}) {
  return _then(_DishChangeBody(
description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,hidden: freezed == hidden ? _self.hidden : hidden // ignore: cast_nullable_to_non_nullable
as bool?,ingredients: freezed == ingredients ? _self.ingredients : ingredients // ignore: cast_nullable_to_non_nullable
as String?,kind: freezed == kind ? _self.kind : kind // ignore: cast_nullable_to_non_nullable
as DishChangeBodyKind?,name: freezed == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String?,originalPriceVnd: freezed == originalPriceVnd ? _self.originalPriceVnd : originalPriceVnd // ignore: cast_nullable_to_non_nullable
as int?,photoId: freezed == photoId ? _self.photoId : photoId // ignore: cast_nullable_to_non_nullable
as String?,unit: freezed == unit ? _self.unit : unit // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
