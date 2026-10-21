// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'review_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$ReviewBody {

 DateTime get createdAt; int get stars; List<String> get tags; String? get comment;
/// Create a copy of ReviewBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ReviewBodyCopyWith<ReviewBody> get copyWith => _$ReviewBodyCopyWithImpl<ReviewBody>(this as ReviewBody, _$identity);

  /// Serializes this ReviewBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as ReviewBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ReviewBody&&(identical(other.createdAt, _this.createdAt) || other.createdAt == _this.createdAt)&&(identical(other.stars, _this.stars) || other.stars == _this.stars)&&const DeepCollectionEquality().equals(other.tags, _this.tags)&&(identical(other.comment, _this.comment) || other.comment == _this.comment));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as ReviewBody;
  return Object.hash(runtimeType,_this.createdAt,_this.stars,const DeepCollectionEquality().hash(_this.tags),_this.comment);
}

@override
String toString() {
  final _this = this as ReviewBody;
  return 'ReviewBody(createdAt: ${_this.createdAt}, stars: ${_this.stars}, tags: ${_this.tags}, comment: ${_this.comment})';
}


}

/// @nodoc
abstract mixin class $ReviewBodyCopyWith<$Res>  {
  factory $ReviewBodyCopyWith(ReviewBody value, $Res Function(ReviewBody) _then) = _$ReviewBodyCopyWithImpl;
@useResult
$Res call({
 DateTime createdAt, int stars, List<String> tags, String? comment
});




}
/// @nodoc
class _$ReviewBodyCopyWithImpl<$Res>
    implements $ReviewBodyCopyWith<$Res> {
  _$ReviewBodyCopyWithImpl(this._self, this._then);

  final ReviewBody _self;
  final $Res Function(ReviewBody) _then;

/// Create a copy of ReviewBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? createdAt = null,Object? stars = null,Object? tags = null,Object? comment = freezed,}) {
  return _then(ReviewBody(
createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,stars: null == stars ? _self.stars : stars // ignore: cast_nullable_to_non_nullable
as int,tags: null == tags ? _self.tags : tags // ignore: cast_nullable_to_non_nullable
as List<String>,comment: freezed == comment ? _self.comment : comment // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [ReviewBody].
extension ReviewBodyPatterns on ReviewBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ReviewBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ReviewBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ReviewBody value)  $default,){
final _that = this;
switch (_that) {
case _ReviewBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ReviewBody value)?  $default,){
final _that = this;
switch (_that) {
case _ReviewBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( DateTime createdAt,  int stars,  List<String> tags,  String? comment)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ReviewBody() when $default != null:
return $default(_that.createdAt,_that.stars,_that.tags,_that.comment);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( DateTime createdAt,  int stars,  List<String> tags,  String? comment)  $default,) {final _that = this;
switch (_that) {
case _ReviewBody():
return $default(_that.createdAt,_that.stars,_that.tags,_that.comment);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( DateTime createdAt,  int stars,  List<String> tags,  String? comment)?  $default,) {final _that = this;
switch (_that) {
case _ReviewBody() when $default != null:
return $default(_that.createdAt,_that.stars,_that.tags,_that.comment);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ReviewBody implements ReviewBody {
  const _ReviewBody({required this.createdAt, required this.stars, required  List<String> tags, this.comment}): _tags = tags;
  factory _ReviewBody.fromJson(Map<String, dynamic> json) => _$ReviewBodyFromJson(json);

@override final  DateTime createdAt;
@override final  int stars;
 final  List<String> _tags;
@override List<String> get tags {
  if (_tags is EqualUnmodifiableListView) return _tags;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_tags);
}

@override final  String? comment;

/// Create a copy of ReviewBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ReviewBodyCopyWith<_ReviewBody> get copyWith => __$ReviewBodyCopyWithImpl<_ReviewBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ReviewBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _ReviewBody&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.stars, stars) || other.stars == stars)&&const DeepCollectionEquality().equals(other.tags, _tags)&&(identical(other.comment, comment) || other.comment == comment));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,createdAt,stars,const DeepCollectionEquality().hash(_tags),comment);
}

@override
String toString() {
    return 'ReviewBody(createdAt: $createdAt, stars: $stars, tags: $tags, comment: $comment)';
}


}

/// @nodoc
abstract mixin class _$ReviewBodyCopyWith<$Res> implements $ReviewBodyCopyWith<$Res> {
  factory _$ReviewBodyCopyWith(_ReviewBody value, $Res Function(_ReviewBody) _then) = __$ReviewBodyCopyWithImpl;
@override @useResult
$Res call({
 DateTime createdAt, int stars, List<String> tags, String? comment
});




}
/// @nodoc
class __$ReviewBodyCopyWithImpl<$Res>
    implements _$ReviewBodyCopyWith<$Res> {
  __$ReviewBodyCopyWithImpl(this._self, this._then);

  final _ReviewBody _self;
  final $Res Function(_ReviewBody) _then;

/// Create a copy of ReviewBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? createdAt = null,Object? stars = null,Object? tags = null,Object? comment = freezed,}) {
  return _then(_ReviewBody(
createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,stars: null == stars ? _self.stars : stars // ignore: cast_nullable_to_non_nullable
as int,tags: null == tags ? _self._tags : tags // ignore: cast_nullable_to_non_nullable
as List<String>,comment: freezed == comment ? _self.comment : comment // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
