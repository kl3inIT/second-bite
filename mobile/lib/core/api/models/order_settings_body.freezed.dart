// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'order_settings_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$OrderSettingsBody {

/// The days missed orders are counted over; the block lifts as they pass
 int get missedDays;/// Orders missed within missedDays that stop a phone number ordering
 int get missedLimit;/// Orders still to collect that may have been placed from one address; loose, as a mall's Wi-Fi is shared
 int get openPerAddress;/// Orders still to collect one phone number may hold at a store
 int get openPerPhonePerSeller; DateTime? get updatedAt; String? get updatedBy;
/// Create a copy of OrderSettingsBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$OrderSettingsBodyCopyWith<OrderSettingsBody> get copyWith => _$OrderSettingsBodyCopyWithImpl<OrderSettingsBody>(this as OrderSettingsBody, _$identity);

  /// Serializes this OrderSettingsBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as OrderSettingsBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is OrderSettingsBody&&(identical(other.missedDays, _this.missedDays) || other.missedDays == _this.missedDays)&&(identical(other.missedLimit, _this.missedLimit) || other.missedLimit == _this.missedLimit)&&(identical(other.openPerAddress, _this.openPerAddress) || other.openPerAddress == _this.openPerAddress)&&(identical(other.openPerPhonePerSeller, _this.openPerPhonePerSeller) || other.openPerPhonePerSeller == _this.openPerPhonePerSeller)&&(identical(other.updatedAt, _this.updatedAt) || other.updatedAt == _this.updatedAt)&&(identical(other.updatedBy, _this.updatedBy) || other.updatedBy == _this.updatedBy));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as OrderSettingsBody;
  return Object.hash(runtimeType,_this.missedDays,_this.missedLimit,_this.openPerAddress,_this.openPerPhonePerSeller,_this.updatedAt,_this.updatedBy);
}

@override
String toString() {
  final _this = this as OrderSettingsBody;
  return 'OrderSettingsBody(missedDays: ${_this.missedDays}, missedLimit: ${_this.missedLimit}, openPerAddress: ${_this.openPerAddress}, openPerPhonePerSeller: ${_this.openPerPhonePerSeller}, updatedAt: ${_this.updatedAt}, updatedBy: ${_this.updatedBy})';
}


}

/// @nodoc
abstract mixin class $OrderSettingsBodyCopyWith<$Res>  {
  factory $OrderSettingsBodyCopyWith(OrderSettingsBody value, $Res Function(OrderSettingsBody) _then) = _$OrderSettingsBodyCopyWithImpl;
@useResult
$Res call({
 int missedDays, int missedLimit, int openPerAddress, int openPerPhonePerSeller, DateTime? updatedAt, String? updatedBy
});




}
/// @nodoc
class _$OrderSettingsBodyCopyWithImpl<$Res>
    implements $OrderSettingsBodyCopyWith<$Res> {
  _$OrderSettingsBodyCopyWithImpl(this._self, this._then);

  final OrderSettingsBody _self;
  final $Res Function(OrderSettingsBody) _then;

/// Create a copy of OrderSettingsBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? missedDays = null,Object? missedLimit = null,Object? openPerAddress = null,Object? openPerPhonePerSeller = null,Object? updatedAt = freezed,Object? updatedBy = freezed,}) {
  return _then(OrderSettingsBody(
missedDays: null == missedDays ? _self.missedDays : missedDays // ignore: cast_nullable_to_non_nullable
as int,missedLimit: null == missedLimit ? _self.missedLimit : missedLimit // ignore: cast_nullable_to_non_nullable
as int,openPerAddress: null == openPerAddress ? _self.openPerAddress : openPerAddress // ignore: cast_nullable_to_non_nullable
as int,openPerPhonePerSeller: null == openPerPhonePerSeller ? _self.openPerPhonePerSeller : openPerPhonePerSeller // ignore: cast_nullable_to_non_nullable
as int,updatedAt: freezed == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,updatedBy: freezed == updatedBy ? _self.updatedBy : updatedBy // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [OrderSettingsBody].
extension OrderSettingsBodyPatterns on OrderSettingsBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _OrderSettingsBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _OrderSettingsBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _OrderSettingsBody value)  $default,){
final _that = this;
switch (_that) {
case _OrderSettingsBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _OrderSettingsBody value)?  $default,){
final _that = this;
switch (_that) {
case _OrderSettingsBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int missedDays,  int missedLimit,  int openPerAddress,  int openPerPhonePerSeller,  DateTime? updatedAt,  String? updatedBy)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _OrderSettingsBody() when $default != null:
return $default(_that.missedDays,_that.missedLimit,_that.openPerAddress,_that.openPerPhonePerSeller,_that.updatedAt,_that.updatedBy);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int missedDays,  int missedLimit,  int openPerAddress,  int openPerPhonePerSeller,  DateTime? updatedAt,  String? updatedBy)  $default,) {final _that = this;
switch (_that) {
case _OrderSettingsBody():
return $default(_that.missedDays,_that.missedLimit,_that.openPerAddress,_that.openPerPhonePerSeller,_that.updatedAt,_that.updatedBy);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int missedDays,  int missedLimit,  int openPerAddress,  int openPerPhonePerSeller,  DateTime? updatedAt,  String? updatedBy)?  $default,) {final _that = this;
switch (_that) {
case _OrderSettingsBody() when $default != null:
return $default(_that.missedDays,_that.missedLimit,_that.openPerAddress,_that.openPerPhonePerSeller,_that.updatedAt,_that.updatedBy);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _OrderSettingsBody implements OrderSettingsBody {
  const _OrderSettingsBody({required this.missedDays, required this.missedLimit, required this.openPerAddress, required this.openPerPhonePerSeller, this.updatedAt, this.updatedBy});
  factory _OrderSettingsBody.fromJson(Map<String, dynamic> json) => _$OrderSettingsBodyFromJson(json);

/// The days missed orders are counted over; the block lifts as they pass
@override final  int missedDays;
/// Orders missed within missedDays that stop a phone number ordering
@override final  int missedLimit;
/// Orders still to collect that may have been placed from one address; loose, as a mall's Wi-Fi is shared
@override final  int openPerAddress;
/// Orders still to collect one phone number may hold at a store
@override final  int openPerPhonePerSeller;
@override final  DateTime? updatedAt;
@override final  String? updatedBy;

/// Create a copy of OrderSettingsBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$OrderSettingsBodyCopyWith<_OrderSettingsBody> get copyWith => __$OrderSettingsBodyCopyWithImpl<_OrderSettingsBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$OrderSettingsBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _OrderSettingsBody&&(identical(other.missedDays, missedDays) || other.missedDays == missedDays)&&(identical(other.missedLimit, missedLimit) || other.missedLimit == missedLimit)&&(identical(other.openPerAddress, openPerAddress) || other.openPerAddress == openPerAddress)&&(identical(other.openPerPhonePerSeller, openPerPhonePerSeller) || other.openPerPhonePerSeller == openPerPhonePerSeller)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt)&&(identical(other.updatedBy, updatedBy) || other.updatedBy == updatedBy));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,missedDays,missedLimit,openPerAddress,openPerPhonePerSeller,updatedAt,updatedBy);
}

@override
String toString() {
    return 'OrderSettingsBody(missedDays: $missedDays, missedLimit: $missedLimit, openPerAddress: $openPerAddress, openPerPhonePerSeller: $openPerPhonePerSeller, updatedAt: $updatedAt, updatedBy: $updatedBy)';
}


}

/// @nodoc
abstract mixin class _$OrderSettingsBodyCopyWith<$Res> implements $OrderSettingsBodyCopyWith<$Res> {
  factory _$OrderSettingsBodyCopyWith(_OrderSettingsBody value, $Res Function(_OrderSettingsBody) _then) = __$OrderSettingsBodyCopyWithImpl;
@override @useResult
$Res call({
 int missedDays, int missedLimit, int openPerAddress, int openPerPhonePerSeller, DateTime? updatedAt, String? updatedBy
});




}
/// @nodoc
class __$OrderSettingsBodyCopyWithImpl<$Res>
    implements _$OrderSettingsBodyCopyWith<$Res> {
  __$OrderSettingsBodyCopyWithImpl(this._self, this._then);

  final _OrderSettingsBody _self;
  final $Res Function(_OrderSettingsBody) _then;

/// Create a copy of OrderSettingsBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? missedDays = null,Object? missedLimit = null,Object? openPerAddress = null,Object? openPerPhonePerSeller = null,Object? updatedAt = freezed,Object? updatedBy = freezed,}) {
  return _then(_OrderSettingsBody(
missedDays: null == missedDays ? _self.missedDays : missedDays // ignore: cast_nullable_to_non_nullable
as int,missedLimit: null == missedLimit ? _self.missedLimit : missedLimit // ignore: cast_nullable_to_non_nullable
as int,openPerAddress: null == openPerAddress ? _self.openPerAddress : openPerAddress // ignore: cast_nullable_to_non_nullable
as int,openPerPhonePerSeller: null == openPerPhonePerSeller ? _self.openPerPhonePerSeller : openPerPhonePerSeller // ignore: cast_nullable_to_non_nullable
as int,updatedAt: freezed == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,updatedBy: freezed == updatedBy ? _self.updatedBy : updatedBy // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
