// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'dish_details_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$DishDetailsBody {

 DishDetailsBodyKind get kind; String get name;/// From POST /photos, or a photo the seller already shows
 String get photoId; String? get description;/// Keeps the dish out of the list a post is picked from
 bool? get hidden;/// What the dish is made of and may contain, allergens included
 String? get ingredients;/// What one unit normally sells for; a post starts from it
 int? get originalPriceVnd;/// What one unit is called; "suất" when empty
 String? get unit;
/// Create a copy of DishDetailsBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$DishDetailsBodyCopyWith<DishDetailsBody> get copyWith => _$DishDetailsBodyCopyWithImpl<DishDetailsBody>(this as DishDetailsBody, _$identity);

  /// Serializes this DishDetailsBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as DishDetailsBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is DishDetailsBody&&(identical(other.kind, _this.kind) || other.kind == _this.kind)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.photoId, _this.photoId) || other.photoId == _this.photoId)&&(identical(other.description, _this.description) || other.description == _this.description)&&(identical(other.hidden, _this.hidden) || other.hidden == _this.hidden)&&(identical(other.ingredients, _this.ingredients) || other.ingredients == _this.ingredients)&&(identical(other.originalPriceVnd, _this.originalPriceVnd) || other.originalPriceVnd == _this.originalPriceVnd)&&(identical(other.unit, _this.unit) || other.unit == _this.unit));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as DishDetailsBody;
  return Object.hash(runtimeType,_this.kind,_this.name,_this.photoId,_this.description,_this.hidden,_this.ingredients,_this.originalPriceVnd,_this.unit);
}

@override
String toString() {
  final _this = this as DishDetailsBody;
  return 'DishDetailsBody(kind: ${_this.kind}, name: ${_this.name}, photoId: ${_this.photoId}, description: ${_this.description}, hidden: ${_this.hidden}, ingredients: ${_this.ingredients}, originalPriceVnd: ${_this.originalPriceVnd}, unit: ${_this.unit})';
}


}

/// @nodoc
abstract mixin class $DishDetailsBodyCopyWith<$Res>  {
  factory $DishDetailsBodyCopyWith(DishDetailsBody value, $Res Function(DishDetailsBody) _then) = _$DishDetailsBodyCopyWithImpl;
@useResult
$Res call({
 DishDetailsBodyKind kind, String name, String photoId, String? description, bool? hidden, String? ingredients, int? originalPriceVnd, String? unit
});




}
/// @nodoc
class _$DishDetailsBodyCopyWithImpl<$Res>
    implements $DishDetailsBodyCopyWith<$Res> {
  _$DishDetailsBodyCopyWithImpl(this._self, this._then);

  final DishDetailsBody _self;
  final $Res Function(DishDetailsBody) _then;

/// Create a copy of DishDetailsBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? kind = null,Object? name = null,Object? photoId = null,Object? description = freezed,Object? hidden = freezed,Object? ingredients = freezed,Object? originalPriceVnd = freezed,Object? unit = freezed,}) {
  return _then(DishDetailsBody(
kind: null == kind ? _self.kind : kind // ignore: cast_nullable_to_non_nullable
as DishDetailsBodyKind,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,photoId: null == photoId ? _self.photoId : photoId // ignore: cast_nullable_to_non_nullable
as String,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,hidden: freezed == hidden ? _self.hidden : hidden // ignore: cast_nullable_to_non_nullable
as bool?,ingredients: freezed == ingredients ? _self.ingredients : ingredients // ignore: cast_nullable_to_non_nullable
as String?,originalPriceVnd: freezed == originalPriceVnd ? _self.originalPriceVnd : originalPriceVnd // ignore: cast_nullable_to_non_nullable
as int?,unit: freezed == unit ? _self.unit : unit // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [DishDetailsBody].
extension DishDetailsBodyPatterns on DishDetailsBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _DishDetailsBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _DishDetailsBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _DishDetailsBody value)  $default,){
final _that = this;
switch (_that) {
case _DishDetailsBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _DishDetailsBody value)?  $default,){
final _that = this;
switch (_that) {
case _DishDetailsBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( DishDetailsBodyKind kind,  String name,  String photoId,  String? description,  bool? hidden,  String? ingredients,  int? originalPriceVnd,  String? unit)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _DishDetailsBody() when $default != null:
return $default(_that.kind,_that.name,_that.photoId,_that.description,_that.hidden,_that.ingredients,_that.originalPriceVnd,_that.unit);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( DishDetailsBodyKind kind,  String name,  String photoId,  String? description,  bool? hidden,  String? ingredients,  int? originalPriceVnd,  String? unit)  $default,) {final _that = this;
switch (_that) {
case _DishDetailsBody():
return $default(_that.kind,_that.name,_that.photoId,_that.description,_that.hidden,_that.ingredients,_that.originalPriceVnd,_that.unit);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( DishDetailsBodyKind kind,  String name,  String photoId,  String? description,  bool? hidden,  String? ingredients,  int? originalPriceVnd,  String? unit)?  $default,) {final _that = this;
switch (_that) {
case _DishDetailsBody() when $default != null:
return $default(_that.kind,_that.name,_that.photoId,_that.description,_that.hidden,_that.ingredients,_that.originalPriceVnd,_that.unit);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _DishDetailsBody implements DishDetailsBody {
  const _DishDetailsBody({required this.kind, required this.name, required this.photoId, this.description, this.hidden, this.ingredients, this.originalPriceVnd, this.unit});
  factory _DishDetailsBody.fromJson(Map<String, dynamic> json) => _$DishDetailsBodyFromJson(json);

@override final  DishDetailsBodyKind kind;
@override final  String name;
/// From POST /photos, or a photo the seller already shows
@override final  String photoId;
@override final  String? description;
/// Keeps the dish out of the list a post is picked from
@override final  bool? hidden;
/// What the dish is made of and may contain, allergens included
@override final  String? ingredients;
/// What one unit normally sells for; a post starts from it
@override final  int? originalPriceVnd;
/// What one unit is called; "suất" when empty
@override final  String? unit;

/// Create a copy of DishDetailsBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$DishDetailsBodyCopyWith<_DishDetailsBody> get copyWith => __$DishDetailsBodyCopyWithImpl<_DishDetailsBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$DishDetailsBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _DishDetailsBody&&(identical(other.kind, kind) || other.kind == kind)&&(identical(other.name, name) || other.name == name)&&(identical(other.photoId, photoId) || other.photoId == photoId)&&(identical(other.description, description) || other.description == description)&&(identical(other.hidden, hidden) || other.hidden == hidden)&&(identical(other.ingredients, ingredients) || other.ingredients == ingredients)&&(identical(other.originalPriceVnd, originalPriceVnd) || other.originalPriceVnd == originalPriceVnd)&&(identical(other.unit, unit) || other.unit == unit));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,kind,name,photoId,description,hidden,ingredients,originalPriceVnd,unit);
}

@override
String toString() {
    return 'DishDetailsBody(kind: $kind, name: $name, photoId: $photoId, description: $description, hidden: $hidden, ingredients: $ingredients, originalPriceVnd: $originalPriceVnd, unit: $unit)';
}


}

/// @nodoc
abstract mixin class _$DishDetailsBodyCopyWith<$Res> implements $DishDetailsBodyCopyWith<$Res> {
  factory _$DishDetailsBodyCopyWith(_DishDetailsBody value, $Res Function(_DishDetailsBody) _then) = __$DishDetailsBodyCopyWithImpl;
@override @useResult
$Res call({
 DishDetailsBodyKind kind, String name, String photoId, String? description, bool? hidden, String? ingredients, int? originalPriceVnd, String? unit
});




}
/// @nodoc
class __$DishDetailsBodyCopyWithImpl<$Res>
    implements _$DishDetailsBodyCopyWith<$Res> {
  __$DishDetailsBodyCopyWithImpl(this._self, this._then);

  final _DishDetailsBody _self;
  final $Res Function(_DishDetailsBody) _then;

/// Create a copy of DishDetailsBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? kind = null,Object? name = null,Object? photoId = null,Object? description = freezed,Object? hidden = freezed,Object? ingredients = freezed,Object? originalPriceVnd = freezed,Object? unit = freezed,}) {
  return _then(_DishDetailsBody(
kind: null == kind ? _self.kind : kind // ignore: cast_nullable_to_non_nullable
as DishDetailsBodyKind,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,photoId: null == photoId ? _self.photoId : photoId // ignore: cast_nullable_to_non_nullable
as String,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,hidden: freezed == hidden ? _self.hidden : hidden // ignore: cast_nullable_to_non_nullable
as bool?,ingredients: freezed == ingredients ? _self.ingredients : ingredients // ignore: cast_nullable_to_non_nullable
as String?,originalPriceVnd: freezed == originalPriceVnd ? _self.originalPriceVnd : originalPriceVnd // ignore: cast_nullable_to_non_nullable
as int?,unit: freezed == unit ? _self.unit : unit // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
