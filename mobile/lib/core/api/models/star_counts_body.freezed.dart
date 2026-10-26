// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'star_counts_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$StarCountsBody {

 int get fiveStars; int get fourStars; int get oneStar; int get threeStars; int get twoStars;
/// Create a copy of StarCountsBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$StarCountsBodyCopyWith<StarCountsBody> get copyWith => _$StarCountsBodyCopyWithImpl<StarCountsBody>(this as StarCountsBody, _$identity);

  /// Serializes this StarCountsBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as StarCountsBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is StarCountsBody&&(identical(other.fiveStars, _this.fiveStars) || other.fiveStars == _this.fiveStars)&&(identical(other.fourStars, _this.fourStars) || other.fourStars == _this.fourStars)&&(identical(other.oneStar, _this.oneStar) || other.oneStar == _this.oneStar)&&(identical(other.threeStars, _this.threeStars) || other.threeStars == _this.threeStars)&&(identical(other.twoStars, _this.twoStars) || other.twoStars == _this.twoStars));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as StarCountsBody;
  return Object.hash(runtimeType,_this.fiveStars,_this.fourStars,_this.oneStar,_this.threeStars,_this.twoStars);
}

@override
String toString() {
  final _this = this as StarCountsBody;
  return 'StarCountsBody(fiveStars: ${_this.fiveStars}, fourStars: ${_this.fourStars}, oneStar: ${_this.oneStar}, threeStars: ${_this.threeStars}, twoStars: ${_this.twoStars})';
}


}

/// @nodoc
abstract mixin class $StarCountsBodyCopyWith<$Res>  {
  factory $StarCountsBodyCopyWith(StarCountsBody value, $Res Function(StarCountsBody) _then) = _$StarCountsBodyCopyWithImpl;
@useResult
$Res call({
 int fiveStars, int fourStars, int oneStar, int threeStars, int twoStars
});




}
/// @nodoc
class _$StarCountsBodyCopyWithImpl<$Res>
    implements $StarCountsBodyCopyWith<$Res> {
  _$StarCountsBodyCopyWithImpl(this._self, this._then);

  final StarCountsBody _self;
  final $Res Function(StarCountsBody) _then;

/// Create a copy of StarCountsBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? fiveStars = null,Object? fourStars = null,Object? oneStar = null,Object? threeStars = null,Object? twoStars = null,}) {
  return _then(StarCountsBody(
fiveStars: null == fiveStars ? _self.fiveStars : fiveStars // ignore: cast_nullable_to_non_nullable
as int,fourStars: null == fourStars ? _self.fourStars : fourStars // ignore: cast_nullable_to_non_nullable
as int,oneStar: null == oneStar ? _self.oneStar : oneStar // ignore: cast_nullable_to_non_nullable
as int,threeStars: null == threeStars ? _self.threeStars : threeStars // ignore: cast_nullable_to_non_nullable
as int,twoStars: null == twoStars ? _self.twoStars : twoStars // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [StarCountsBody].
extension StarCountsBodyPatterns on StarCountsBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _StarCountsBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _StarCountsBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _StarCountsBody value)  $default,){
final _that = this;
switch (_that) {
case _StarCountsBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _StarCountsBody value)?  $default,){
final _that = this;
switch (_that) {
case _StarCountsBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int fiveStars,  int fourStars,  int oneStar,  int threeStars,  int twoStars)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _StarCountsBody() when $default != null:
return $default(_that.fiveStars,_that.fourStars,_that.oneStar,_that.threeStars,_that.twoStars);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int fiveStars,  int fourStars,  int oneStar,  int threeStars,  int twoStars)  $default,) {final _that = this;
switch (_that) {
case _StarCountsBody():
return $default(_that.fiveStars,_that.fourStars,_that.oneStar,_that.threeStars,_that.twoStars);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int fiveStars,  int fourStars,  int oneStar,  int threeStars,  int twoStars)?  $default,) {final _that = this;
switch (_that) {
case _StarCountsBody() when $default != null:
return $default(_that.fiveStars,_that.fourStars,_that.oneStar,_that.threeStars,_that.twoStars);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _StarCountsBody implements StarCountsBody {
  const _StarCountsBody({required this.fiveStars, required this.fourStars, required this.oneStar, required this.threeStars, required this.twoStars});
  factory _StarCountsBody.fromJson(Map<String, dynamic> json) => _$StarCountsBodyFromJson(json);

@override final  int fiveStars;
@override final  int fourStars;
@override final  int oneStar;
@override final  int threeStars;
@override final  int twoStars;

/// Create a copy of StarCountsBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$StarCountsBodyCopyWith<_StarCountsBody> get copyWith => __$StarCountsBodyCopyWithImpl<_StarCountsBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$StarCountsBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _StarCountsBody&&(identical(other.fiveStars, fiveStars) || other.fiveStars == fiveStars)&&(identical(other.fourStars, fourStars) || other.fourStars == fourStars)&&(identical(other.oneStar, oneStar) || other.oneStar == oneStar)&&(identical(other.threeStars, threeStars) || other.threeStars == threeStars)&&(identical(other.twoStars, twoStars) || other.twoStars == twoStars));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,fiveStars,fourStars,oneStar,threeStars,twoStars);
}

@override
String toString() {
    return 'StarCountsBody(fiveStars: $fiveStars, fourStars: $fourStars, oneStar: $oneStar, threeStars: $threeStars, twoStars: $twoStars)';
}


}

/// @nodoc
abstract mixin class _$StarCountsBodyCopyWith<$Res> implements $StarCountsBodyCopyWith<$Res> {
  factory _$StarCountsBodyCopyWith(_StarCountsBody value, $Res Function(_StarCountsBody) _then) = __$StarCountsBodyCopyWithImpl;
@override @useResult
$Res call({
 int fiveStars, int fourStars, int oneStar, int threeStars, int twoStars
});




}
/// @nodoc
class __$StarCountsBodyCopyWithImpl<$Res>
    implements _$StarCountsBodyCopyWith<$Res> {
  __$StarCountsBodyCopyWithImpl(this._self, this._then);

  final _StarCountsBody _self;
  final $Res Function(_StarCountsBody) _then;

/// Create a copy of StarCountsBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? fiveStars = null,Object? fourStars = null,Object? oneStar = null,Object? threeStars = null,Object? twoStars = null,}) {
  return _then(_StarCountsBody(
fiveStars: null == fiveStars ? _self.fiveStars : fiveStars // ignore: cast_nullable_to_non_nullable
as int,fourStars: null == fourStars ? _self.fourStars : fourStars // ignore: cast_nullable_to_non_nullable
as int,oneStar: null == oneStar ? _self.oneStar : oneStar // ignore: cast_nullable_to_non_nullable
as int,threeStars: null == threeStars ? _self.threeStars : threeStars // ignore: cast_nullable_to_non_nullable
as int,twoStars: null == twoStars ? _self.twoStars : twoStars // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
