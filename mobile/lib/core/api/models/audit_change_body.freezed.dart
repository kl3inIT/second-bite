// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'audit_change_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$AuditChangeBody {

 String get field;/// The value before; absent for a secret or the SMTP user
 String? get from;/// The value after; absent likewise
 String? get to;
/// Create a copy of AuditChangeBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AuditChangeBodyCopyWith<AuditChangeBody> get copyWith => _$AuditChangeBodyCopyWithImpl<AuditChangeBody>(this as AuditChangeBody, _$identity);

  /// Serializes this AuditChangeBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as AuditChangeBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AuditChangeBody&&(identical(other.field, _this.field) || other.field == _this.field)&&(identical(other.from, _this.from) || other.from == _this.from)&&(identical(other.to, _this.to) || other.to == _this.to));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as AuditChangeBody;
  return Object.hash(runtimeType,_this.field,_this.from,_this.to);
}

@override
String toString() {
  final _this = this as AuditChangeBody;
  return 'AuditChangeBody(field: ${_this.field}, from: ${_this.from}, to: ${_this.to})';
}


}

/// @nodoc
abstract mixin class $AuditChangeBodyCopyWith<$Res>  {
  factory $AuditChangeBodyCopyWith(AuditChangeBody value, $Res Function(AuditChangeBody) _then) = _$AuditChangeBodyCopyWithImpl;
@useResult
$Res call({
 String field, String? from, String? to
});




}
/// @nodoc
class _$AuditChangeBodyCopyWithImpl<$Res>
    implements $AuditChangeBodyCopyWith<$Res> {
  _$AuditChangeBodyCopyWithImpl(this._self, this._then);

  final AuditChangeBody _self;
  final $Res Function(AuditChangeBody) _then;

/// Create a copy of AuditChangeBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? field = null,Object? from = freezed,Object? to = freezed,}) {
  return _then(AuditChangeBody(
field: null == field ? _self.field : field // ignore: cast_nullable_to_non_nullable
as String,from: freezed == from ? _self.from : from // ignore: cast_nullable_to_non_nullable
as String?,to: freezed == to ? _self.to : to // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [AuditChangeBody].
extension AuditChangeBodyPatterns on AuditChangeBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AuditChangeBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AuditChangeBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AuditChangeBody value)  $default,){
final _that = this;
switch (_that) {
case _AuditChangeBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AuditChangeBody value)?  $default,){
final _that = this;
switch (_that) {
case _AuditChangeBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String field,  String? from,  String? to)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AuditChangeBody() when $default != null:
return $default(_that.field,_that.from,_that.to);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String field,  String? from,  String? to)  $default,) {final _that = this;
switch (_that) {
case _AuditChangeBody():
return $default(_that.field,_that.from,_that.to);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String field,  String? from,  String? to)?  $default,) {final _that = this;
switch (_that) {
case _AuditChangeBody() when $default != null:
return $default(_that.field,_that.from,_that.to);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _AuditChangeBody implements AuditChangeBody {
  const _AuditChangeBody({required this.field, this.from, this.to});
  factory _AuditChangeBody.fromJson(Map<String, dynamic> json) => _$AuditChangeBodyFromJson(json);

@override final  String field;
/// The value before; absent for a secret or the SMTP user
@override final  String? from;
/// The value after; absent likewise
@override final  String? to;

/// Create a copy of AuditChangeBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AuditChangeBodyCopyWith<_AuditChangeBody> get copyWith => __$AuditChangeBodyCopyWithImpl<_AuditChangeBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AuditChangeBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _AuditChangeBody&&(identical(other.field, field) || other.field == field)&&(identical(other.from, from) || other.from == from)&&(identical(other.to, to) || other.to == to));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,field,from,to);
}

@override
String toString() {
    return 'AuditChangeBody(field: $field, from: $from, to: $to)';
}


}

/// @nodoc
abstract mixin class _$AuditChangeBodyCopyWith<$Res> implements $AuditChangeBodyCopyWith<$Res> {
  factory _$AuditChangeBodyCopyWith(_AuditChangeBody value, $Res Function(_AuditChangeBody) _then) = __$AuditChangeBodyCopyWithImpl;
@override @useResult
$Res call({
 String field, String? from, String? to
});




}
/// @nodoc
class __$AuditChangeBodyCopyWithImpl<$Res>
    implements _$AuditChangeBodyCopyWith<$Res> {
  __$AuditChangeBodyCopyWithImpl(this._self, this._then);

  final _AuditChangeBody _self;
  final $Res Function(_AuditChangeBody) _then;

/// Create a copy of AuditChangeBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? field = null,Object? from = freezed,Object? to = freezed,}) {
  return _then(_AuditChangeBody(
field: null == field ? _self.field : field // ignore: cast_nullable_to_non_nullable
as String,from: freezed == from ? _self.from : from // ignore: cast_nullable_to_non_nullable
as String?,to: freezed == to ? _self.to : to // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
