// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'messages_output_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$MessagesOutputBody {

/// Oldest first
 List<MessageBody> get messages;/// Whether the chat takes messages
 bool get open; SeenBody get seen;/// Only once the order is collected: when its chat turns read-only
 DateTime? get closesAt;
/// Create a copy of MessagesOutputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$MessagesOutputBodyCopyWith<MessagesOutputBody> get copyWith => _$MessagesOutputBodyCopyWithImpl<MessagesOutputBody>(this as MessagesOutputBody, _$identity);

  /// Serializes this MessagesOutputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as MessagesOutputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is MessagesOutputBody&&const DeepCollectionEquality().equals(other.messages, _this.messages)&&(identical(other.open, _this.open) || other.open == _this.open)&&(identical(other.seen, _this.seen) || other.seen == _this.seen)&&(identical(other.closesAt, _this.closesAt) || other.closesAt == _this.closesAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as MessagesOutputBody;
  return Object.hash(runtimeType,const DeepCollectionEquality().hash(_this.messages),_this.open,_this.seen,_this.closesAt);
}

@override
String toString() {
  final _this = this as MessagesOutputBody;
  return 'MessagesOutputBody(messages: ${_this.messages}, open: ${_this.open}, seen: ${_this.seen}, closesAt: ${_this.closesAt})';
}


}

/// @nodoc
abstract mixin class $MessagesOutputBodyCopyWith<$Res>  {
  factory $MessagesOutputBodyCopyWith(MessagesOutputBody value, $Res Function(MessagesOutputBody) _then) = _$MessagesOutputBodyCopyWithImpl;
@useResult
$Res call({
 List<MessageBody> messages, bool open, SeenBody seen, DateTime? closesAt
});


$SeenBodyCopyWith<$Res> get seen;

}
/// @nodoc
class _$MessagesOutputBodyCopyWithImpl<$Res>
    implements $MessagesOutputBodyCopyWith<$Res> {
  _$MessagesOutputBodyCopyWithImpl(this._self, this._then);

  final MessagesOutputBody _self;
  final $Res Function(MessagesOutputBody) _then;

/// Create a copy of MessagesOutputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? messages = null,Object? open = null,Object? seen = null,Object? closesAt = freezed,}) {
  return _then(MessagesOutputBody(
messages: null == messages ? _self.messages : messages // ignore: cast_nullable_to_non_nullable
as List<MessageBody>,open: null == open ? _self.open : open // ignore: cast_nullable_to_non_nullable
as bool,seen: null == seen ? _self.seen : seen // ignore: cast_nullable_to_non_nullable
as SeenBody,closesAt: freezed == closesAt ? _self.closesAt : closesAt // ignore: cast_nullable_to_non_nullable
as DateTime?,
  ));
}
/// Create a copy of MessagesOutputBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$SeenBodyCopyWith<$Res> get seen {
  
  return $SeenBodyCopyWith<$Res>(_self.seen, (value) {
    return _then(_self.copyWith(seen: value));
  });
}
}


/// Adds pattern-matching-related methods to [MessagesOutputBody].
extension MessagesOutputBodyPatterns on MessagesOutputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _MessagesOutputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _MessagesOutputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _MessagesOutputBody value)  $default,){
final _that = this;
switch (_that) {
case _MessagesOutputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _MessagesOutputBody value)?  $default,){
final _that = this;
switch (_that) {
case _MessagesOutputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( List<MessageBody> messages,  bool open,  SeenBody seen,  DateTime? closesAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _MessagesOutputBody() when $default != null:
return $default(_that.messages,_that.open,_that.seen,_that.closesAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( List<MessageBody> messages,  bool open,  SeenBody seen,  DateTime? closesAt)  $default,) {final _that = this;
switch (_that) {
case _MessagesOutputBody():
return $default(_that.messages,_that.open,_that.seen,_that.closesAt);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( List<MessageBody> messages,  bool open,  SeenBody seen,  DateTime? closesAt)?  $default,) {final _that = this;
switch (_that) {
case _MessagesOutputBody() when $default != null:
return $default(_that.messages,_that.open,_that.seen,_that.closesAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _MessagesOutputBody implements MessagesOutputBody {
  const _MessagesOutputBody({required  List<MessageBody> messages, required this.open, required this.seen, this.closesAt}): _messages = messages;
  factory _MessagesOutputBody.fromJson(Map<String, dynamic> json) => _$MessagesOutputBodyFromJson(json);

/// Oldest first
 final  List<MessageBody> _messages;
/// Oldest first
@override List<MessageBody> get messages {
  if (_messages is EqualUnmodifiableListView) return _messages;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_messages);
}

/// Whether the chat takes messages
@override final  bool open;
@override final  SeenBody seen;
/// Only once the order is collected: when its chat turns read-only
@override final  DateTime? closesAt;

/// Create a copy of MessagesOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$MessagesOutputBodyCopyWith<_MessagesOutputBody> get copyWith => __$MessagesOutputBodyCopyWithImpl<_MessagesOutputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$MessagesOutputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _MessagesOutputBody&&const DeepCollectionEquality().equals(other.messages, _messages)&&(identical(other.open, open) || other.open == open)&&(identical(other.seen, seen) || other.seen == seen)&&(identical(other.closesAt, closesAt) || other.closesAt == closesAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,const DeepCollectionEquality().hash(_messages),open,seen,closesAt);
}

@override
String toString() {
    return 'MessagesOutputBody(messages: $messages, open: $open, seen: $seen, closesAt: $closesAt)';
}


}

/// @nodoc
abstract mixin class _$MessagesOutputBodyCopyWith<$Res> implements $MessagesOutputBodyCopyWith<$Res> {
  factory _$MessagesOutputBodyCopyWith(_MessagesOutputBody value, $Res Function(_MessagesOutputBody) _then) = __$MessagesOutputBodyCopyWithImpl;
@override @useResult
$Res call({
 List<MessageBody> messages, bool open, SeenBody seen, DateTime? closesAt
});


@override $SeenBodyCopyWith<$Res> get seen;

}
/// @nodoc
class __$MessagesOutputBodyCopyWithImpl<$Res>
    implements _$MessagesOutputBodyCopyWith<$Res> {
  __$MessagesOutputBodyCopyWithImpl(this._self, this._then);

  final _MessagesOutputBody _self;
  final $Res Function(_MessagesOutputBody) _then;

/// Create a copy of MessagesOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? messages = null,Object? open = null,Object? seen = null,Object? closesAt = freezed,}) {
  return _then(_MessagesOutputBody(
messages: null == messages ? _self._messages : messages // ignore: cast_nullable_to_non_nullable
as List<MessageBody>,open: null == open ? _self.open : open // ignore: cast_nullable_to_non_nullable
as bool,seen: null == seen ? _self.seen : seen // ignore: cast_nullable_to_non_nullable
as SeenBody,closesAt: freezed == closesAt ? _self.closesAt : closesAt // ignore: cast_nullable_to_non_nullable
as DateTime?,
  ));
}

/// Create a copy of MessagesOutputBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$SeenBodyCopyWith<$Res> get seen {
  
  return $SeenBodyCopyWith<$Res>(_self.seen, (value) {
    return _then(_self.copyWith(seen: value));
  });
}
}

// dart format on
