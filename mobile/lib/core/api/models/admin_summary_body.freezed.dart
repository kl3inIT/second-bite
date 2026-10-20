// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'admin_summary_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$AdminSummaryBody {

 AccountsSummaryBody get accounts;/// The range's first day in Vietnam time
 DateTime get from; OffersSummaryBody get offers; SellersSummaryBody get sellers;/// The range's last day in Vietnam time, included
 DateTime get to;
/// Create a copy of AdminSummaryBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AdminSummaryBodyCopyWith<AdminSummaryBody> get copyWith => _$AdminSummaryBodyCopyWithImpl<AdminSummaryBody>(this as AdminSummaryBody, _$identity);

  /// Serializes this AdminSummaryBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as AdminSummaryBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AdminSummaryBody&&(identical(other.accounts, _this.accounts) || other.accounts == _this.accounts)&&(identical(other.from, _this.from) || other.from == _this.from)&&(identical(other.offers, _this.offers) || other.offers == _this.offers)&&(identical(other.sellers, _this.sellers) || other.sellers == _this.sellers)&&(identical(other.to, _this.to) || other.to == _this.to));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as AdminSummaryBody;
  return Object.hash(runtimeType,_this.accounts,_this.from,_this.offers,_this.sellers,_this.to);
}

@override
String toString() {
  final _this = this as AdminSummaryBody;
  return 'AdminSummaryBody(accounts: ${_this.accounts}, from: ${_this.from}, offers: ${_this.offers}, sellers: ${_this.sellers}, to: ${_this.to})';
}


}

/// @nodoc
abstract mixin class $AdminSummaryBodyCopyWith<$Res>  {
  factory $AdminSummaryBodyCopyWith(AdminSummaryBody value, $Res Function(AdminSummaryBody) _then) = _$AdminSummaryBodyCopyWithImpl;
@useResult
$Res call({
 AccountsSummaryBody accounts, DateTime from, OffersSummaryBody offers, SellersSummaryBody sellers, DateTime to
});


$AccountsSummaryBodyCopyWith<$Res> get accounts;$OffersSummaryBodyCopyWith<$Res> get offers;$SellersSummaryBodyCopyWith<$Res> get sellers;

}
/// @nodoc
class _$AdminSummaryBodyCopyWithImpl<$Res>
    implements $AdminSummaryBodyCopyWith<$Res> {
  _$AdminSummaryBodyCopyWithImpl(this._self, this._then);

  final AdminSummaryBody _self;
  final $Res Function(AdminSummaryBody) _then;

/// Create a copy of AdminSummaryBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? accounts = null,Object? from = null,Object? offers = null,Object? sellers = null,Object? to = null,}) {
  return _then(AdminSummaryBody(
accounts: null == accounts ? _self.accounts : accounts // ignore: cast_nullable_to_non_nullable
as AccountsSummaryBody,from: null == from ? _self.from : from // ignore: cast_nullable_to_non_nullable
as DateTime,offers: null == offers ? _self.offers : offers // ignore: cast_nullable_to_non_nullable
as OffersSummaryBody,sellers: null == sellers ? _self.sellers : sellers // ignore: cast_nullable_to_non_nullable
as SellersSummaryBody,to: null == to ? _self.to : to // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}
/// Create a copy of AdminSummaryBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$AccountsSummaryBodyCopyWith<$Res> get accounts {
  
  return $AccountsSummaryBodyCopyWith<$Res>(_self.accounts, (value) {
    return _then(_self.copyWith(accounts: value));
  });
}/// Create a copy of AdminSummaryBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$OffersSummaryBodyCopyWith<$Res> get offers {
  
  return $OffersSummaryBodyCopyWith<$Res>(_self.offers, (value) {
    return _then(_self.copyWith(offers: value));
  });
}/// Create a copy of AdminSummaryBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$SellersSummaryBodyCopyWith<$Res> get sellers {
  
  return $SellersSummaryBodyCopyWith<$Res>(_self.sellers, (value) {
    return _then(_self.copyWith(sellers: value));
  });
}
}


/// Adds pattern-matching-related methods to [AdminSummaryBody].
extension AdminSummaryBodyPatterns on AdminSummaryBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AdminSummaryBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AdminSummaryBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AdminSummaryBody value)  $default,){
final _that = this;
switch (_that) {
case _AdminSummaryBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AdminSummaryBody value)?  $default,){
final _that = this;
switch (_that) {
case _AdminSummaryBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( AccountsSummaryBody accounts,  DateTime from,  OffersSummaryBody offers,  SellersSummaryBody sellers,  DateTime to)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AdminSummaryBody() when $default != null:
return $default(_that.accounts,_that.from,_that.offers,_that.sellers,_that.to);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( AccountsSummaryBody accounts,  DateTime from,  OffersSummaryBody offers,  SellersSummaryBody sellers,  DateTime to)  $default,) {final _that = this;
switch (_that) {
case _AdminSummaryBody():
return $default(_that.accounts,_that.from,_that.offers,_that.sellers,_that.to);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( AccountsSummaryBody accounts,  DateTime from,  OffersSummaryBody offers,  SellersSummaryBody sellers,  DateTime to)?  $default,) {final _that = this;
switch (_that) {
case _AdminSummaryBody() when $default != null:
return $default(_that.accounts,_that.from,_that.offers,_that.sellers,_that.to);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _AdminSummaryBody implements AdminSummaryBody {
  const _AdminSummaryBody({required this.accounts, required this.from, required this.offers, required this.sellers, required this.to});
  factory _AdminSummaryBody.fromJson(Map<String, dynamic> json) => _$AdminSummaryBodyFromJson(json);

@override final  AccountsSummaryBody accounts;
/// The range's first day in Vietnam time
@override final  DateTime from;
@override final  OffersSummaryBody offers;
@override final  SellersSummaryBody sellers;
/// The range's last day in Vietnam time, included
@override final  DateTime to;

/// Create a copy of AdminSummaryBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AdminSummaryBodyCopyWith<_AdminSummaryBody> get copyWith => __$AdminSummaryBodyCopyWithImpl<_AdminSummaryBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AdminSummaryBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _AdminSummaryBody&&(identical(other.accounts, accounts) || other.accounts == accounts)&&(identical(other.from, from) || other.from == from)&&(identical(other.offers, offers) || other.offers == offers)&&(identical(other.sellers, sellers) || other.sellers == sellers)&&(identical(other.to, to) || other.to == to));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,accounts,from,offers,sellers,to);
}

@override
String toString() {
    return 'AdminSummaryBody(accounts: $accounts, from: $from, offers: $offers, sellers: $sellers, to: $to)';
}


}

/// @nodoc
abstract mixin class _$AdminSummaryBodyCopyWith<$Res> implements $AdminSummaryBodyCopyWith<$Res> {
  factory _$AdminSummaryBodyCopyWith(_AdminSummaryBody value, $Res Function(_AdminSummaryBody) _then) = __$AdminSummaryBodyCopyWithImpl;
@override @useResult
$Res call({
 AccountsSummaryBody accounts, DateTime from, OffersSummaryBody offers, SellersSummaryBody sellers, DateTime to
});


@override $AccountsSummaryBodyCopyWith<$Res> get accounts;@override $OffersSummaryBodyCopyWith<$Res> get offers;@override $SellersSummaryBodyCopyWith<$Res> get sellers;

}
/// @nodoc
class __$AdminSummaryBodyCopyWithImpl<$Res>
    implements _$AdminSummaryBodyCopyWith<$Res> {
  __$AdminSummaryBodyCopyWithImpl(this._self, this._then);

  final _AdminSummaryBody _self;
  final $Res Function(_AdminSummaryBody) _then;

/// Create a copy of AdminSummaryBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? accounts = null,Object? from = null,Object? offers = null,Object? sellers = null,Object? to = null,}) {
  return _then(_AdminSummaryBody(
accounts: null == accounts ? _self.accounts : accounts // ignore: cast_nullable_to_non_nullable
as AccountsSummaryBody,from: null == from ? _self.from : from // ignore: cast_nullable_to_non_nullable
as DateTime,offers: null == offers ? _self.offers : offers // ignore: cast_nullable_to_non_nullable
as OffersSummaryBody,sellers: null == sellers ? _self.sellers : sellers // ignore: cast_nullable_to_non_nullable
as SellersSummaryBody,to: null == to ? _self.to : to // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}

/// Create a copy of AdminSummaryBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$AccountsSummaryBodyCopyWith<$Res> get accounts {
  
  return $AccountsSummaryBodyCopyWith<$Res>(_self.accounts, (value) {
    return _then(_self.copyWith(accounts: value));
  });
}/// Create a copy of AdminSummaryBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$OffersSummaryBodyCopyWith<$Res> get offers {
  
  return $OffersSummaryBodyCopyWith<$Res>(_self.offers, (value) {
    return _then(_self.copyWith(offers: value));
  });
}/// Create a copy of AdminSummaryBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$SellersSummaryBodyCopyWith<$Res> get sellers {
  
  return $SellersSummaryBodyCopyWith<$Res>(_self.sellers, (value) {
    return _then(_self.copyWith(sellers: value));
  });
}
}

// dart format on
