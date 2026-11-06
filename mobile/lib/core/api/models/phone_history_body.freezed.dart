// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'phone_history_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$PhoneHistoryBody {

/// Orders it missed at any seller in the order settings' missedDays: no hand-over by the window's end, or refused as no answer, no show, late or suspected
 int get missed;/// Orders the phone number holds at this seller still to collect, this one included
 int get open;
/// Create a copy of PhoneHistoryBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$PhoneHistoryBodyCopyWith<PhoneHistoryBody> get copyWith => _$PhoneHistoryBodyCopyWithImpl<PhoneHistoryBody>(this as PhoneHistoryBody, _$identity);

  /// Serializes this PhoneHistoryBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as PhoneHistoryBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is PhoneHistoryBody&&(identical(other.missed, _this.missed) || other.missed == _this.missed)&&(identical(other.open, _this.open) || other.open == _this.open));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as PhoneHistoryBody;
  return Object.hash(runtimeType,_this.missed,_this.open);
}

@override
String toString() {
  final _this = this as PhoneHistoryBody;
  return 'PhoneHistoryBody(missed: ${_this.missed}, open: ${_this.open})';
}


}

/// @nodoc
abstract mixin class $PhoneHistoryBodyCopyWith<$Res>  {
  factory $PhoneHistoryBodyCopyWith(PhoneHistoryBody value, $Res Function(PhoneHistoryBody) _then) = _$PhoneHistoryBodyCopyWithImpl;
@useResult
$Res call({
 int missed, int open
});




}
/// @nodoc
class _$PhoneHistoryBodyCopyWithImpl<$Res>
    implements $PhoneHistoryBodyCopyWith<$Res> {
  _$PhoneHistoryBodyCopyWithImpl(this._self, this._then);

  final PhoneHistoryBody _self;
  final $Res Function(PhoneHistoryBody) _then;

/// Create a copy of PhoneHistoryBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? missed = null,Object? open = null,}) {
  return _then(PhoneHistoryBody(
missed: null == missed ? _self.missed : missed // ignore: cast_nullable_to_non_nullable
as int,open: null == open ? _self.open : open // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [PhoneHistoryBody].
extension PhoneHistoryBodyPatterns on PhoneHistoryBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _PhoneHistoryBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _PhoneHistoryBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _PhoneHistoryBody value)  $default,){
final _that = this;
switch (_that) {
case _PhoneHistoryBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _PhoneHistoryBody value)?  $default,){
final _that = this;
switch (_that) {
case _PhoneHistoryBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int missed,  int open)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _PhoneHistoryBody() when $default != null:
return $default(_that.missed,_that.open);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int missed,  int open)  $default,) {final _that = this;
switch (_that) {
case _PhoneHistoryBody():
return $default(_that.missed,_that.open);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int missed,  int open)?  $default,) {final _that = this;
switch (_that) {
case _PhoneHistoryBody() when $default != null:
return $default(_that.missed,_that.open);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _PhoneHistoryBody implements PhoneHistoryBody {
  const _PhoneHistoryBody({required this.missed, required this.open});
  factory _PhoneHistoryBody.fromJson(Map<String, dynamic> json) => _$PhoneHistoryBodyFromJson(json);

/// Orders it missed at any seller in the order settings' missedDays: no hand-over by the window's end, or refused as no answer, no show, late or suspected
@override final  int missed;
/// Orders the phone number holds at this seller still to collect, this one included
@override final  int open;

/// Create a copy of PhoneHistoryBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$PhoneHistoryBodyCopyWith<_PhoneHistoryBody> get copyWith => __$PhoneHistoryBodyCopyWithImpl<_PhoneHistoryBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$PhoneHistoryBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _PhoneHistoryBody&&(identical(other.missed, missed) || other.missed == missed)&&(identical(other.open, open) || other.open == open));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,missed,open);
}

@override
String toString() {
    return 'PhoneHistoryBody(missed: $missed, open: $open)';
}


}

/// @nodoc
abstract mixin class _$PhoneHistoryBodyCopyWith<$Res> implements $PhoneHistoryBodyCopyWith<$Res> {
  factory _$PhoneHistoryBodyCopyWith(_PhoneHistoryBody value, $Res Function(_PhoneHistoryBody) _then) = __$PhoneHistoryBodyCopyWithImpl;
@override @useResult
$Res call({
 int missed, int open
});




}
/// @nodoc
class __$PhoneHistoryBodyCopyWithImpl<$Res>
    implements _$PhoneHistoryBodyCopyWith<$Res> {
  __$PhoneHistoryBodyCopyWithImpl(this._self, this._then);

  final _PhoneHistoryBody _self;
  final $Res Function(_PhoneHistoryBody) _then;

/// Create a copy of PhoneHistoryBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? missed = null,Object? open = null,}) {
  return _then(_PhoneHistoryBody(
missed: null == missed ? _self.missed : missed // ignore: cast_nullable_to_non_nullable
as int,open: null == open ? _self.open : open // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
