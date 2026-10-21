// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'role_counts_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$RoleCountsBody {

 int get admin; int get customer;
/// Create a copy of RoleCountsBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$RoleCountsBodyCopyWith<RoleCountsBody> get copyWith => _$RoleCountsBodyCopyWithImpl<RoleCountsBody>(this as RoleCountsBody, _$identity);

  /// Serializes this RoleCountsBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as RoleCountsBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is RoleCountsBody&&(identical(other.admin, _this.admin) || other.admin == _this.admin)&&(identical(other.customer, _this.customer) || other.customer == _this.customer));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as RoleCountsBody;
  return Object.hash(runtimeType,_this.admin,_this.customer);
}

@override
String toString() {
  final _this = this as RoleCountsBody;
  return 'RoleCountsBody(admin: ${_this.admin}, customer: ${_this.customer})';
}


}

/// @nodoc
abstract mixin class $RoleCountsBodyCopyWith<$Res>  {
  factory $RoleCountsBodyCopyWith(RoleCountsBody value, $Res Function(RoleCountsBody) _then) = _$RoleCountsBodyCopyWithImpl;
@useResult
$Res call({
 int admin, int customer
});




}
/// @nodoc
class _$RoleCountsBodyCopyWithImpl<$Res>
    implements $RoleCountsBodyCopyWith<$Res> {
  _$RoleCountsBodyCopyWithImpl(this._self, this._then);

  final RoleCountsBody _self;
  final $Res Function(RoleCountsBody) _then;

/// Create a copy of RoleCountsBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? admin = null,Object? customer = null,}) {
  return _then(RoleCountsBody(
admin: null == admin ? _self.admin : admin // ignore: cast_nullable_to_non_nullable
as int,customer: null == customer ? _self.customer : customer // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [RoleCountsBody].
extension RoleCountsBodyPatterns on RoleCountsBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _RoleCountsBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _RoleCountsBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _RoleCountsBody value)  $default,){
final _that = this;
switch (_that) {
case _RoleCountsBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _RoleCountsBody value)?  $default,){
final _that = this;
switch (_that) {
case _RoleCountsBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int admin,  int customer)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _RoleCountsBody() when $default != null:
return $default(_that.admin,_that.customer);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int admin,  int customer)  $default,) {final _that = this;
switch (_that) {
case _RoleCountsBody():
return $default(_that.admin,_that.customer);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int admin,  int customer)?  $default,) {final _that = this;
switch (_that) {
case _RoleCountsBody() when $default != null:
return $default(_that.admin,_that.customer);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _RoleCountsBody implements RoleCountsBody {
  const _RoleCountsBody({required this.admin, required this.customer});
  factory _RoleCountsBody.fromJson(Map<String, dynamic> json) => _$RoleCountsBodyFromJson(json);

@override final  int admin;
@override final  int customer;

/// Create a copy of RoleCountsBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$RoleCountsBodyCopyWith<_RoleCountsBody> get copyWith => __$RoleCountsBodyCopyWithImpl<_RoleCountsBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$RoleCountsBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _RoleCountsBody&&(identical(other.admin, admin) || other.admin == admin)&&(identical(other.customer, customer) || other.customer == customer));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,admin,customer);
}

@override
String toString() {
    return 'RoleCountsBody(admin: $admin, customer: $customer)';
}


}

/// @nodoc
abstract mixin class _$RoleCountsBodyCopyWith<$Res> implements $RoleCountsBodyCopyWith<$Res> {
  factory _$RoleCountsBodyCopyWith(_RoleCountsBody value, $Res Function(_RoleCountsBody) _then) = __$RoleCountsBodyCopyWithImpl;
@override @useResult
$Res call({
 int admin, int customer
});




}
/// @nodoc
class __$RoleCountsBodyCopyWithImpl<$Res>
    implements _$RoleCountsBodyCopyWith<$Res> {
  __$RoleCountsBodyCopyWithImpl(this._self, this._then);

  final _RoleCountsBody _self;
  final $Res Function(_RoleCountsBody) _then;

/// Create a copy of RoleCountsBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? admin = null,Object? customer = null,}) {
  return _then(_RoleCountsBody(
admin: null == admin ? _self.admin : admin // ignore: cast_nullable_to_non_nullable
as int,customer: null == customer ? _self.customer : customer // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
