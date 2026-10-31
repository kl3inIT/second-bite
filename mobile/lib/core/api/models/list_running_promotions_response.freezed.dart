// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'list_running_promotions_response.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$ListRunningPromotionsResponse {

 List<RunningPromotionBody> get promotions;
/// Create a copy of ListRunningPromotionsResponse
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ListRunningPromotionsResponseCopyWith<ListRunningPromotionsResponse> get copyWith => _$ListRunningPromotionsResponseCopyWithImpl<ListRunningPromotionsResponse>(this as ListRunningPromotionsResponse, _$identity);

  /// Serializes this ListRunningPromotionsResponse to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as ListRunningPromotionsResponse;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ListRunningPromotionsResponse&&const DeepCollectionEquality().equals(other.promotions, _this.promotions));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as ListRunningPromotionsResponse;
  return Object.hash(runtimeType,const DeepCollectionEquality().hash(_this.promotions));
}

@override
String toString() {
  final _this = this as ListRunningPromotionsResponse;
  return 'ListRunningPromotionsResponse(promotions: ${_this.promotions})';
}


}

/// @nodoc
abstract mixin class $ListRunningPromotionsResponseCopyWith<$Res>  {
  factory $ListRunningPromotionsResponseCopyWith(ListRunningPromotionsResponse value, $Res Function(ListRunningPromotionsResponse) _then) = _$ListRunningPromotionsResponseCopyWithImpl;
@useResult
$Res call({
 List<RunningPromotionBody> promotions
});




}
/// @nodoc
class _$ListRunningPromotionsResponseCopyWithImpl<$Res>
    implements $ListRunningPromotionsResponseCopyWith<$Res> {
  _$ListRunningPromotionsResponseCopyWithImpl(this._self, this._then);

  final ListRunningPromotionsResponse _self;
  final $Res Function(ListRunningPromotionsResponse) _then;

/// Create a copy of ListRunningPromotionsResponse
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? promotions = null,}) {
  return _then(ListRunningPromotionsResponse(
promotions: null == promotions ? _self.promotions : promotions // ignore: cast_nullable_to_non_nullable
as List<RunningPromotionBody>,
  ));
}

}


/// Adds pattern-matching-related methods to [ListRunningPromotionsResponse].
extension ListRunningPromotionsResponsePatterns on ListRunningPromotionsResponse {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ListRunningPromotionsResponse value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ListRunningPromotionsResponse() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ListRunningPromotionsResponse value)  $default,){
final _that = this;
switch (_that) {
case _ListRunningPromotionsResponse():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ListRunningPromotionsResponse value)?  $default,){
final _that = this;
switch (_that) {
case _ListRunningPromotionsResponse() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( List<RunningPromotionBody> promotions)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ListRunningPromotionsResponse() when $default != null:
return $default(_that.promotions);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( List<RunningPromotionBody> promotions)  $default,) {final _that = this;
switch (_that) {
case _ListRunningPromotionsResponse():
return $default(_that.promotions);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( List<RunningPromotionBody> promotions)?  $default,) {final _that = this;
switch (_that) {
case _ListRunningPromotionsResponse() when $default != null:
return $default(_that.promotions);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ListRunningPromotionsResponse implements ListRunningPromotionsResponse {
  const _ListRunningPromotionsResponse({required  List<RunningPromotionBody> promotions}): _promotions = promotions;
  factory _ListRunningPromotionsResponse.fromJson(Map<String, dynamic> json) => _$ListRunningPromotionsResponseFromJson(json);

 final  List<RunningPromotionBody> _promotions;
@override List<RunningPromotionBody> get promotions {
  if (_promotions is EqualUnmodifiableListView) return _promotions;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_promotions);
}


/// Create a copy of ListRunningPromotionsResponse
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ListRunningPromotionsResponseCopyWith<_ListRunningPromotionsResponse> get copyWith => __$ListRunningPromotionsResponseCopyWithImpl<_ListRunningPromotionsResponse>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ListRunningPromotionsResponseToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _ListRunningPromotionsResponse&&const DeepCollectionEquality().equals(other.promotions, _promotions));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,const DeepCollectionEquality().hash(_promotions));
}

@override
String toString() {
    return 'ListRunningPromotionsResponse(promotions: $promotions)';
}


}

/// @nodoc
abstract mixin class _$ListRunningPromotionsResponseCopyWith<$Res> implements $ListRunningPromotionsResponseCopyWith<$Res> {
  factory _$ListRunningPromotionsResponseCopyWith(_ListRunningPromotionsResponse value, $Res Function(_ListRunningPromotionsResponse) _then) = __$ListRunningPromotionsResponseCopyWithImpl;
@override @useResult
$Res call({
 List<RunningPromotionBody> promotions
});




}
/// @nodoc
class __$ListRunningPromotionsResponseCopyWithImpl<$Res>
    implements _$ListRunningPromotionsResponseCopyWith<$Res> {
  __$ListRunningPromotionsResponseCopyWithImpl(this._self, this._then);

  final _ListRunningPromotionsResponse _self;
  final $Res Function(_ListRunningPromotionsResponse) _then;

/// Create a copy of ListRunningPromotionsResponse
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? promotions = null,}) {
  return _then(_ListRunningPromotionsResponse(
promotions: null == promotions ? _self._promotions : promotions // ignore: cast_nullable_to_non_nullable
as List<RunningPromotionBody>,
  ));
}


}

// dart format on
