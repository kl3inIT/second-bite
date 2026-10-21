// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'admin_seller_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$AdminSellerBody {

/// Absent when the owner deleted their account
 String? get ownerEmail;
/// Create a copy of AdminSellerBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AdminSellerBodyCopyWith<AdminSellerBody> get copyWith => _$AdminSellerBodyCopyWithImpl<AdminSellerBody>(this as AdminSellerBody, _$identity);

  /// Serializes this AdminSellerBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as AdminSellerBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AdminSellerBody&&(identical(other.ownerEmail, _this.ownerEmail) || other.ownerEmail == _this.ownerEmail));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as AdminSellerBody;
  return Object.hash(runtimeType,_this.ownerEmail);
}

@override
String toString() {
  final _this = this as AdminSellerBody;
  return 'AdminSellerBody(ownerEmail: ${_this.ownerEmail})';
}


}

/// @nodoc
abstract mixin class $AdminSellerBodyCopyWith<$Res>  {
  factory $AdminSellerBodyCopyWith(AdminSellerBody value, $Res Function(AdminSellerBody) _then) = _$AdminSellerBodyCopyWithImpl;
@useResult
$Res call({
 String? ownerEmail
});




}
/// @nodoc
class _$AdminSellerBodyCopyWithImpl<$Res>
    implements $AdminSellerBodyCopyWith<$Res> {
  _$AdminSellerBodyCopyWithImpl(this._self, this._then);

  final AdminSellerBody _self;
  final $Res Function(AdminSellerBody) _then;

/// Create a copy of AdminSellerBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? ownerEmail = freezed,}) {
  return _then(AdminSellerBody(
ownerEmail: freezed == ownerEmail ? _self.ownerEmail : ownerEmail // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [AdminSellerBody].
extension AdminSellerBodyPatterns on AdminSellerBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AdminSellerBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AdminSellerBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AdminSellerBody value)  $default,){
final _that = this;
switch (_that) {
case _AdminSellerBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AdminSellerBody value)?  $default,){
final _that = this;
switch (_that) {
case _AdminSellerBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String? ownerEmail)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AdminSellerBody() when $default != null:
return $default(_that.ownerEmail);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String? ownerEmail)  $default,) {final _that = this;
switch (_that) {
case _AdminSellerBody():
return $default(_that.ownerEmail);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String? ownerEmail)?  $default,) {final _that = this;
switch (_that) {
case _AdminSellerBody() when $default != null:
return $default(_that.ownerEmail);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _AdminSellerBody implements AdminSellerBody {
  const _AdminSellerBody({this.ownerEmail});
  factory _AdminSellerBody.fromJson(Map<String, dynamic> json) => _$AdminSellerBodyFromJson(json);

/// Absent when the owner deleted their account
@override final  String? ownerEmail;

/// Create a copy of AdminSellerBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AdminSellerBodyCopyWith<_AdminSellerBody> get copyWith => __$AdminSellerBodyCopyWithImpl<_AdminSellerBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AdminSellerBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _AdminSellerBody&&(identical(other.ownerEmail, ownerEmail) || other.ownerEmail == ownerEmail));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,ownerEmail);
}

@override
String toString() {
    return 'AdminSellerBody(ownerEmail: $ownerEmail)';
}


}

/// @nodoc
abstract mixin class _$AdminSellerBodyCopyWith<$Res> implements $AdminSellerBodyCopyWith<$Res> {
  factory _$AdminSellerBodyCopyWith(_AdminSellerBody value, $Res Function(_AdminSellerBody) _then) = __$AdminSellerBodyCopyWithImpl;
@override @useResult
$Res call({
 String? ownerEmail
});




}
/// @nodoc
class __$AdminSellerBodyCopyWithImpl<$Res>
    implements _$AdminSellerBodyCopyWith<$Res> {
  __$AdminSellerBodyCopyWithImpl(this._self, this._then);

  final _AdminSellerBody _self;
  final $Res Function(_AdminSellerBody) _then;

/// Create a copy of AdminSellerBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? ownerEmail = freezed,}) {
  return _then(_AdminSellerBody(
ownerEmail: freezed == ownerEmail ? _self.ownerEmail : ownerEmail // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
