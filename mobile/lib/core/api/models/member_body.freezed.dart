// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'member_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$MemberBody {

 String get accountId; DateTime get addedAt; String get email; MemberBodyRole get role;
/// Create a copy of MemberBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$MemberBodyCopyWith<MemberBody> get copyWith => _$MemberBodyCopyWithImpl<MemberBody>(this as MemberBody, _$identity);

  /// Serializes this MemberBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as MemberBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is MemberBody&&(identical(other.accountId, _this.accountId) || other.accountId == _this.accountId)&&(identical(other.addedAt, _this.addedAt) || other.addedAt == _this.addedAt)&&(identical(other.email, _this.email) || other.email == _this.email)&&(identical(other.role, _this.role) || other.role == _this.role));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as MemberBody;
  return Object.hash(runtimeType,_this.accountId,_this.addedAt,_this.email,_this.role);
}

@override
String toString() {
  final _this = this as MemberBody;
  return 'MemberBody(accountId: ${_this.accountId}, addedAt: ${_this.addedAt}, email: ${_this.email}, role: ${_this.role})';
}


}

/// @nodoc
abstract mixin class $MemberBodyCopyWith<$Res>  {
  factory $MemberBodyCopyWith(MemberBody value, $Res Function(MemberBody) _then) = _$MemberBodyCopyWithImpl;
@useResult
$Res call({
 String accountId, DateTime addedAt, String email, MemberBodyRole role
});




}
/// @nodoc
class _$MemberBodyCopyWithImpl<$Res>
    implements $MemberBodyCopyWith<$Res> {
  _$MemberBodyCopyWithImpl(this._self, this._then);

  final MemberBody _self;
  final $Res Function(MemberBody) _then;

/// Create a copy of MemberBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? accountId = null,Object? addedAt = null,Object? email = null,Object? role = null,}) {
  return _then(MemberBody(
accountId: null == accountId ? _self.accountId : accountId // ignore: cast_nullable_to_non_nullable
as String,addedAt: null == addedAt ? _self.addedAt : addedAt // ignore: cast_nullable_to_non_nullable
as DateTime,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,role: null == role ? _self.role : role // ignore: cast_nullable_to_non_nullable
as MemberBodyRole,
  ));
}

}


/// Adds pattern-matching-related methods to [MemberBody].
extension MemberBodyPatterns on MemberBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _MemberBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _MemberBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _MemberBody value)  $default,){
final _that = this;
switch (_that) {
case _MemberBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _MemberBody value)?  $default,){
final _that = this;
switch (_that) {
case _MemberBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String accountId,  DateTime addedAt,  String email,  MemberBodyRole role)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _MemberBody() when $default != null:
return $default(_that.accountId,_that.addedAt,_that.email,_that.role);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String accountId,  DateTime addedAt,  String email,  MemberBodyRole role)  $default,) {final _that = this;
switch (_that) {
case _MemberBody():
return $default(_that.accountId,_that.addedAt,_that.email,_that.role);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String accountId,  DateTime addedAt,  String email,  MemberBodyRole role)?  $default,) {final _that = this;
switch (_that) {
case _MemberBody() when $default != null:
return $default(_that.accountId,_that.addedAt,_that.email,_that.role);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _MemberBody implements MemberBody {
  const _MemberBody({required this.accountId, required this.addedAt, required this.email, required this.role});
  factory _MemberBody.fromJson(Map<String, dynamic> json) => _$MemberBodyFromJson(json);

@override final  String accountId;
@override final  DateTime addedAt;
@override final  String email;
@override final  MemberBodyRole role;

/// Create a copy of MemberBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$MemberBodyCopyWith<_MemberBody> get copyWith => __$MemberBodyCopyWithImpl<_MemberBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$MemberBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _MemberBody&&(identical(other.accountId, accountId) || other.accountId == accountId)&&(identical(other.addedAt, addedAt) || other.addedAt == addedAt)&&(identical(other.email, email) || other.email == email)&&(identical(other.role, role) || other.role == role));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,accountId,addedAt,email,role);
}

@override
String toString() {
    return 'MemberBody(accountId: $accountId, addedAt: $addedAt, email: $email, role: $role)';
}


}

/// @nodoc
abstract mixin class _$MemberBodyCopyWith<$Res> implements $MemberBodyCopyWith<$Res> {
  factory _$MemberBodyCopyWith(_MemberBody value, $Res Function(_MemberBody) _then) = __$MemberBodyCopyWithImpl;
@override @useResult
$Res call({
 String accountId, DateTime addedAt, String email, MemberBodyRole role
});




}
/// @nodoc
class __$MemberBodyCopyWithImpl<$Res>
    implements _$MemberBodyCopyWith<$Res> {
  __$MemberBodyCopyWithImpl(this._self, this._then);

  final _MemberBody _self;
  final $Res Function(_MemberBody) _then;

/// Create a copy of MemberBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? accountId = null,Object? addedAt = null,Object? email = null,Object? role = null,}) {
  return _then(_MemberBody(
accountId: null == accountId ? _self.accountId : accountId // ignore: cast_nullable_to_non_nullable
as String,addedAt: null == addedAt ? _self.addedAt : addedAt // ignore: cast_nullable_to_non_nullable
as DateTime,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,role: null == role ? _self.role : role // ignore: cast_nullable_to_non_nullable
as MemberBodyRole,
  ));
}


}

// dart format on
