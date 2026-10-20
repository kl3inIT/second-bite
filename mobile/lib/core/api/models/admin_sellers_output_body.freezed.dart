// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'admin_sellers_output_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$AdminSellersOutputBody {

 List<AdminSellerBody>? get items; int get page; int get pageSize; int get total;
/// Create a copy of AdminSellersOutputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AdminSellersOutputBodyCopyWith<AdminSellersOutputBody> get copyWith => _$AdminSellersOutputBodyCopyWithImpl<AdminSellersOutputBody>(this as AdminSellersOutputBody, _$identity);

  /// Serializes this AdminSellersOutputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as AdminSellersOutputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AdminSellersOutputBody&&const DeepCollectionEquality().equals(other.items, _this.items)&&(identical(other.page, _this.page) || other.page == _this.page)&&(identical(other.pageSize, _this.pageSize) || other.pageSize == _this.pageSize)&&(identical(other.total, _this.total) || other.total == _this.total));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as AdminSellersOutputBody;
  return Object.hash(runtimeType,const DeepCollectionEquality().hash(_this.items),_this.page,_this.pageSize,_this.total);
}

@override
String toString() {
  final _this = this as AdminSellersOutputBody;
  return 'AdminSellersOutputBody(items: ${_this.items}, page: ${_this.page}, pageSize: ${_this.pageSize}, total: ${_this.total})';
}


}

/// @nodoc
abstract mixin class $AdminSellersOutputBodyCopyWith<$Res>  {
  factory $AdminSellersOutputBodyCopyWith(AdminSellersOutputBody value, $Res Function(AdminSellersOutputBody) _then) = _$AdminSellersOutputBodyCopyWithImpl;
@useResult
$Res call({
 List<AdminSellerBody>? items, int page, int pageSize, int total
});




}
/// @nodoc
class _$AdminSellersOutputBodyCopyWithImpl<$Res>
    implements $AdminSellersOutputBodyCopyWith<$Res> {
  _$AdminSellersOutputBodyCopyWithImpl(this._self, this._then);

  final AdminSellersOutputBody _self;
  final $Res Function(AdminSellersOutputBody) _then;

/// Create a copy of AdminSellersOutputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? items = freezed,Object? page = null,Object? pageSize = null,Object? total = null,}) {
  return _then(AdminSellersOutputBody(
items: freezed == items ? _self.items : items // ignore: cast_nullable_to_non_nullable
as List<AdminSellerBody>?,page: null == page ? _self.page : page // ignore: cast_nullable_to_non_nullable
as int,pageSize: null == pageSize ? _self.pageSize : pageSize // ignore: cast_nullable_to_non_nullable
as int,total: null == total ? _self.total : total // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [AdminSellersOutputBody].
extension AdminSellersOutputBodyPatterns on AdminSellersOutputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AdminSellersOutputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AdminSellersOutputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AdminSellersOutputBody value)  $default,){
final _that = this;
switch (_that) {
case _AdminSellersOutputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AdminSellersOutputBody value)?  $default,){
final _that = this;
switch (_that) {
case _AdminSellersOutputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( List<AdminSellerBody>? items,  int page,  int pageSize,  int total)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AdminSellersOutputBody() when $default != null:
return $default(_that.items,_that.page,_that.pageSize,_that.total);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( List<AdminSellerBody>? items,  int page,  int pageSize,  int total)  $default,) {final _that = this;
switch (_that) {
case _AdminSellersOutputBody():
return $default(_that.items,_that.page,_that.pageSize,_that.total);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( List<AdminSellerBody>? items,  int page,  int pageSize,  int total)?  $default,) {final _that = this;
switch (_that) {
case _AdminSellersOutputBody() when $default != null:
return $default(_that.items,_that.page,_that.pageSize,_that.total);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _AdminSellersOutputBody implements AdminSellersOutputBody {
  const _AdminSellersOutputBody({required  List<AdminSellerBody>? items, required this.page, required this.pageSize, required this.total}): _items = items;
  factory _AdminSellersOutputBody.fromJson(Map<String, dynamic> json) => _$AdminSellersOutputBodyFromJson(json);

 final  List<AdminSellerBody>? _items;
@override List<AdminSellerBody>? get items {
  final value = _items;
  if (value == null) return null;
  if (_items is EqualUnmodifiableListView) return _items;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(value);
}

@override final  int page;
@override final  int pageSize;
@override final  int total;

/// Create a copy of AdminSellersOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AdminSellersOutputBodyCopyWith<_AdminSellersOutputBody> get copyWith => __$AdminSellersOutputBodyCopyWithImpl<_AdminSellersOutputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AdminSellersOutputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _AdminSellersOutputBody&&const DeepCollectionEquality().equals(other.items, _items)&&(identical(other.page, page) || other.page == page)&&(identical(other.pageSize, pageSize) || other.pageSize == pageSize)&&(identical(other.total, total) || other.total == total));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,const DeepCollectionEquality().hash(_items),page,pageSize,total);
}

@override
String toString() {
    return 'AdminSellersOutputBody(items: $items, page: $page, pageSize: $pageSize, total: $total)';
}


}

/// @nodoc
abstract mixin class _$AdminSellersOutputBodyCopyWith<$Res> implements $AdminSellersOutputBodyCopyWith<$Res> {
  factory _$AdminSellersOutputBodyCopyWith(_AdminSellersOutputBody value, $Res Function(_AdminSellersOutputBody) _then) = __$AdminSellersOutputBodyCopyWithImpl;
@override @useResult
$Res call({
 List<AdminSellerBody>? items, int page, int pageSize, int total
});




}
/// @nodoc
class __$AdminSellersOutputBodyCopyWithImpl<$Res>
    implements _$AdminSellersOutputBodyCopyWith<$Res> {
  __$AdminSellersOutputBodyCopyWithImpl(this._self, this._then);

  final _AdminSellersOutputBody _self;
  final $Res Function(_AdminSellersOutputBody) _then;

/// Create a copy of AdminSellersOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? items = freezed,Object? page = null,Object? pageSize = null,Object? total = null,}) {
  return _then(_AdminSellersOutputBody(
items: freezed == items ? _self._items : items // ignore: cast_nullable_to_non_nullable
as List<AdminSellerBody>?,page: null == page ? _self.page : page // ignore: cast_nullable_to_non_nullable
as int,pageSize: null == pageSize ? _self.pageSize : pageSize // ignore: cast_nullable_to_non_nullable
as int,total: null == total ? _self.total : total // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
