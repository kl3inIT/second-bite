// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'lead_times_struct.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$LeadTimesStruct {

 int get overThreeHours; int get underHalfHour; int get underHour; int get underThreeHours;
/// Create a copy of LeadTimesStruct
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$LeadTimesStructCopyWith<LeadTimesStruct> get copyWith => _$LeadTimesStructCopyWithImpl<LeadTimesStruct>(this as LeadTimesStruct, _$identity);

  /// Serializes this LeadTimesStruct to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as LeadTimesStruct;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is LeadTimesStruct&&(identical(other.overThreeHours, _this.overThreeHours) || other.overThreeHours == _this.overThreeHours)&&(identical(other.underHalfHour, _this.underHalfHour) || other.underHalfHour == _this.underHalfHour)&&(identical(other.underHour, _this.underHour) || other.underHour == _this.underHour)&&(identical(other.underThreeHours, _this.underThreeHours) || other.underThreeHours == _this.underThreeHours));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as LeadTimesStruct;
  return Object.hash(runtimeType,_this.overThreeHours,_this.underHalfHour,_this.underHour,_this.underThreeHours);
}

@override
String toString() {
  final _this = this as LeadTimesStruct;
  return 'LeadTimesStruct(overThreeHours: ${_this.overThreeHours}, underHalfHour: ${_this.underHalfHour}, underHour: ${_this.underHour}, underThreeHours: ${_this.underThreeHours})';
}


}

/// @nodoc
abstract mixin class $LeadTimesStructCopyWith<$Res>  {
  factory $LeadTimesStructCopyWith(LeadTimesStruct value, $Res Function(LeadTimesStruct) _then) = _$LeadTimesStructCopyWithImpl;
@useResult
$Res call({
 int overThreeHours, int underHalfHour, int underHour, int underThreeHours
});




}
/// @nodoc
class _$LeadTimesStructCopyWithImpl<$Res>
    implements $LeadTimesStructCopyWith<$Res> {
  _$LeadTimesStructCopyWithImpl(this._self, this._then);

  final LeadTimesStruct _self;
  final $Res Function(LeadTimesStruct) _then;

/// Create a copy of LeadTimesStruct
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? overThreeHours = null,Object? underHalfHour = null,Object? underHour = null,Object? underThreeHours = null,}) {
  return _then(LeadTimesStruct(
overThreeHours: null == overThreeHours ? _self.overThreeHours : overThreeHours // ignore: cast_nullable_to_non_nullable
as int,underHalfHour: null == underHalfHour ? _self.underHalfHour : underHalfHour // ignore: cast_nullable_to_non_nullable
as int,underHour: null == underHour ? _self.underHour : underHour // ignore: cast_nullable_to_non_nullable
as int,underThreeHours: null == underThreeHours ? _self.underThreeHours : underThreeHours // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [LeadTimesStruct].
extension LeadTimesStructPatterns on LeadTimesStruct {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _LeadTimesStruct value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _LeadTimesStruct() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _LeadTimesStruct value)  $default,){
final _that = this;
switch (_that) {
case _LeadTimesStruct():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _LeadTimesStruct value)?  $default,){
final _that = this;
switch (_that) {
case _LeadTimesStruct() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int overThreeHours,  int underHalfHour,  int underHour,  int underThreeHours)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _LeadTimesStruct() when $default != null:
return $default(_that.overThreeHours,_that.underHalfHour,_that.underHour,_that.underThreeHours);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int overThreeHours,  int underHalfHour,  int underHour,  int underThreeHours)  $default,) {final _that = this;
switch (_that) {
case _LeadTimesStruct():
return $default(_that.overThreeHours,_that.underHalfHour,_that.underHour,_that.underThreeHours);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int overThreeHours,  int underHalfHour,  int underHour,  int underThreeHours)?  $default,) {final _that = this;
switch (_that) {
case _LeadTimesStruct() when $default != null:
return $default(_that.overThreeHours,_that.underHalfHour,_that.underHour,_that.underThreeHours);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _LeadTimesStruct implements LeadTimesStruct {
  const _LeadTimesStruct({required this.overThreeHours, required this.underHalfHour, required this.underHour, required this.underThreeHours});
  factory _LeadTimesStruct.fromJson(Map<String, dynamic> json) => _$LeadTimesStructFromJson(json);

@override final  int overThreeHours;
@override final  int underHalfHour;
@override final  int underHour;
@override final  int underThreeHours;

/// Create a copy of LeadTimesStruct
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$LeadTimesStructCopyWith<_LeadTimesStruct> get copyWith => __$LeadTimesStructCopyWithImpl<_LeadTimesStruct>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$LeadTimesStructToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _LeadTimesStruct&&(identical(other.overThreeHours, overThreeHours) || other.overThreeHours == overThreeHours)&&(identical(other.underHalfHour, underHalfHour) || other.underHalfHour == underHalfHour)&&(identical(other.underHour, underHour) || other.underHour == underHour)&&(identical(other.underThreeHours, underThreeHours) || other.underThreeHours == underThreeHours));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,overThreeHours,underHalfHour,underHour,underThreeHours);
}

@override
String toString() {
    return 'LeadTimesStruct(overThreeHours: $overThreeHours, underHalfHour: $underHalfHour, underHour: $underHour, underThreeHours: $underThreeHours)';
}


}

/// @nodoc
abstract mixin class _$LeadTimesStructCopyWith<$Res> implements $LeadTimesStructCopyWith<$Res> {
  factory _$LeadTimesStructCopyWith(_LeadTimesStruct value, $Res Function(_LeadTimesStruct) _then) = __$LeadTimesStructCopyWithImpl;
@override @useResult
$Res call({
 int overThreeHours, int underHalfHour, int underHour, int underThreeHours
});




}
/// @nodoc
class __$LeadTimesStructCopyWithImpl<$Res>
    implements _$LeadTimesStructCopyWith<$Res> {
  __$LeadTimesStructCopyWithImpl(this._self, this._then);

  final _LeadTimesStruct _self;
  final $Res Function(_LeadTimesStruct) _then;

/// Create a copy of LeadTimesStruct
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? overThreeHours = null,Object? underHalfHour = null,Object? underHour = null,Object? underThreeHours = null,}) {
  return _then(_LeadTimesStruct(
overThreeHours: null == overThreeHours ? _self.overThreeHours : overThreeHours // ignore: cast_nullable_to_non_nullable
as int,underHalfHour: null == underHalfHour ? _self.underHalfHour : underHalfHour // ignore: cast_nullable_to_non_nullable
as int,underHour: null == underHour ? _self.underHour : underHour // ignore: cast_nullable_to_non_nullable
as int,underThreeHours: null == underThreeHours ? _self.underThreeHours : underThreeHours // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
