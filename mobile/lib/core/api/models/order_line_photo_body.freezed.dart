// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'order_line_photo_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$OrderLinePhotoBody {

 String get id; String get largePath; String get smallPath;
/// Create a copy of OrderLinePhotoBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$OrderLinePhotoBodyCopyWith<OrderLinePhotoBody> get copyWith => _$OrderLinePhotoBodyCopyWithImpl<OrderLinePhotoBody>(this as OrderLinePhotoBody, _$identity);

  /// Serializes this OrderLinePhotoBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as OrderLinePhotoBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is OrderLinePhotoBody&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.largePath, _this.largePath) || other.largePath == _this.largePath)&&(identical(other.smallPath, _this.smallPath) || other.smallPath == _this.smallPath));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as OrderLinePhotoBody;
  return Object.hash(runtimeType,_this.id,_this.largePath,_this.smallPath);
}

@override
String toString() {
  final _this = this as OrderLinePhotoBody;
  return 'OrderLinePhotoBody(id: ${_this.id}, largePath: ${_this.largePath}, smallPath: ${_this.smallPath})';
}


}

/// @nodoc
abstract mixin class $OrderLinePhotoBodyCopyWith<$Res>  {
  factory $OrderLinePhotoBodyCopyWith(OrderLinePhotoBody value, $Res Function(OrderLinePhotoBody) _then) = _$OrderLinePhotoBodyCopyWithImpl;
@useResult
$Res call({
 String id, String largePath, String smallPath
});




}
/// @nodoc
class _$OrderLinePhotoBodyCopyWithImpl<$Res>
    implements $OrderLinePhotoBodyCopyWith<$Res> {
  _$OrderLinePhotoBodyCopyWithImpl(this._self, this._then);

  final OrderLinePhotoBody _self;
  final $Res Function(OrderLinePhotoBody) _then;

/// Create a copy of OrderLinePhotoBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? largePath = null,Object? smallPath = null,}) {
  return _then(OrderLinePhotoBody(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,largePath: null == largePath ? _self.largePath : largePath // ignore: cast_nullable_to_non_nullable
as String,smallPath: null == smallPath ? _self.smallPath : smallPath // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [OrderLinePhotoBody].
extension OrderLinePhotoBodyPatterns on OrderLinePhotoBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _OrderLinePhotoBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _OrderLinePhotoBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _OrderLinePhotoBody value)  $default,){
final _that = this;
switch (_that) {
case _OrderLinePhotoBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _OrderLinePhotoBody value)?  $default,){
final _that = this;
switch (_that) {
case _OrderLinePhotoBody() when $default != null:
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
case _OrderLinePhotoBody() when $default != null:
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
case _OrderLinePhotoBody():
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
case _OrderLinePhotoBody() when $default != null:
return $default(_that.id,_that.largePath,_that.smallPath);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _OrderLinePhotoBody implements OrderLinePhotoBody {
  const _OrderLinePhotoBody({required this.id, required this.largePath, required this.smallPath});
  factory _OrderLinePhotoBody.fromJson(Map<String, dynamic> json) => _$OrderLinePhotoBodyFromJson(json);

@override final  String id;
@override final  String largePath;
@override final  String smallPath;

/// Create a copy of OrderLinePhotoBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$OrderLinePhotoBodyCopyWith<_OrderLinePhotoBody> get copyWith => __$OrderLinePhotoBodyCopyWithImpl<_OrderLinePhotoBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$OrderLinePhotoBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _OrderLinePhotoBody&&(identical(other.id, id) || other.id == id)&&(identical(other.largePath, largePath) || other.largePath == largePath)&&(identical(other.smallPath, smallPath) || other.smallPath == smallPath));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,id,largePath,smallPath);
}

@override
String toString() {
    return 'OrderLinePhotoBody(id: $id, largePath: $largePath, smallPath: $smallPath)';
}


}

/// @nodoc
abstract mixin class _$OrderLinePhotoBodyCopyWith<$Res> implements $OrderLinePhotoBodyCopyWith<$Res> {
  factory _$OrderLinePhotoBodyCopyWith(_OrderLinePhotoBody value, $Res Function(_OrderLinePhotoBody) _then) = __$OrderLinePhotoBodyCopyWithImpl;
@override @useResult
$Res call({
 String id, String largePath, String smallPath
});




}
/// @nodoc
class __$OrderLinePhotoBodyCopyWithImpl<$Res>
    implements _$OrderLinePhotoBodyCopyWith<$Res> {
  __$OrderLinePhotoBodyCopyWithImpl(this._self, this._then);

  final _OrderLinePhotoBody _self;
  final $Res Function(_OrderLinePhotoBody) _then;

/// Create a copy of OrderLinePhotoBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? largePath = null,Object? smallPath = null,}) {
  return _then(_OrderLinePhotoBody(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,largePath: null == largePath ? _self.largePath : largePath // ignore: cast_nullable_to_non_nullable
as String,smallPath: null == smallPath ? _self.smallPath : smallPath // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
