// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'analysis_dish_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$AnalysisDishBody {

/// Units of them collected
 int get collected; String get name; String get offerId;/// Units posted
 int get posted; String get sellerName; String get unit;
/// Create a copy of AnalysisDishBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AnalysisDishBodyCopyWith<AnalysisDishBody> get copyWith => _$AnalysisDishBodyCopyWithImpl<AnalysisDishBody>(this as AnalysisDishBody, _$identity);

  /// Serializes this AnalysisDishBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as AnalysisDishBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AnalysisDishBody&&(identical(other.collected, _this.collected) || other.collected == _this.collected)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.offerId, _this.offerId) || other.offerId == _this.offerId)&&(identical(other.posted, _this.posted) || other.posted == _this.posted)&&(identical(other.sellerName, _this.sellerName) || other.sellerName == _this.sellerName)&&(identical(other.unit, _this.unit) || other.unit == _this.unit));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as AnalysisDishBody;
  return Object.hash(runtimeType,_this.collected,_this.name,_this.offerId,_this.posted,_this.sellerName,_this.unit);
}

@override
String toString() {
  final _this = this as AnalysisDishBody;
  return 'AnalysisDishBody(collected: ${_this.collected}, name: ${_this.name}, offerId: ${_this.offerId}, posted: ${_this.posted}, sellerName: ${_this.sellerName}, unit: ${_this.unit})';
}


}

/// @nodoc
abstract mixin class $AnalysisDishBodyCopyWith<$Res>  {
  factory $AnalysisDishBodyCopyWith(AnalysisDishBody value, $Res Function(AnalysisDishBody) _then) = _$AnalysisDishBodyCopyWithImpl;
@useResult
$Res call({
 int collected, String name, String offerId, int posted, String sellerName, String unit
});




}
/// @nodoc
class _$AnalysisDishBodyCopyWithImpl<$Res>
    implements $AnalysisDishBodyCopyWith<$Res> {
  _$AnalysisDishBodyCopyWithImpl(this._self, this._then);

  final AnalysisDishBody _self;
  final $Res Function(AnalysisDishBody) _then;

/// Create a copy of AnalysisDishBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? collected = null,Object? name = null,Object? offerId = null,Object? posted = null,Object? sellerName = null,Object? unit = null,}) {
  return _then(AnalysisDishBody(
collected: null == collected ? _self.collected : collected // ignore: cast_nullable_to_non_nullable
as int,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,offerId: null == offerId ? _self.offerId : offerId // ignore: cast_nullable_to_non_nullable
as String,posted: null == posted ? _self.posted : posted // ignore: cast_nullable_to_non_nullable
as int,sellerName: null == sellerName ? _self.sellerName : sellerName // ignore: cast_nullable_to_non_nullable
as String,unit: null == unit ? _self.unit : unit // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [AnalysisDishBody].
extension AnalysisDishBodyPatterns on AnalysisDishBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AnalysisDishBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AnalysisDishBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AnalysisDishBody value)  $default,){
final _that = this;
switch (_that) {
case _AnalysisDishBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AnalysisDishBody value)?  $default,){
final _that = this;
switch (_that) {
case _AnalysisDishBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int collected,  String name,  String offerId,  int posted,  String sellerName,  String unit)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AnalysisDishBody() when $default != null:
return $default(_that.collected,_that.name,_that.offerId,_that.posted,_that.sellerName,_that.unit);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int collected,  String name,  String offerId,  int posted,  String sellerName,  String unit)  $default,) {final _that = this;
switch (_that) {
case _AnalysisDishBody():
return $default(_that.collected,_that.name,_that.offerId,_that.posted,_that.sellerName,_that.unit);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int collected,  String name,  String offerId,  int posted,  String sellerName,  String unit)?  $default,) {final _that = this;
switch (_that) {
case _AnalysisDishBody() when $default != null:
return $default(_that.collected,_that.name,_that.offerId,_that.posted,_that.sellerName,_that.unit);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _AnalysisDishBody implements AnalysisDishBody {
  const _AnalysisDishBody({required this.collected, required this.name, required this.offerId, required this.posted, required this.sellerName, required this.unit});
  factory _AnalysisDishBody.fromJson(Map<String, dynamic> json) => _$AnalysisDishBodyFromJson(json);

/// Units of them collected
@override final  int collected;
@override final  String name;
@override final  String offerId;
/// Units posted
@override final  int posted;
@override final  String sellerName;
@override final  String unit;

/// Create a copy of AnalysisDishBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AnalysisDishBodyCopyWith<_AnalysisDishBody> get copyWith => __$AnalysisDishBodyCopyWithImpl<_AnalysisDishBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AnalysisDishBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _AnalysisDishBody&&(identical(other.collected, collected) || other.collected == collected)&&(identical(other.name, name) || other.name == name)&&(identical(other.offerId, offerId) || other.offerId == offerId)&&(identical(other.posted, posted) || other.posted == posted)&&(identical(other.sellerName, sellerName) || other.sellerName == sellerName)&&(identical(other.unit, unit) || other.unit == unit));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,collected,name,offerId,posted,sellerName,unit);
}

@override
String toString() {
    return 'AnalysisDishBody(collected: $collected, name: $name, offerId: $offerId, posted: $posted, sellerName: $sellerName, unit: $unit)';
}


}

/// @nodoc
abstract mixin class _$AnalysisDishBodyCopyWith<$Res> implements $AnalysisDishBodyCopyWith<$Res> {
  factory _$AnalysisDishBodyCopyWith(_AnalysisDishBody value, $Res Function(_AnalysisDishBody) _then) = __$AnalysisDishBodyCopyWithImpl;
@override @useResult
$Res call({
 int collected, String name, String offerId, int posted, String sellerName, String unit
});




}
/// @nodoc
class __$AnalysisDishBodyCopyWithImpl<$Res>
    implements _$AnalysisDishBodyCopyWith<$Res> {
  __$AnalysisDishBodyCopyWithImpl(this._self, this._then);

  final _AnalysisDishBody _self;
  final $Res Function(_AnalysisDishBody) _then;

/// Create a copy of AnalysisDishBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? collected = null,Object? name = null,Object? offerId = null,Object? posted = null,Object? sellerName = null,Object? unit = null,}) {
  return _then(_AnalysisDishBody(
collected: null == collected ? _self.collected : collected // ignore: cast_nullable_to_non_nullable
as int,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,offerId: null == offerId ? _self.offerId : offerId // ignore: cast_nullable_to_non_nullable
as String,posted: null == posted ? _self.posted : posted // ignore: cast_nullable_to_non_nullable
as int,sellerName: null == sellerName ? _self.sellerName : sellerName // ignore: cast_nullable_to_non_nullable
as String,unit: null == unit ? _self.unit : unit // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
