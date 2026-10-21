// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'live_ticket_output_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$LiveTicketOutputBody {

/// Thirty seconds after it was minted
 DateTime get expiresAt;/// Sent once in a subscribe frame on GET /live; it works once
 String get ticket;
/// Create a copy of LiveTicketOutputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$LiveTicketOutputBodyCopyWith<LiveTicketOutputBody> get copyWith => _$LiveTicketOutputBodyCopyWithImpl<LiveTicketOutputBody>(this as LiveTicketOutputBody, _$identity);

  /// Serializes this LiveTicketOutputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as LiveTicketOutputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is LiveTicketOutputBody&&(identical(other.expiresAt, _this.expiresAt) || other.expiresAt == _this.expiresAt)&&(identical(other.ticket, _this.ticket) || other.ticket == _this.ticket));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as LiveTicketOutputBody;
  return Object.hash(runtimeType,_this.expiresAt,_this.ticket);
}

@override
String toString() {
  final _this = this as LiveTicketOutputBody;
  return 'LiveTicketOutputBody(expiresAt: ${_this.expiresAt}, ticket: ${_this.ticket})';
}


}

/// @nodoc
abstract mixin class $LiveTicketOutputBodyCopyWith<$Res>  {
  factory $LiveTicketOutputBodyCopyWith(LiveTicketOutputBody value, $Res Function(LiveTicketOutputBody) _then) = _$LiveTicketOutputBodyCopyWithImpl;
@useResult
$Res call({
 DateTime expiresAt, String ticket
});




}
/// @nodoc
class _$LiveTicketOutputBodyCopyWithImpl<$Res>
    implements $LiveTicketOutputBodyCopyWith<$Res> {
  _$LiveTicketOutputBodyCopyWithImpl(this._self, this._then);

  final LiveTicketOutputBody _self;
  final $Res Function(LiveTicketOutputBody) _then;

/// Create a copy of LiveTicketOutputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? expiresAt = null,Object? ticket = null,}) {
  return _then(LiveTicketOutputBody(
expiresAt: null == expiresAt ? _self.expiresAt : expiresAt // ignore: cast_nullable_to_non_nullable
as DateTime,ticket: null == ticket ? _self.ticket : ticket // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [LiveTicketOutputBody].
extension LiveTicketOutputBodyPatterns on LiveTicketOutputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _LiveTicketOutputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _LiveTicketOutputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _LiveTicketOutputBody value)  $default,){
final _that = this;
switch (_that) {
case _LiveTicketOutputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _LiveTicketOutputBody value)?  $default,){
final _that = this;
switch (_that) {
case _LiveTicketOutputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( DateTime expiresAt,  String ticket)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _LiveTicketOutputBody() when $default != null:
return $default(_that.expiresAt,_that.ticket);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( DateTime expiresAt,  String ticket)  $default,) {final _that = this;
switch (_that) {
case _LiveTicketOutputBody():
return $default(_that.expiresAt,_that.ticket);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( DateTime expiresAt,  String ticket)?  $default,) {final _that = this;
switch (_that) {
case _LiveTicketOutputBody() when $default != null:
return $default(_that.expiresAt,_that.ticket);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _LiveTicketOutputBody implements LiveTicketOutputBody {
  const _LiveTicketOutputBody({required this.expiresAt, required this.ticket});
  factory _LiveTicketOutputBody.fromJson(Map<String, dynamic> json) => _$LiveTicketOutputBodyFromJson(json);

/// Thirty seconds after it was minted
@override final  DateTime expiresAt;
/// Sent once in a subscribe frame on GET /live; it works once
@override final  String ticket;

/// Create a copy of LiveTicketOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$LiveTicketOutputBodyCopyWith<_LiveTicketOutputBody> get copyWith => __$LiveTicketOutputBodyCopyWithImpl<_LiveTicketOutputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$LiveTicketOutputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _LiveTicketOutputBody&&(identical(other.expiresAt, expiresAt) || other.expiresAt == expiresAt)&&(identical(other.ticket, ticket) || other.ticket == ticket));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,expiresAt,ticket);
}

@override
String toString() {
    return 'LiveTicketOutputBody(expiresAt: $expiresAt, ticket: $ticket)';
}


}

/// @nodoc
abstract mixin class _$LiveTicketOutputBodyCopyWith<$Res> implements $LiveTicketOutputBodyCopyWith<$Res> {
  factory _$LiveTicketOutputBodyCopyWith(_LiveTicketOutputBody value, $Res Function(_LiveTicketOutputBody) _then) = __$LiveTicketOutputBodyCopyWithImpl;
@override @useResult
$Res call({
 DateTime expiresAt, String ticket
});




}
/// @nodoc
class __$LiveTicketOutputBodyCopyWithImpl<$Res>
    implements _$LiveTicketOutputBodyCopyWith<$Res> {
  __$LiveTicketOutputBodyCopyWithImpl(this._self, this._then);

  final _LiveTicketOutputBody _self;
  final $Res Function(_LiveTicketOutputBody) _then;

/// Create a copy of LiveTicketOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? expiresAt = null,Object? ticket = null,}) {
  return _then(_LiveTicketOutputBody(
expiresAt: null == expiresAt ? _self.expiresAt : expiresAt // ignore: cast_nullable_to_non_nullable
as DateTime,ticket: null == ticket ? _self.ticket : ticket // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
