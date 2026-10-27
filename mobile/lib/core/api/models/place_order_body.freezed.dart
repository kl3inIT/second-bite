// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'place_order_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$PlaceOrderBody {

/// One to ten different offers of one seller
 List<OrderWantedBody>? get lines;/// The name the seller calls at the counter
 String get name;/// A Vietnamese phone number, 0 and nine digits; spaces, dots, dashes and +84 are accepted
 String get phone;/// The customer agrees to be told about the order by Zalo once Second Bite sends there
 bool? get byZalo;/// Shared by the orders placed together from one cart, one per seller; a new one when omitted
 String? get checkoutId;
/// Create a copy of PlaceOrderBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$PlaceOrderBodyCopyWith<PlaceOrderBody> get copyWith => _$PlaceOrderBodyCopyWithImpl<PlaceOrderBody>(this as PlaceOrderBody, _$identity);

  /// Serializes this PlaceOrderBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as PlaceOrderBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is PlaceOrderBody&&const DeepCollectionEquality().equals(other.lines, _this.lines)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.phone, _this.phone) || other.phone == _this.phone)&&(identical(other.byZalo, _this.byZalo) || other.byZalo == _this.byZalo)&&(identical(other.checkoutId, _this.checkoutId) || other.checkoutId == _this.checkoutId));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as PlaceOrderBody;
  return Object.hash(runtimeType,const DeepCollectionEquality().hash(_this.lines),_this.name,_this.phone,_this.byZalo,_this.checkoutId);
}

@override
String toString() {
  final _this = this as PlaceOrderBody;
  return 'PlaceOrderBody(lines: ${_this.lines}, name: ${_this.name}, phone: ${_this.phone}, byZalo: ${_this.byZalo}, checkoutId: ${_this.checkoutId})';
}


}

/// @nodoc
abstract mixin class $PlaceOrderBodyCopyWith<$Res>  {
  factory $PlaceOrderBodyCopyWith(PlaceOrderBody value, $Res Function(PlaceOrderBody) _then) = _$PlaceOrderBodyCopyWithImpl;
@useResult
$Res call({
 List<OrderWantedBody>? lines, String name, String phone, bool? byZalo, String? checkoutId
});




}
/// @nodoc
class _$PlaceOrderBodyCopyWithImpl<$Res>
    implements $PlaceOrderBodyCopyWith<$Res> {
  _$PlaceOrderBodyCopyWithImpl(this._self, this._then);

  final PlaceOrderBody _self;
  final $Res Function(PlaceOrderBody) _then;

/// Create a copy of PlaceOrderBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? lines = freezed,Object? name = null,Object? phone = null,Object? byZalo = freezed,Object? checkoutId = freezed,}) {
  return _then(PlaceOrderBody(
lines: freezed == lines ? _self.lines : lines // ignore: cast_nullable_to_non_nullable
as List<OrderWantedBody>?,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,phone: null == phone ? _self.phone : phone // ignore: cast_nullable_to_non_nullable
as String,byZalo: freezed == byZalo ? _self.byZalo : byZalo // ignore: cast_nullable_to_non_nullable
as bool?,checkoutId: freezed == checkoutId ? _self.checkoutId : checkoutId // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [PlaceOrderBody].
extension PlaceOrderBodyPatterns on PlaceOrderBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _PlaceOrderBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _PlaceOrderBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _PlaceOrderBody value)  $default,){
final _that = this;
switch (_that) {
case _PlaceOrderBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _PlaceOrderBody value)?  $default,){
final _that = this;
switch (_that) {
case _PlaceOrderBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( List<OrderWantedBody>? lines,  String name,  String phone,  bool? byZalo,  String? checkoutId)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _PlaceOrderBody() when $default != null:
return $default(_that.lines,_that.name,_that.phone,_that.byZalo,_that.checkoutId);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( List<OrderWantedBody>? lines,  String name,  String phone,  bool? byZalo,  String? checkoutId)  $default,) {final _that = this;
switch (_that) {
case _PlaceOrderBody():
return $default(_that.lines,_that.name,_that.phone,_that.byZalo,_that.checkoutId);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( List<OrderWantedBody>? lines,  String name,  String phone,  bool? byZalo,  String? checkoutId)?  $default,) {final _that = this;
switch (_that) {
case _PlaceOrderBody() when $default != null:
return $default(_that.lines,_that.name,_that.phone,_that.byZalo,_that.checkoutId);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _PlaceOrderBody implements PlaceOrderBody {
  const _PlaceOrderBody({required  List<OrderWantedBody>? lines, required this.name, required this.phone, this.byZalo, this.checkoutId}): _lines = lines;
  factory _PlaceOrderBody.fromJson(Map<String, dynamic> json) => _$PlaceOrderBodyFromJson(json);

/// One to ten different offers of one seller
 final  List<OrderWantedBody>? _lines;
/// One to ten different offers of one seller
@override List<OrderWantedBody>? get lines {
  final value = _lines;
  if (value == null) return null;
  if (_lines is EqualUnmodifiableListView) return _lines;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(value);
}

/// The name the seller calls at the counter
@override final  String name;
/// A Vietnamese phone number, 0 and nine digits; spaces, dots, dashes and +84 are accepted
@override final  String phone;
/// The customer agrees to be told about the order by Zalo once Second Bite sends there
@override final  bool? byZalo;
/// Shared by the orders placed together from one cart, one per seller; a new one when omitted
@override final  String? checkoutId;

/// Create a copy of PlaceOrderBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$PlaceOrderBodyCopyWith<_PlaceOrderBody> get copyWith => __$PlaceOrderBodyCopyWithImpl<_PlaceOrderBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$PlaceOrderBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _PlaceOrderBody&&const DeepCollectionEquality().equals(other.lines, _lines)&&(identical(other.name, name) || other.name == name)&&(identical(other.phone, phone) || other.phone == phone)&&(identical(other.byZalo, byZalo) || other.byZalo == byZalo)&&(identical(other.checkoutId, checkoutId) || other.checkoutId == checkoutId));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,const DeepCollectionEquality().hash(_lines),name,phone,byZalo,checkoutId);
}

@override
String toString() {
    return 'PlaceOrderBody(lines: $lines, name: $name, phone: $phone, byZalo: $byZalo, checkoutId: $checkoutId)';
}


}

/// @nodoc
abstract mixin class _$PlaceOrderBodyCopyWith<$Res> implements $PlaceOrderBodyCopyWith<$Res> {
  factory _$PlaceOrderBodyCopyWith(_PlaceOrderBody value, $Res Function(_PlaceOrderBody) _then) = __$PlaceOrderBodyCopyWithImpl;
@override @useResult
$Res call({
 List<OrderWantedBody>? lines, String name, String phone, bool? byZalo, String? checkoutId
});




}
/// @nodoc
class __$PlaceOrderBodyCopyWithImpl<$Res>
    implements _$PlaceOrderBodyCopyWith<$Res> {
  __$PlaceOrderBodyCopyWithImpl(this._self, this._then);

  final _PlaceOrderBody _self;
  final $Res Function(_PlaceOrderBody) _then;

/// Create a copy of PlaceOrderBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? lines = freezed,Object? name = null,Object? phone = null,Object? byZalo = freezed,Object? checkoutId = freezed,}) {
  return _then(_PlaceOrderBody(
lines: freezed == lines ? _self._lines : lines // ignore: cast_nullable_to_non_nullable
as List<OrderWantedBody>?,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,phone: null == phone ? _self.phone : phone // ignore: cast_nullable_to_non_nullable
as String,byZalo: freezed == byZalo ? _self.byZalo : byZalo // ignore: cast_nullable_to_non_nullable
as bool?,checkoutId: freezed == checkoutId ? _self.checkoutId : checkoutId // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
