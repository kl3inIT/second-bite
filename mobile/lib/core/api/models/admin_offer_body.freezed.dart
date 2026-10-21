// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'admin_offer_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$AdminOfferBody {

 OfferBody get offer;/// Copied from the seller when the offer was posted
 String get sellerName;
/// Create a copy of AdminOfferBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AdminOfferBodyCopyWith<AdminOfferBody> get copyWith => _$AdminOfferBodyCopyWithImpl<AdminOfferBody>(this as AdminOfferBody, _$identity);

  /// Serializes this AdminOfferBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as AdminOfferBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AdminOfferBody&&(identical(other.offer, _this.offer) || other.offer == _this.offer)&&(identical(other.sellerName, _this.sellerName) || other.sellerName == _this.sellerName));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as AdminOfferBody;
  return Object.hash(runtimeType,_this.offer,_this.sellerName);
}

@override
String toString() {
  final _this = this as AdminOfferBody;
  return 'AdminOfferBody(offer: ${_this.offer}, sellerName: ${_this.sellerName})';
}


}

/// @nodoc
abstract mixin class $AdminOfferBodyCopyWith<$Res>  {
  factory $AdminOfferBodyCopyWith(AdminOfferBody value, $Res Function(AdminOfferBody) _then) = _$AdminOfferBodyCopyWithImpl;
@useResult
$Res call({
 OfferBody offer, String sellerName
});


$OfferBodyCopyWith<$Res> get offer;

}
/// @nodoc
class _$AdminOfferBodyCopyWithImpl<$Res>
    implements $AdminOfferBodyCopyWith<$Res> {
  _$AdminOfferBodyCopyWithImpl(this._self, this._then);

  final AdminOfferBody _self;
  final $Res Function(AdminOfferBody) _then;

/// Create a copy of AdminOfferBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? offer = null,Object? sellerName = null,}) {
  return _then(AdminOfferBody(
offer: null == offer ? _self.offer : offer // ignore: cast_nullable_to_non_nullable
as OfferBody,sellerName: null == sellerName ? _self.sellerName : sellerName // ignore: cast_nullable_to_non_nullable
as String,
  ));
}
/// Create a copy of AdminOfferBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$OfferBodyCopyWith<$Res> get offer {
  
  return $OfferBodyCopyWith<$Res>(_self.offer, (value) {
    return _then(_self.copyWith(offer: value));
  });
}
}


/// Adds pattern-matching-related methods to [AdminOfferBody].
extension AdminOfferBodyPatterns on AdminOfferBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AdminOfferBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AdminOfferBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AdminOfferBody value)  $default,){
final _that = this;
switch (_that) {
case _AdminOfferBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AdminOfferBody value)?  $default,){
final _that = this;
switch (_that) {
case _AdminOfferBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( OfferBody offer,  String sellerName)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AdminOfferBody() when $default != null:
return $default(_that.offer,_that.sellerName);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( OfferBody offer,  String sellerName)  $default,) {final _that = this;
switch (_that) {
case _AdminOfferBody():
return $default(_that.offer,_that.sellerName);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( OfferBody offer,  String sellerName)?  $default,) {final _that = this;
switch (_that) {
case _AdminOfferBody() when $default != null:
return $default(_that.offer,_that.sellerName);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _AdminOfferBody implements AdminOfferBody {
  const _AdminOfferBody({required this.offer, required this.sellerName});
  factory _AdminOfferBody.fromJson(Map<String, dynamic> json) => _$AdminOfferBodyFromJson(json);

@override final  OfferBody offer;
/// Copied from the seller when the offer was posted
@override final  String sellerName;

/// Create a copy of AdminOfferBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AdminOfferBodyCopyWith<_AdminOfferBody> get copyWith => __$AdminOfferBodyCopyWithImpl<_AdminOfferBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AdminOfferBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _AdminOfferBody&&(identical(other.offer, offer) || other.offer == offer)&&(identical(other.sellerName, sellerName) || other.sellerName == sellerName));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,offer,sellerName);
}

@override
String toString() {
    return 'AdminOfferBody(offer: $offer, sellerName: $sellerName)';
}


}

/// @nodoc
abstract mixin class _$AdminOfferBodyCopyWith<$Res> implements $AdminOfferBodyCopyWith<$Res> {
  factory _$AdminOfferBodyCopyWith(_AdminOfferBody value, $Res Function(_AdminOfferBody) _then) = __$AdminOfferBodyCopyWithImpl;
@override @useResult
$Res call({
 OfferBody offer, String sellerName
});


@override $OfferBodyCopyWith<$Res> get offer;

}
/// @nodoc
class __$AdminOfferBodyCopyWithImpl<$Res>
    implements _$AdminOfferBodyCopyWith<$Res> {
  __$AdminOfferBodyCopyWithImpl(this._self, this._then);

  final _AdminOfferBody _self;
  final $Res Function(_AdminOfferBody) _then;

/// Create a copy of AdminOfferBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? offer = null,Object? sellerName = null,}) {
  return _then(_AdminOfferBody(
offer: null == offer ? _self.offer : offer // ignore: cast_nullable_to_non_nullable
as OfferBody,sellerName: null == sellerName ? _self.sellerName : sellerName // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

/// Create a copy of AdminOfferBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$OfferBodyCopyWith<$Res> get offer {
  
  return $OfferBodyCopyWith<$Res>(_self.offer, (value) {
    return _then(_self.copyWith(offer: value));
  });
}
}

// dart format on
