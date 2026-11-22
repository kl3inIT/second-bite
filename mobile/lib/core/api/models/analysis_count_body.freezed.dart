// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'analysis_count_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$AnalysisCountBody {

 int get count; String get key;
/// Create a copy of AnalysisCountBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AnalysisCountBodyCopyWith<AnalysisCountBody> get copyWith => _$AnalysisCountBodyCopyWithImpl<AnalysisCountBody>(this as AnalysisCountBody, _$identity);

  /// Serializes this AnalysisCountBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as AnalysisCountBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AnalysisCountBody&&(identical(other.count, _this.count) || other.count == _this.count)&&(identical(other.key, _this.key) || other.key == _this.key));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as AnalysisCountBody;
  return Object.hash(runtimeType,_this.count,_this.key);
}

@override
String toString() {
  final _this = this as AnalysisCountBody;
  return 'AnalysisCountBody(count: ${_this.count}, key: ${_this.key})';
}


}

/// @nodoc
abstract mixin class $AnalysisCountBodyCopyWith<$Res>  {
  factory $AnalysisCountBodyCopyWith(AnalysisCountBody value, $Res Function(AnalysisCountBody) _then) = _$AnalysisCountBodyCopyWithImpl;
@useResult
$Res call({
 int count, String key
});




}
/// @nodoc
class _$AnalysisCountBodyCopyWithImpl<$Res>
    implements $AnalysisCountBodyCopyWith<$Res> {
  _$AnalysisCountBodyCopyWithImpl(this._self, this._then);

  final AnalysisCountBody _self;
  final $Res Function(AnalysisCountBody) _then;

/// Create a copy of AnalysisCountBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? count = null,Object? key = null,}) {
  return _then(AnalysisCountBody(
count: null == count ? _self.count : count // ignore: cast_nullable_to_non_nullable
as int,key: null == key ? _self.key : key // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [AnalysisCountBody].
extension AnalysisCountBodyPatterns on AnalysisCountBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AnalysisCountBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AnalysisCountBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AnalysisCountBody value)  $default,){
final _that = this;
switch (_that) {
case _AnalysisCountBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AnalysisCountBody value)?  $default,){
final _that = this;
switch (_that) {
case _AnalysisCountBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int count,  String key)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AnalysisCountBody() when $default != null:
return $default(_that.count,_that.key);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int count,  String key)  $default,) {final _that = this;
switch (_that) {
case _AnalysisCountBody():
return $default(_that.count,_that.key);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int count,  String key)?  $default,) {final _that = this;
switch (_that) {
case _AnalysisCountBody() when $default != null:
return $default(_that.count,_that.key);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _AnalysisCountBody implements AnalysisCountBody {
  const _AnalysisCountBody({required this.count, required this.key});
  factory _AnalysisCountBody.fromJson(Map<String, dynamic> json) => _$AnalysisCountBodyFromJson(json);

@override final  int count;
@override final  String key;

/// Create a copy of AnalysisCountBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AnalysisCountBodyCopyWith<_AnalysisCountBody> get copyWith => __$AnalysisCountBodyCopyWithImpl<_AnalysisCountBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AnalysisCountBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _AnalysisCountBody&&(identical(other.count, count) || other.count == count)&&(identical(other.key, key) || other.key == key));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,count,key);
}

@override
String toString() {
    return 'AnalysisCountBody(count: $count, key: $key)';
}


}

/// @nodoc
abstract mixin class _$AnalysisCountBodyCopyWith<$Res> implements $AnalysisCountBodyCopyWith<$Res> {
  factory _$AnalysisCountBodyCopyWith(_AnalysisCountBody value, $Res Function(_AnalysisCountBody) _then) = __$AnalysisCountBodyCopyWithImpl;
@override @useResult
$Res call({
 int count, String key
});




}
/// @nodoc
class __$AnalysisCountBodyCopyWithImpl<$Res>
    implements _$AnalysisCountBodyCopyWith<$Res> {
  __$AnalysisCountBodyCopyWithImpl(this._self, this._then);

  final _AnalysisCountBody _self;
  final $Res Function(_AnalysisCountBody) _then;

/// Create a copy of AnalysisCountBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? count = null,Object? key = null,}) {
  return _then(_AnalysisCountBody(
count: null == count ? _self.count : count // ignore: cast_nullable_to_non_nullable
as int,key: null == key ? _self.key : key // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
