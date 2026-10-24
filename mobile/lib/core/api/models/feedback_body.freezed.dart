// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'feedback_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$FeedbackBody {

 String get id; String get sellerId; String get sellerName; DateTime get sentAt; String get text;
/// Create a copy of FeedbackBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$FeedbackBodyCopyWith<FeedbackBody> get copyWith => _$FeedbackBodyCopyWithImpl<FeedbackBody>(this as FeedbackBody, _$identity);

  /// Serializes this FeedbackBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as FeedbackBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is FeedbackBody&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.sellerId, _this.sellerId) || other.sellerId == _this.sellerId)&&(identical(other.sellerName, _this.sellerName) || other.sellerName == _this.sellerName)&&(identical(other.sentAt, _this.sentAt) || other.sentAt == _this.sentAt)&&(identical(other.text, _this.text) || other.text == _this.text));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as FeedbackBody;
  return Object.hash(runtimeType,_this.id,_this.sellerId,_this.sellerName,_this.sentAt,_this.text);
}

@override
String toString() {
  final _this = this as FeedbackBody;
  return 'FeedbackBody(id: ${_this.id}, sellerId: ${_this.sellerId}, sellerName: ${_this.sellerName}, sentAt: ${_this.sentAt}, text: ${_this.text})';
}


}

/// @nodoc
abstract mixin class $FeedbackBodyCopyWith<$Res>  {
  factory $FeedbackBodyCopyWith(FeedbackBody value, $Res Function(FeedbackBody) _then) = _$FeedbackBodyCopyWithImpl;
@useResult
$Res call({
 String id, String sellerId, String sellerName, DateTime sentAt, String text
});




}
/// @nodoc
class _$FeedbackBodyCopyWithImpl<$Res>
    implements $FeedbackBodyCopyWith<$Res> {
  _$FeedbackBodyCopyWithImpl(this._self, this._then);

  final FeedbackBody _self;
  final $Res Function(FeedbackBody) _then;

/// Create a copy of FeedbackBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? sellerId = null,Object? sellerName = null,Object? sentAt = null,Object? text = null,}) {
  return _then(FeedbackBody(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,sellerId: null == sellerId ? _self.sellerId : sellerId // ignore: cast_nullable_to_non_nullable
as String,sellerName: null == sellerName ? _self.sellerName : sellerName // ignore: cast_nullable_to_non_nullable
as String,sentAt: null == sentAt ? _self.sentAt : sentAt // ignore: cast_nullable_to_non_nullable
as DateTime,text: null == text ? _self.text : text // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [FeedbackBody].
extension FeedbackBodyPatterns on FeedbackBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _FeedbackBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _FeedbackBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _FeedbackBody value)  $default,){
final _that = this;
switch (_that) {
case _FeedbackBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _FeedbackBody value)?  $default,){
final _that = this;
switch (_that) {
case _FeedbackBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String sellerId,  String sellerName,  DateTime sentAt,  String text)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _FeedbackBody() when $default != null:
return $default(_that.id,_that.sellerId,_that.sellerName,_that.sentAt,_that.text);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String sellerId,  String sellerName,  DateTime sentAt,  String text)  $default,) {final _that = this;
switch (_that) {
case _FeedbackBody():
return $default(_that.id,_that.sellerId,_that.sellerName,_that.sentAt,_that.text);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String sellerId,  String sellerName,  DateTime sentAt,  String text)?  $default,) {final _that = this;
switch (_that) {
case _FeedbackBody() when $default != null:
return $default(_that.id,_that.sellerId,_that.sellerName,_that.sentAt,_that.text);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _FeedbackBody implements FeedbackBody {
  const _FeedbackBody({required this.id, required this.sellerId, required this.sellerName, required this.sentAt, required this.text});
  factory _FeedbackBody.fromJson(Map<String, dynamic> json) => _$FeedbackBodyFromJson(json);

@override final  String id;
@override final  String sellerId;
@override final  String sellerName;
@override final  DateTime sentAt;
@override final  String text;

/// Create a copy of FeedbackBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$FeedbackBodyCopyWith<_FeedbackBody> get copyWith => __$FeedbackBodyCopyWithImpl<_FeedbackBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$FeedbackBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _FeedbackBody&&(identical(other.id, id) || other.id == id)&&(identical(other.sellerId, sellerId) || other.sellerId == sellerId)&&(identical(other.sellerName, sellerName) || other.sellerName == sellerName)&&(identical(other.sentAt, sentAt) || other.sentAt == sentAt)&&(identical(other.text, text) || other.text == text));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,id,sellerId,sellerName,sentAt,text);
}

@override
String toString() {
    return 'FeedbackBody(id: $id, sellerId: $sellerId, sellerName: $sellerName, sentAt: $sentAt, text: $text)';
}


}

/// @nodoc
abstract mixin class _$FeedbackBodyCopyWith<$Res> implements $FeedbackBodyCopyWith<$Res> {
  factory _$FeedbackBodyCopyWith(_FeedbackBody value, $Res Function(_FeedbackBody) _then) = __$FeedbackBodyCopyWithImpl;
@override @useResult
$Res call({
 String id, String sellerId, String sellerName, DateTime sentAt, String text
});




}
/// @nodoc
class __$FeedbackBodyCopyWithImpl<$Res>
    implements _$FeedbackBodyCopyWith<$Res> {
  __$FeedbackBodyCopyWithImpl(this._self, this._then);

  final _FeedbackBody _self;
  final $Res Function(_FeedbackBody) _then;

/// Create a copy of FeedbackBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? sellerId = null,Object? sellerName = null,Object? sentAt = null,Object? text = null,}) {
  return _then(_FeedbackBody(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,sellerId: null == sellerId ? _self.sellerId : sellerId // ignore: cast_nullable_to_non_nullable
as String,sellerName: null == sellerName ? _self.sellerName : sellerName // ignore: cast_nullable_to_non_nullable
as String,sentAt: null == sentAt ? _self.sentAt : sentAt // ignore: cast_nullable_to_non_nullable
as DateTime,text: null == text ? _self.text : text // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
