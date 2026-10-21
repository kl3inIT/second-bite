// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'places_output_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$PlacesOutputBody {

/// Up to five places in Hanoi; none when nothing matches or the search does not answer
 List<PlaceBody>? get places;
/// Create a copy of PlacesOutputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$PlacesOutputBodyCopyWith<PlacesOutputBody> get copyWith => _$PlacesOutputBodyCopyWithImpl<PlacesOutputBody>(this as PlacesOutputBody, _$identity);

  /// Serializes this PlacesOutputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as PlacesOutputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is PlacesOutputBody&&const DeepCollectionEquality().equals(other.places, _this.places));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as PlacesOutputBody;
  return Object.hash(runtimeType,const DeepCollectionEquality().hash(_this.places));
}

@override
String toString() {
  final _this = this as PlacesOutputBody;
  return 'PlacesOutputBody(places: ${_this.places})';
}


}

/// @nodoc
abstract mixin class $PlacesOutputBodyCopyWith<$Res>  {
  factory $PlacesOutputBodyCopyWith(PlacesOutputBody value, $Res Function(PlacesOutputBody) _then) = _$PlacesOutputBodyCopyWithImpl;
@useResult
$Res call({
 List<PlaceBody>? places
});




}
/// @nodoc
class _$PlacesOutputBodyCopyWithImpl<$Res>
    implements $PlacesOutputBodyCopyWith<$Res> {
  _$PlacesOutputBodyCopyWithImpl(this._self, this._then);

  final PlacesOutputBody _self;
  final $Res Function(PlacesOutputBody) _then;

/// Create a copy of PlacesOutputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? places = freezed,}) {
  return _then(PlacesOutputBody(
places: freezed == places ? _self.places : places // ignore: cast_nullable_to_non_nullable
as List<PlaceBody>?,
  ));
}

}


/// Adds pattern-matching-related methods to [PlacesOutputBody].
extension PlacesOutputBodyPatterns on PlacesOutputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _PlacesOutputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _PlacesOutputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _PlacesOutputBody value)  $default,){
final _that = this;
switch (_that) {
case _PlacesOutputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _PlacesOutputBody value)?  $default,){
final _that = this;
switch (_that) {
case _PlacesOutputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( List<PlaceBody>? places)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _PlacesOutputBody() when $default != null:
return $default(_that.places);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( List<PlaceBody>? places)  $default,) {final _that = this;
switch (_that) {
case _PlacesOutputBody():
return $default(_that.places);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( List<PlaceBody>? places)?  $default,) {final _that = this;
switch (_that) {
case _PlacesOutputBody() when $default != null:
return $default(_that.places);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _PlacesOutputBody implements PlacesOutputBody {
  const _PlacesOutputBody({required  List<PlaceBody>? places}): _places = places;
  factory _PlacesOutputBody.fromJson(Map<String, dynamic> json) => _$PlacesOutputBodyFromJson(json);

/// Up to five places in Hanoi; none when nothing matches or the search does not answer
 final  List<PlaceBody>? _places;
/// Up to five places in Hanoi; none when nothing matches or the search does not answer
@override List<PlaceBody>? get places {
  final value = _places;
  if (value == null) return null;
  if (_places is EqualUnmodifiableListView) return _places;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(value);
}


/// Create a copy of PlacesOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$PlacesOutputBodyCopyWith<_PlacesOutputBody> get copyWith => __$PlacesOutputBodyCopyWithImpl<_PlacesOutputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$PlacesOutputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _PlacesOutputBody&&const DeepCollectionEquality().equals(other.places, _places));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,const DeepCollectionEquality().hash(_places));
}

@override
String toString() {
    return 'PlacesOutputBody(places: $places)';
}


}

/// @nodoc
abstract mixin class _$PlacesOutputBodyCopyWith<$Res> implements $PlacesOutputBodyCopyWith<$Res> {
  factory _$PlacesOutputBodyCopyWith(_PlacesOutputBody value, $Res Function(_PlacesOutputBody) _then) = __$PlacesOutputBodyCopyWithImpl;
@override @useResult
$Res call({
 List<PlaceBody>? places
});




}
/// @nodoc
class __$PlacesOutputBodyCopyWithImpl<$Res>
    implements _$PlacesOutputBodyCopyWith<$Res> {
  __$PlacesOutputBodyCopyWithImpl(this._self, this._then);

  final _PlacesOutputBody _self;
  final $Res Function(_PlacesOutputBody) _then;

/// Create a copy of PlacesOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? places = freezed,}) {
  return _then(_PlacesOutputBody(
places: freezed == places ? _self._places : places // ignore: cast_nullable_to_non_nullable
as List<PlaceBody>?,
  ));
}


}

// dart format on
