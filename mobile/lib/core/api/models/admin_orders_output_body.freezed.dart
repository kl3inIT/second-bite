// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'admin_orders_output_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$AdminOrdersOutputBody {

/// Orders of each status matching the other filters, whatever status asks
 OrderCountsBody get counts; List<OrderBody> get items; int get page; int get pageSize; int get total;
/// Create a copy of AdminOrdersOutputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AdminOrdersOutputBodyCopyWith<AdminOrdersOutputBody> get copyWith => _$AdminOrdersOutputBodyCopyWithImpl<AdminOrdersOutputBody>(this as AdminOrdersOutputBody, _$identity);

  /// Serializes this AdminOrdersOutputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as AdminOrdersOutputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AdminOrdersOutputBody&&(identical(other.counts, _this.counts) || other.counts == _this.counts)&&const DeepCollectionEquality().equals(other.items, _this.items)&&(identical(other.page, _this.page) || other.page == _this.page)&&(identical(other.pageSize, _this.pageSize) || other.pageSize == _this.pageSize)&&(identical(other.total, _this.total) || other.total == _this.total));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as AdminOrdersOutputBody;
  return Object.hash(runtimeType,_this.counts,const DeepCollectionEquality().hash(_this.items),_this.page,_this.pageSize,_this.total);
}

@override
String toString() {
  final _this = this as AdminOrdersOutputBody;
  return 'AdminOrdersOutputBody(counts: ${_this.counts}, items: ${_this.items}, page: ${_this.page}, pageSize: ${_this.pageSize}, total: ${_this.total})';
}


}

/// @nodoc
abstract mixin class $AdminOrdersOutputBodyCopyWith<$Res>  {
  factory $AdminOrdersOutputBodyCopyWith(AdminOrdersOutputBody value, $Res Function(AdminOrdersOutputBody) _then) = _$AdminOrdersOutputBodyCopyWithImpl;
@useResult
$Res call({
 OrderCountsBody counts, List<OrderBody> items, int page, int pageSize, int total
});


$OrderCountsBodyCopyWith<$Res> get counts;

}
/// @nodoc
class _$AdminOrdersOutputBodyCopyWithImpl<$Res>
    implements $AdminOrdersOutputBodyCopyWith<$Res> {
  _$AdminOrdersOutputBodyCopyWithImpl(this._self, this._then);

  final AdminOrdersOutputBody _self;
  final $Res Function(AdminOrdersOutputBody) _then;

/// Create a copy of AdminOrdersOutputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? counts = null,Object? items = null,Object? page = null,Object? pageSize = null,Object? total = null,}) {
  return _then(AdminOrdersOutputBody(
counts: null == counts ? _self.counts : counts // ignore: cast_nullable_to_non_nullable
as OrderCountsBody,items: null == items ? _self.items : items // ignore: cast_nullable_to_non_nullable
as List<OrderBody>,page: null == page ? _self.page : page // ignore: cast_nullable_to_non_nullable
as int,pageSize: null == pageSize ? _self.pageSize : pageSize // ignore: cast_nullable_to_non_nullable
as int,total: null == total ? _self.total : total // ignore: cast_nullable_to_non_nullable
as int,
  ));
}
/// Create a copy of AdminOrdersOutputBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$OrderCountsBodyCopyWith<$Res> get counts {
  
  return $OrderCountsBodyCopyWith<$Res>(_self.counts, (value) {
    return _then(_self.copyWith(counts: value));
  });
}
}


/// Adds pattern-matching-related methods to [AdminOrdersOutputBody].
extension AdminOrdersOutputBodyPatterns on AdminOrdersOutputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AdminOrdersOutputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AdminOrdersOutputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AdminOrdersOutputBody value)  $default,){
final _that = this;
switch (_that) {
case _AdminOrdersOutputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AdminOrdersOutputBody value)?  $default,){
final _that = this;
switch (_that) {
case _AdminOrdersOutputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( OrderCountsBody counts,  List<OrderBody> items,  int page,  int pageSize,  int total)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AdminOrdersOutputBody() when $default != null:
return $default(_that.counts,_that.items,_that.page,_that.pageSize,_that.total);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( OrderCountsBody counts,  List<OrderBody> items,  int page,  int pageSize,  int total)  $default,) {final _that = this;
switch (_that) {
case _AdminOrdersOutputBody():
return $default(_that.counts,_that.items,_that.page,_that.pageSize,_that.total);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( OrderCountsBody counts,  List<OrderBody> items,  int page,  int pageSize,  int total)?  $default,) {final _that = this;
switch (_that) {
case _AdminOrdersOutputBody() when $default != null:
return $default(_that.counts,_that.items,_that.page,_that.pageSize,_that.total);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _AdminOrdersOutputBody implements AdminOrdersOutputBody {
  const _AdminOrdersOutputBody({required this.counts, required  List<OrderBody> items, required this.page, required this.pageSize, required this.total}): _items = items;
  factory _AdminOrdersOutputBody.fromJson(Map<String, dynamic> json) => _$AdminOrdersOutputBodyFromJson(json);

/// Orders of each status matching the other filters, whatever status asks
@override final  OrderCountsBody counts;
 final  List<OrderBody> _items;
@override List<OrderBody> get items {
  if (_items is EqualUnmodifiableListView) return _items;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_items);
}

@override final  int page;
@override final  int pageSize;
@override final  int total;

/// Create a copy of AdminOrdersOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AdminOrdersOutputBodyCopyWith<_AdminOrdersOutputBody> get copyWith => __$AdminOrdersOutputBodyCopyWithImpl<_AdminOrdersOutputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AdminOrdersOutputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _AdminOrdersOutputBody&&(identical(other.counts, counts) || other.counts == counts)&&const DeepCollectionEquality().equals(other.items, _items)&&(identical(other.page, page) || other.page == page)&&(identical(other.pageSize, pageSize) || other.pageSize == pageSize)&&(identical(other.total, total) || other.total == total));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,counts,const DeepCollectionEquality().hash(_items),page,pageSize,total);
}

@override
String toString() {
    return 'AdminOrdersOutputBody(counts: $counts, items: $items, page: $page, pageSize: $pageSize, total: $total)';
}


}

/// @nodoc
abstract mixin class _$AdminOrdersOutputBodyCopyWith<$Res> implements $AdminOrdersOutputBodyCopyWith<$Res> {
  factory _$AdminOrdersOutputBodyCopyWith(_AdminOrdersOutputBody value, $Res Function(_AdminOrdersOutputBody) _then) = __$AdminOrdersOutputBodyCopyWithImpl;
@override @useResult
$Res call({
 OrderCountsBody counts, List<OrderBody> items, int page, int pageSize, int total
});


@override $OrderCountsBodyCopyWith<$Res> get counts;

}
/// @nodoc
class __$AdminOrdersOutputBodyCopyWithImpl<$Res>
    implements _$AdminOrdersOutputBodyCopyWith<$Res> {
  __$AdminOrdersOutputBodyCopyWithImpl(this._self, this._then);

  final _AdminOrdersOutputBody _self;
  final $Res Function(_AdminOrdersOutputBody) _then;

/// Create a copy of AdminOrdersOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? counts = null,Object? items = null,Object? page = null,Object? pageSize = null,Object? total = null,}) {
  return _then(_AdminOrdersOutputBody(
counts: null == counts ? _self.counts : counts // ignore: cast_nullable_to_non_nullable
as OrderCountsBody,items: null == items ? _self._items : items // ignore: cast_nullable_to_non_nullable
as List<OrderBody>,page: null == page ? _self.page : page // ignore: cast_nullable_to_non_nullable
as int,pageSize: null == pageSize ? _self.pageSize : pageSize // ignore: cast_nullable_to_non_nullable
as int,total: null == total ? _self.total : total // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

/// Create a copy of AdminOrdersOutputBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$OrderCountsBodyCopyWith<$Res> get counts {
  
  return $OrderCountsBodyCopyWith<$Res>(_self.counts, (value) {
    return _then(_self.copyWith(counts: value));
  });
}
}

// dart format on
