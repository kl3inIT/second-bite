// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'methods_output_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$MethodsOutputBody {

/// Present when signing in with Google is available
 GoogleMethodBody? get google;
/// Create a copy of MethodsOutputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$MethodsOutputBodyCopyWith<MethodsOutputBody> get copyWith => _$MethodsOutputBodyCopyWithImpl<MethodsOutputBody>(this as MethodsOutputBody, _$identity);

  /// Serializes this MethodsOutputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as MethodsOutputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is MethodsOutputBody&&(identical(other.google, _this.google) || other.google == _this.google));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as MethodsOutputBody;
  return Object.hash(runtimeType,_this.google);
}

@override
String toString() {
  final _this = this as MethodsOutputBody;
  return 'MethodsOutputBody(google: ${_this.google})';
}


}

/// @nodoc
abstract mixin class $MethodsOutputBodyCopyWith<$Res>  {
  factory $MethodsOutputBodyCopyWith(MethodsOutputBody value, $Res Function(MethodsOutputBody) _then) = _$MethodsOutputBodyCopyWithImpl;
@useResult
$Res call({
 GoogleMethodBody? google
});


$GoogleMethodBodyCopyWith<$Res>? get google;

}
/// @nodoc
class _$MethodsOutputBodyCopyWithImpl<$Res>
    implements $MethodsOutputBodyCopyWith<$Res> {
  _$MethodsOutputBodyCopyWithImpl(this._self, this._then);

  final MethodsOutputBody _self;
  final $Res Function(MethodsOutputBody) _then;

/// Create a copy of MethodsOutputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? google = freezed,}) {
  return _then(MethodsOutputBody(
google: freezed == google ? _self.google : google // ignore: cast_nullable_to_non_nullable
as GoogleMethodBody?,
  ));
}
/// Create a copy of MethodsOutputBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$GoogleMethodBodyCopyWith<$Res>? get google {
    if (_self.google == null) {
    return null;
  }

  return $GoogleMethodBodyCopyWith<$Res>(_self.google!, (value) {
    return _then(_self.copyWith(google: value));
  });
}
}


/// Adds pattern-matching-related methods to [MethodsOutputBody].
extension MethodsOutputBodyPatterns on MethodsOutputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _MethodsOutputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _MethodsOutputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _MethodsOutputBody value)  $default,){
final _that = this;
switch (_that) {
case _MethodsOutputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _MethodsOutputBody value)?  $default,){
final _that = this;
switch (_that) {
case _MethodsOutputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( GoogleMethodBody? google)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _MethodsOutputBody() when $default != null:
return $default(_that.google);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( GoogleMethodBody? google)  $default,) {final _that = this;
switch (_that) {
case _MethodsOutputBody():
return $default(_that.google);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( GoogleMethodBody? google)?  $default,) {final _that = this;
switch (_that) {
case _MethodsOutputBody() when $default != null:
return $default(_that.google);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _MethodsOutputBody implements MethodsOutputBody {
  const _MethodsOutputBody({this.google});
  factory _MethodsOutputBody.fromJson(Map<String, dynamic> json) => _$MethodsOutputBodyFromJson(json);

/// Present when signing in with Google is available
@override final  GoogleMethodBody? google;

/// Create a copy of MethodsOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$MethodsOutputBodyCopyWith<_MethodsOutputBody> get copyWith => __$MethodsOutputBodyCopyWithImpl<_MethodsOutputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$MethodsOutputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _MethodsOutputBody&&(identical(other.google, google) || other.google == google));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,google);
}

@override
String toString() {
    return 'MethodsOutputBody(google: $google)';
}


}

/// @nodoc
abstract mixin class _$MethodsOutputBodyCopyWith<$Res> implements $MethodsOutputBodyCopyWith<$Res> {
  factory _$MethodsOutputBodyCopyWith(_MethodsOutputBody value, $Res Function(_MethodsOutputBody) _then) = __$MethodsOutputBodyCopyWithImpl;
@override @useResult
$Res call({
 GoogleMethodBody? google
});


@override $GoogleMethodBodyCopyWith<$Res>? get google;

}
/// @nodoc
class __$MethodsOutputBodyCopyWithImpl<$Res>
    implements _$MethodsOutputBodyCopyWith<$Res> {
  __$MethodsOutputBodyCopyWithImpl(this._self, this._then);

  final _MethodsOutputBody _self;
  final $Res Function(_MethodsOutputBody) _then;

/// Create a copy of MethodsOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? google = freezed,}) {
  return _then(_MethodsOutputBody(
google: freezed == google ? _self.google : google // ignore: cast_nullable_to_non_nullable
as GoogleMethodBody?,
  ));
}

/// Create a copy of MethodsOutputBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$GoogleMethodBodyCopyWith<$Res>? get google {
    if (_self.google == null) {
    return null;
  }

  return $GoogleMethodBodyCopyWith<$Res>(_self.google!, (value) {
    return _then(_self.copyWith(google: value));
  });
}
}

// dart format on
