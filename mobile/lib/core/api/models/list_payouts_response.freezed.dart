// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'list_payouts_response.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$ListPayoutsResponse {

 List<PayoutBody> get payouts;
/// Create a copy of ListPayoutsResponse
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ListPayoutsResponseCopyWith<ListPayoutsResponse> get copyWith => _$ListPayoutsResponseCopyWithImpl<ListPayoutsResponse>(this as ListPayoutsResponse, _$identity);

  /// Serializes this ListPayoutsResponse to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as ListPayoutsResponse;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ListPayoutsResponse&&const DeepCollectionEquality().equals(other.payouts, _this.payouts));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as ListPayoutsResponse;
  return Object.hash(runtimeType,const DeepCollectionEquality().hash(_this.payouts));
}

@override
String toString() {
  final _this = this as ListPayoutsResponse;
  return 'ListPayoutsResponse(payouts: ${_this.payouts})';
}


}

/// @nodoc
abstract mixin class $ListPayoutsResponseCopyWith<$Res>  {
  factory $ListPayoutsResponseCopyWith(ListPayoutsResponse value, $Res Function(ListPayoutsResponse) _then) = _$ListPayoutsResponseCopyWithImpl;
@useResult
$Res call({
 List<PayoutBody> payouts
});




}
/// @nodoc
class _$ListPayoutsResponseCopyWithImpl<$Res>
    implements $ListPayoutsResponseCopyWith<$Res> {
  _$ListPayoutsResponseCopyWithImpl(this._self, this._then);

  final ListPayoutsResponse _self;
  final $Res Function(ListPayoutsResponse) _then;

/// Create a copy of ListPayoutsResponse
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? payouts = null,}) {
  return _then(ListPayoutsResponse(
payouts: null == payouts ? _self.payouts : payouts // ignore: cast_nullable_to_non_nullable
as List<PayoutBody>,
  ));
}

}


/// Adds pattern-matching-related methods to [ListPayoutsResponse].
extension ListPayoutsResponsePatterns on ListPayoutsResponse {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ListPayoutsResponse value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ListPayoutsResponse() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ListPayoutsResponse value)  $default,){
final _that = this;
switch (_that) {
case _ListPayoutsResponse():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ListPayoutsResponse value)?  $default,){
final _that = this;
switch (_that) {
case _ListPayoutsResponse() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( List<PayoutBody> payouts)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ListPayoutsResponse() when $default != null:
return $default(_that.payouts);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( List<PayoutBody> payouts)  $default,) {final _that = this;
switch (_that) {
case _ListPayoutsResponse():
return $default(_that.payouts);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( List<PayoutBody> payouts)?  $default,) {final _that = this;
switch (_that) {
case _ListPayoutsResponse() when $default != null:
return $default(_that.payouts);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ListPayoutsResponse implements ListPayoutsResponse {
  const _ListPayoutsResponse({required  List<PayoutBody> payouts}): _payouts = payouts;
  factory _ListPayoutsResponse.fromJson(Map<String, dynamic> json) => _$ListPayoutsResponseFromJson(json);

 final  List<PayoutBody> _payouts;
@override List<PayoutBody> get payouts {
  if (_payouts is EqualUnmodifiableListView) return _payouts;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_payouts);
}


/// Create a copy of ListPayoutsResponse
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ListPayoutsResponseCopyWith<_ListPayoutsResponse> get copyWith => __$ListPayoutsResponseCopyWithImpl<_ListPayoutsResponse>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ListPayoutsResponseToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _ListPayoutsResponse&&const DeepCollectionEquality().equals(other.payouts, _payouts));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,const DeepCollectionEquality().hash(_payouts));
}

@override
String toString() {
    return 'ListPayoutsResponse(payouts: $payouts)';
}


}

/// @nodoc
abstract mixin class _$ListPayoutsResponseCopyWith<$Res> implements $ListPayoutsResponseCopyWith<$Res> {
  factory _$ListPayoutsResponseCopyWith(_ListPayoutsResponse value, $Res Function(_ListPayoutsResponse) _then) = __$ListPayoutsResponseCopyWithImpl;
@override @useResult
$Res call({
 List<PayoutBody> payouts
});




}
/// @nodoc
class __$ListPayoutsResponseCopyWithImpl<$Res>
    implements _$ListPayoutsResponseCopyWith<$Res> {
  __$ListPayoutsResponseCopyWithImpl(this._self, this._then);

  final _ListPayoutsResponse _self;
  final $Res Function(_ListPayoutsResponse) _then;

/// Create a copy of ListPayoutsResponse
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? payouts = null,}) {
  return _then(_ListPayoutsResponse(
payouts: null == payouts ? _self._payouts : payouts // ignore: cast_nullable_to_non_nullable
as List<PayoutBody>,
  ));
}


}

// dart format on
