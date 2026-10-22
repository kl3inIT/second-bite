// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'view_input_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$ViewInputBody {

/// The page's path, as the address bar shows it, such as /vi/sellers/{id}
 String get path;/// utm_source of the address that opened the site, such as qr; anything else than 1 to 40 of a-z, 0-9, _ and - counts as none
 String? get source;
/// Create a copy of ViewInputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ViewInputBodyCopyWith<ViewInputBody> get copyWith => _$ViewInputBodyCopyWithImpl<ViewInputBody>(this as ViewInputBody, _$identity);

  /// Serializes this ViewInputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as ViewInputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ViewInputBody&&(identical(other.path, _this.path) || other.path == _this.path)&&(identical(other.source, _this.source) || other.source == _this.source));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as ViewInputBody;
  return Object.hash(runtimeType,_this.path,_this.source);
}

@override
String toString() {
  final _this = this as ViewInputBody;
  return 'ViewInputBody(path: ${_this.path}, source: ${_this.source})';
}


}

/// @nodoc
abstract mixin class $ViewInputBodyCopyWith<$Res>  {
  factory $ViewInputBodyCopyWith(ViewInputBody value, $Res Function(ViewInputBody) _then) = _$ViewInputBodyCopyWithImpl;
@useResult
$Res call({
 String path, String? source
});




}
/// @nodoc
class _$ViewInputBodyCopyWithImpl<$Res>
    implements $ViewInputBodyCopyWith<$Res> {
  _$ViewInputBodyCopyWithImpl(this._self, this._then);

  final ViewInputBody _self;
  final $Res Function(ViewInputBody) _then;

/// Create a copy of ViewInputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? path = null,Object? source = freezed,}) {
  return _then(ViewInputBody(
path: null == path ? _self.path : path // ignore: cast_nullable_to_non_nullable
as String,source: freezed == source ? _self.source : source // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [ViewInputBody].
extension ViewInputBodyPatterns on ViewInputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ViewInputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ViewInputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ViewInputBody value)  $default,){
final _that = this;
switch (_that) {
case _ViewInputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ViewInputBody value)?  $default,){
final _that = this;
switch (_that) {
case _ViewInputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String path,  String? source)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ViewInputBody() when $default != null:
return $default(_that.path,_that.source);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String path,  String? source)  $default,) {final _that = this;
switch (_that) {
case _ViewInputBody():
return $default(_that.path,_that.source);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String path,  String? source)?  $default,) {final _that = this;
switch (_that) {
case _ViewInputBody() when $default != null:
return $default(_that.path,_that.source);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ViewInputBody implements ViewInputBody {
  const _ViewInputBody({required this.path, this.source});
  factory _ViewInputBody.fromJson(Map<String, dynamic> json) => _$ViewInputBodyFromJson(json);

/// The page's path, as the address bar shows it, such as /vi/sellers/{id}
@override final  String path;
/// utm_source of the address that opened the site, such as qr; anything else than 1 to 40 of a-z, 0-9, _ and - counts as none
@override final  String? source;

/// Create a copy of ViewInputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ViewInputBodyCopyWith<_ViewInputBody> get copyWith => __$ViewInputBodyCopyWithImpl<_ViewInputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ViewInputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _ViewInputBody&&(identical(other.path, path) || other.path == path)&&(identical(other.source, source) || other.source == source));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,path,source);
}

@override
String toString() {
    return 'ViewInputBody(path: $path, source: $source)';
}


}

/// @nodoc
abstract mixin class _$ViewInputBodyCopyWith<$Res> implements $ViewInputBodyCopyWith<$Res> {
  factory _$ViewInputBodyCopyWith(_ViewInputBody value, $Res Function(_ViewInputBody) _then) = __$ViewInputBodyCopyWithImpl;
@override @useResult
$Res call({
 String path, String? source
});




}
/// @nodoc
class __$ViewInputBodyCopyWithImpl<$Res>
    implements _$ViewInputBodyCopyWith<$Res> {
  __$ViewInputBodyCopyWithImpl(this._self, this._then);

  final _ViewInputBody _self;
  final $Res Function(_ViewInputBody) _then;

/// Create a copy of ViewInputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? path = null,Object? source = freezed,}) {
  return _then(_ViewInputBody(
path: null == path ? _self.path : path // ignore: cast_nullable_to_non_nullable
as String,source: freezed == source ? _self.source : source // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
