// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'admins_output_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$AdminsOutputBody {

/// Every admin, by address
 List<RecordBody>? get admins;
/// Create a copy of AdminsOutputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AdminsOutputBodyCopyWith<AdminsOutputBody> get copyWith => _$AdminsOutputBodyCopyWithImpl<AdminsOutputBody>(this as AdminsOutputBody, _$identity);

  /// Serializes this AdminsOutputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as AdminsOutputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AdminsOutputBody&&const DeepCollectionEquality().equals(other.admins, _this.admins));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as AdminsOutputBody;
  return Object.hash(runtimeType,const DeepCollectionEquality().hash(_this.admins));
}

@override
String toString() {
  final _this = this as AdminsOutputBody;
  return 'AdminsOutputBody(admins: ${_this.admins})';
}


}

/// @nodoc
abstract mixin class $AdminsOutputBodyCopyWith<$Res>  {
  factory $AdminsOutputBodyCopyWith(AdminsOutputBody value, $Res Function(AdminsOutputBody) _then) = _$AdminsOutputBodyCopyWithImpl;
@useResult
$Res call({
 List<RecordBody>? admins
});




}
/// @nodoc
class _$AdminsOutputBodyCopyWithImpl<$Res>
    implements $AdminsOutputBodyCopyWith<$Res> {
  _$AdminsOutputBodyCopyWithImpl(this._self, this._then);

  final AdminsOutputBody _self;
  final $Res Function(AdminsOutputBody) _then;

/// Create a copy of AdminsOutputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? admins = freezed,}) {
  return _then(AdminsOutputBody(
admins: freezed == admins ? _self.admins : admins // ignore: cast_nullable_to_non_nullable
as List<RecordBody>?,
  ));
}

}


/// Adds pattern-matching-related methods to [AdminsOutputBody].
extension AdminsOutputBodyPatterns on AdminsOutputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AdminsOutputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AdminsOutputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AdminsOutputBody value)  $default,){
final _that = this;
switch (_that) {
case _AdminsOutputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AdminsOutputBody value)?  $default,){
final _that = this;
switch (_that) {
case _AdminsOutputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( List<RecordBody>? admins)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AdminsOutputBody() when $default != null:
return $default(_that.admins);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( List<RecordBody>? admins)  $default,) {final _that = this;
switch (_that) {
case _AdminsOutputBody():
return $default(_that.admins);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( List<RecordBody>? admins)?  $default,) {final _that = this;
switch (_that) {
case _AdminsOutputBody() when $default != null:
return $default(_that.admins);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _AdminsOutputBody implements AdminsOutputBody {
  const _AdminsOutputBody({required  List<RecordBody>? admins}): _admins = admins;
  factory _AdminsOutputBody.fromJson(Map<String, dynamic> json) => _$AdminsOutputBodyFromJson(json);

/// Every admin, by address
 final  List<RecordBody>? _admins;
/// Every admin, by address
@override List<RecordBody>? get admins {
  final value = _admins;
  if (value == null) return null;
  if (_admins is EqualUnmodifiableListView) return _admins;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(value);
}


/// Create a copy of AdminsOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AdminsOutputBodyCopyWith<_AdminsOutputBody> get copyWith => __$AdminsOutputBodyCopyWithImpl<_AdminsOutputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AdminsOutputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _AdminsOutputBody&&const DeepCollectionEquality().equals(other.admins, _admins));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,const DeepCollectionEquality().hash(_admins));
}

@override
String toString() {
    return 'AdminsOutputBody(admins: $admins)';
}


}

/// @nodoc
abstract mixin class _$AdminsOutputBodyCopyWith<$Res> implements $AdminsOutputBodyCopyWith<$Res> {
  factory _$AdminsOutputBodyCopyWith(_AdminsOutputBody value, $Res Function(_AdminsOutputBody) _then) = __$AdminsOutputBodyCopyWithImpl;
@override @useResult
$Res call({
 List<RecordBody>? admins
});




}
/// @nodoc
class __$AdminsOutputBodyCopyWithImpl<$Res>
    implements _$AdminsOutputBodyCopyWith<$Res> {
  __$AdminsOutputBodyCopyWithImpl(this._self, this._then);

  final _AdminsOutputBody _self;
  final $Res Function(_AdminsOutputBody) _then;

/// Create a copy of AdminsOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? admins = freezed,}) {
  return _then(_AdminsOutputBody(
admins: freezed == admins ? _self._admins : admins // ignore: cast_nullable_to_non_nullable
as List<RecordBody>?,
  ));
}


}

// dart format on
