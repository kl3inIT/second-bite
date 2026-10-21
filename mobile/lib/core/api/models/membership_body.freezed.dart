// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'membership_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$MembershipBody {

 String get accountId; MembershipBodyRole get role; String get sellerId; String get sellerName; MembershipBodySellerStatus get sellerStatus;
/// Create a copy of MembershipBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$MembershipBodyCopyWith<MembershipBody> get copyWith => _$MembershipBodyCopyWithImpl<MembershipBody>(this as MembershipBody, _$identity);

  /// Serializes this MembershipBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as MembershipBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is MembershipBody&&(identical(other.accountId, _this.accountId) || other.accountId == _this.accountId)&&(identical(other.role, _this.role) || other.role == _this.role)&&(identical(other.sellerId, _this.sellerId) || other.sellerId == _this.sellerId)&&(identical(other.sellerName, _this.sellerName) || other.sellerName == _this.sellerName)&&(identical(other.sellerStatus, _this.sellerStatus) || other.sellerStatus == _this.sellerStatus));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as MembershipBody;
  return Object.hash(runtimeType,_this.accountId,_this.role,_this.sellerId,_this.sellerName,_this.sellerStatus);
}

@override
String toString() {
  final _this = this as MembershipBody;
  return 'MembershipBody(accountId: ${_this.accountId}, role: ${_this.role}, sellerId: ${_this.sellerId}, sellerName: ${_this.sellerName}, sellerStatus: ${_this.sellerStatus})';
}


}

/// @nodoc
abstract mixin class $MembershipBodyCopyWith<$Res>  {
  factory $MembershipBodyCopyWith(MembershipBody value, $Res Function(MembershipBody) _then) = _$MembershipBodyCopyWithImpl;
@useResult
$Res call({
 String accountId, MembershipBodyRole role, String sellerId, String sellerName, MembershipBodySellerStatus sellerStatus
});




}
/// @nodoc
class _$MembershipBodyCopyWithImpl<$Res>
    implements $MembershipBodyCopyWith<$Res> {
  _$MembershipBodyCopyWithImpl(this._self, this._then);

  final MembershipBody _self;
  final $Res Function(MembershipBody) _then;

/// Create a copy of MembershipBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? accountId = null,Object? role = null,Object? sellerId = null,Object? sellerName = null,Object? sellerStatus = null,}) {
  return _then(MembershipBody(
accountId: null == accountId ? _self.accountId : accountId // ignore: cast_nullable_to_non_nullable
as String,role: null == role ? _self.role : role // ignore: cast_nullable_to_non_nullable
as MembershipBodyRole,sellerId: null == sellerId ? _self.sellerId : sellerId // ignore: cast_nullable_to_non_nullable
as String,sellerName: null == sellerName ? _self.sellerName : sellerName // ignore: cast_nullable_to_non_nullable
as String,sellerStatus: null == sellerStatus ? _self.sellerStatus : sellerStatus // ignore: cast_nullable_to_non_nullable
as MembershipBodySellerStatus,
  ));
}

}


/// Adds pattern-matching-related methods to [MembershipBody].
extension MembershipBodyPatterns on MembershipBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _MembershipBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _MembershipBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _MembershipBody value)  $default,){
final _that = this;
switch (_that) {
case _MembershipBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _MembershipBody value)?  $default,){
final _that = this;
switch (_that) {
case _MembershipBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String accountId,  MembershipBodyRole role,  String sellerId,  String sellerName,  MembershipBodySellerStatus sellerStatus)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _MembershipBody() when $default != null:
return $default(_that.accountId,_that.role,_that.sellerId,_that.sellerName,_that.sellerStatus);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String accountId,  MembershipBodyRole role,  String sellerId,  String sellerName,  MembershipBodySellerStatus sellerStatus)  $default,) {final _that = this;
switch (_that) {
case _MembershipBody():
return $default(_that.accountId,_that.role,_that.sellerId,_that.sellerName,_that.sellerStatus);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String accountId,  MembershipBodyRole role,  String sellerId,  String sellerName,  MembershipBodySellerStatus sellerStatus)?  $default,) {final _that = this;
switch (_that) {
case _MembershipBody() when $default != null:
return $default(_that.accountId,_that.role,_that.sellerId,_that.sellerName,_that.sellerStatus);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _MembershipBody implements MembershipBody {
  const _MembershipBody({required this.accountId, required this.role, required this.sellerId, required this.sellerName, required this.sellerStatus});
  factory _MembershipBody.fromJson(Map<String, dynamic> json) => _$MembershipBodyFromJson(json);

@override final  String accountId;
@override final  MembershipBodyRole role;
@override final  String sellerId;
@override final  String sellerName;
@override final  MembershipBodySellerStatus sellerStatus;

/// Create a copy of MembershipBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$MembershipBodyCopyWith<_MembershipBody> get copyWith => __$MembershipBodyCopyWithImpl<_MembershipBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$MembershipBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _MembershipBody&&(identical(other.accountId, accountId) || other.accountId == accountId)&&(identical(other.role, role) || other.role == role)&&(identical(other.sellerId, sellerId) || other.sellerId == sellerId)&&(identical(other.sellerName, sellerName) || other.sellerName == sellerName)&&(identical(other.sellerStatus, sellerStatus) || other.sellerStatus == sellerStatus));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,accountId,role,sellerId,sellerName,sellerStatus);
}

@override
String toString() {
    return 'MembershipBody(accountId: $accountId, role: $role, sellerId: $sellerId, sellerName: $sellerName, sellerStatus: $sellerStatus)';
}


}

/// @nodoc
abstract mixin class _$MembershipBodyCopyWith<$Res> implements $MembershipBodyCopyWith<$Res> {
  factory _$MembershipBodyCopyWith(_MembershipBody value, $Res Function(_MembershipBody) _then) = __$MembershipBodyCopyWithImpl;
@override @useResult
$Res call({
 String accountId, MembershipBodyRole role, String sellerId, String sellerName, MembershipBodySellerStatus sellerStatus
});




}
/// @nodoc
class __$MembershipBodyCopyWithImpl<$Res>
    implements _$MembershipBodyCopyWith<$Res> {
  __$MembershipBodyCopyWithImpl(this._self, this._then);

  final _MembershipBody _self;
  final $Res Function(_MembershipBody) _then;

/// Create a copy of MembershipBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? accountId = null,Object? role = null,Object? sellerId = null,Object? sellerName = null,Object? sellerStatus = null,}) {
  return _then(_MembershipBody(
accountId: null == accountId ? _self.accountId : accountId // ignore: cast_nullable_to_non_nullable
as String,role: null == role ? _self.role : role // ignore: cast_nullable_to_non_nullable
as MembershipBodyRole,sellerId: null == sellerId ? _self.sellerId : sellerId // ignore: cast_nullable_to_non_nullable
as String,sellerName: null == sellerName ? _self.sellerName : sellerName // ignore: cast_nullable_to_non_nullable
as String,sellerStatus: null == sellerStatus ? _self.sellerStatus : sellerStatus // ignore: cast_nullable_to_non_nullable
as MembershipBodySellerStatus,
  ));
}


}

// dart format on
