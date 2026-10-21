// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'history_output_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$HistoryOutputBody {

/// Orders handed over
 int get collected;/// Orders the customer did not come for: the window ended, or staff ended them as no answer, no show or late
 int get missed; int get placed;/// The latest five, newest first
 List<OrderBody> get recent;
/// Create a copy of HistoryOutputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$HistoryOutputBodyCopyWith<HistoryOutputBody> get copyWith => _$HistoryOutputBodyCopyWithImpl<HistoryOutputBody>(this as HistoryOutputBody, _$identity);

  /// Serializes this HistoryOutputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as HistoryOutputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is HistoryOutputBody&&(identical(other.collected, _this.collected) || other.collected == _this.collected)&&(identical(other.missed, _this.missed) || other.missed == _this.missed)&&(identical(other.placed, _this.placed) || other.placed == _this.placed)&&const DeepCollectionEquality().equals(other.recent, _this.recent));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as HistoryOutputBody;
  return Object.hash(runtimeType,_this.collected,_this.missed,_this.placed,const DeepCollectionEquality().hash(_this.recent));
}

@override
String toString() {
  final _this = this as HistoryOutputBody;
  return 'HistoryOutputBody(collected: ${_this.collected}, missed: ${_this.missed}, placed: ${_this.placed}, recent: ${_this.recent})';
}


}

/// @nodoc
abstract mixin class $HistoryOutputBodyCopyWith<$Res>  {
  factory $HistoryOutputBodyCopyWith(HistoryOutputBody value, $Res Function(HistoryOutputBody) _then) = _$HistoryOutputBodyCopyWithImpl;
@useResult
$Res call({
 int collected, int missed, int placed, List<OrderBody> recent
});




}
/// @nodoc
class _$HistoryOutputBodyCopyWithImpl<$Res>
    implements $HistoryOutputBodyCopyWith<$Res> {
  _$HistoryOutputBodyCopyWithImpl(this._self, this._then);

  final HistoryOutputBody _self;
  final $Res Function(HistoryOutputBody) _then;

/// Create a copy of HistoryOutputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? collected = null,Object? missed = null,Object? placed = null,Object? recent = null,}) {
  return _then(HistoryOutputBody(
collected: null == collected ? _self.collected : collected // ignore: cast_nullable_to_non_nullable
as int,missed: null == missed ? _self.missed : missed // ignore: cast_nullable_to_non_nullable
as int,placed: null == placed ? _self.placed : placed // ignore: cast_nullable_to_non_nullable
as int,recent: null == recent ? _self.recent : recent // ignore: cast_nullable_to_non_nullable
as List<OrderBody>,
  ));
}

}


/// Adds pattern-matching-related methods to [HistoryOutputBody].
extension HistoryOutputBodyPatterns on HistoryOutputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _HistoryOutputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _HistoryOutputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _HistoryOutputBody value)  $default,){
final _that = this;
switch (_that) {
case _HistoryOutputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _HistoryOutputBody value)?  $default,){
final _that = this;
switch (_that) {
case _HistoryOutputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int collected,  int missed,  int placed,  List<OrderBody> recent)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _HistoryOutputBody() when $default != null:
return $default(_that.collected,_that.missed,_that.placed,_that.recent);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int collected,  int missed,  int placed,  List<OrderBody> recent)  $default,) {final _that = this;
switch (_that) {
case _HistoryOutputBody():
return $default(_that.collected,_that.missed,_that.placed,_that.recent);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int collected,  int missed,  int placed,  List<OrderBody> recent)?  $default,) {final _that = this;
switch (_that) {
case _HistoryOutputBody() when $default != null:
return $default(_that.collected,_that.missed,_that.placed,_that.recent);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _HistoryOutputBody implements HistoryOutputBody {
  const _HistoryOutputBody({required this.collected, required this.missed, required this.placed, required  List<OrderBody> recent}): _recent = recent;
  factory _HistoryOutputBody.fromJson(Map<String, dynamic> json) => _$HistoryOutputBodyFromJson(json);

/// Orders handed over
@override final  int collected;
/// Orders the customer did not come for: the window ended, or staff ended them as no answer, no show or late
@override final  int missed;
@override final  int placed;
/// The latest five, newest first
 final  List<OrderBody> _recent;
/// The latest five, newest first
@override List<OrderBody> get recent {
  if (_recent is EqualUnmodifiableListView) return _recent;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_recent);
}


/// Create a copy of HistoryOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$HistoryOutputBodyCopyWith<_HistoryOutputBody> get copyWith => __$HistoryOutputBodyCopyWithImpl<_HistoryOutputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$HistoryOutputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _HistoryOutputBody&&(identical(other.collected, collected) || other.collected == collected)&&(identical(other.missed, missed) || other.missed == missed)&&(identical(other.placed, placed) || other.placed == placed)&&const DeepCollectionEquality().equals(other.recent, _recent));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,collected,missed,placed,const DeepCollectionEquality().hash(_recent));
}

@override
String toString() {
    return 'HistoryOutputBody(collected: $collected, missed: $missed, placed: $placed, recent: $recent)';
}


}

/// @nodoc
abstract mixin class _$HistoryOutputBodyCopyWith<$Res> implements $HistoryOutputBodyCopyWith<$Res> {
  factory _$HistoryOutputBodyCopyWith(_HistoryOutputBody value, $Res Function(_HistoryOutputBody) _then) = __$HistoryOutputBodyCopyWithImpl;
@override @useResult
$Res call({
 int collected, int missed, int placed, List<OrderBody> recent
});




}
/// @nodoc
class __$HistoryOutputBodyCopyWithImpl<$Res>
    implements _$HistoryOutputBodyCopyWith<$Res> {
  __$HistoryOutputBodyCopyWithImpl(this._self, this._then);

  final _HistoryOutputBody _self;
  final $Res Function(_HistoryOutputBody) _then;

/// Create a copy of HistoryOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? collected = null,Object? missed = null,Object? placed = null,Object? recent = null,}) {
  return _then(_HistoryOutputBody(
collected: null == collected ? _self.collected : collected // ignore: cast_nullable_to_non_nullable
as int,missed: null == missed ? _self.missed : missed // ignore: cast_nullable_to_non_nullable
as int,placed: null == placed ? _self.placed : placed // ignore: cast_nullable_to_non_nullable
as int,recent: null == recent ? _self._recent : recent // ignore: cast_nullable_to_non_nullable
as List<OrderBody>,
  ));
}


}

// dart format on
