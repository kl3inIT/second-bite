// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'record_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$RecordBody {

 DateTime get createdAt;/// Empty until Google gives one or the person sets it
 String get displayName; String get email; String get id; RecordBodyRole get role;/// How it last signed in: an emailed code or Google
 RecordBodyLastSignInMethod? get lastSignInMethod;/// Absent until it signs in
 DateTime? get lastSignedInAt;
/// Create a copy of RecordBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$RecordBodyCopyWith<RecordBody> get copyWith => _$RecordBodyCopyWithImpl<RecordBody>(this as RecordBody, _$identity);

  /// Serializes this RecordBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as RecordBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is RecordBody&&(identical(other.createdAt, _this.createdAt) || other.createdAt == _this.createdAt)&&(identical(other.displayName, _this.displayName) || other.displayName == _this.displayName)&&(identical(other.email, _this.email) || other.email == _this.email)&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.role, _this.role) || other.role == _this.role)&&(identical(other.lastSignInMethod, _this.lastSignInMethod) || other.lastSignInMethod == _this.lastSignInMethod)&&(identical(other.lastSignedInAt, _this.lastSignedInAt) || other.lastSignedInAt == _this.lastSignedInAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as RecordBody;
  return Object.hash(runtimeType,_this.createdAt,_this.displayName,_this.email,_this.id,_this.role,_this.lastSignInMethod,_this.lastSignedInAt);
}

@override
String toString() {
  final _this = this as RecordBody;
  return 'RecordBody(createdAt: ${_this.createdAt}, displayName: ${_this.displayName}, email: ${_this.email}, id: ${_this.id}, role: ${_this.role}, lastSignInMethod: ${_this.lastSignInMethod}, lastSignedInAt: ${_this.lastSignedInAt})';
}


}

/// @nodoc
abstract mixin class $RecordBodyCopyWith<$Res>  {
  factory $RecordBodyCopyWith(RecordBody value, $Res Function(RecordBody) _then) = _$RecordBodyCopyWithImpl;
@useResult
$Res call({
 DateTime createdAt, String displayName, String email, String id, RecordBodyRole role, RecordBodyLastSignInMethod? lastSignInMethod, DateTime? lastSignedInAt
});




}
/// @nodoc
class _$RecordBodyCopyWithImpl<$Res>
    implements $RecordBodyCopyWith<$Res> {
  _$RecordBodyCopyWithImpl(this._self, this._then);

  final RecordBody _self;
  final $Res Function(RecordBody) _then;

/// Create a copy of RecordBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? createdAt = null,Object? displayName = null,Object? email = null,Object? id = null,Object? role = null,Object? lastSignInMethod = freezed,Object? lastSignedInAt = freezed,}) {
  return _then(RecordBody(
createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,displayName: null == displayName ? _self.displayName : displayName // ignore: cast_nullable_to_non_nullable
as String,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,role: null == role ? _self.role : role // ignore: cast_nullable_to_non_nullable
as RecordBodyRole,lastSignInMethod: freezed == lastSignInMethod ? _self.lastSignInMethod : lastSignInMethod // ignore: cast_nullable_to_non_nullable
as RecordBodyLastSignInMethod?,lastSignedInAt: freezed == lastSignedInAt ? _self.lastSignedInAt : lastSignedInAt // ignore: cast_nullable_to_non_nullable
as DateTime?,
  ));
}

}


/// Adds pattern-matching-related methods to [RecordBody].
extension RecordBodyPatterns on RecordBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _RecordBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _RecordBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _RecordBody value)  $default,){
final _that = this;
switch (_that) {
case _RecordBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _RecordBody value)?  $default,){
final _that = this;
switch (_that) {
case _RecordBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( DateTime createdAt,  String displayName,  String email,  String id,  RecordBodyRole role,  RecordBodyLastSignInMethod? lastSignInMethod,  DateTime? lastSignedInAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _RecordBody() when $default != null:
return $default(_that.createdAt,_that.displayName,_that.email,_that.id,_that.role,_that.lastSignInMethod,_that.lastSignedInAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( DateTime createdAt,  String displayName,  String email,  String id,  RecordBodyRole role,  RecordBodyLastSignInMethod? lastSignInMethod,  DateTime? lastSignedInAt)  $default,) {final _that = this;
switch (_that) {
case _RecordBody():
return $default(_that.createdAt,_that.displayName,_that.email,_that.id,_that.role,_that.lastSignInMethod,_that.lastSignedInAt);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( DateTime createdAt,  String displayName,  String email,  String id,  RecordBodyRole role,  RecordBodyLastSignInMethod? lastSignInMethod,  DateTime? lastSignedInAt)?  $default,) {final _that = this;
switch (_that) {
case _RecordBody() when $default != null:
return $default(_that.createdAt,_that.displayName,_that.email,_that.id,_that.role,_that.lastSignInMethod,_that.lastSignedInAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _RecordBody implements RecordBody {
  const _RecordBody({required this.createdAt, required this.displayName, required this.email, required this.id, required this.role, this.lastSignInMethod, this.lastSignedInAt});
  factory _RecordBody.fromJson(Map<String, dynamic> json) => _$RecordBodyFromJson(json);

@override final  DateTime createdAt;
/// Empty until Google gives one or the person sets it
@override final  String displayName;
@override final  String email;
@override final  String id;
@override final  RecordBodyRole role;
/// How it last signed in: an emailed code or Google
@override final  RecordBodyLastSignInMethod? lastSignInMethod;
/// Absent until it signs in
@override final  DateTime? lastSignedInAt;

/// Create a copy of RecordBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$RecordBodyCopyWith<_RecordBody> get copyWith => __$RecordBodyCopyWithImpl<_RecordBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$RecordBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _RecordBody&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.displayName, displayName) || other.displayName == displayName)&&(identical(other.email, email) || other.email == email)&&(identical(other.id, id) || other.id == id)&&(identical(other.role, role) || other.role == role)&&(identical(other.lastSignInMethod, lastSignInMethod) || other.lastSignInMethod == lastSignInMethod)&&(identical(other.lastSignedInAt, lastSignedInAt) || other.lastSignedInAt == lastSignedInAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,createdAt,displayName,email,id,role,lastSignInMethod,lastSignedInAt);
}

@override
String toString() {
    return 'RecordBody(createdAt: $createdAt, displayName: $displayName, email: $email, id: $id, role: $role, lastSignInMethod: $lastSignInMethod, lastSignedInAt: $lastSignedInAt)';
}


}

/// @nodoc
abstract mixin class _$RecordBodyCopyWith<$Res> implements $RecordBodyCopyWith<$Res> {
  factory _$RecordBodyCopyWith(_RecordBody value, $Res Function(_RecordBody) _then) = __$RecordBodyCopyWithImpl;
@override @useResult
$Res call({
 DateTime createdAt, String displayName, String email, String id, RecordBodyRole role, RecordBodyLastSignInMethod? lastSignInMethod, DateTime? lastSignedInAt
});




}
/// @nodoc
class __$RecordBodyCopyWithImpl<$Res>
    implements _$RecordBodyCopyWith<$Res> {
  __$RecordBodyCopyWithImpl(this._self, this._then);

  final _RecordBody _self;
  final $Res Function(_RecordBody) _then;

/// Create a copy of RecordBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? createdAt = null,Object? displayName = null,Object? email = null,Object? id = null,Object? role = null,Object? lastSignInMethod = freezed,Object? lastSignedInAt = freezed,}) {
  return _then(_RecordBody(
createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,displayName: null == displayName ? _self.displayName : displayName // ignore: cast_nullable_to_non_nullable
as String,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,role: null == role ? _self.role : role // ignore: cast_nullable_to_non_nullable
as RecordBodyRole,lastSignInMethod: freezed == lastSignInMethod ? _self.lastSignInMethod : lastSignInMethod // ignore: cast_nullable_to_non_nullable
as RecordBodyLastSignInMethod?,lastSignedInAt: freezed == lastSignedInAt ? _self.lastSignedInAt : lastSignedInAt // ignore: cast_nullable_to_non_nullable
as DateTime?,
  ));
}


}

// dart format on
