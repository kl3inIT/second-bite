// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'shift_block_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$ShiftBlockBody {

/// HH:MM
 String get from; String get name;/// By window, then number
 List<ShiftOrderBody> get orders; ShiftSummaryBody get summary;/// HH:MM, 24:00 ending at midnight
 String get until;
/// Create a copy of ShiftBlockBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ShiftBlockBodyCopyWith<ShiftBlockBody> get copyWith => _$ShiftBlockBodyCopyWithImpl<ShiftBlockBody>(this as ShiftBlockBody, _$identity);

  /// Serializes this ShiftBlockBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as ShiftBlockBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ShiftBlockBody&&(identical(other.from, _this.from) || other.from == _this.from)&&(identical(other.name, _this.name) || other.name == _this.name)&&const DeepCollectionEquality().equals(other.orders, _this.orders)&&(identical(other.summary, _this.summary) || other.summary == _this.summary)&&(identical(other.until, _this.until) || other.until == _this.until));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as ShiftBlockBody;
  return Object.hash(runtimeType,_this.from,_this.name,const DeepCollectionEquality().hash(_this.orders),_this.summary,_this.until);
}

@override
String toString() {
  final _this = this as ShiftBlockBody;
  return 'ShiftBlockBody(from: ${_this.from}, name: ${_this.name}, orders: ${_this.orders}, summary: ${_this.summary}, until: ${_this.until})';
}


}

/// @nodoc
abstract mixin class $ShiftBlockBodyCopyWith<$Res>  {
  factory $ShiftBlockBodyCopyWith(ShiftBlockBody value, $Res Function(ShiftBlockBody) _then) = _$ShiftBlockBodyCopyWithImpl;
@useResult
$Res call({
 String from, String name, List<ShiftOrderBody> orders, ShiftSummaryBody summary, String until
});


$ShiftSummaryBodyCopyWith<$Res> get summary;

}
/// @nodoc
class _$ShiftBlockBodyCopyWithImpl<$Res>
    implements $ShiftBlockBodyCopyWith<$Res> {
  _$ShiftBlockBodyCopyWithImpl(this._self, this._then);

  final ShiftBlockBody _self;
  final $Res Function(ShiftBlockBody) _then;

/// Create a copy of ShiftBlockBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? from = null,Object? name = null,Object? orders = null,Object? summary = null,Object? until = null,}) {
  return _then(ShiftBlockBody(
from: null == from ? _self.from : from // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,orders: null == orders ? _self.orders : orders // ignore: cast_nullable_to_non_nullable
as List<ShiftOrderBody>,summary: null == summary ? _self.summary : summary // ignore: cast_nullable_to_non_nullable
as ShiftSummaryBody,until: null == until ? _self.until : until // ignore: cast_nullable_to_non_nullable
as String,
  ));
}
/// Create a copy of ShiftBlockBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$ShiftSummaryBodyCopyWith<$Res> get summary {
  
  return $ShiftSummaryBodyCopyWith<$Res>(_self.summary, (value) {
    return _then(_self.copyWith(summary: value));
  });
}
}


/// Adds pattern-matching-related methods to [ShiftBlockBody].
extension ShiftBlockBodyPatterns on ShiftBlockBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ShiftBlockBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ShiftBlockBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ShiftBlockBody value)  $default,){
final _that = this;
switch (_that) {
case _ShiftBlockBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ShiftBlockBody value)?  $default,){
final _that = this;
switch (_that) {
case _ShiftBlockBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String from,  String name,  List<ShiftOrderBody> orders,  ShiftSummaryBody summary,  String until)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ShiftBlockBody() when $default != null:
return $default(_that.from,_that.name,_that.orders,_that.summary,_that.until);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String from,  String name,  List<ShiftOrderBody> orders,  ShiftSummaryBody summary,  String until)  $default,) {final _that = this;
switch (_that) {
case _ShiftBlockBody():
return $default(_that.from,_that.name,_that.orders,_that.summary,_that.until);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String from,  String name,  List<ShiftOrderBody> orders,  ShiftSummaryBody summary,  String until)?  $default,) {final _that = this;
switch (_that) {
case _ShiftBlockBody() when $default != null:
return $default(_that.from,_that.name,_that.orders,_that.summary,_that.until);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ShiftBlockBody implements ShiftBlockBody {
  const _ShiftBlockBody({required this.from, required this.name, required  List<ShiftOrderBody> orders, required this.summary, required this.until}): _orders = orders;
  factory _ShiftBlockBody.fromJson(Map<String, dynamic> json) => _$ShiftBlockBodyFromJson(json);

/// HH:MM
@override final  String from;
@override final  String name;
/// By window, then number
 final  List<ShiftOrderBody> _orders;
/// By window, then number
@override List<ShiftOrderBody> get orders {
  if (_orders is EqualUnmodifiableListView) return _orders;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_orders);
}

@override final  ShiftSummaryBody summary;
/// HH:MM, 24:00 ending at midnight
@override final  String until;

/// Create a copy of ShiftBlockBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ShiftBlockBodyCopyWith<_ShiftBlockBody> get copyWith => __$ShiftBlockBodyCopyWithImpl<_ShiftBlockBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ShiftBlockBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _ShiftBlockBody&&(identical(other.from, from) || other.from == from)&&(identical(other.name, name) || other.name == name)&&const DeepCollectionEquality().equals(other.orders, _orders)&&(identical(other.summary, summary) || other.summary == summary)&&(identical(other.until, until) || other.until == until));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,from,name,const DeepCollectionEquality().hash(_orders),summary,until);
}

@override
String toString() {
    return 'ShiftBlockBody(from: $from, name: $name, orders: $orders, summary: $summary, until: $until)';
}


}

/// @nodoc
abstract mixin class _$ShiftBlockBodyCopyWith<$Res> implements $ShiftBlockBodyCopyWith<$Res> {
  factory _$ShiftBlockBodyCopyWith(_ShiftBlockBody value, $Res Function(_ShiftBlockBody) _then) = __$ShiftBlockBodyCopyWithImpl;
@override @useResult
$Res call({
 String from, String name, List<ShiftOrderBody> orders, ShiftSummaryBody summary, String until
});


@override $ShiftSummaryBodyCopyWith<$Res> get summary;

}
/// @nodoc
class __$ShiftBlockBodyCopyWithImpl<$Res>
    implements _$ShiftBlockBodyCopyWith<$Res> {
  __$ShiftBlockBodyCopyWithImpl(this._self, this._then);

  final _ShiftBlockBody _self;
  final $Res Function(_ShiftBlockBody) _then;

/// Create a copy of ShiftBlockBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? from = null,Object? name = null,Object? orders = null,Object? summary = null,Object? until = null,}) {
  return _then(_ShiftBlockBody(
from: null == from ? _self.from : from // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,orders: null == orders ? _self._orders : orders // ignore: cast_nullable_to_non_nullable
as List<ShiftOrderBody>,summary: null == summary ? _self.summary : summary // ignore: cast_nullable_to_non_nullable
as ShiftSummaryBody,until: null == until ? _self.until : until // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

/// Create a copy of ShiftBlockBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$ShiftSummaryBodyCopyWith<$Res> get summary {
  
  return $ShiftSummaryBodyCopyWith<$Res>(_self.summary, (value) {
    return _then(_self.copyWith(summary: value));
  });
}
}

// dart format on
