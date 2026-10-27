// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'subscribe_push_input_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$SubscribePushInputBody {

/// The push service's address for this browser
 String get endpoint; PushKeys get keys;/// Live tickets, one per topic to follow: an order's (POST /orders/{id}/live-ticket) or a seller's
 List<String>? get tickets;
/// Create a copy of SubscribePushInputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$SubscribePushInputBodyCopyWith<SubscribePushInputBody> get copyWith => _$SubscribePushInputBodyCopyWithImpl<SubscribePushInputBody>(this as SubscribePushInputBody, _$identity);

  /// Serializes this SubscribePushInputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as SubscribePushInputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is SubscribePushInputBody&&(identical(other.endpoint, _this.endpoint) || other.endpoint == _this.endpoint)&&(identical(other.keys, _this.keys) || other.keys == _this.keys)&&const DeepCollectionEquality().equals(other.tickets, _this.tickets));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as SubscribePushInputBody;
  return Object.hash(runtimeType,_this.endpoint,_this.keys,const DeepCollectionEquality().hash(_this.tickets));
}

@override
String toString() {
  final _this = this as SubscribePushInputBody;
  return 'SubscribePushInputBody(endpoint: ${_this.endpoint}, keys: ${_this.keys}, tickets: ${_this.tickets})';
}


}

/// @nodoc
abstract mixin class $SubscribePushInputBodyCopyWith<$Res>  {
  factory $SubscribePushInputBodyCopyWith(SubscribePushInputBody value, $Res Function(SubscribePushInputBody) _then) = _$SubscribePushInputBodyCopyWithImpl;
@useResult
$Res call({
 String endpoint, PushKeys keys, List<String>? tickets
});


$PushKeysCopyWith<$Res> get keys;

}
/// @nodoc
class _$SubscribePushInputBodyCopyWithImpl<$Res>
    implements $SubscribePushInputBodyCopyWith<$Res> {
  _$SubscribePushInputBodyCopyWithImpl(this._self, this._then);

  final SubscribePushInputBody _self;
  final $Res Function(SubscribePushInputBody) _then;

/// Create a copy of SubscribePushInputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? endpoint = null,Object? keys = null,Object? tickets = freezed,}) {
  return _then(SubscribePushInputBody(
endpoint: null == endpoint ? _self.endpoint : endpoint // ignore: cast_nullable_to_non_nullable
as String,keys: null == keys ? _self.keys : keys // ignore: cast_nullable_to_non_nullable
as PushKeys,tickets: freezed == tickets ? _self.tickets : tickets // ignore: cast_nullable_to_non_nullable
as List<String>?,
  ));
}
/// Create a copy of SubscribePushInputBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$PushKeysCopyWith<$Res> get keys {
  
  return $PushKeysCopyWith<$Res>(_self.keys, (value) {
    return _then(_self.copyWith(keys: value));
  });
}
}


/// Adds pattern-matching-related methods to [SubscribePushInputBody].
extension SubscribePushInputBodyPatterns on SubscribePushInputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _SubscribePushInputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _SubscribePushInputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _SubscribePushInputBody value)  $default,){
final _that = this;
switch (_that) {
case _SubscribePushInputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _SubscribePushInputBody value)?  $default,){
final _that = this;
switch (_that) {
case _SubscribePushInputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String endpoint,  PushKeys keys,  List<String>? tickets)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _SubscribePushInputBody() when $default != null:
return $default(_that.endpoint,_that.keys,_that.tickets);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String endpoint,  PushKeys keys,  List<String>? tickets)  $default,) {final _that = this;
switch (_that) {
case _SubscribePushInputBody():
return $default(_that.endpoint,_that.keys,_that.tickets);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String endpoint,  PushKeys keys,  List<String>? tickets)?  $default,) {final _that = this;
switch (_that) {
case _SubscribePushInputBody() when $default != null:
return $default(_that.endpoint,_that.keys,_that.tickets);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _SubscribePushInputBody implements SubscribePushInputBody {
  const _SubscribePushInputBody({required this.endpoint, required this.keys, required  List<String>? tickets}): _tickets = tickets;
  factory _SubscribePushInputBody.fromJson(Map<String, dynamic> json) => _$SubscribePushInputBodyFromJson(json);

/// The push service's address for this browser
@override final  String endpoint;
@override final  PushKeys keys;
/// Live tickets, one per topic to follow: an order's (POST /orders/{id}/live-ticket) or a seller's
 final  List<String>? _tickets;
/// Live tickets, one per topic to follow: an order's (POST /orders/{id}/live-ticket) or a seller's
@override List<String>? get tickets {
  final value = _tickets;
  if (value == null) return null;
  if (_tickets is EqualUnmodifiableListView) return _tickets;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(value);
}


/// Create a copy of SubscribePushInputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$SubscribePushInputBodyCopyWith<_SubscribePushInputBody> get copyWith => __$SubscribePushInputBodyCopyWithImpl<_SubscribePushInputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$SubscribePushInputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _SubscribePushInputBody&&(identical(other.endpoint, endpoint) || other.endpoint == endpoint)&&(identical(other.keys, keys) || other.keys == keys)&&const DeepCollectionEquality().equals(other.tickets, _tickets));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,endpoint,keys,const DeepCollectionEquality().hash(_tickets));
}

@override
String toString() {
    return 'SubscribePushInputBody(endpoint: $endpoint, keys: $keys, tickets: $tickets)';
}


}

/// @nodoc
abstract mixin class _$SubscribePushInputBodyCopyWith<$Res> implements $SubscribePushInputBodyCopyWith<$Res> {
  factory _$SubscribePushInputBodyCopyWith(_SubscribePushInputBody value, $Res Function(_SubscribePushInputBody) _then) = __$SubscribePushInputBodyCopyWithImpl;
@override @useResult
$Res call({
 String endpoint, PushKeys keys, List<String>? tickets
});


@override $PushKeysCopyWith<$Res> get keys;

}
/// @nodoc
class __$SubscribePushInputBodyCopyWithImpl<$Res>
    implements _$SubscribePushInputBodyCopyWith<$Res> {
  __$SubscribePushInputBodyCopyWithImpl(this._self, this._then);

  final _SubscribePushInputBody _self;
  final $Res Function(_SubscribePushInputBody) _then;

/// Create a copy of SubscribePushInputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? endpoint = null,Object? keys = null,Object? tickets = freezed,}) {
  return _then(_SubscribePushInputBody(
endpoint: null == endpoint ? _self.endpoint : endpoint // ignore: cast_nullable_to_non_nullable
as String,keys: null == keys ? _self.keys : keys // ignore: cast_nullable_to_non_nullable
as PushKeys,tickets: freezed == tickets ? _self._tickets : tickets // ignore: cast_nullable_to_non_nullable
as List<String>?,
  ));
}

/// Create a copy of SubscribePushInputBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$PushKeysCopyWith<$Res> get keys {
  
  return $PushKeysCopyWith<$Res>(_self.keys, (value) {
    return _then(_self.copyWith(keys: value));
  });
}
}

// dart format on
