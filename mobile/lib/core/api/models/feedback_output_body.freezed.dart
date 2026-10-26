// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'feedback_output_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$FeedbackOutputBody {

 List<FeedbackBody> get items;
/// Create a copy of FeedbackOutputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$FeedbackOutputBodyCopyWith<FeedbackOutputBody> get copyWith => _$FeedbackOutputBodyCopyWithImpl<FeedbackOutputBody>(this as FeedbackOutputBody, _$identity);

  /// Serializes this FeedbackOutputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as FeedbackOutputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is FeedbackOutputBody&&const DeepCollectionEquality().equals(other.items, _this.items));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as FeedbackOutputBody;
  return Object.hash(runtimeType,const DeepCollectionEquality().hash(_this.items));
}

@override
String toString() {
  final _this = this as FeedbackOutputBody;
  return 'FeedbackOutputBody(items: ${_this.items})';
}


}

/// @nodoc
abstract mixin class $FeedbackOutputBodyCopyWith<$Res>  {
  factory $FeedbackOutputBodyCopyWith(FeedbackOutputBody value, $Res Function(FeedbackOutputBody) _then) = _$FeedbackOutputBodyCopyWithImpl;
@useResult
$Res call({
 List<FeedbackBody> items
});




}
/// @nodoc
class _$FeedbackOutputBodyCopyWithImpl<$Res>
    implements $FeedbackOutputBodyCopyWith<$Res> {
  _$FeedbackOutputBodyCopyWithImpl(this._self, this._then);

  final FeedbackOutputBody _self;
  final $Res Function(FeedbackOutputBody) _then;

/// Create a copy of FeedbackOutputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? items = null,}) {
  return _then(FeedbackOutputBody(
items: null == items ? _self.items : items // ignore: cast_nullable_to_non_nullable
as List<FeedbackBody>,
  ));
}

}


/// Adds pattern-matching-related methods to [FeedbackOutputBody].
extension FeedbackOutputBodyPatterns on FeedbackOutputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _FeedbackOutputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _FeedbackOutputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _FeedbackOutputBody value)  $default,){
final _that = this;
switch (_that) {
case _FeedbackOutputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _FeedbackOutputBody value)?  $default,){
final _that = this;
switch (_that) {
case _FeedbackOutputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( List<FeedbackBody> items)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _FeedbackOutputBody() when $default != null:
return $default(_that.items);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( List<FeedbackBody> items)  $default,) {final _that = this;
switch (_that) {
case _FeedbackOutputBody():
return $default(_that.items);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( List<FeedbackBody> items)?  $default,) {final _that = this;
switch (_that) {
case _FeedbackOutputBody() when $default != null:
return $default(_that.items);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _FeedbackOutputBody implements FeedbackOutputBody {
  const _FeedbackOutputBody({required  List<FeedbackBody> items}): _items = items;
  factory _FeedbackOutputBody.fromJson(Map<String, dynamic> json) => _$FeedbackOutputBodyFromJson(json);

 final  List<FeedbackBody> _items;
@override List<FeedbackBody> get items {
  if (_items is EqualUnmodifiableListView) return _items;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_items);
}


/// Create a copy of FeedbackOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$FeedbackOutputBodyCopyWith<_FeedbackOutputBody> get copyWith => __$FeedbackOutputBodyCopyWithImpl<_FeedbackOutputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$FeedbackOutputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _FeedbackOutputBody&&const DeepCollectionEquality().equals(other.items, _items));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,const DeepCollectionEquality().hash(_items));
}

@override
String toString() {
    return 'FeedbackOutputBody(items: $items)';
}


}

/// @nodoc
abstract mixin class _$FeedbackOutputBodyCopyWith<$Res> implements $FeedbackOutputBodyCopyWith<$Res> {
  factory _$FeedbackOutputBodyCopyWith(_FeedbackOutputBody value, $Res Function(_FeedbackOutputBody) _then) = __$FeedbackOutputBodyCopyWithImpl;
@override @useResult
$Res call({
 List<FeedbackBody> items
});




}
/// @nodoc
class __$FeedbackOutputBodyCopyWithImpl<$Res>
    implements _$FeedbackOutputBodyCopyWith<$Res> {
  __$FeedbackOutputBodyCopyWithImpl(this._self, this._then);

  final _FeedbackOutputBody _self;
  final $Res Function(_FeedbackOutputBody) _then;

/// Create a copy of FeedbackOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? items = null,}) {
  return _then(_FeedbackOutputBody(
items: null == items ? _self._items : items // ignore: cast_nullable_to_non_nullable
as List<FeedbackBody>,
  ));
}


}

// dart format on
