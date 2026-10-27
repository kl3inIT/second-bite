// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'admin_members_output_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$AdminMembersOutputBody {

 List<MemberBody>? get members;
/// Create a copy of AdminMembersOutputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AdminMembersOutputBodyCopyWith<AdminMembersOutputBody> get copyWith => _$AdminMembersOutputBodyCopyWithImpl<AdminMembersOutputBody>(this as AdminMembersOutputBody, _$identity);

  /// Serializes this AdminMembersOutputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as AdminMembersOutputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AdminMembersOutputBody&&const DeepCollectionEquality().equals(other.members, _this.members));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as AdminMembersOutputBody;
  return Object.hash(runtimeType,const DeepCollectionEquality().hash(_this.members));
}

@override
String toString() {
  final _this = this as AdminMembersOutputBody;
  return 'AdminMembersOutputBody(members: ${_this.members})';
}


}

/// @nodoc
abstract mixin class $AdminMembersOutputBodyCopyWith<$Res>  {
  factory $AdminMembersOutputBodyCopyWith(AdminMembersOutputBody value, $Res Function(AdminMembersOutputBody) _then) = _$AdminMembersOutputBodyCopyWithImpl;
@useResult
$Res call({
 List<MemberBody>? members
});




}
/// @nodoc
class _$AdminMembersOutputBodyCopyWithImpl<$Res>
    implements $AdminMembersOutputBodyCopyWith<$Res> {
  _$AdminMembersOutputBodyCopyWithImpl(this._self, this._then);

  final AdminMembersOutputBody _self;
  final $Res Function(AdminMembersOutputBody) _then;

/// Create a copy of AdminMembersOutputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? members = freezed,}) {
  return _then(AdminMembersOutputBody(
members: freezed == members ? _self.members : members // ignore: cast_nullable_to_non_nullable
as List<MemberBody>?,
  ));
}

}


/// Adds pattern-matching-related methods to [AdminMembersOutputBody].
extension AdminMembersOutputBodyPatterns on AdminMembersOutputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AdminMembersOutputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AdminMembersOutputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AdminMembersOutputBody value)  $default,){
final _that = this;
switch (_that) {
case _AdminMembersOutputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AdminMembersOutputBody value)?  $default,){
final _that = this;
switch (_that) {
case _AdminMembersOutputBody() when $default != null:
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
case _AdminMembersOutputBody() when $default != null:
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
case _AdminMembersOutputBody():
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
case _AdminMembersOutputBody() when $default != null:
return $default(_that.members);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _AdminMembersOutputBody implements AdminMembersOutputBody {
  const _AdminMembersOutputBody({required  List<MemberBody>? members}): _members = members;
  factory _AdminMembersOutputBody.fromJson(Map<String, dynamic> json) => _$AdminMembersOutputBodyFromJson(json);

 final  List<MemberBody>? _members;
@override List<MemberBody>? get members {
  final value = _members;
  if (value == null) return null;
  if (_members is EqualUnmodifiableListView) return _members;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(value);
}


/// Create a copy of AdminMembersOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AdminMembersOutputBodyCopyWith<_AdminMembersOutputBody> get copyWith => __$AdminMembersOutputBodyCopyWithImpl<_AdminMembersOutputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AdminMembersOutputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _AdminMembersOutputBody&&const DeepCollectionEquality().equals(other.members, _members));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,const DeepCollectionEquality().hash(_members));
}

@override
String toString() {
    return 'AdminMembersOutputBody(members: $members)';
}


}

/// @nodoc
abstract mixin class _$AdminMembersOutputBodyCopyWith<$Res> implements $AdminMembersOutputBodyCopyWith<$Res> {
  factory _$AdminMembersOutputBodyCopyWith(_AdminMembersOutputBody value, $Res Function(_AdminMembersOutputBody) _then) = __$AdminMembersOutputBodyCopyWithImpl;
@override @useResult
$Res call({
 List<MemberBody>? members
});




}
/// @nodoc
class __$AdminMembersOutputBodyCopyWithImpl<$Res>
    implements _$AdminMembersOutputBodyCopyWith<$Res> {
  __$AdminMembersOutputBodyCopyWithImpl(this._self, this._then);

  final _AdminMembersOutputBody _self;
  final $Res Function(_AdminMembersOutputBody) _then;

/// Create a copy of AdminMembersOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? members = freezed,}) {
  return _then(_AdminMembersOutputBody(
members: freezed == members ? _self._members : members // ignore: cast_nullable_to_non_nullable
as List<MemberBody>?,
  ));
}


}

// dart format on
