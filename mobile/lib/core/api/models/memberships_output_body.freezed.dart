// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'memberships_output_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$MembershipsOutputBody {

 List<MembershipBody>? get memberships;
/// Create a copy of MembershipsOutputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$MembershipsOutputBodyCopyWith<MembershipsOutputBody> get copyWith => _$MembershipsOutputBodyCopyWithImpl<MembershipsOutputBody>(this as MembershipsOutputBody, _$identity);

  /// Serializes this MembershipsOutputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as MembershipsOutputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is MembershipsOutputBody&&const DeepCollectionEquality().equals(other.memberships, _this.memberships));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as MembershipsOutputBody;
  return Object.hash(runtimeType,const DeepCollectionEquality().hash(_this.memberships));
}

@override
String toString() {
  final _this = this as MembershipsOutputBody;
  return 'MembershipsOutputBody(memberships: ${_this.memberships})';
}


}

/// @nodoc
abstract mixin class $MembershipsOutputBodyCopyWith<$Res>  {
  factory $MembershipsOutputBodyCopyWith(MembershipsOutputBody value, $Res Function(MembershipsOutputBody) _then) = _$MembershipsOutputBodyCopyWithImpl;
@useResult
$Res call({
 List<MembershipBody>? memberships
});




}
/// @nodoc
class _$MembershipsOutputBodyCopyWithImpl<$Res>
    implements $MembershipsOutputBodyCopyWith<$Res> {
  _$MembershipsOutputBodyCopyWithImpl(this._self, this._then);

  final MembershipsOutputBody _self;
  final $Res Function(MembershipsOutputBody) _then;

/// Create a copy of MembershipsOutputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? memberships = freezed,}) {
  return _then(MembershipsOutputBody(
memberships: freezed == memberships ? _self.memberships : memberships // ignore: cast_nullable_to_non_nullable
as List<MembershipBody>?,
  ));
}

}


/// Adds pattern-matching-related methods to [MembershipsOutputBody].
extension MembershipsOutputBodyPatterns on MembershipsOutputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _MembershipsOutputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _MembershipsOutputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _MembershipsOutputBody value)  $default,){
final _that = this;
switch (_that) {
case _MembershipsOutputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _MembershipsOutputBody value)?  $default,){
final _that = this;
switch (_that) {
case _MembershipsOutputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( List<MembershipBody>? memberships)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _MembershipsOutputBody() when $default != null:
return $default(_that.memberships);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( List<MembershipBody>? memberships)  $default,) {final _that = this;
switch (_that) {
case _MembershipsOutputBody():
return $default(_that.memberships);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( List<MembershipBody>? memberships)?  $default,) {final _that = this;
switch (_that) {
case _MembershipsOutputBody() when $default != null:
return $default(_that.memberships);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _MembershipsOutputBody implements MembershipsOutputBody {
  const _MembershipsOutputBody({required  List<MembershipBody>? memberships}): _memberships = memberships;
  factory _MembershipsOutputBody.fromJson(Map<String, dynamic> json) => _$MembershipsOutputBodyFromJson(json);

 final  List<MembershipBody>? _memberships;
@override List<MembershipBody>? get memberships {
  final value = _memberships;
  if (value == null) return null;
  if (_memberships is EqualUnmodifiableListView) return _memberships;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(value);
}


/// Create a copy of MembershipsOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$MembershipsOutputBodyCopyWith<_MembershipsOutputBody> get copyWith => __$MembershipsOutputBodyCopyWithImpl<_MembershipsOutputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$MembershipsOutputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _MembershipsOutputBody&&const DeepCollectionEquality().equals(other.memberships, _memberships));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,const DeepCollectionEquality().hash(_memberships));
}

@override
String toString() {
    return 'MembershipsOutputBody(memberships: $memberships)';
}


}

/// @nodoc
abstract mixin class _$MembershipsOutputBodyCopyWith<$Res> implements $MembershipsOutputBodyCopyWith<$Res> {
  factory _$MembershipsOutputBodyCopyWith(_MembershipsOutputBody value, $Res Function(_MembershipsOutputBody) _then) = __$MembershipsOutputBodyCopyWithImpl;
@override @useResult
$Res call({
 List<MembershipBody>? memberships
});




}
/// @nodoc
class __$MembershipsOutputBodyCopyWithImpl<$Res>
    implements _$MembershipsOutputBodyCopyWith<$Res> {
  __$MembershipsOutputBodyCopyWithImpl(this._self, this._then);

  final _MembershipsOutputBody _self;
  final $Res Function(_MembershipsOutputBody) _then;

/// Create a copy of MembershipsOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? memberships = freezed,}) {
  return _then(_MembershipsOutputBody(
memberships: freezed == memberships ? _self._memberships : memberships // ignore: cast_nullable_to_non_nullable
as List<MembershipBody>?,
  ));
}


}

// dart format on
