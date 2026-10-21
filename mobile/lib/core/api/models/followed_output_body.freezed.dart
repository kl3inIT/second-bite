// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'followed_output_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$FollowedOutputBody {

 List<SellerProfileBody>? get sellers;
/// Create a copy of FollowedOutputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$FollowedOutputBodyCopyWith<FollowedOutputBody> get copyWith => _$FollowedOutputBodyCopyWithImpl<FollowedOutputBody>(this as FollowedOutputBody, _$identity);

  /// Serializes this FollowedOutputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as FollowedOutputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is FollowedOutputBody&&const DeepCollectionEquality().equals(other.sellers, _this.sellers));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as FollowedOutputBody;
  return Object.hash(runtimeType,const DeepCollectionEquality().hash(_this.sellers));
}

@override
String toString() {
  final _this = this as FollowedOutputBody;
  return 'FollowedOutputBody(sellers: ${_this.sellers})';
}


}

/// @nodoc
abstract mixin class $FollowedOutputBodyCopyWith<$Res>  {
  factory $FollowedOutputBodyCopyWith(FollowedOutputBody value, $Res Function(FollowedOutputBody) _then) = _$FollowedOutputBodyCopyWithImpl;
@useResult
$Res call({
 List<SellerProfileBody>? sellers
});




}
/// @nodoc
class _$FollowedOutputBodyCopyWithImpl<$Res>
    implements $FollowedOutputBodyCopyWith<$Res> {
  _$FollowedOutputBodyCopyWithImpl(this._self, this._then);

  final FollowedOutputBody _self;
  final $Res Function(FollowedOutputBody) _then;

/// Create a copy of FollowedOutputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? sellers = freezed,}) {
  return _then(FollowedOutputBody(
sellers: freezed == sellers ? _self.sellers : sellers // ignore: cast_nullable_to_non_nullable
as List<SellerProfileBody>?,
  ));
}

}


/// Adds pattern-matching-related methods to [FollowedOutputBody].
extension FollowedOutputBodyPatterns on FollowedOutputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _FollowedOutputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _FollowedOutputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _FollowedOutputBody value)  $default,){
final _that = this;
switch (_that) {
case _FollowedOutputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _FollowedOutputBody value)?  $default,){
final _that = this;
switch (_that) {
case _FollowedOutputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( List<SellerProfileBody>? sellers)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _FollowedOutputBody() when $default != null:
return $default(_that.sellers);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( List<SellerProfileBody>? sellers)  $default,) {final _that = this;
switch (_that) {
case _FollowedOutputBody():
return $default(_that.sellers);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( List<SellerProfileBody>? sellers)?  $default,) {final _that = this;
switch (_that) {
case _FollowedOutputBody() when $default != null:
return $default(_that.sellers);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _FollowedOutputBody implements FollowedOutputBody {
  const _FollowedOutputBody({required  List<SellerProfileBody>? sellers}): _sellers = sellers;
  factory _FollowedOutputBody.fromJson(Map<String, dynamic> json) => _$FollowedOutputBodyFromJson(json);

 final  List<SellerProfileBody>? _sellers;
@override List<SellerProfileBody>? get sellers {
  final value = _sellers;
  if (value == null) return null;
  if (_sellers is EqualUnmodifiableListView) return _sellers;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(value);
}


/// Create a copy of FollowedOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$FollowedOutputBodyCopyWith<_FollowedOutputBody> get copyWith => __$FollowedOutputBodyCopyWithImpl<_FollowedOutputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$FollowedOutputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _FollowedOutputBody&&const DeepCollectionEquality().equals(other.sellers, _sellers));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,const DeepCollectionEquality().hash(_sellers));
}

@override
String toString() {
    return 'FollowedOutputBody(sellers: $sellers)';
}


}

/// @nodoc
abstract mixin class _$FollowedOutputBodyCopyWith<$Res> implements $FollowedOutputBodyCopyWith<$Res> {
  factory _$FollowedOutputBodyCopyWith(_FollowedOutputBody value, $Res Function(_FollowedOutputBody) _then) = __$FollowedOutputBodyCopyWithImpl;
@override @useResult
$Res call({
 List<SellerProfileBody>? sellers
});




}
/// @nodoc
class __$FollowedOutputBodyCopyWithImpl<$Res>
    implements _$FollowedOutputBodyCopyWith<$Res> {
  __$FollowedOutputBodyCopyWithImpl(this._self, this._then);

  final _FollowedOutputBody _self;
  final $Res Function(_FollowedOutputBody) _then;

/// Create a copy of FollowedOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? sellers = freezed,}) {
  return _then(_FollowedOutputBody(
sellers: freezed == sellers ? _self._sellers : sellers // ignore: cast_nullable_to_non_nullable
as List<SellerProfileBody>?,
  ));
}


}

// dart format on
