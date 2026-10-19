// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'seller_photo_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$SellerPhotoBody {

 String get id; String get largePath; String get smallPath;
/// Create a copy of SellerPhotoBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$SellerPhotoBodyCopyWith<SellerPhotoBody> get copyWith => _$SellerPhotoBodyCopyWithImpl<SellerPhotoBody>(this as SellerPhotoBody, _$identity);

  /// Serializes this SellerPhotoBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as SellerPhotoBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is SellerPhotoBody&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.largePath, _this.largePath) || other.largePath == _this.largePath)&&(identical(other.smallPath, _this.smallPath) || other.smallPath == _this.smallPath));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as SellerPhotoBody;
  return Object.hash(runtimeType,_this.id,_this.largePath,_this.smallPath);
}

@override
String toString() {
  final _this = this as SellerPhotoBody;
  return 'SellerPhotoBody(id: ${_this.id}, largePath: ${_this.largePath}, smallPath: ${_this.smallPath})';
}


}

/// @nodoc
abstract mixin class $SellerPhotoBodyCopyWith<$Res>  {
  factory $SellerPhotoBodyCopyWith(SellerPhotoBody value, $Res Function(SellerPhotoBody) _then) = _$SellerPhotoBodyCopyWithImpl;
@useResult
$Res call({
 String id, String largePath, String smallPath
});




}
/// @nodoc
class _$SellerPhotoBodyCopyWithImpl<$Res>
    implements $SellerPhotoBodyCopyWith<$Res> {
  _$SellerPhotoBodyCopyWithImpl(this._self, this._then);

  final SellerPhotoBody _self;
  final $Res Function(SellerPhotoBody) _then;

/// Create a copy of SellerPhotoBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? largePath = null,Object? smallPath = null,}) {
  return _then(SellerPhotoBody(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,largePath: null == largePath ? _self.largePath : largePath // ignore: cast_nullable_to_non_nullable
as String,smallPath: null == smallPath ? _self.smallPath : smallPath // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [SellerPhotoBody].
extension SellerPhotoBodyPatterns on SellerPhotoBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _SellerPhotoBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _SellerPhotoBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _SellerPhotoBody value)  $default,){
final _that = this;
switch (_that) {
case _SellerPhotoBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _SellerPhotoBody value)?  $default,){
final _that = this;
switch (_that) {
case _SellerPhotoBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String largePath,  String smallPath)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _SellerPhotoBody() when $default != null:
return $default(_that.id,_that.largePath,_that.smallPath);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String largePath,  String smallPath)  $default,) {final _that = this;
switch (_that) {
case _SellerPhotoBody():
return $default(_that.id,_that.largePath,_that.smallPath);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String largePath,  String smallPath)?  $default,) {final _that = this;
switch (_that) {
case _SellerPhotoBody() when $default != null:
return $default(_that.id,_that.largePath,_that.smallPath);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _SellerPhotoBody implements SellerPhotoBody {
  const _SellerPhotoBody({required this.id, required this.largePath, required this.smallPath});
  factory _SellerPhotoBody.fromJson(Map<String, dynamic> json) => _$SellerPhotoBodyFromJson(json);

@override final  String id;
@override final  String largePath;
@override final  String smallPath;

/// Create a copy of SellerPhotoBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$SellerPhotoBodyCopyWith<_SellerPhotoBody> get copyWith => __$SellerPhotoBodyCopyWithImpl<_SellerPhotoBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$SellerPhotoBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _SellerPhotoBody&&(identical(other.id, id) || other.id == id)&&(identical(other.largePath, largePath) || other.largePath == largePath)&&(identical(other.smallPath, smallPath) || other.smallPath == smallPath));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,id,largePath,smallPath);
}

@override
String toString() {
    return 'SellerPhotoBody(id: $id, largePath: $largePath, smallPath: $smallPath)';
}


}

/// @nodoc
abstract mixin class _$SellerPhotoBodyCopyWith<$Res> implements $SellerPhotoBodyCopyWith<$Res> {
  factory _$SellerPhotoBodyCopyWith(_SellerPhotoBody value, $Res Function(_SellerPhotoBody) _then) = __$SellerPhotoBodyCopyWithImpl;
@override @useResult
$Res call({
 String id, String largePath, String smallPath
});




}
/// @nodoc
class __$SellerPhotoBodyCopyWithImpl<$Res>
    implements _$SellerPhotoBodyCopyWith<$Res> {
  __$SellerPhotoBodyCopyWithImpl(this._self, this._then);

  final _SellerPhotoBody _self;
  final $Res Function(_SellerPhotoBody) _then;

/// Create a copy of SellerPhotoBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? largePath = null,Object? smallPath = null,}) {
  return _then(_SellerPhotoBody(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,largePath: null == largePath ? _self.largePath : largePath // ignore: cast_nullable_to_non_nullable
as String,smallPath: null == smallPath ? _self.smallPath : smallPath // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
