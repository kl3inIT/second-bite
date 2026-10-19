// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'violation.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$Violation {

 String get code; String get detail;/// The invalid parameter, for example query.limit
 String? get parameter;/// JSON Pointer to the body member, for example #/priceVnd
 String? get pointer;
/// Create a copy of Violation
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ViolationCopyWith<Violation> get copyWith => _$ViolationCopyWithImpl<Violation>(this as Violation, _$identity);

  /// Serializes this Violation to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as Violation;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is Violation&&(identical(other.code, _this.code) || other.code == _this.code)&&(identical(other.detail, _this.detail) || other.detail == _this.detail)&&(identical(other.parameter, _this.parameter) || other.parameter == _this.parameter)&&(identical(other.pointer, _this.pointer) || other.pointer == _this.pointer));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as Violation;
  return Object.hash(runtimeType,_this.code,_this.detail,_this.parameter,_this.pointer);
}

@override
String toString() {
  final _this = this as Violation;
  return 'Violation(code: ${_this.code}, detail: ${_this.detail}, parameter: ${_this.parameter}, pointer: ${_this.pointer})';
}


}

/// @nodoc
abstract mixin class $ViolationCopyWith<$Res>  {
  factory $ViolationCopyWith(Violation value, $Res Function(Violation) _then) = _$ViolationCopyWithImpl;
@useResult
$Res call({
 String code, String detail, String? parameter, String? pointer
});




}
/// @nodoc
class _$ViolationCopyWithImpl<$Res>
    implements $ViolationCopyWith<$Res> {
  _$ViolationCopyWithImpl(this._self, this._then);

  final Violation _self;
  final $Res Function(Violation) _then;

/// Create a copy of Violation
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? code = null,Object? detail = null,Object? parameter = freezed,Object? pointer = freezed,}) {
  return _then(Violation(
code: null == code ? _self.code : code // ignore: cast_nullable_to_non_nullable
as String,detail: null == detail ? _self.detail : detail // ignore: cast_nullable_to_non_nullable
as String,parameter: freezed == parameter ? _self.parameter : parameter // ignore: cast_nullable_to_non_nullable
as String?,pointer: freezed == pointer ? _self.pointer : pointer // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [Violation].
extension ViolationPatterns on Violation {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _Violation value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _Violation() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _Violation value)  $default,){
final _that = this;
switch (_that) {
case _Violation():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _Violation value)?  $default,){
final _that = this;
switch (_that) {
case _Violation() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String code,  String detail,  String? parameter,  String? pointer)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _Violation() when $default != null:
return $default(_that.code,_that.detail,_that.parameter,_that.pointer);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String code,  String detail,  String? parameter,  String? pointer)  $default,) {final _that = this;
switch (_that) {
case _Violation():
return $default(_that.code,_that.detail,_that.parameter,_that.pointer);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String code,  String detail,  String? parameter,  String? pointer)?  $default,) {final _that = this;
switch (_that) {
case _Violation() when $default != null:
return $default(_that.code,_that.detail,_that.parameter,_that.pointer);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _Violation implements Violation {
  const _Violation({required this.code, required this.detail, this.parameter, this.pointer});
  factory _Violation.fromJson(Map<String, dynamic> json) => _$ViolationFromJson(json);

@override final  String code;
@override final  String detail;
/// The invalid parameter, for example query.limit
@override final  String? parameter;
/// JSON Pointer to the body member, for example #/priceVnd
@override final  String? pointer;

/// Create a copy of Violation
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ViolationCopyWith<_Violation> get copyWith => __$ViolationCopyWithImpl<_Violation>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ViolationToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _Violation&&(identical(other.code, code) || other.code == code)&&(identical(other.detail, detail) || other.detail == detail)&&(identical(other.parameter, parameter) || other.parameter == parameter)&&(identical(other.pointer, pointer) || other.pointer == pointer));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,code,detail,parameter,pointer);
}

@override
String toString() {
    return 'Violation(code: $code, detail: $detail, parameter: $parameter, pointer: $pointer)';
}


}

/// @nodoc
abstract mixin class _$ViolationCopyWith<$Res> implements $ViolationCopyWith<$Res> {
  factory _$ViolationCopyWith(_Violation value, $Res Function(_Violation) _then) = __$ViolationCopyWithImpl;
@override @useResult
$Res call({
 String code, String detail, String? parameter, String? pointer
});




}
/// @nodoc
class __$ViolationCopyWithImpl<$Res>
    implements _$ViolationCopyWith<$Res> {
  __$ViolationCopyWithImpl(this._self, this._then);

  final _Violation _self;
  final $Res Function(_Violation) _then;

/// Create a copy of Violation
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? code = null,Object? detail = null,Object? parameter = freezed,Object? pointer = freezed,}) {
  return _then(_Violation(
code: null == code ? _self.code : code // ignore: cast_nullable_to_non_nullable
as String,detail: null == detail ? _self.detail : detail // ignore: cast_nullable_to_non_nullable
as String,parameter: freezed == parameter ? _self.parameter : parameter // ignore: cast_nullable_to_non_nullable
as String?,pointer: freezed == pointer ? _self.pointer : pointer // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
