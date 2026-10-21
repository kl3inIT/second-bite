// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'message_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$MessageBody {

 MessageBodyFrom get from; DateTime get sentAt;/// Its number in the chat, from 1
 int get seq; String get text;
/// Create a copy of MessageBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$MessageBodyCopyWith<MessageBody> get copyWith => _$MessageBodyCopyWithImpl<MessageBody>(this as MessageBody, _$identity);

  /// Serializes this MessageBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as MessageBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is MessageBody&&(identical(other.from, _this.from) || other.from == _this.from)&&(identical(other.sentAt, _this.sentAt) || other.sentAt == _this.sentAt)&&(identical(other.seq, _this.seq) || other.seq == _this.seq)&&(identical(other.text, _this.text) || other.text == _this.text));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as MessageBody;
  return Object.hash(runtimeType,_this.from,_this.sentAt,_this.seq,_this.text);
}

@override
String toString() {
  final _this = this as MessageBody;
  return 'MessageBody(from: ${_this.from}, sentAt: ${_this.sentAt}, seq: ${_this.seq}, text: ${_this.text})';
}


}

/// @nodoc
abstract mixin class $MessageBodyCopyWith<$Res>  {
  factory $MessageBodyCopyWith(MessageBody value, $Res Function(MessageBody) _then) = _$MessageBodyCopyWithImpl;
@useResult
$Res call({
 MessageBodyFrom from, DateTime sentAt, int seq, String text
});




}
/// @nodoc
class _$MessageBodyCopyWithImpl<$Res>
    implements $MessageBodyCopyWith<$Res> {
  _$MessageBodyCopyWithImpl(this._self, this._then);

  final MessageBody _self;
  final $Res Function(MessageBody) _then;

/// Create a copy of MessageBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? from = null,Object? sentAt = null,Object? seq = null,Object? text = null,}) {
  return _then(MessageBody(
from: null == from ? _self.from : from // ignore: cast_nullable_to_non_nullable
as MessageBodyFrom,sentAt: null == sentAt ? _self.sentAt : sentAt // ignore: cast_nullable_to_non_nullable
as DateTime,seq: null == seq ? _self.seq : seq // ignore: cast_nullable_to_non_nullable
as int,text: null == text ? _self.text : text // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [MessageBody].
extension MessageBodyPatterns on MessageBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _MessageBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _MessageBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _MessageBody value)  $default,){
final _that = this;
switch (_that) {
case _MessageBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _MessageBody value)?  $default,){
final _that = this;
switch (_that) {
case _MessageBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( MessageBodyFrom from,  DateTime sentAt,  int seq,  String text)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _MessageBody() when $default != null:
return $default(_that.from,_that.sentAt,_that.seq,_that.text);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( MessageBodyFrom from,  DateTime sentAt,  int seq,  String text)  $default,) {final _that = this;
switch (_that) {
case _MessageBody():
return $default(_that.from,_that.sentAt,_that.seq,_that.text);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( MessageBodyFrom from,  DateTime sentAt,  int seq,  String text)?  $default,) {final _that = this;
switch (_that) {
case _MessageBody() when $default != null:
return $default(_that.from,_that.sentAt,_that.seq,_that.text);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _MessageBody implements MessageBody {
  const _MessageBody({required this.from, required this.sentAt, required this.seq, required this.text});
  factory _MessageBody.fromJson(Map<String, dynamic> json) => _$MessageBodyFromJson(json);

@override final  MessageBodyFrom from;
@override final  DateTime sentAt;
/// Its number in the chat, from 1
@override final  int seq;
@override final  String text;

/// Create a copy of MessageBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$MessageBodyCopyWith<_MessageBody> get copyWith => __$MessageBodyCopyWithImpl<_MessageBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$MessageBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _MessageBody&&(identical(other.from, from) || other.from == from)&&(identical(other.sentAt, sentAt) || other.sentAt == sentAt)&&(identical(other.seq, seq) || other.seq == seq)&&(identical(other.text, text) || other.text == text));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,from,sentAt,seq,text);
}

@override
String toString() {
    return 'MessageBody(from: $from, sentAt: $sentAt, seq: $seq, text: $text)';
}


}

/// @nodoc
abstract mixin class _$MessageBodyCopyWith<$Res> implements $MessageBodyCopyWith<$Res> {
  factory _$MessageBodyCopyWith(_MessageBody value, $Res Function(_MessageBody) _then) = __$MessageBodyCopyWithImpl;
@override @useResult
$Res call({
 MessageBodyFrom from, DateTime sentAt, int seq, String text
});




}
/// @nodoc
class __$MessageBodyCopyWithImpl<$Res>
    implements _$MessageBodyCopyWith<$Res> {
  __$MessageBodyCopyWithImpl(this._self, this._then);

  final _MessageBody _self;
  final $Res Function(_MessageBody) _then;

/// Create a copy of MessageBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? from = null,Object? sentAt = null,Object? seq = null,Object? text = null,}) {
  return _then(_MessageBody(
from: null == from ? _self.from : from // ignore: cast_nullable_to_non_nullable
as MessageBodyFrom,sentAt: null == sentAt ? _self.sentAt : sentAt // ignore: cast_nullable_to_non_nullable
as DateTime,seq: null == seq ? _self.seq : seq // ignore: cast_nullable_to_non_nullable
as int,text: null == text ? _self.text : text // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
