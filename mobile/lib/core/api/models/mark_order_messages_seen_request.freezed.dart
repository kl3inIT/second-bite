// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'mark_order_messages_seen_request.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$MarkOrderMessagesSeenRequest {

 int get upTo;
/// Create a copy of MarkOrderMessagesSeenRequest
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$MarkOrderMessagesSeenRequestCopyWith<MarkOrderMessagesSeenRequest> get copyWith => _$MarkOrderMessagesSeenRequestCopyWithImpl<MarkOrderMessagesSeenRequest>(this as MarkOrderMessagesSeenRequest, _$identity);

  /// Serializes this MarkOrderMessagesSeenRequest to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as MarkOrderMessagesSeenRequest;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is MarkOrderMessagesSeenRequest&&(identical(other.upTo, _this.upTo) || other.upTo == _this.upTo));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as MarkOrderMessagesSeenRequest;
  return Object.hash(runtimeType,_this.upTo);
}

@override
String toString() {
  final _this = this as MarkOrderMessagesSeenRequest;
  return 'MarkOrderMessagesSeenRequest(upTo: ${_this.upTo})';
}


}

/// @nodoc
abstract mixin class $MarkOrderMessagesSeenRequestCopyWith<$Res>  {
  factory $MarkOrderMessagesSeenRequestCopyWith(MarkOrderMessagesSeenRequest value, $Res Function(MarkOrderMessagesSeenRequest) _then) = _$MarkOrderMessagesSeenRequestCopyWithImpl;
@useResult
$Res call({
 int upTo
});




}
/// @nodoc
class _$MarkOrderMessagesSeenRequestCopyWithImpl<$Res>
    implements $MarkOrderMessagesSeenRequestCopyWith<$Res> {
  _$MarkOrderMessagesSeenRequestCopyWithImpl(this._self, this._then);

  final MarkOrderMessagesSeenRequest _self;
  final $Res Function(MarkOrderMessagesSeenRequest) _then;

/// Create a copy of MarkOrderMessagesSeenRequest
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? upTo = null,}) {
  return _then(MarkOrderMessagesSeenRequest(
upTo: null == upTo ? _self.upTo : upTo // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [MarkOrderMessagesSeenRequest].
extension MarkOrderMessagesSeenRequestPatterns on MarkOrderMessagesSeenRequest {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _MarkOrderMessagesSeenRequest value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _MarkOrderMessagesSeenRequest() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _MarkOrderMessagesSeenRequest value)  $default,){
final _that = this;
switch (_that) {
case _MarkOrderMessagesSeenRequest():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _MarkOrderMessagesSeenRequest value)?  $default,){
final _that = this;
switch (_that) {
case _MarkOrderMessagesSeenRequest() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int upTo)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _MarkOrderMessagesSeenRequest() when $default != null:
return $default(_that.upTo);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int upTo)  $default,) {final _that = this;
switch (_that) {
case _MarkOrderMessagesSeenRequest():
return $default(_that.upTo);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int upTo)?  $default,) {final _that = this;
switch (_that) {
case _MarkOrderMessagesSeenRequest() when $default != null:
return $default(_that.upTo);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _MarkOrderMessagesSeenRequest implements MarkOrderMessagesSeenRequest {
  const _MarkOrderMessagesSeenRequest({required this.upTo});
  factory _MarkOrderMessagesSeenRequest.fromJson(Map<String, dynamic> json) => _$MarkOrderMessagesSeenRequestFromJson(json);

@override final  int upTo;

/// Create a copy of MarkOrderMessagesSeenRequest
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$MarkOrderMessagesSeenRequestCopyWith<_MarkOrderMessagesSeenRequest> get copyWith => __$MarkOrderMessagesSeenRequestCopyWithImpl<_MarkOrderMessagesSeenRequest>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$MarkOrderMessagesSeenRequestToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _MarkOrderMessagesSeenRequest&&(identical(other.upTo, upTo) || other.upTo == upTo));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,upTo);
}

@override
String toString() {
    return 'MarkOrderMessagesSeenRequest(upTo: $upTo)';
}


}

/// @nodoc
abstract mixin class _$MarkOrderMessagesSeenRequestCopyWith<$Res> implements $MarkOrderMessagesSeenRequestCopyWith<$Res> {
  factory _$MarkOrderMessagesSeenRequestCopyWith(_MarkOrderMessagesSeenRequest value, $Res Function(_MarkOrderMessagesSeenRequest) _then) = __$MarkOrderMessagesSeenRequestCopyWithImpl;
@override @useResult
$Res call({
 int upTo
});




}
/// @nodoc
class __$MarkOrderMessagesSeenRequestCopyWithImpl<$Res>
    implements _$MarkOrderMessagesSeenRequestCopyWith<$Res> {
  __$MarkOrderMessagesSeenRequestCopyWithImpl(this._self, this._then);

  final _MarkOrderMessagesSeenRequest _self;
  final $Res Function(_MarkOrderMessagesSeenRequest) _then;

/// Create a copy of MarkOrderMessagesSeenRequest
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? upTo = null,}) {
  return _then(_MarkOrderMessagesSeenRequest(
upTo: null == upTo ? _self.upTo : upTo // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
