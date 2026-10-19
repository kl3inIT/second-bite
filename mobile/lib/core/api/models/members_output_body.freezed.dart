// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'members_output_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$MembersOutputBody {

 List<MemberBody>? get members;
/// Create a copy of MembersOutputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$MembersOutputBodyCopyWith<MembersOutputBody> get copyWith => _$MembersOutputBodyCopyWithImpl<MembersOutputBody>(this as MembersOutputBody, _$identity);

  /// Serializes this MembersOutputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as MembersOutputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is MembersOutputBody&&const DeepCollectionEquality().equals(other.members, _this.members));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as MembersOutputBody;
  return Object.hash(runtimeType,const DeepCollectionEquality().hash(_this.members));
}

@override
String toString() {
  final _this = this as MembersOutputBody;
  return 'MembersOutputBody(members: ${_this.members})';
}


}

/// @nodoc
abstract mixin class $MembersOutputBodyCopyWith<$Res>  {
  factory $MembersOutputBodyCopyWith(MembersOutputBody value, $Res Function(MembersOutputBody) _then) = _$MembersOutputBodyCopyWithImpl;
@useResult
$Res call({
 List<MemberBody>? members
});




}
/// @nodoc
class _$MembersOutputBodyCopyWithImpl<$Res>
    implements $MembersOutputBodyCopyWith<$Res> {
  _$MembersOutputBodyCopyWithImpl(this._self, this._then);

  final MembersOutputBody _self;
  final $Res Function(MembersOutputBody) _then;

/// Create a copy of MembersOutputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? members = freezed,}) {
  return _then(MembersOutputBody(
members: freezed == members ? _self.members : members // ignore: cast_nullable_to_non_nullable
as List<MemberBody>?,
  ));
}

}


/// Adds pattern-matching-related methods to [MembersOutputBody].
extension MembersOutputBodyPatterns on MembersOutputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _MembersOutputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _MembersOutputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _MembersOutputBody value)  $default,){
final _that = this;
switch (_that) {
case _MembersOutputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _MembersOutputBody value)?  $default,){
final _that = this;
switch (_that) {
case _MembersOutputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( List<MemberBody>? members)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _MembersOutputBody() when $default != null:
return $default(_that.members);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( List<MemberBody>? members)  $default,) {final _that = this;
switch (_that) {
case _MembersOutputBody():
return $default(_that.members);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( List<MemberBody>? members)?  $default,) {final _that = this;
switch (_that) {
case _MembersOutputBody() when $default != null:
return $default(_that.members);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _MembersOutputBody implements MembersOutputBody {
  const _MembersOutputBody({required  List<MemberBody>? members}): _members = members;
  factory _MembersOutputBody.fromJson(Map<String, dynamic> json) => _$MembersOutputBodyFromJson(json);

 final  List<MemberBody>? _members;
@override List<MemberBody>? get members {
  final value = _members;
  if (value == null) return null;
  if (_members is EqualUnmodifiableListView) return _members;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(value);
}


/// Create a copy of MembersOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$MembersOutputBodyCopyWith<_MembersOutputBody> get copyWith => __$MembersOutputBodyCopyWithImpl<_MembersOutputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$MembersOutputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _MembersOutputBody&&const DeepCollectionEquality().equals(other.members, _members));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,const DeepCollectionEquality().hash(_members));
}

@override
String toString() {
    return 'MembersOutputBody(members: $members)';
}


}

/// @nodoc
abstract mixin class _$MembersOutputBodyCopyWith<$Res> implements $MembersOutputBodyCopyWith<$Res> {
  factory _$MembersOutputBodyCopyWith(_MembersOutputBody value, $Res Function(_MembersOutputBody) _then) = __$MembersOutputBodyCopyWithImpl;
@override @useResult
$Res call({
 List<MemberBody>? members
});




}
/// @nodoc
class __$MembersOutputBodyCopyWithImpl<$Res>
    implements _$MembersOutputBodyCopyWith<$Res> {
  __$MembersOutputBodyCopyWithImpl(this._self, this._then);

  final _MembersOutputBody _self;
  final $Res Function(_MembersOutputBody) _then;

/// Create a copy of MembersOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? members = freezed,}) {
  return _then(_MembersOutputBody(
members: freezed == members ? _self._members : members // ignore: cast_nullable_to_non_nullable
as List<MemberBody>?,
  ));
}


}

// dart format on
