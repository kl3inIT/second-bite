// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'offer_counts_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$OfferCountsBody {

 int get closed; int get onSale; int get soldOut; int get withdrawn;
/// Create a copy of OfferCountsBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$OfferCountsBodyCopyWith<OfferCountsBody> get copyWith => _$OfferCountsBodyCopyWithImpl<OfferCountsBody>(this as OfferCountsBody, _$identity);

  /// Serializes this OfferCountsBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as OfferCountsBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is OfferCountsBody&&(identical(other.closed, _this.closed) || other.closed == _this.closed)&&(identical(other.onSale, _this.onSale) || other.onSale == _this.onSale)&&(identical(other.soldOut, _this.soldOut) || other.soldOut == _this.soldOut)&&(identical(other.withdrawn, _this.withdrawn) || other.withdrawn == _this.withdrawn));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as OfferCountsBody;
  return Object.hash(runtimeType,_this.closed,_this.onSale,_this.soldOut,_this.withdrawn);
}

@override
String toString() {
  final _this = this as OfferCountsBody;
  return 'OfferCountsBody(closed: ${_this.closed}, onSale: ${_this.onSale}, soldOut: ${_this.soldOut}, withdrawn: ${_this.withdrawn})';
}


}

/// @nodoc
abstract mixin class $OfferCountsBodyCopyWith<$Res>  {
  factory $OfferCountsBodyCopyWith(OfferCountsBody value, $Res Function(OfferCountsBody) _then) = _$OfferCountsBodyCopyWithImpl;
@useResult
$Res call({
 int closed, int onSale, int soldOut, int withdrawn
});




}
/// @nodoc
class _$OfferCountsBodyCopyWithImpl<$Res>
    implements $OfferCountsBodyCopyWith<$Res> {
  _$OfferCountsBodyCopyWithImpl(this._self, this._then);

  final OfferCountsBody _self;
  final $Res Function(OfferCountsBody) _then;

/// Create a copy of OfferCountsBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? closed = null,Object? onSale = null,Object? soldOut = null,Object? withdrawn = null,}) {
  return _then(OfferCountsBody(
closed: null == closed ? _self.closed : closed // ignore: cast_nullable_to_non_nullable
as int,onSale: null == onSale ? _self.onSale : onSale // ignore: cast_nullable_to_non_nullable
as int,soldOut: null == soldOut ? _self.soldOut : soldOut // ignore: cast_nullable_to_non_nullable
as int,withdrawn: null == withdrawn ? _self.withdrawn : withdrawn // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [OfferCountsBody].
extension OfferCountsBodyPatterns on OfferCountsBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _OfferCountsBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _OfferCountsBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _OfferCountsBody value)  $default,){
final _that = this;
switch (_that) {
case _OfferCountsBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _OfferCountsBody value)?  $default,){
final _that = this;
switch (_that) {
case _OfferCountsBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int closed,  int onSale,  int soldOut,  int withdrawn)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _OfferCountsBody() when $default != null:
return $default(_that.closed,_that.onSale,_that.soldOut,_that.withdrawn);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int closed,  int onSale,  int soldOut,  int withdrawn)  $default,) {final _that = this;
switch (_that) {
case _OfferCountsBody():
return $default(_that.closed,_that.onSale,_that.soldOut,_that.withdrawn);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int closed,  int onSale,  int soldOut,  int withdrawn)?  $default,) {final _that = this;
switch (_that) {
case _OfferCountsBody() when $default != null:
return $default(_that.closed,_that.onSale,_that.soldOut,_that.withdrawn);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _OfferCountsBody implements OfferCountsBody {
  const _OfferCountsBody({required this.closed, required this.onSale, required this.soldOut, required this.withdrawn});
  factory _OfferCountsBody.fromJson(Map<String, dynamic> json) => _$OfferCountsBodyFromJson(json);

@override final  int closed;
@override final  int onSale;
@override final  int soldOut;
@override final  int withdrawn;

/// Create a copy of OfferCountsBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$OfferCountsBodyCopyWith<_OfferCountsBody> get copyWith => __$OfferCountsBodyCopyWithImpl<_OfferCountsBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$OfferCountsBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _OfferCountsBody&&(identical(other.closed, closed) || other.closed == closed)&&(identical(other.onSale, onSale) || other.onSale == onSale)&&(identical(other.soldOut, soldOut) || other.soldOut == soldOut)&&(identical(other.withdrawn, withdrawn) || other.withdrawn == withdrawn));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,closed,onSale,soldOut,withdrawn);
}

@override
String toString() {
    return 'OfferCountsBody(closed: $closed, onSale: $onSale, soldOut: $soldOut, withdrawn: $withdrawn)';
}


}

/// @nodoc
abstract mixin class _$OfferCountsBodyCopyWith<$Res> implements $OfferCountsBodyCopyWith<$Res> {
  factory _$OfferCountsBodyCopyWith(_OfferCountsBody value, $Res Function(_OfferCountsBody) _then) = __$OfferCountsBodyCopyWithImpl;
@override @useResult
$Res call({
 int closed, int onSale, int soldOut, int withdrawn
});




}
/// @nodoc
class __$OfferCountsBodyCopyWithImpl<$Res>
    implements _$OfferCountsBodyCopyWith<$Res> {
  __$OfferCountsBodyCopyWithImpl(this._self, this._then);

  final _OfferCountsBody _self;
  final $Res Function(_OfferCountsBody) _then;

/// Create a copy of OfferCountsBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? closed = null,Object? onSale = null,Object? soldOut = null,Object? withdrawn = null,}) {
  return _then(_OfferCountsBody(
closed: null == closed ? _self.closed : closed // ignore: cast_nullable_to_non_nullable
as int,onSale: null == onSale ? _self.onSale : onSale // ignore: cast_nullable_to_non_nullable
as int,soldOut: null == soldOut ? _self.soldOut : soldOut // ignore: cast_nullable_to_non_nullable
as int,withdrawn: null == withdrawn ? _self.withdrawn : withdrawn // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
