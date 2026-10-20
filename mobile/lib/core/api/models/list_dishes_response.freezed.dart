// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'list_dishes_response.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$ListDishesResponse {

 List<DishBody> get dishes;
/// Create a copy of ListDishesResponse
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ListDishesResponseCopyWith<ListDishesResponse> get copyWith => _$ListDishesResponseCopyWithImpl<ListDishesResponse>(this as ListDishesResponse, _$identity);

  /// Serializes this ListDishesResponse to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as ListDishesResponse;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ListDishesResponse&&const DeepCollectionEquality().equals(other.dishes, _this.dishes));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as ListDishesResponse;
  return Object.hash(runtimeType,const DeepCollectionEquality().hash(_this.dishes));
}

@override
String toString() {
  final _this = this as ListDishesResponse;
  return 'ListDishesResponse(dishes: ${_this.dishes})';
}


}

/// @nodoc
abstract mixin class $ListDishesResponseCopyWith<$Res>  {
  factory $ListDishesResponseCopyWith(ListDishesResponse value, $Res Function(ListDishesResponse) _then) = _$ListDishesResponseCopyWithImpl;
@useResult
$Res call({
 List<DishBody> dishes
});




}
/// @nodoc
class _$ListDishesResponseCopyWithImpl<$Res>
    implements $ListDishesResponseCopyWith<$Res> {
  _$ListDishesResponseCopyWithImpl(this._self, this._then);

  final ListDishesResponse _self;
  final $Res Function(ListDishesResponse) _then;

/// Create a copy of ListDishesResponse
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? dishes = null,}) {
  return _then(ListDishesResponse(
dishes: null == dishes ? _self.dishes : dishes // ignore: cast_nullable_to_non_nullable
as List<DishBody>,
  ));
}

}


/// Adds pattern-matching-related methods to [ListDishesResponse].
extension ListDishesResponsePatterns on ListDishesResponse {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ListDishesResponse value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ListDishesResponse() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ListDishesResponse value)  $default,){
final _that = this;
switch (_that) {
case _ListDishesResponse():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ListDishesResponse value)?  $default,){
final _that = this;
switch (_that) {
case _ListDishesResponse() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( List<DishBody> dishes)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ListDishesResponse() when $default != null:
return $default(_that.dishes);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( List<DishBody> dishes)  $default,) {final _that = this;
switch (_that) {
case _ListDishesResponse():
return $default(_that.dishes);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( List<DishBody> dishes)?  $default,) {final _that = this;
switch (_that) {
case _ListDishesResponse() when $default != null:
return $default(_that.dishes);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ListDishesResponse implements ListDishesResponse {
  const _ListDishesResponse({required  List<DishBody> dishes}): _dishes = dishes;
  factory _ListDishesResponse.fromJson(Map<String, dynamic> json) => _$ListDishesResponseFromJson(json);

 final  List<DishBody> _dishes;
@override List<DishBody> get dishes {
  if (_dishes is EqualUnmodifiableListView) return _dishes;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_dishes);
}


/// Create a copy of ListDishesResponse
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ListDishesResponseCopyWith<_ListDishesResponse> get copyWith => __$ListDishesResponseCopyWithImpl<_ListDishesResponse>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ListDishesResponseToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _ListDishesResponse&&const DeepCollectionEquality().equals(other.dishes, _dishes));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,const DeepCollectionEquality().hash(_dishes));
}

@override
String toString() {
    return 'ListDishesResponse(dishes: $dishes)';
}


}

/// @nodoc
abstract mixin class _$ListDishesResponseCopyWith<$Res> implements $ListDishesResponseCopyWith<$Res> {
  factory _$ListDishesResponseCopyWith(_ListDishesResponse value, $Res Function(_ListDishesResponse) _then) = __$ListDishesResponseCopyWithImpl;
@override @useResult
$Res call({
 List<DishBody> dishes
});




}
/// @nodoc
class __$ListDishesResponseCopyWithImpl<$Res>
    implements _$ListDishesResponseCopyWith<$Res> {
  __$ListDishesResponseCopyWithImpl(this._self, this._then);

  final _ListDishesResponse _self;
  final $Res Function(_ListDishesResponse) _then;

/// Create a copy of ListDishesResponse
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? dishes = null,}) {
  return _then(_ListDishesResponse(
dishes: null == dishes ? _self._dishes : dishes // ignore: cast_nullable_to_non_nullable
as List<DishBody>,
  ));
}


}

// dart format on
