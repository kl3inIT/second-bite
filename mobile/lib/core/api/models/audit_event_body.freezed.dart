// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'audit_event_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$AuditEventBody {

 AuditEventBodyAction get action; AuditDetailsBody get details; String get id; DateTime get occurredAt; String get resourceId; AuditEventBodyResourceType get resourceType; String? get actorId; String? get actorLabel;/// The store's name or the account's address at the time; absent once that account is deleted
 String? get resourceLabel;
/// Create a copy of AuditEventBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AuditEventBodyCopyWith<AuditEventBody> get copyWith => _$AuditEventBodyCopyWithImpl<AuditEventBody>(this as AuditEventBody, _$identity);

  /// Serializes this AuditEventBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as AuditEventBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AuditEventBody&&(identical(other.action, _this.action) || other.action == _this.action)&&(identical(other.details, _this.details) || other.details == _this.details)&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.occurredAt, _this.occurredAt) || other.occurredAt == _this.occurredAt)&&(identical(other.resourceId, _this.resourceId) || other.resourceId == _this.resourceId)&&(identical(other.resourceType, _this.resourceType) || other.resourceType == _this.resourceType)&&(identical(other.actorId, _this.actorId) || other.actorId == _this.actorId)&&(identical(other.actorLabel, _this.actorLabel) || other.actorLabel == _this.actorLabel)&&(identical(other.resourceLabel, _this.resourceLabel) || other.resourceLabel == _this.resourceLabel));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as AuditEventBody;
  return Object.hash(runtimeType,_this.action,_this.details,_this.id,_this.occurredAt,_this.resourceId,_this.resourceType,_this.actorId,_this.actorLabel,_this.resourceLabel);
}

@override
String toString() {
  final _this = this as AuditEventBody;
  return 'AuditEventBody(action: ${_this.action}, details: ${_this.details}, id: ${_this.id}, occurredAt: ${_this.occurredAt}, resourceId: ${_this.resourceId}, resourceType: ${_this.resourceType}, actorId: ${_this.actorId}, actorLabel: ${_this.actorLabel}, resourceLabel: ${_this.resourceLabel})';
}


}

/// @nodoc
abstract mixin class $AuditEventBodyCopyWith<$Res>  {
  factory $AuditEventBodyCopyWith(AuditEventBody value, $Res Function(AuditEventBody) _then) = _$AuditEventBodyCopyWithImpl;
@useResult
$Res call({
 AuditEventBodyAction action, AuditDetailsBody details, String id, DateTime occurredAt, String resourceId, AuditEventBodyResourceType resourceType, String? actorId, String? actorLabel, String? resourceLabel
});


$AuditDetailsBodyCopyWith<$Res> get details;

}
/// @nodoc
class _$AuditEventBodyCopyWithImpl<$Res>
    implements $AuditEventBodyCopyWith<$Res> {
  _$AuditEventBodyCopyWithImpl(this._self, this._then);

  final AuditEventBody _self;
  final $Res Function(AuditEventBody) _then;

/// Create a copy of AuditEventBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? action = null,Object? details = null,Object? id = null,Object? occurredAt = null,Object? resourceId = null,Object? resourceType = null,Object? actorId = freezed,Object? actorLabel = freezed,Object? resourceLabel = freezed,}) {
  return _then(AuditEventBody(
action: null == action ? _self.action : action // ignore: cast_nullable_to_non_nullable
as AuditEventBodyAction,details: null == details ? _self.details : details // ignore: cast_nullable_to_non_nullable
as AuditDetailsBody,id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,occurredAt: null == occurredAt ? _self.occurredAt : occurredAt // ignore: cast_nullable_to_non_nullable
as DateTime,resourceId: null == resourceId ? _self.resourceId : resourceId // ignore: cast_nullable_to_non_nullable
as String,resourceType: null == resourceType ? _self.resourceType : resourceType // ignore: cast_nullable_to_non_nullable
as AuditEventBodyResourceType,actorId: freezed == actorId ? _self.actorId : actorId // ignore: cast_nullable_to_non_nullable
as String?,actorLabel: freezed == actorLabel ? _self.actorLabel : actorLabel // ignore: cast_nullable_to_non_nullable
as String?,resourceLabel: freezed == resourceLabel ? _self.resourceLabel : resourceLabel // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}
/// Create a copy of AuditEventBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$AuditDetailsBodyCopyWith<$Res> get details {
  
  return $AuditDetailsBodyCopyWith<$Res>(_self.details, (value) {
    return _then(_self.copyWith(details: value));
  });
}
}


/// Adds pattern-matching-related methods to [AuditEventBody].
extension AuditEventBodyPatterns on AuditEventBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AuditEventBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AuditEventBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AuditEventBody value)  $default,){
final _that = this;
switch (_that) {
case _AuditEventBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AuditEventBody value)?  $default,){
final _that = this;
switch (_that) {
case _AuditEventBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( AuditEventBodyAction action,  AuditDetailsBody details,  String id,  DateTime occurredAt,  String resourceId,  AuditEventBodyResourceType resourceType,  String? actorId,  String? actorLabel,  String? resourceLabel)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AuditEventBody() when $default != null:
return $default(_that.action,_that.details,_that.id,_that.occurredAt,_that.resourceId,_that.resourceType,_that.actorId,_that.actorLabel,_that.resourceLabel);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( AuditEventBodyAction action,  AuditDetailsBody details,  String id,  DateTime occurredAt,  String resourceId,  AuditEventBodyResourceType resourceType,  String? actorId,  String? actorLabel,  String? resourceLabel)  $default,) {final _that = this;
switch (_that) {
case _AuditEventBody():
return $default(_that.action,_that.details,_that.id,_that.occurredAt,_that.resourceId,_that.resourceType,_that.actorId,_that.actorLabel,_that.resourceLabel);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( AuditEventBodyAction action,  AuditDetailsBody details,  String id,  DateTime occurredAt,  String resourceId,  AuditEventBodyResourceType resourceType,  String? actorId,  String? actorLabel,  String? resourceLabel)?  $default,) {final _that = this;
switch (_that) {
case _AuditEventBody() when $default != null:
return $default(_that.action,_that.details,_that.id,_that.occurredAt,_that.resourceId,_that.resourceType,_that.actorId,_that.actorLabel,_that.resourceLabel);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _AuditEventBody implements AuditEventBody {
  const _AuditEventBody({required this.action, required this.details, required this.id, required this.occurredAt, required this.resourceId, required this.resourceType, this.actorId, this.actorLabel, this.resourceLabel});
  factory _AuditEventBody.fromJson(Map<String, dynamic> json) => _$AuditEventBodyFromJson(json);

@override final  AuditEventBodyAction action;
@override final  AuditDetailsBody details;
@override final  String id;
@override final  DateTime occurredAt;
@override final  String resourceId;
@override final  AuditEventBodyResourceType resourceType;
@override final  String? actorId;
@override final  String? actorLabel;
/// The store's name or the account's address at the time; absent once that account is deleted
@override final  String? resourceLabel;

/// Create a copy of AuditEventBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AuditEventBodyCopyWith<_AuditEventBody> get copyWith => __$AuditEventBodyCopyWithImpl<_AuditEventBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AuditEventBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _AuditEventBody&&(identical(other.action, action) || other.action == action)&&(identical(other.details, details) || other.details == details)&&(identical(other.id, id) || other.id == id)&&(identical(other.occurredAt, occurredAt) || other.occurredAt == occurredAt)&&(identical(other.resourceId, resourceId) || other.resourceId == resourceId)&&(identical(other.resourceType, resourceType) || other.resourceType == resourceType)&&(identical(other.actorId, actorId) || other.actorId == actorId)&&(identical(other.actorLabel, actorLabel) || other.actorLabel == actorLabel)&&(identical(other.resourceLabel, resourceLabel) || other.resourceLabel == resourceLabel));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,action,details,id,occurredAt,resourceId,resourceType,actorId,actorLabel,resourceLabel);
}

@override
String toString() {
    return 'AuditEventBody(action: $action, details: $details, id: $id, occurredAt: $occurredAt, resourceId: $resourceId, resourceType: $resourceType, actorId: $actorId, actorLabel: $actorLabel, resourceLabel: $resourceLabel)';
}


}

/// @nodoc
abstract mixin class _$AuditEventBodyCopyWith<$Res> implements $AuditEventBodyCopyWith<$Res> {
  factory _$AuditEventBodyCopyWith(_AuditEventBody value, $Res Function(_AuditEventBody) _then) = __$AuditEventBodyCopyWithImpl;
@override @useResult
$Res call({
 AuditEventBodyAction action, AuditDetailsBody details, String id, DateTime occurredAt, String resourceId, AuditEventBodyResourceType resourceType, String? actorId, String? actorLabel, String? resourceLabel
});


@override $AuditDetailsBodyCopyWith<$Res> get details;

}
/// @nodoc
class __$AuditEventBodyCopyWithImpl<$Res>
    implements _$AuditEventBodyCopyWith<$Res> {
  __$AuditEventBodyCopyWithImpl(this._self, this._then);

  final _AuditEventBody _self;
  final $Res Function(_AuditEventBody) _then;

/// Create a copy of AuditEventBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? action = null,Object? details = null,Object? id = null,Object? occurredAt = null,Object? resourceId = null,Object? resourceType = null,Object? actorId = freezed,Object? actorLabel = freezed,Object? resourceLabel = freezed,}) {
  return _then(_AuditEventBody(
action: null == action ? _self.action : action // ignore: cast_nullable_to_non_nullable
as AuditEventBodyAction,details: null == details ? _self.details : details // ignore: cast_nullable_to_non_nullable
as AuditDetailsBody,id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,occurredAt: null == occurredAt ? _self.occurredAt : occurredAt // ignore: cast_nullable_to_non_nullable
as DateTime,resourceId: null == resourceId ? _self.resourceId : resourceId // ignore: cast_nullable_to_non_nullable
as String,resourceType: null == resourceType ? _self.resourceType : resourceType // ignore: cast_nullable_to_non_nullable
as AuditEventBodyResourceType,actorId: freezed == actorId ? _self.actorId : actorId // ignore: cast_nullable_to_non_nullable
as String?,actorLabel: freezed == actorLabel ? _self.actorLabel : actorLabel // ignore: cast_nullable_to_non_nullable
as String?,resourceLabel: freezed == resourceLabel ? _self.resourceLabel : resourceLabel // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

/// Create a copy of AuditEventBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$AuditDetailsBodyCopyWith<$Res> get details {
  
  return $AuditDetailsBodyCopyWith<$Res>(_self.details, (value) {
    return _then(_self.copyWith(details: value));
  });
}
}

// dart format on
