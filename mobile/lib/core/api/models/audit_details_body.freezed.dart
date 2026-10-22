// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'audit_details_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$AuditDetailsBody {

/// The settings changed
 List<AuditChangeBody>? get changes;/// Who delivers email after the change
 AuditDetailsBodyProvider? get provider;/// What the owner was told, for a rejection or a block; the admin's reason, for a hidden review
 String? get reason;/// Where a change of admins came from
 AuditDetailsBodySource? get source;
/// Create a copy of AuditDetailsBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AuditDetailsBodyCopyWith<AuditDetailsBody> get copyWith => _$AuditDetailsBodyCopyWithImpl<AuditDetailsBody>(this as AuditDetailsBody, _$identity);

  /// Serializes this AuditDetailsBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as AuditDetailsBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AuditDetailsBody&&const DeepCollectionEquality().equals(other.changes, _this.changes)&&(identical(other.provider, _this.provider) || other.provider == _this.provider)&&(identical(other.reason, _this.reason) || other.reason == _this.reason)&&(identical(other.source, _this.source) || other.source == _this.source));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as AuditDetailsBody;
  return Object.hash(runtimeType,const DeepCollectionEquality().hash(_this.changes),_this.provider,_this.reason,_this.source);
}

@override
String toString() {
  final _this = this as AuditDetailsBody;
  return 'AuditDetailsBody(changes: ${_this.changes}, provider: ${_this.provider}, reason: ${_this.reason}, source: ${_this.source})';
}


}

/// @nodoc
abstract mixin class $AuditDetailsBodyCopyWith<$Res>  {
  factory $AuditDetailsBodyCopyWith(AuditDetailsBody value, $Res Function(AuditDetailsBody) _then) = _$AuditDetailsBodyCopyWithImpl;
@useResult
$Res call({
 List<AuditChangeBody>? changes, AuditDetailsBodyProvider? provider, String? reason, AuditDetailsBodySource? source
});




}
/// @nodoc
class _$AuditDetailsBodyCopyWithImpl<$Res>
    implements $AuditDetailsBodyCopyWith<$Res> {
  _$AuditDetailsBodyCopyWithImpl(this._self, this._then);

  final AuditDetailsBody _self;
  final $Res Function(AuditDetailsBody) _then;

/// Create a copy of AuditDetailsBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? changes = freezed,Object? provider = freezed,Object? reason = freezed,Object? source = freezed,}) {
  return _then(AuditDetailsBody(
changes: freezed == changes ? _self.changes : changes // ignore: cast_nullable_to_non_nullable
as List<AuditChangeBody>?,provider: freezed == provider ? _self.provider : provider // ignore: cast_nullable_to_non_nullable
as AuditDetailsBodyProvider?,reason: freezed == reason ? _self.reason : reason // ignore: cast_nullable_to_non_nullable
as String?,source: freezed == source ? _self.source : source // ignore: cast_nullable_to_non_nullable
as AuditDetailsBodySource?,
  ));
}

}


/// Adds pattern-matching-related methods to [AuditDetailsBody].
extension AuditDetailsBodyPatterns on AuditDetailsBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AuditDetailsBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AuditDetailsBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AuditDetailsBody value)  $default,){
final _that = this;
switch (_that) {
case _AuditDetailsBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AuditDetailsBody value)?  $default,){
final _that = this;
switch (_that) {
case _AuditDetailsBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( List<AuditChangeBody>? changes,  AuditDetailsBodyProvider? provider,  String? reason,  AuditDetailsBodySource? source)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AuditDetailsBody() when $default != null:
return $default(_that.changes,_that.provider,_that.reason,_that.source);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( List<AuditChangeBody>? changes,  AuditDetailsBodyProvider? provider,  String? reason,  AuditDetailsBodySource? source)  $default,) {final _that = this;
switch (_that) {
case _AuditDetailsBody():
return $default(_that.changes,_that.provider,_that.reason,_that.source);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( List<AuditChangeBody>? changes,  AuditDetailsBodyProvider? provider,  String? reason,  AuditDetailsBodySource? source)?  $default,) {final _that = this;
switch (_that) {
case _AuditDetailsBody() when $default != null:
return $default(_that.changes,_that.provider,_that.reason,_that.source);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _AuditDetailsBody implements AuditDetailsBody {
  const _AuditDetailsBody({ List<AuditChangeBody>? changes, this.provider, this.reason, this.source}): _changes = changes;
  factory _AuditDetailsBody.fromJson(Map<String, dynamic> json) => _$AuditDetailsBodyFromJson(json);

/// The settings changed
 final  List<AuditChangeBody>? _changes;
/// The settings changed
@override List<AuditChangeBody>? get changes {
  final value = _changes;
  if (value == null) return null;
  if (_changes is EqualUnmodifiableListView) return _changes;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(value);
}

/// Who delivers email after the change
@override final  AuditDetailsBodyProvider? provider;
/// What the owner was told, for a rejection or a block; the admin's reason, for a hidden review
@override final  String? reason;
/// Where a change of admins came from
@override final  AuditDetailsBodySource? source;

/// Create a copy of AuditDetailsBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AuditDetailsBodyCopyWith<_AuditDetailsBody> get copyWith => __$AuditDetailsBodyCopyWithImpl<_AuditDetailsBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AuditDetailsBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _AuditDetailsBody&&const DeepCollectionEquality().equals(other.changes, _changes)&&(identical(other.provider, provider) || other.provider == provider)&&(identical(other.reason, reason) || other.reason == reason)&&(identical(other.source, source) || other.source == source));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,const DeepCollectionEquality().hash(_changes),provider,reason,source);
}

@override
String toString() {
    return 'AuditDetailsBody(changes: $changes, provider: $provider, reason: $reason, source: $source)';
}


}

/// @nodoc
abstract mixin class _$AuditDetailsBodyCopyWith<$Res> implements $AuditDetailsBodyCopyWith<$Res> {
  factory _$AuditDetailsBodyCopyWith(_AuditDetailsBody value, $Res Function(_AuditDetailsBody) _then) = __$AuditDetailsBodyCopyWithImpl;
@override @useResult
$Res call({
 List<AuditChangeBody>? changes, AuditDetailsBodyProvider? provider, String? reason, AuditDetailsBodySource? source
});




}
/// @nodoc
class __$AuditDetailsBodyCopyWithImpl<$Res>
    implements _$AuditDetailsBodyCopyWith<$Res> {
  __$AuditDetailsBodyCopyWithImpl(this._self, this._then);

  final _AuditDetailsBody _self;
  final $Res Function(_AuditDetailsBody) _then;

/// Create a copy of AuditDetailsBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? changes = freezed,Object? provider = freezed,Object? reason = freezed,Object? source = freezed,}) {
  return _then(_AuditDetailsBody(
changes: freezed == changes ? _self._changes : changes // ignore: cast_nullable_to_non_nullable
as List<AuditChangeBody>?,provider: freezed == provider ? _self.provider : provider // ignore: cast_nullable_to_non_nullable
as AuditDetailsBodyProvider?,reason: freezed == reason ? _self.reason : reason // ignore: cast_nullable_to_non_nullable
as String?,source: freezed == source ? _self.source : source // ignore: cast_nullable_to_non_nullable
as AuditDetailsBodySource?,
  ));
}


}

// dart format on
