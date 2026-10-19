// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'offers_output_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$OffersOutputBody {

 List<OfferBody> get offers;
/// Create a copy of OffersOutputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$OffersOutputBodyCopyWith<OffersOutputBody> get copyWith => _$OffersOutputBodyCopyWithImpl<OffersOutputBody>(this as OffersOutputBody, _$identity);

  /// Serializes this OffersOutputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as OffersOutputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is OffersOutputBody&&const DeepCollectionEquality().equals(other.offers, _this.offers));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as OffersOutputBody;
  return Object.hash(runtimeType,const DeepCollectionEquality().hash(_this.offers));
}

@override
String toString() {
  final _this = this as OffersOutputBody;
  return 'OffersOutputBody(offers: ${_this.offers})';
}


}

/// @nodoc
abstract mixin class $OffersOutputBodyCopyWith<$Res>  {
  factory $OffersOutputBodyCopyWith(OffersOutputBody value, $Res Function(OffersOutputBody) _then) = _$OffersOutputBodyCopyWithImpl;
@useResult
$Res call({
 List<OfferBody> offers
});




}
/// @nodoc
class _$OffersOutputBodyCopyWithImpl<$Res>
    implements $OffersOutputBodyCopyWith<$Res> {
  _$OffersOutputBodyCopyWithImpl(this._self, this._then);

  final OffersOutputBody _self;
  final $Res Function(OffersOutputBody) _then;

/// Create a copy of OffersOutputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? offers = null,}) {
  return _then(OffersOutputBody(
offers: null == offers ? _self.offers : offers // ignore: cast_nullable_to_non_nullable
as List<OfferBody>,
  ));
}

}


/// Adds pattern-matching-related methods to [OffersOutputBody].
extension OffersOutputBodyPatterns on OffersOutputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _OffersOutputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _OffersOutputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _OffersOutputBody value)  $default,){
final _that = this;
switch (_that) {
case _OffersOutputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _OffersOutputBody value)?  $default,){
final _that = this;
switch (_that) {
case _OffersOutputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( List<OfferBody> offers)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _OffersOutputBody() when $default != null:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( List<OfferBody> offers)  $default,) {final _that = this;
switch (_that) {
case _OffersOutputBody():
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( List<OfferBody> offers)?  $default,) {final _that = this;
switch (_that) {
case _OffersOutputBody() when $default != null:
return $default(_that.offers);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _OffersOutputBody implements OffersOutputBody {
  const _OffersOutputBody({required  List<OfferBody> offers}): _offers = offers;
  factory _OffersOutputBody.fromJson(Map<String, dynamic> json) => _$OffersOutputBodyFromJson(json);

 final  List<OfferBody> _offers;
@override List<OfferBody> get offers {
  if (_offers is EqualUnmodifiableListView) return _offers;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_offers);
}


/// Create a copy of OffersOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$OffersOutputBodyCopyWith<_OffersOutputBody> get copyWith => __$OffersOutputBodyCopyWithImpl<_OffersOutputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$OffersOutputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _OffersOutputBody&&const DeepCollectionEquality().equals(other.offers, _offers));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,const DeepCollectionEquality().hash(_offers));
}

@override
String toString() {
    return 'OffersOutputBody(offers: $offers)';
}


}

/// @nodoc
abstract mixin class _$OffersOutputBodyCopyWith<$Res> implements $OffersOutputBodyCopyWith<$Res> {
  factory _$OffersOutputBodyCopyWith(_OffersOutputBody value, $Res Function(_OffersOutputBody) _then) = __$OffersOutputBodyCopyWithImpl;
@override @useResult
$Res call({
 List<OfferBody> offers
});




}
/// @nodoc
class __$OffersOutputBodyCopyWithImpl<$Res>
    implements _$OffersOutputBodyCopyWith<$Res> {
  __$OffersOutputBodyCopyWithImpl(this._self, this._then);

  final _OffersOutputBody _self;
  final $Res Function(_OffersOutputBody) _then;

/// Create a copy of OffersOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? offers = null,}) {
  return _then(_OffersOutputBody(
offers: null == offers ? _self._offers : offers // ignore: cast_nullable_to_non_nullable
as List<OfferBody>,
  ));
}


}

// dart format on
