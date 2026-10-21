// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'address_output_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$AddressOutputBody {

/// As people write it; empty when the point has no known address
 String get address;
/// Create a copy of AddressOutputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AddressOutputBodyCopyWith<AddressOutputBody> get copyWith => _$AddressOutputBodyCopyWithImpl<AddressOutputBody>(this as AddressOutputBody, _$identity);

  /// Serializes this AddressOutputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as AddressOutputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AddressOutputBody&&(identical(other.address, _this.address) || other.address == _this.address));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as AddressOutputBody;
  return Object.hash(runtimeType,_this.address);
}

@override
String toString() {
  final _this = this as AddressOutputBody;
  return 'AddressOutputBody(address: ${_this.address})';
}


}

/// @nodoc
abstract mixin class $AddressOutputBodyCopyWith<$Res>  {
  factory $AddressOutputBodyCopyWith(AddressOutputBody value, $Res Function(AddressOutputBody) _then) = _$AddressOutputBodyCopyWithImpl;
@useResult
$Res call({
 String address
});




}
/// @nodoc
class _$AddressOutputBodyCopyWithImpl<$Res>
    implements $AddressOutputBodyCopyWith<$Res> {
  _$AddressOutputBodyCopyWithImpl(this._self, this._then);

  final AddressOutputBody _self;
  final $Res Function(AddressOutputBody) _then;

/// Create a copy of AddressOutputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? address = null,}) {
  return _then(AddressOutputBody(
address: null == address ? _self.address : address // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [AddressOutputBody].
extension AddressOutputBodyPatterns on AddressOutputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AddressOutputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AddressOutputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AddressOutputBody value)  $default,){
final _that = this;
switch (_that) {
case _AddressOutputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AddressOutputBody value)?  $default,){
final _that = this;
switch (_that) {
case _AddressOutputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String address)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AddressOutputBody() when $default != null:
return $default(_that.address);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String address)  $default,) {final _that = this;
switch (_that) {
case _AddressOutputBody():
return $default(_that.address);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String address)?  $default,) {final _that = this;
switch (_that) {
case _AddressOutputBody() when $default != null:
return $default(_that.address);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _AddressOutputBody implements AddressOutputBody {
  const _AddressOutputBody({required this.address});
  factory _AddressOutputBody.fromJson(Map<String, dynamic> json) => _$AddressOutputBodyFromJson(json);

/// As people write it; empty when the point has no known address
@override final  String address;

/// Create a copy of AddressOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AddressOutputBodyCopyWith<_AddressOutputBody> get copyWith => __$AddressOutputBodyCopyWithImpl<_AddressOutputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AddressOutputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _AddressOutputBody&&(identical(other.address, address) || other.address == address));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,address);
}

@override
String toString() {
    return 'AddressOutputBody(address: $address)';
}


}

/// @nodoc
abstract mixin class _$AddressOutputBodyCopyWith<$Res> implements $AddressOutputBodyCopyWith<$Res> {
  factory _$AddressOutputBodyCopyWith(_AddressOutputBody value, $Res Function(_AddressOutputBody) _then) = __$AddressOutputBodyCopyWithImpl;
@override @useResult
$Res call({
 String address
});




}
/// @nodoc
class __$AddressOutputBodyCopyWithImpl<$Res>
    implements _$AddressOutputBodyCopyWith<$Res> {
  __$AddressOutputBodyCopyWithImpl(this._self, this._then);

  final _AddressOutputBody _self;
  final $Res Function(_AddressOutputBody) _then;

/// Create a copy of AddressOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? address = null,}) {
  return _then(_AddressOutputBody(
address: null == address ? _self.address : address // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
