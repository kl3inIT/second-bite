// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'photo_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$PhotoBody {

 int get height; String get id;/// The photo at most 1600 px on its longer side
 String get largePath;/// The photo at most 400 px on its longer side, for lists
 String get smallPath;/// Of the photo as uploaded, turned the way it was taken
 int get width;
/// Create a copy of PhotoBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$PhotoBodyCopyWith<PhotoBody> get copyWith => _$PhotoBodyCopyWithImpl<PhotoBody>(this as PhotoBody, _$identity);

  /// Serializes this PhotoBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as PhotoBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is PhotoBody&&(identical(other.height, _this.height) || other.height == _this.height)&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.largePath, _this.largePath) || other.largePath == _this.largePath)&&(identical(other.smallPath, _this.smallPath) || other.smallPath == _this.smallPath)&&(identical(other.width, _this.width) || other.width == _this.width));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as PhotoBody;
  return Object.hash(runtimeType,_this.height,_this.id,_this.largePath,_this.smallPath,_this.width);
}

@override
String toString() {
  final _this = this as PhotoBody;
  return 'PhotoBody(height: ${_this.height}, id: ${_this.id}, largePath: ${_this.largePath}, smallPath: ${_this.smallPath}, width: ${_this.width})';
}


}

/// @nodoc
abstract mixin class $PhotoBodyCopyWith<$Res>  {
  factory $PhotoBodyCopyWith(PhotoBody value, $Res Function(PhotoBody) _then) = _$PhotoBodyCopyWithImpl;
@useResult
$Res call({
 int height, String id, String largePath, String smallPath, int width
});




}
/// @nodoc
class _$PhotoBodyCopyWithImpl<$Res>
    implements $PhotoBodyCopyWith<$Res> {
  _$PhotoBodyCopyWithImpl(this._self, this._then);

  final PhotoBody _self;
  final $Res Function(PhotoBody) _then;

/// Create a copy of PhotoBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? height = null,Object? id = null,Object? largePath = null,Object? smallPath = null,Object? width = null,}) {
  return _then(PhotoBody(
height: null == height ? _self.height : height // ignore: cast_nullable_to_non_nullable
as int,id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,largePath: null == largePath ? _self.largePath : largePath // ignore: cast_nullable_to_non_nullable
as String,smallPath: null == smallPath ? _self.smallPath : smallPath // ignore: cast_nullable_to_non_nullable
as String,width: null == width ? _self.width : width // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [PhotoBody].
extension PhotoBodyPatterns on PhotoBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _PhotoBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _PhotoBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _PhotoBody value)  $default,){
final _that = this;
switch (_that) {
case _PhotoBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _PhotoBody value)?  $default,){
final _that = this;
switch (_that) {
case _PhotoBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int height,  String id,  String largePath,  String smallPath,  int width)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _PhotoBody() when $default != null:
return $default(_that.height,_that.id,_that.largePath,_that.smallPath,_that.width);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int height,  String id,  String largePath,  String smallPath,  int width)  $default,) {final _that = this;
switch (_that) {
case _PhotoBody():
return $default(_that.height,_that.id,_that.largePath,_that.smallPath,_that.width);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int height,  String id,  String largePath,  String smallPath,  int width)?  $default,) {final _that = this;
switch (_that) {
case _PhotoBody() when $default != null:
return $default(_that.height,_that.id,_that.largePath,_that.smallPath,_that.width);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _PhotoBody implements PhotoBody {
  const _PhotoBody({required this.height, required this.id, required this.largePath, required this.smallPath, required this.width});
  factory _PhotoBody.fromJson(Map<String, dynamic> json) => _$PhotoBodyFromJson(json);

@override final  int height;
@override final  String id;
/// The photo at most 1600 px on its longer side
@override final  String largePath;
/// The photo at most 400 px on its longer side, for lists
@override final  String smallPath;
/// Of the photo as uploaded, turned the way it was taken
@override final  int width;

/// Create a copy of PhotoBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$PhotoBodyCopyWith<_PhotoBody> get copyWith => __$PhotoBodyCopyWithImpl<_PhotoBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$PhotoBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _PhotoBody&&(identical(other.height, height) || other.height == height)&&(identical(other.id, id) || other.id == id)&&(identical(other.largePath, largePath) || other.largePath == largePath)&&(identical(other.smallPath, smallPath) || other.smallPath == smallPath)&&(identical(other.width, width) || other.width == width));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,height,id,largePath,smallPath,width);
}

@override
String toString() {
    return 'PhotoBody(height: $height, id: $id, largePath: $largePath, smallPath: $smallPath, width: $width)';
}


}

/// @nodoc
abstract mixin class _$PhotoBodyCopyWith<$Res> implements $PhotoBodyCopyWith<$Res> {
  factory _$PhotoBodyCopyWith(_PhotoBody value, $Res Function(_PhotoBody) _then) = __$PhotoBodyCopyWithImpl;
@override @useResult
$Res call({
 int height, String id, String largePath, String smallPath, int width
});




}
/// @nodoc
class __$PhotoBodyCopyWithImpl<$Res>
    implements _$PhotoBodyCopyWith<$Res> {
  __$PhotoBodyCopyWithImpl(this._self, this._then);

  final _PhotoBody _self;
  final $Res Function(_PhotoBody) _then;

/// Create a copy of PhotoBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? height = null,Object? id = null,Object? largePath = null,Object? smallPath = null,Object? width = null,}) {
  return _then(_PhotoBody(
height: null == height ? _self.height : height // ignore: cast_nullable_to_non_nullable
as int,id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,largePath: null == largePath ? _self.largePath : largePath // ignore: cast_nullable_to_non_nullable
as String,smallPath: null == smallPath ? _self.smallPath : smallPath // ignore: cast_nullable_to_non_nullable
as String,width: null == width ? _self.width : width // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
