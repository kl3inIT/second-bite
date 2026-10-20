// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'sellers_summary_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$SellersSummaryBody {

/// Sellers active now
 int get active;/// Sellers blocked now
 int get blocked;/// The five sellers opened last, newest first, whenever that was
 List<OpenedSellerBody> get latest;/// Sellers opened in the range, whatever their status
 int get openedInRange;/// Sellers pending now
 int get pending;
/// Create a copy of SellersSummaryBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$SellersSummaryBodyCopyWith<SellersSummaryBody> get copyWith => _$SellersSummaryBodyCopyWithImpl<SellersSummaryBody>(this as SellersSummaryBody, _$identity);

  /// Serializes this SellersSummaryBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as SellersSummaryBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is SellersSummaryBody&&(identical(other.active, _this.active) || other.active == _this.active)&&(identical(other.blocked, _this.blocked) || other.blocked == _this.blocked)&&const DeepCollectionEquality().equals(other.latest, _this.latest)&&(identical(other.openedInRange, _this.openedInRange) || other.openedInRange == _this.openedInRange)&&(identical(other.pending, _this.pending) || other.pending == _this.pending));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as SellersSummaryBody;
  return Object.hash(runtimeType,_this.active,_this.blocked,const DeepCollectionEquality().hash(_this.latest),_this.openedInRange,_this.pending);
}

@override
String toString() {
  final _this = this as SellersSummaryBody;
  return 'SellersSummaryBody(active: ${_this.active}, blocked: ${_this.blocked}, latest: ${_this.latest}, openedInRange: ${_this.openedInRange}, pending: ${_this.pending})';
}


}

/// @nodoc
abstract mixin class $SellersSummaryBodyCopyWith<$Res>  {
  factory $SellersSummaryBodyCopyWith(SellersSummaryBody value, $Res Function(SellersSummaryBody) _then) = _$SellersSummaryBodyCopyWithImpl;
@useResult
$Res call({
 int active, int blocked, List<OpenedSellerBody> latest, int openedInRange, int pending
});




}
/// @nodoc
class _$SellersSummaryBodyCopyWithImpl<$Res>
    implements $SellersSummaryBodyCopyWith<$Res> {
  _$SellersSummaryBodyCopyWithImpl(this._self, this._then);

  final SellersSummaryBody _self;
  final $Res Function(SellersSummaryBody) _then;

/// Create a copy of SellersSummaryBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? active = null,Object? blocked = null,Object? latest = null,Object? openedInRange = null,Object? pending = null,}) {
  return _then(SellersSummaryBody(
active: null == active ? _self.active : active // ignore: cast_nullable_to_non_nullable
as int,blocked: null == blocked ? _self.blocked : blocked // ignore: cast_nullable_to_non_nullable
as int,latest: null == latest ? _self.latest : latest // ignore: cast_nullable_to_non_nullable
as List<OpenedSellerBody>,openedInRange: null == openedInRange ? _self.openedInRange : openedInRange // ignore: cast_nullable_to_non_nullable
as int,pending: null == pending ? _self.pending : pending // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [SellersSummaryBody].
extension SellersSummaryBodyPatterns on SellersSummaryBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _SellersSummaryBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _SellersSummaryBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _SellersSummaryBody value)  $default,){
final _that = this;
switch (_that) {
case _SellersSummaryBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _SellersSummaryBody value)?  $default,){
final _that = this;
switch (_that) {
case _SellersSummaryBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int active,  int blocked,  List<OpenedSellerBody> latest,  int openedInRange,  int pending)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _SellersSummaryBody() when $default != null:
return $default(_that.active,_that.blocked,_that.latest,_that.openedInRange,_that.pending);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int active,  int blocked,  List<OpenedSellerBody> latest,  int openedInRange,  int pending)  $default,) {final _that = this;
switch (_that) {
case _SellersSummaryBody():
return $default(_that.active,_that.blocked,_that.latest,_that.openedInRange,_that.pending);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int active,  int blocked,  List<OpenedSellerBody> latest,  int openedInRange,  int pending)?  $default,) {final _that = this;
switch (_that) {
case _SellersSummaryBody() when $default != null:
return $default(_that.active,_that.blocked,_that.latest,_that.openedInRange,_that.pending);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _SellersSummaryBody implements SellersSummaryBody {
  const _SellersSummaryBody({required this.active, required this.blocked, required  List<OpenedSellerBody> latest, required this.openedInRange, required this.pending}): _latest = latest;
  factory _SellersSummaryBody.fromJson(Map<String, dynamic> json) => _$SellersSummaryBodyFromJson(json);

/// Sellers active now
@override final  int active;
/// Sellers blocked now
@override final  int blocked;
/// The five sellers opened last, newest first, whenever that was
 final  List<OpenedSellerBody> _latest;
/// The five sellers opened last, newest first, whenever that was
@override List<OpenedSellerBody> get latest {
  if (_latest is EqualUnmodifiableListView) return _latest;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_latest);
}

/// Sellers opened in the range, whatever their status
@override final  int openedInRange;
/// Sellers pending now
@override final  int pending;

/// Create a copy of SellersSummaryBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$SellersSummaryBodyCopyWith<_SellersSummaryBody> get copyWith => __$SellersSummaryBodyCopyWithImpl<_SellersSummaryBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$SellersSummaryBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _SellersSummaryBody&&(identical(other.active, active) || other.active == active)&&(identical(other.blocked, blocked) || other.blocked == blocked)&&const DeepCollectionEquality().equals(other.latest, _latest)&&(identical(other.openedInRange, openedInRange) || other.openedInRange == openedInRange)&&(identical(other.pending, pending) || other.pending == pending));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,active,blocked,const DeepCollectionEquality().hash(_latest),openedInRange,pending);
}

@override
String toString() {
    return 'SellersSummaryBody(active: $active, blocked: $blocked, latest: $latest, openedInRange: $openedInRange, pending: $pending)';
}


}

/// @nodoc
abstract mixin class _$SellersSummaryBodyCopyWith<$Res> implements $SellersSummaryBodyCopyWith<$Res> {
  factory _$SellersSummaryBodyCopyWith(_SellersSummaryBody value, $Res Function(_SellersSummaryBody) _then) = __$SellersSummaryBodyCopyWithImpl;
@override @useResult
$Res call({
 int active, int blocked, List<OpenedSellerBody> latest, int openedInRange, int pending
});




}
/// @nodoc
class __$SellersSummaryBodyCopyWithImpl<$Res>
    implements _$SellersSummaryBodyCopyWith<$Res> {
  __$SellersSummaryBodyCopyWithImpl(this._self, this._then);

  final _SellersSummaryBody _self;
  final $Res Function(_SellersSummaryBody) _then;

/// Create a copy of SellersSummaryBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? active = null,Object? blocked = null,Object? latest = null,Object? openedInRange = null,Object? pending = null,}) {
  return _then(_SellersSummaryBody(
active: null == active ? _self.active : active // ignore: cast_nullable_to_non_nullable
as int,blocked: null == blocked ? _self.blocked : blocked // ignore: cast_nullable_to_non_nullable
as int,latest: null == latest ? _self._latest : latest // ignore: cast_nullable_to_non_nullable
as List<OpenedSellerBody>,openedInRange: null == openedInRange ? _self.openedInRange : openedInRange // ignore: cast_nullable_to_non_nullable
as int,pending: null == pending ? _self.pending : pending // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
