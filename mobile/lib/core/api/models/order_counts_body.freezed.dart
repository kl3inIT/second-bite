// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'order_counts_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$OrderCountsBody {

 int get cancelled; int get collected; int get confirmed; int get expired; int get ready; int get refused;
/// Create a copy of OrderCountsBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$OrderCountsBodyCopyWith<OrderCountsBody> get copyWith => _$OrderCountsBodyCopyWithImpl<OrderCountsBody>(this as OrderCountsBody, _$identity);

  /// Serializes this OrderCountsBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as OrderCountsBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is OrderCountsBody&&(identical(other.cancelled, _this.cancelled) || other.cancelled == _this.cancelled)&&(identical(other.collected, _this.collected) || other.collected == _this.collected)&&(identical(other.confirmed, _this.confirmed) || other.confirmed == _this.confirmed)&&(identical(other.expired, _this.expired) || other.expired == _this.expired)&&(identical(other.ready, _this.ready) || other.ready == _this.ready)&&(identical(other.refused, _this.refused) || other.refused == _this.refused));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as OrderCountsBody;
  return Object.hash(runtimeType,_this.cancelled,_this.collected,_this.confirmed,_this.expired,_this.ready,_this.refused);
}

@override
String toString() {
  final _this = this as OrderCountsBody;
  return 'OrderCountsBody(cancelled: ${_this.cancelled}, collected: ${_this.collected}, confirmed: ${_this.confirmed}, expired: ${_this.expired}, ready: ${_this.ready}, refused: ${_this.refused})';
}


}

/// @nodoc
abstract mixin class $OrderCountsBodyCopyWith<$Res>  {
  factory $OrderCountsBodyCopyWith(OrderCountsBody value, $Res Function(OrderCountsBody) _then) = _$OrderCountsBodyCopyWithImpl;
@useResult
$Res call({
 int cancelled, int collected, int confirmed, int expired, int ready, int refused
});




}
/// @nodoc
class _$OrderCountsBodyCopyWithImpl<$Res>
    implements $OrderCountsBodyCopyWith<$Res> {
  _$OrderCountsBodyCopyWithImpl(this._self, this._then);

  final OrderCountsBody _self;
  final $Res Function(OrderCountsBody) _then;

/// Create a copy of OrderCountsBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? cancelled = null,Object? collected = null,Object? confirmed = null,Object? expired = null,Object? ready = null,Object? refused = null,}) {
  return _then(OrderCountsBody(
cancelled: null == cancelled ? _self.cancelled : cancelled // ignore: cast_nullable_to_non_nullable
as int,collected: null == collected ? _self.collected : collected // ignore: cast_nullable_to_non_nullable
as int,confirmed: null == confirmed ? _self.confirmed : confirmed // ignore: cast_nullable_to_non_nullable
as int,expired: null == expired ? _self.expired : expired // ignore: cast_nullable_to_non_nullable
as int,ready: null == ready ? _self.ready : ready // ignore: cast_nullable_to_non_nullable
as int,refused: null == refused ? _self.refused : refused // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [OrderCountsBody].
extension OrderCountsBodyPatterns on OrderCountsBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _OrderCountsBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _OrderCountsBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _OrderCountsBody value)  $default,){
final _that = this;
switch (_that) {
case _OrderCountsBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _OrderCountsBody value)?  $default,){
final _that = this;
switch (_that) {
case _OrderCountsBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int cancelled,  int collected,  int confirmed,  int expired,  int ready,  int refused)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _OrderCountsBody() when $default != null:
return $default(_that.cancelled,_that.collected,_that.confirmed,_that.expired,_that.ready,_that.refused);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int cancelled,  int collected,  int confirmed,  int expired,  int ready,  int refused)  $default,) {final _that = this;
switch (_that) {
case _OrderCountsBody():
return $default(_that.cancelled,_that.collected,_that.confirmed,_that.expired,_that.ready,_that.refused);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int cancelled,  int collected,  int confirmed,  int expired,  int ready,  int refused)?  $default,) {final _that = this;
switch (_that) {
case _OrderCountsBody() when $default != null:
return $default(_that.cancelled,_that.collected,_that.confirmed,_that.expired,_that.ready,_that.refused);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _OrderCountsBody implements OrderCountsBody {
  const _OrderCountsBody({required this.cancelled, required this.collected, required this.confirmed, required this.expired, required this.ready, required this.refused});
  factory _OrderCountsBody.fromJson(Map<String, dynamic> json) => _$OrderCountsBodyFromJson(json);

@override final  int cancelled;
@override final  int collected;
@override final  int confirmed;
@override final  int expired;
@override final  int ready;
@override final  int refused;

/// Create a copy of OrderCountsBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$OrderCountsBodyCopyWith<_OrderCountsBody> get copyWith => __$OrderCountsBodyCopyWithImpl<_OrderCountsBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$OrderCountsBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _OrderCountsBody&&(identical(other.cancelled, cancelled) || other.cancelled == cancelled)&&(identical(other.collected, collected) || other.collected == collected)&&(identical(other.confirmed, confirmed) || other.confirmed == confirmed)&&(identical(other.expired, expired) || other.expired == expired)&&(identical(other.ready, ready) || other.ready == ready)&&(identical(other.refused, refused) || other.refused == refused));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,cancelled,collected,confirmed,expired,ready,refused);
}

@override
String toString() {
    return 'OrderCountsBody(cancelled: $cancelled, collected: $collected, confirmed: $confirmed, expired: $expired, ready: $ready, refused: $refused)';
}


}

/// @nodoc
abstract mixin class _$OrderCountsBodyCopyWith<$Res> implements $OrderCountsBodyCopyWith<$Res> {
  factory _$OrderCountsBodyCopyWith(_OrderCountsBody value, $Res Function(_OrderCountsBody) _then) = __$OrderCountsBodyCopyWithImpl;
@override @useResult
$Res call({
 int cancelled, int collected, int confirmed, int expired, int ready, int refused
});




}
/// @nodoc
class __$OrderCountsBodyCopyWithImpl<$Res>
    implements _$OrderCountsBodyCopyWith<$Res> {
  __$OrderCountsBodyCopyWithImpl(this._self, this._then);

  final _OrderCountsBody _self;
  final $Res Function(_OrderCountsBody) _then;

/// Create a copy of OrderCountsBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? cancelled = null,Object? collected = null,Object? confirmed = null,Object? expired = null,Object? ready = null,Object? refused = null,}) {
  return _then(_OrderCountsBody(
cancelled: null == cancelled ? _self.cancelled : cancelled // ignore: cast_nullable_to_non_nullable
as int,collected: null == collected ? _self.collected : collected // ignore: cast_nullable_to_non_nullable
as int,confirmed: null == confirmed ? _self.confirmed : confirmed // ignore: cast_nullable_to_non_nullable
as int,expired: null == expired ? _self.expired : expired // ignore: cast_nullable_to_non_nullable
as int,ready: null == ready ? _self.ready : ready // ignore: cast_nullable_to_non_nullable
as int,refused: null == refused ? _self.refused : refused // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
