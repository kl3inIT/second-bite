// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'latest_offer_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$LatestOfferBody {

 String get id; String get name; DateTime get postedAt; String get sellerId;/// As the offer copied it when posted
 String get sellerName;
/// Create a copy of LatestOfferBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$LatestOfferBodyCopyWith<LatestOfferBody> get copyWith => _$LatestOfferBodyCopyWithImpl<LatestOfferBody>(this as LatestOfferBody, _$identity);

  /// Serializes this LatestOfferBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as LatestOfferBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is LatestOfferBody&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.postedAt, _this.postedAt) || other.postedAt == _this.postedAt)&&(identical(other.sellerId, _this.sellerId) || other.sellerId == _this.sellerId)&&(identical(other.sellerName, _this.sellerName) || other.sellerName == _this.sellerName));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as LatestOfferBody;
  return Object.hash(runtimeType,_this.id,_this.name,_this.postedAt,_this.sellerId,_this.sellerName);
}

@override
String toString() {
  final _this = this as LatestOfferBody;
  return 'LatestOfferBody(id: ${_this.id}, name: ${_this.name}, postedAt: ${_this.postedAt}, sellerId: ${_this.sellerId}, sellerName: ${_this.sellerName})';
}


}

/// @nodoc
abstract mixin class $LatestOfferBodyCopyWith<$Res>  {
  factory $LatestOfferBodyCopyWith(LatestOfferBody value, $Res Function(LatestOfferBody) _then) = _$LatestOfferBodyCopyWithImpl;
@useResult
$Res call({
 String id, String name, DateTime postedAt, String sellerId, String sellerName
});




}
/// @nodoc
class _$LatestOfferBodyCopyWithImpl<$Res>
    implements $LatestOfferBodyCopyWith<$Res> {
  _$LatestOfferBodyCopyWithImpl(this._self, this._then);

  final LatestOfferBody _self;
  final $Res Function(LatestOfferBody) _then;

/// Create a copy of LatestOfferBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? name = null,Object? postedAt = null,Object? sellerId = null,Object? sellerName = null,}) {
  return _then(LatestOfferBody(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,postedAt: null == postedAt ? _self.postedAt : postedAt // ignore: cast_nullable_to_non_nullable
as DateTime,sellerId: null == sellerId ? _self.sellerId : sellerId // ignore: cast_nullable_to_non_nullable
as String,sellerName: null == sellerName ? _self.sellerName : sellerName // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [LatestOfferBody].
extension LatestOfferBodyPatterns on LatestOfferBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _LatestOfferBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _LatestOfferBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _LatestOfferBody value)  $default,){
final _that = this;
switch (_that) {
case _LatestOfferBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _LatestOfferBody value)?  $default,){
final _that = this;
switch (_that) {
case _LatestOfferBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String name,  DateTime postedAt,  String sellerId,  String sellerName)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _LatestOfferBody() when $default != null:
return $default(_that.id,_that.name,_that.postedAt,_that.sellerId,_that.sellerName);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String name,  DateTime postedAt,  String sellerId,  String sellerName)  $default,) {final _that = this;
switch (_that) {
case _LatestOfferBody():
return $default(_that.id,_that.name,_that.postedAt,_that.sellerId,_that.sellerName);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String name,  DateTime postedAt,  String sellerId,  String sellerName)?  $default,) {final _that = this;
switch (_that) {
case _LatestOfferBody() when $default != null:
return $default(_that.id,_that.name,_that.postedAt,_that.sellerId,_that.sellerName);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _LatestOfferBody implements LatestOfferBody {
  const _LatestOfferBody({required this.id, required this.name, required this.postedAt, required this.sellerId, required this.sellerName});
  factory _LatestOfferBody.fromJson(Map<String, dynamic> json) => _$LatestOfferBodyFromJson(json);

@override final  String id;
@override final  String name;
@override final  DateTime postedAt;
@override final  String sellerId;
/// As the offer copied it when posted
@override final  String sellerName;

/// Create a copy of LatestOfferBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$LatestOfferBodyCopyWith<_LatestOfferBody> get copyWith => __$LatestOfferBodyCopyWithImpl<_LatestOfferBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$LatestOfferBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _LatestOfferBody&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.postedAt, postedAt) || other.postedAt == postedAt)&&(identical(other.sellerId, sellerId) || other.sellerId == sellerId)&&(identical(other.sellerName, sellerName) || other.sellerName == sellerName));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,id,name,postedAt,sellerId,sellerName);
}

@override
String toString() {
    return 'LatestOfferBody(id: $id, name: $name, postedAt: $postedAt, sellerId: $sellerId, sellerName: $sellerName)';
}


}

/// @nodoc
abstract mixin class _$LatestOfferBodyCopyWith<$Res> implements $LatestOfferBodyCopyWith<$Res> {
  factory _$LatestOfferBodyCopyWith(_LatestOfferBody value, $Res Function(_LatestOfferBody) _then) = __$LatestOfferBodyCopyWithImpl;
@override @useResult
$Res call({
 String id, String name, DateTime postedAt, String sellerId, String sellerName
});




}
/// @nodoc
class __$LatestOfferBodyCopyWithImpl<$Res>
    implements _$LatestOfferBodyCopyWith<$Res> {
  __$LatestOfferBodyCopyWithImpl(this._self, this._then);

  final _LatestOfferBody _self;
  final $Res Function(_LatestOfferBody) _then;

/// Create a copy of LatestOfferBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? name = null,Object? postedAt = null,Object? sellerId = null,Object? sellerName = null,}) {
  return _then(_LatestOfferBody(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,postedAt: null == postedAt ? _self.postedAt : postedAt // ignore: cast_nullable_to_non_nullable
as DateTime,sellerId: null == sellerId ? _self.sellerId : sellerId // ignore: cast_nullable_to_non_nullable
as String,sellerName: null == sellerName ? _self.sellerName : sellerName // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
