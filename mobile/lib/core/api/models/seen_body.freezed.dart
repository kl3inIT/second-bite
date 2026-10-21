// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'seen_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$SeenBody {

/// The highest message the customer has read
 int get customer;/// The highest message the seller's people have read
 int get seller;
/// Create a copy of SeenBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$SeenBodyCopyWith<SeenBody> get copyWith => _$SeenBodyCopyWithImpl<SeenBody>(this as SeenBody, _$identity);

  /// Serializes this SeenBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as SeenBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is SeenBody&&(identical(other.customer, _this.customer) || other.customer == _this.customer)&&(identical(other.seller, _this.seller) || other.seller == _this.seller));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as SeenBody;
  return Object.hash(runtimeType,_this.customer,_this.seller);
}

@override
String toString() {
  final _this = this as SeenBody;
  return 'SeenBody(customer: ${_this.customer}, seller: ${_this.seller})';
}


}

/// @nodoc
abstract mixin class $SeenBodyCopyWith<$Res>  {
  factory $SeenBodyCopyWith(SeenBody value, $Res Function(SeenBody) _then) = _$SeenBodyCopyWithImpl;
@useResult
$Res call({
 int customer, int seller
});




}
/// @nodoc
class _$SeenBodyCopyWithImpl<$Res>
    implements $SeenBodyCopyWith<$Res> {
  _$SeenBodyCopyWithImpl(this._self, this._then);

  final SeenBody _self;
  final $Res Function(SeenBody) _then;

/// Create a copy of SeenBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? customer = null,Object? seller = null,}) {
  return _then(SeenBody(
customer: null == customer ? _self.customer : customer // ignore: cast_nullable_to_non_nullable
as int,seller: null == seller ? _self.seller : seller // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [SeenBody].
extension SeenBodyPatterns on SeenBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _SeenBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _SeenBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _SeenBody value)  $default,){
final _that = this;
switch (_that) {
case _SeenBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _SeenBody value)?  $default,){
final _that = this;
switch (_that) {
case _SeenBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int customer,  int seller)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _SeenBody() when $default != null:
return $default(_that.customer,_that.seller);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int customer,  int seller)  $default,) {final _that = this;
switch (_that) {
case _SeenBody():
return $default(_that.customer,_that.seller);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int customer,  int seller)?  $default,) {final _that = this;
switch (_that) {
case _SeenBody() when $default != null:
return $default(_that.customer,_that.seller);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _SeenBody implements SeenBody {
  const _SeenBody({required this.customer, required this.seller});
  factory _SeenBody.fromJson(Map<String, dynamic> json) => _$SeenBodyFromJson(json);

/// The highest message the customer has read
@override final  int customer;
/// The highest message the seller's people have read
@override final  int seller;

/// Create a copy of SeenBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$SeenBodyCopyWith<_SeenBody> get copyWith => __$SeenBodyCopyWithImpl<_SeenBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$SeenBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _SeenBody&&(identical(other.customer, customer) || other.customer == customer)&&(identical(other.seller, seller) || other.seller == seller));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,customer,seller);
}

@override
String toString() {
    return 'SeenBody(customer: $customer, seller: $seller)';
}


}

/// @nodoc
abstract mixin class _$SeenBodyCopyWith<$Res> implements $SeenBodyCopyWith<$Res> {
  factory _$SeenBodyCopyWith(_SeenBody value, $Res Function(_SeenBody) _then) = __$SeenBodyCopyWithImpl;
@override @useResult
$Res call({
 int customer, int seller
});




}
/// @nodoc
class __$SeenBodyCopyWithImpl<$Res>
    implements _$SeenBodyCopyWith<$Res> {
  __$SeenBodyCopyWithImpl(this._self, this._then);

  final _SeenBody _self;
  final $Res Function(_SeenBody) _then;

/// Create a copy of SeenBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? customer = null,Object? seller = null,}) {
  return _then(_SeenBody(
customer: null == customer ? _self.customer : customer // ignore: cast_nullable_to_non_nullable
as int,seller: null == seller ? _self.seller : seller // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
