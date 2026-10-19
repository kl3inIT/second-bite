// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'found_output_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$FoundOutputBody {

 List<FoundBody> get offers;
/// Create a copy of FoundOutputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$FoundOutputBodyCopyWith<FoundOutputBody> get copyWith => _$FoundOutputBodyCopyWithImpl<FoundOutputBody>(this as FoundOutputBody, _$identity);

  /// Serializes this FoundOutputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as FoundOutputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is FoundOutputBody&&const DeepCollectionEquality().equals(other.offers, _this.offers));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as FoundOutputBody;
  return Object.hash(runtimeType,const DeepCollectionEquality().hash(_this.offers));
}

@override
String toString() {
  final _this = this as FoundOutputBody;
  return 'FoundOutputBody(offers: ${_this.offers})';
}


}

/// @nodoc
abstract mixin class $FoundOutputBodyCopyWith<$Res>  {
  factory $FoundOutputBodyCopyWith(FoundOutputBody value, $Res Function(FoundOutputBody) _then) = _$FoundOutputBodyCopyWithImpl;
@useResult
$Res call({
 List<FoundBody> offers
});




}
/// @nodoc
class _$FoundOutputBodyCopyWithImpl<$Res>
    implements $FoundOutputBodyCopyWith<$Res> {
  _$FoundOutputBodyCopyWithImpl(this._self, this._then);

  final FoundOutputBody _self;
  final $Res Function(FoundOutputBody) _then;

/// Create a copy of FoundOutputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? offers = null,}) {
  return _then(FoundOutputBody(
offers: null == offers ? _self.offers : offers // ignore: cast_nullable_to_non_nullable
as List<FoundBody>,
  ));
}

}


/// Adds pattern-matching-related methods to [FoundOutputBody].
extension FoundOutputBodyPatterns on FoundOutputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _FoundOutputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _FoundOutputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _FoundOutputBody value)  $default,){
final _that = this;
switch (_that) {
case _FoundOutputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _FoundOutputBody value)?  $default,){
final _that = this;
switch (_that) {
case _FoundOutputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( List<FoundBody> offers)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _FoundOutputBody() when $default != null:
return $default(_that.offers);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( List<FoundBody> offers)  $default,) {final _that = this;
switch (_that) {
case _FoundOutputBody():
return $default(_that.offers);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( List<FoundBody> offers)?  $default,) {final _that = this;
switch (_that) {
case _FoundOutputBody() when $default != null:
return $default(_that.offers);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _FoundOutputBody implements FoundOutputBody {
  const _FoundOutputBody({required  List<FoundBody> offers}): _offers = offers;
  factory _FoundOutputBody.fromJson(Map<String, dynamic> json) => _$FoundOutputBodyFromJson(json);

 final  List<FoundBody> _offers;
@override List<FoundBody> get offers {
  if (_offers is EqualUnmodifiableListView) return _offers;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_offers);
}


/// Create a copy of FoundOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$FoundOutputBodyCopyWith<_FoundOutputBody> get copyWith => __$FoundOutputBodyCopyWithImpl<_FoundOutputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$FoundOutputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _FoundOutputBody&&const DeepCollectionEquality().equals(other.offers, _offers));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,const DeepCollectionEquality().hash(_offers));
}

@override
String toString() {
    return 'FoundOutputBody(offers: $offers)';
}


}

/// @nodoc
abstract mixin class _$FoundOutputBodyCopyWith<$Res> implements $FoundOutputBodyCopyWith<$Res> {
  factory _$FoundOutputBodyCopyWith(_FoundOutputBody value, $Res Function(_FoundOutputBody) _then) = __$FoundOutputBodyCopyWithImpl;
@override @useResult
$Res call({
 List<FoundBody> offers
});




}
/// @nodoc
class __$FoundOutputBodyCopyWithImpl<$Res>
    implements _$FoundOutputBodyCopyWith<$Res> {
  __$FoundOutputBodyCopyWithImpl(this._self, this._then);

  final _FoundOutputBody _self;
  final $Res Function(_FoundOutputBody) _then;

/// Create a copy of FoundOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? offers = null,}) {
  return _then(_FoundOutputBody(
offers: null == offers ? _self._offers : offers // ignore: cast_nullable_to_non_nullable
as List<FoundBody>,
  ));
}


}

// dart format on
