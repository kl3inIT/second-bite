// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'top_seller_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$TopSellerBody {

/// As the seller's newest offer in the range copied it
 String get name;/// Offers it posted in the range
 int get offers; String get sellerId;
/// Create a copy of TopSellerBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$TopSellerBodyCopyWith<TopSellerBody> get copyWith => _$TopSellerBodyCopyWithImpl<TopSellerBody>(this as TopSellerBody, _$identity);

  /// Serializes this TopSellerBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as TopSellerBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is TopSellerBody&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.offers, _this.offers) || other.offers == _this.offers)&&(identical(other.sellerId, _this.sellerId) || other.sellerId == _this.sellerId));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as TopSellerBody;
  return Object.hash(runtimeType,_this.name,_this.offers,_this.sellerId);
}

@override
String toString() {
  final _this = this as TopSellerBody;
  return 'TopSellerBody(name: ${_this.name}, offers: ${_this.offers}, sellerId: ${_this.sellerId})';
}


}

/// @nodoc
abstract mixin class $TopSellerBodyCopyWith<$Res>  {
  factory $TopSellerBodyCopyWith(TopSellerBody value, $Res Function(TopSellerBody) _then) = _$TopSellerBodyCopyWithImpl;
@useResult
$Res call({
 String name, int offers, String sellerId
});




}
/// @nodoc
class _$TopSellerBodyCopyWithImpl<$Res>
    implements $TopSellerBodyCopyWith<$Res> {
  _$TopSellerBodyCopyWithImpl(this._self, this._then);

  final TopSellerBody _self;
  final $Res Function(TopSellerBody) _then;

/// Create a copy of TopSellerBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? name = null,Object? offers = null,Object? sellerId = null,}) {
  return _then(TopSellerBody(
name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,offers: null == offers ? _self.offers : offers // ignore: cast_nullable_to_non_nullable
as int,sellerId: null == sellerId ? _self.sellerId : sellerId // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [TopSellerBody].
extension TopSellerBodyPatterns on TopSellerBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _TopSellerBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _TopSellerBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _TopSellerBody value)  $default,){
final _that = this;
switch (_that) {
case _TopSellerBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _TopSellerBody value)?  $default,){
final _that = this;
switch (_that) {
case _TopSellerBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String name,  int offers,  String sellerId)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _TopSellerBody() when $default != null:
return $default(_that.name,_that.offers,_that.sellerId);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String name,  int offers,  String sellerId)  $default,) {final _that = this;
switch (_that) {
case _TopSellerBody():
return $default(_that.name,_that.offers,_that.sellerId);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String name,  int offers,  String sellerId)?  $default,) {final _that = this;
switch (_that) {
case _TopSellerBody() when $default != null:
return $default(_that.name,_that.offers,_that.sellerId);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _TopSellerBody implements TopSellerBody {
  const _TopSellerBody({required this.name, required this.offers, required this.sellerId});
  factory _TopSellerBody.fromJson(Map<String, dynamic> json) => _$TopSellerBodyFromJson(json);

/// As the seller's newest offer in the range copied it
@override final  String name;
/// Offers it posted in the range
@override final  int offers;
@override final  String sellerId;

/// Create a copy of TopSellerBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$TopSellerBodyCopyWith<_TopSellerBody> get copyWith => __$TopSellerBodyCopyWithImpl<_TopSellerBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$TopSellerBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _TopSellerBody&&(identical(other.name, name) || other.name == name)&&(identical(other.offers, offers) || other.offers == offers)&&(identical(other.sellerId, sellerId) || other.sellerId == sellerId));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,name,offers,sellerId);
}

@override
String toString() {
    return 'TopSellerBody(name: $name, offers: $offers, sellerId: $sellerId)';
}


}

/// @nodoc
abstract mixin class _$TopSellerBodyCopyWith<$Res> implements $TopSellerBodyCopyWith<$Res> {
  factory _$TopSellerBodyCopyWith(_TopSellerBody value, $Res Function(_TopSellerBody) _then) = __$TopSellerBodyCopyWithImpl;
@override @useResult
$Res call({
 String name, int offers, String sellerId
});




}
/// @nodoc
class __$TopSellerBodyCopyWithImpl<$Res>
    implements _$TopSellerBodyCopyWith<$Res> {
  __$TopSellerBodyCopyWithImpl(this._self, this._then);

  final _TopSellerBody _self;
  final $Res Function(_TopSellerBody) _then;

/// Create a copy of TopSellerBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? name = null,Object? offers = null,Object? sellerId = null,}) {
  return _then(_TopSellerBody(
name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,offers: null == offers ? _self.offers : offers // ignore: cast_nullable_to_non_nullable
as int,sellerId: null == sellerId ? _self.sellerId : sellerId // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
