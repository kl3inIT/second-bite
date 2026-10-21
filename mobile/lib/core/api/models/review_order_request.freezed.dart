// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'review_order_request.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$ReviewOrderRequest {

 int get stars;/// What went well
 List<ReviewOrderRequestTags> get tags; String? get comment;
/// Create a copy of ReviewOrderRequest
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ReviewOrderRequestCopyWith<ReviewOrderRequest> get copyWith => _$ReviewOrderRequestCopyWithImpl<ReviewOrderRequest>(this as ReviewOrderRequest, _$identity);

  /// Serializes this ReviewOrderRequest to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as ReviewOrderRequest;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ReviewOrderRequest&&(identical(other.stars, _this.stars) || other.stars == _this.stars)&&const DeepCollectionEquality().equals(other.tags, _this.tags)&&(identical(other.comment, _this.comment) || other.comment == _this.comment));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as ReviewOrderRequest;
  return Object.hash(runtimeType,_this.stars,const DeepCollectionEquality().hash(_this.tags),_this.comment);
}

@override
String toString() {
  final _this = this as ReviewOrderRequest;
  return 'ReviewOrderRequest(stars: ${_this.stars}, tags: ${_this.tags}, comment: ${_this.comment})';
}


}

/// @nodoc
abstract mixin class $ReviewOrderRequestCopyWith<$Res>  {
  factory $ReviewOrderRequestCopyWith(ReviewOrderRequest value, $Res Function(ReviewOrderRequest) _then) = _$ReviewOrderRequestCopyWithImpl;
@useResult
$Res call({
 int stars, List<ReviewOrderRequestTags> tags, String? comment
});




}
/// @nodoc
class _$ReviewOrderRequestCopyWithImpl<$Res>
    implements $ReviewOrderRequestCopyWith<$Res> {
  _$ReviewOrderRequestCopyWithImpl(this._self, this._then);

  final ReviewOrderRequest _self;
  final $Res Function(ReviewOrderRequest) _then;

/// Create a copy of ReviewOrderRequest
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? stars = null,Object? tags = null,Object? comment = freezed,}) {
  return _then(ReviewOrderRequest(
stars: null == stars ? _self.stars : stars // ignore: cast_nullable_to_non_nullable
as int,tags: null == tags ? _self.tags : tags // ignore: cast_nullable_to_non_nullable
as List<ReviewOrderRequestTags>,comment: freezed == comment ? _self.comment : comment // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [ReviewOrderRequest].
extension ReviewOrderRequestPatterns on ReviewOrderRequest {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ReviewOrderRequest value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ReviewOrderRequest() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ReviewOrderRequest value)  $default,){
final _that = this;
switch (_that) {
case _ReviewOrderRequest():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ReviewOrderRequest value)?  $default,){
final _that = this;
switch (_that) {
case _ReviewOrderRequest() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int stars,  List<ReviewOrderRequestTags> tags,  String? comment)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ReviewOrderRequest() when $default != null:
return $default(_that.stars,_that.tags,_that.comment);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int stars,  List<ReviewOrderRequestTags> tags,  String? comment)  $default,) {final _that = this;
switch (_that) {
case _ReviewOrderRequest():
return $default(_that.stars,_that.tags,_that.comment);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int stars,  List<ReviewOrderRequestTags> tags,  String? comment)?  $default,) {final _that = this;
switch (_that) {
case _ReviewOrderRequest() when $default != null:
return $default(_that.stars,_that.tags,_that.comment);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ReviewOrderRequest implements ReviewOrderRequest {
  const _ReviewOrderRequest({required this.stars, required  List<ReviewOrderRequestTags> tags, this.comment}): _tags = tags;
  factory _ReviewOrderRequest.fromJson(Map<String, dynamic> json) => _$ReviewOrderRequestFromJson(json);

@override final  int stars;
/// What went well
 final  List<ReviewOrderRequestTags> _tags;
/// What went well
@override List<ReviewOrderRequestTags> get tags {
  if (_tags is EqualUnmodifiableListView) return _tags;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_tags);
}

@override final  String? comment;

/// Create a copy of ReviewOrderRequest
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ReviewOrderRequestCopyWith<_ReviewOrderRequest> get copyWith => __$ReviewOrderRequestCopyWithImpl<_ReviewOrderRequest>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ReviewOrderRequestToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _ReviewOrderRequest&&(identical(other.stars, stars) || other.stars == stars)&&const DeepCollectionEquality().equals(other.tags, _tags)&&(identical(other.comment, comment) || other.comment == comment));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,stars,const DeepCollectionEquality().hash(_tags),comment);
}

@override
String toString() {
    return 'ReviewOrderRequest(stars: $stars, tags: $tags, comment: $comment)';
}


}

/// @nodoc
abstract mixin class _$ReviewOrderRequestCopyWith<$Res> implements $ReviewOrderRequestCopyWith<$Res> {
  factory _$ReviewOrderRequestCopyWith(_ReviewOrderRequest value, $Res Function(_ReviewOrderRequest) _then) = __$ReviewOrderRequestCopyWithImpl;
@override @useResult
$Res call({
 int stars, List<ReviewOrderRequestTags> tags, String? comment
});




}
/// @nodoc
class __$ReviewOrderRequestCopyWithImpl<$Res>
    implements _$ReviewOrderRequestCopyWith<$Res> {
  __$ReviewOrderRequestCopyWithImpl(this._self, this._then);

  final _ReviewOrderRequest _self;
  final $Res Function(_ReviewOrderRequest) _then;

/// Create a copy of ReviewOrderRequest
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? stars = null,Object? tags = null,Object? comment = freezed,}) {
  return _then(_ReviewOrderRequest(
stars: null == stars ? _self.stars : stars // ignore: cast_nullable_to_non_nullable
as int,tags: null == tags ? _self._tags : tags // ignore: cast_nullable_to_non_nullable
as List<ReviewOrderRequestTags>,comment: freezed == comment ? _self.comment : comment // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
