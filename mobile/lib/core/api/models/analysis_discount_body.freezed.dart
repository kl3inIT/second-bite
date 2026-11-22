// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'analysis_discount_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$AnalysisDiscountBody {

/// The discount against the original price
 AnalysisDiscountBodyBand get band;/// Units of them collected
 int get collected;/// Units posted
 int get posted;
/// Create a copy of AnalysisDiscountBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AnalysisDiscountBodyCopyWith<AnalysisDiscountBody> get copyWith => _$AnalysisDiscountBodyCopyWithImpl<AnalysisDiscountBody>(this as AnalysisDiscountBody, _$identity);

  /// Serializes this AnalysisDiscountBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as AnalysisDiscountBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AnalysisDiscountBody&&(identical(other.band, _this.band) || other.band == _this.band)&&(identical(other.collected, _this.collected) || other.collected == _this.collected)&&(identical(other.posted, _this.posted) || other.posted == _this.posted));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as AnalysisDiscountBody;
  return Object.hash(runtimeType,_this.band,_this.collected,_this.posted);
}

@override
String toString() {
  final _this = this as AnalysisDiscountBody;
  return 'AnalysisDiscountBody(band: ${_this.band}, collected: ${_this.collected}, posted: ${_this.posted})';
}


}

/// @nodoc
abstract mixin class $AnalysisDiscountBodyCopyWith<$Res>  {
  factory $AnalysisDiscountBodyCopyWith(AnalysisDiscountBody value, $Res Function(AnalysisDiscountBody) _then) = _$AnalysisDiscountBodyCopyWithImpl;
@useResult
$Res call({
 AnalysisDiscountBodyBand band, int collected, int posted
});




}
/// @nodoc
class _$AnalysisDiscountBodyCopyWithImpl<$Res>
    implements $AnalysisDiscountBodyCopyWith<$Res> {
  _$AnalysisDiscountBodyCopyWithImpl(this._self, this._then);

  final AnalysisDiscountBody _self;
  final $Res Function(AnalysisDiscountBody) _then;

/// Create a copy of AnalysisDiscountBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? band = null,Object? collected = null,Object? posted = null,}) {
  return _then(AnalysisDiscountBody(
band: null == band ? _self.band : band // ignore: cast_nullable_to_non_nullable
as AnalysisDiscountBodyBand,collected: null == collected ? _self.collected : collected // ignore: cast_nullable_to_non_nullable
as int,posted: null == posted ? _self.posted : posted // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [AnalysisDiscountBody].
extension AnalysisDiscountBodyPatterns on AnalysisDiscountBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AnalysisDiscountBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AnalysisDiscountBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AnalysisDiscountBody value)  $default,){
final _that = this;
switch (_that) {
case _AnalysisDiscountBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AnalysisDiscountBody value)?  $default,){
final _that = this;
switch (_that) {
case _AnalysisDiscountBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( AnalysisDiscountBodyBand band,  int collected,  int posted)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AnalysisDiscountBody() when $default != null:
return $default(_that.band,_that.collected,_that.posted);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( AnalysisDiscountBodyBand band,  int collected,  int posted)  $default,) {final _that = this;
switch (_that) {
case _AnalysisDiscountBody():
return $default(_that.band,_that.collected,_that.posted);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( AnalysisDiscountBodyBand band,  int collected,  int posted)?  $default,) {final _that = this;
switch (_that) {
case _AnalysisDiscountBody() when $default != null:
return $default(_that.band,_that.collected,_that.posted);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _AnalysisDiscountBody implements AnalysisDiscountBody {
  const _AnalysisDiscountBody({required this.band, required this.collected, required this.posted});
  factory _AnalysisDiscountBody.fromJson(Map<String, dynamic> json) => _$AnalysisDiscountBodyFromJson(json);

/// The discount against the original price
@override final  AnalysisDiscountBodyBand band;
/// Units of them collected
@override final  int collected;
/// Units posted
@override final  int posted;

/// Create a copy of AnalysisDiscountBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AnalysisDiscountBodyCopyWith<_AnalysisDiscountBody> get copyWith => __$AnalysisDiscountBodyCopyWithImpl<_AnalysisDiscountBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AnalysisDiscountBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _AnalysisDiscountBody&&(identical(other.band, band) || other.band == band)&&(identical(other.collected, collected) || other.collected == collected)&&(identical(other.posted, posted) || other.posted == posted));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,band,collected,posted);
}

@override
String toString() {
    return 'AnalysisDiscountBody(band: $band, collected: $collected, posted: $posted)';
}


}

/// @nodoc
abstract mixin class _$AnalysisDiscountBodyCopyWith<$Res> implements $AnalysisDiscountBodyCopyWith<$Res> {
  factory _$AnalysisDiscountBodyCopyWith(_AnalysisDiscountBody value, $Res Function(_AnalysisDiscountBody) _then) = __$AnalysisDiscountBodyCopyWithImpl;
@override @useResult
$Res call({
 AnalysisDiscountBodyBand band, int collected, int posted
});




}
/// @nodoc
class __$AnalysisDiscountBodyCopyWithImpl<$Res>
    implements _$AnalysisDiscountBodyCopyWith<$Res> {
  __$AnalysisDiscountBodyCopyWithImpl(this._self, this._then);

  final _AnalysisDiscountBody _self;
  final $Res Function(_AnalysisDiscountBody) _then;

/// Create a copy of AnalysisDiscountBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? band = null,Object? collected = null,Object? posted = null,}) {
  return _then(_AnalysisDiscountBody(
band: null == band ? _self.band : band // ignore: cast_nullable_to_non_nullable
as AnalysisDiscountBodyBand,collected: null == collected ? _self.collected : collected // ignore: cast_nullable_to_non_nullable
as int,posted: null == posted ? _self.posted : posted // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
