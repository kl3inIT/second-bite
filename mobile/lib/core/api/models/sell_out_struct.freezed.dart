// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'sell_out_struct.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$SellOutStruct {

/// The middle time to sell out; 0 when none did
 int get medianMinutes;/// Posts that ended with units left
 int get notSoldOut; int get overTwoHours; int get underHalfHour; int get underHour; int get underTwoHours;
/// Create a copy of SellOutStruct
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$SellOutStructCopyWith<SellOutStruct> get copyWith => _$SellOutStructCopyWithImpl<SellOutStruct>(this as SellOutStruct, _$identity);

  /// Serializes this SellOutStruct to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as SellOutStruct;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is SellOutStruct&&(identical(other.medianMinutes, _this.medianMinutes) || other.medianMinutes == _this.medianMinutes)&&(identical(other.notSoldOut, _this.notSoldOut) || other.notSoldOut == _this.notSoldOut)&&(identical(other.overTwoHours, _this.overTwoHours) || other.overTwoHours == _this.overTwoHours)&&(identical(other.underHalfHour, _this.underHalfHour) || other.underHalfHour == _this.underHalfHour)&&(identical(other.underHour, _this.underHour) || other.underHour == _this.underHour)&&(identical(other.underTwoHours, _this.underTwoHours) || other.underTwoHours == _this.underTwoHours));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as SellOutStruct;
  return Object.hash(runtimeType,_this.medianMinutes,_this.notSoldOut,_this.overTwoHours,_this.underHalfHour,_this.underHour,_this.underTwoHours);
}

@override
String toString() {
  final _this = this as SellOutStruct;
  return 'SellOutStruct(medianMinutes: ${_this.medianMinutes}, notSoldOut: ${_this.notSoldOut}, overTwoHours: ${_this.overTwoHours}, underHalfHour: ${_this.underHalfHour}, underHour: ${_this.underHour}, underTwoHours: ${_this.underTwoHours})';
}


}

/// @nodoc
abstract mixin class $SellOutStructCopyWith<$Res>  {
  factory $SellOutStructCopyWith(SellOutStruct value, $Res Function(SellOutStruct) _then) = _$SellOutStructCopyWithImpl;
@useResult
$Res call({
 int medianMinutes, int notSoldOut, int overTwoHours, int underHalfHour, int underHour, int underTwoHours
});




}
/// @nodoc
class _$SellOutStructCopyWithImpl<$Res>
    implements $SellOutStructCopyWith<$Res> {
  _$SellOutStructCopyWithImpl(this._self, this._then);

  final SellOutStruct _self;
  final $Res Function(SellOutStruct) _then;

/// Create a copy of SellOutStruct
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? medianMinutes = null,Object? notSoldOut = null,Object? overTwoHours = null,Object? underHalfHour = null,Object? underHour = null,Object? underTwoHours = null,}) {
  return _then(SellOutStruct(
medianMinutes: null == medianMinutes ? _self.medianMinutes : medianMinutes // ignore: cast_nullable_to_non_nullable
as int,notSoldOut: null == notSoldOut ? _self.notSoldOut : notSoldOut // ignore: cast_nullable_to_non_nullable
as int,overTwoHours: null == overTwoHours ? _self.overTwoHours : overTwoHours // ignore: cast_nullable_to_non_nullable
as int,underHalfHour: null == underHalfHour ? _self.underHalfHour : underHalfHour // ignore: cast_nullable_to_non_nullable
as int,underHour: null == underHour ? _self.underHour : underHour // ignore: cast_nullable_to_non_nullable
as int,underTwoHours: null == underTwoHours ? _self.underTwoHours : underTwoHours // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [SellOutStruct].
extension SellOutStructPatterns on SellOutStruct {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _SellOutStruct value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _SellOutStruct() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _SellOutStruct value)  $default,){
final _that = this;
switch (_that) {
case _SellOutStruct():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _SellOutStruct value)?  $default,){
final _that = this;
switch (_that) {
case _SellOutStruct() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int medianMinutes,  int notSoldOut,  int overTwoHours,  int underHalfHour,  int underHour,  int underTwoHours)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _SellOutStruct() when $default != null:
return $default(_that.medianMinutes,_that.notSoldOut,_that.overTwoHours,_that.underHalfHour,_that.underHour,_that.underTwoHours);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int medianMinutes,  int notSoldOut,  int overTwoHours,  int underHalfHour,  int underHour,  int underTwoHours)  $default,) {final _that = this;
switch (_that) {
case _SellOutStruct():
return $default(_that.medianMinutes,_that.notSoldOut,_that.overTwoHours,_that.underHalfHour,_that.underHour,_that.underTwoHours);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int medianMinutes,  int notSoldOut,  int overTwoHours,  int underHalfHour,  int underHour,  int underTwoHours)?  $default,) {final _that = this;
switch (_that) {
case _SellOutStruct() when $default != null:
return $default(_that.medianMinutes,_that.notSoldOut,_that.overTwoHours,_that.underHalfHour,_that.underHour,_that.underTwoHours);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _SellOutStruct implements SellOutStruct {
  const _SellOutStruct({required this.medianMinutes, required this.notSoldOut, required this.overTwoHours, required this.underHalfHour, required this.underHour, required this.underTwoHours});
  factory _SellOutStruct.fromJson(Map<String, dynamic> json) => _$SellOutStructFromJson(json);

/// The middle time to sell out; 0 when none did
@override final  int medianMinutes;
/// Posts that ended with units left
@override final  int notSoldOut;
@override final  int overTwoHours;
@override final  int underHalfHour;
@override final  int underHour;
@override final  int underTwoHours;

/// Create a copy of SellOutStruct
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$SellOutStructCopyWith<_SellOutStruct> get copyWith => __$SellOutStructCopyWithImpl<_SellOutStruct>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$SellOutStructToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _SellOutStruct&&(identical(other.medianMinutes, medianMinutes) || other.medianMinutes == medianMinutes)&&(identical(other.notSoldOut, notSoldOut) || other.notSoldOut == notSoldOut)&&(identical(other.overTwoHours, overTwoHours) || other.overTwoHours == overTwoHours)&&(identical(other.underHalfHour, underHalfHour) || other.underHalfHour == underHalfHour)&&(identical(other.underHour, underHour) || other.underHour == underHour)&&(identical(other.underTwoHours, underTwoHours) || other.underTwoHours == underTwoHours));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,medianMinutes,notSoldOut,overTwoHours,underHalfHour,underHour,underTwoHours);
}

@override
String toString() {
    return 'SellOutStruct(medianMinutes: $medianMinutes, notSoldOut: $notSoldOut, overTwoHours: $overTwoHours, underHalfHour: $underHalfHour, underHour: $underHour, underTwoHours: $underTwoHours)';
}


}

/// @nodoc
abstract mixin class _$SellOutStructCopyWith<$Res> implements $SellOutStructCopyWith<$Res> {
  factory _$SellOutStructCopyWith(_SellOutStruct value, $Res Function(_SellOutStruct) _then) = __$SellOutStructCopyWithImpl;
@override @useResult
$Res call({
 int medianMinutes, int notSoldOut, int overTwoHours, int underHalfHour, int underHour, int underTwoHours
});




}
/// @nodoc
class __$SellOutStructCopyWithImpl<$Res>
    implements _$SellOutStructCopyWith<$Res> {
  __$SellOutStructCopyWithImpl(this._self, this._then);

  final _SellOutStruct _self;
  final $Res Function(_SellOutStruct) _then;

/// Create a copy of SellOutStruct
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? medianMinutes = null,Object? notSoldOut = null,Object? overTwoHours = null,Object? underHalfHour = null,Object? underHour = null,Object? underTwoHours = null,}) {
  return _then(_SellOutStruct(
medianMinutes: null == medianMinutes ? _self.medianMinutes : medianMinutes // ignore: cast_nullable_to_non_nullable
as int,notSoldOut: null == notSoldOut ? _self.notSoldOut : notSoldOut // ignore: cast_nullable_to_non_nullable
as int,overTwoHours: null == overTwoHours ? _self.overTwoHours : overTwoHours // ignore: cast_nullable_to_non_nullable
as int,underHalfHour: null == underHalfHour ? _self.underHalfHour : underHalfHour // ignore: cast_nullable_to_non_nullable
as int,underHour: null == underHour ? _self.underHour : underHour // ignore: cast_nullable_to_non_nullable
as int,underTwoHours: null == underTwoHours ? _self.underTwoHours : underTwoHours // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
