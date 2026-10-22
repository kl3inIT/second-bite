// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'report_store_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$ReportStoreBody {

 String get name; String get sellerId;
/// Create a copy of ReportStoreBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ReportStoreBodyCopyWith<ReportStoreBody> get copyWith => _$ReportStoreBodyCopyWithImpl<ReportStoreBody>(this as ReportStoreBody, _$identity);

  /// Serializes this ReportStoreBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as ReportStoreBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ReportStoreBody&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.sellerId, _this.sellerId) || other.sellerId == _this.sellerId));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as ReportStoreBody;
  return Object.hash(runtimeType,_this.name,_this.sellerId);
}

@override
String toString() {
  final _this = this as ReportStoreBody;
  return 'ReportStoreBody(name: ${_this.name}, sellerId: ${_this.sellerId})';
}


}

/// @nodoc
abstract mixin class $ReportStoreBodyCopyWith<$Res>  {
  factory $ReportStoreBodyCopyWith(ReportStoreBody value, $Res Function(ReportStoreBody) _then) = _$ReportStoreBodyCopyWithImpl;
@useResult
$Res call({
 String name, String sellerId
});




}
/// @nodoc
class _$ReportStoreBodyCopyWithImpl<$Res>
    implements $ReportStoreBodyCopyWith<$Res> {
  _$ReportStoreBodyCopyWithImpl(this._self, this._then);

  final ReportStoreBody _self;
  final $Res Function(ReportStoreBody) _then;

/// Create a copy of ReportStoreBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? name = null,Object? sellerId = null,}) {
  return _then(ReportStoreBody(
name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,sellerId: null == sellerId ? _self.sellerId : sellerId // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [ReportStoreBody].
extension ReportStoreBodyPatterns on ReportStoreBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ReportStoreBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ReportStoreBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ReportStoreBody value)  $default,){
final _that = this;
switch (_that) {
case _ReportStoreBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ReportStoreBody value)?  $default,){
final _that = this;
switch (_that) {
case _ReportStoreBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String name,  String sellerId)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ReportStoreBody() when $default != null:
return $default(_that.name,_that.sellerId);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String name,  String sellerId)  $default,) {final _that = this;
switch (_that) {
case _ReportStoreBody():
return $default(_that.name,_that.sellerId);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String name,  String sellerId)?  $default,) {final _that = this;
switch (_that) {
case _ReportStoreBody() when $default != null:
return $default(_that.name,_that.sellerId);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ReportStoreBody implements ReportStoreBody {
  const _ReportStoreBody({required this.name, required this.sellerId});
  factory _ReportStoreBody.fromJson(Map<String, dynamic> json) => _$ReportStoreBodyFromJson(json);

@override final  String name;
@override final  String sellerId;

/// Create a copy of ReportStoreBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ReportStoreBodyCopyWith<_ReportStoreBody> get copyWith => __$ReportStoreBodyCopyWithImpl<_ReportStoreBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ReportStoreBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _ReportStoreBody&&(identical(other.name, name) || other.name == name)&&(identical(other.sellerId, sellerId) || other.sellerId == sellerId));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,name,sellerId);
}

@override
String toString() {
    return 'ReportStoreBody(name: $name, sellerId: $sellerId)';
}


}

/// @nodoc
abstract mixin class _$ReportStoreBodyCopyWith<$Res> implements $ReportStoreBodyCopyWith<$Res> {
  factory _$ReportStoreBodyCopyWith(_ReportStoreBody value, $Res Function(_ReportStoreBody) _then) = __$ReportStoreBodyCopyWithImpl;
@override @useResult
$Res call({
 String name, String sellerId
});




}
/// @nodoc
class __$ReportStoreBodyCopyWithImpl<$Res>
    implements _$ReportStoreBodyCopyWith<$Res> {
  __$ReportStoreBodyCopyWithImpl(this._self, this._then);

  final _ReportStoreBody _self;
  final $Res Function(_ReportStoreBody) _then;

/// Create a copy of ReportStoreBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? name = null,Object? sellerId = null,}) {
  return _then(_ReportStoreBody(
name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,sellerId: null == sellerId ? _self.sellerId : sellerId // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
