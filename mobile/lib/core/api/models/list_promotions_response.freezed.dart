// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'list_promotions_response.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$ListPromotionsResponse {

 PromotionCountsBody get counts; List<PromotionBody> get items; int get page; int get pageSize; int get total;
/// Create a copy of ListPromotionsResponse
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ListPromotionsResponseCopyWith<ListPromotionsResponse> get copyWith => _$ListPromotionsResponseCopyWithImpl<ListPromotionsResponse>(this as ListPromotionsResponse, _$identity);

  /// Serializes this ListPromotionsResponse to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as ListPromotionsResponse;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ListPromotionsResponse&&(identical(other.counts, _this.counts) || other.counts == _this.counts)&&const DeepCollectionEquality().equals(other.items, _this.items)&&(identical(other.page, _this.page) || other.page == _this.page)&&(identical(other.pageSize, _this.pageSize) || other.pageSize == _this.pageSize)&&(identical(other.total, _this.total) || other.total == _this.total));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as ListPromotionsResponse;
  return Object.hash(runtimeType,_this.counts,const DeepCollectionEquality().hash(_this.items),_this.page,_this.pageSize,_this.total);
}

@override
String toString() {
  final _this = this as ListPromotionsResponse;
  return 'ListPromotionsResponse(counts: ${_this.counts}, items: ${_this.items}, page: ${_this.page}, pageSize: ${_this.pageSize}, total: ${_this.total})';
}


}

/// @nodoc
abstract mixin class $ListPromotionsResponseCopyWith<$Res>  {
  factory $ListPromotionsResponseCopyWith(ListPromotionsResponse value, $Res Function(ListPromotionsResponse) _then) = _$ListPromotionsResponseCopyWithImpl;
@useResult
$Res call({
 PromotionCountsBody counts, List<PromotionBody> items, int page, int pageSize, int total
});


$PromotionCountsBodyCopyWith<$Res> get counts;

}
/// @nodoc
class _$ListPromotionsResponseCopyWithImpl<$Res>
    implements $ListPromotionsResponseCopyWith<$Res> {
  _$ListPromotionsResponseCopyWithImpl(this._self, this._then);

  final ListPromotionsResponse _self;
  final $Res Function(ListPromotionsResponse) _then;

/// Create a copy of ListPromotionsResponse
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? counts = null,Object? items = null,Object? page = null,Object? pageSize = null,Object? total = null,}) {
  return _then(ListPromotionsResponse(
counts: null == counts ? _self.counts : counts // ignore: cast_nullable_to_non_nullable
as PromotionCountsBody,items: null == items ? _self.items : items // ignore: cast_nullable_to_non_nullable
as List<PromotionBody>,page: null == page ? _self.page : page // ignore: cast_nullable_to_non_nullable
as int,pageSize: null == pageSize ? _self.pageSize : pageSize // ignore: cast_nullable_to_non_nullable
as int,total: null == total ? _self.total : total // ignore: cast_nullable_to_non_nullable
as int,
  ));
}
/// Create a copy of ListPromotionsResponse
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$PromotionCountsBodyCopyWith<$Res> get counts {
  
  return $PromotionCountsBodyCopyWith<$Res>(_self.counts, (value) {
    return _then(_self.copyWith(counts: value));
  });
}
}


/// Adds pattern-matching-related methods to [ListPromotionsResponse].
extension ListPromotionsResponsePatterns on ListPromotionsResponse {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ListPromotionsResponse value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ListPromotionsResponse() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ListPromotionsResponse value)  $default,){
final _that = this;
switch (_that) {
case _ListPromotionsResponse():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ListPromotionsResponse value)?  $default,){
final _that = this;
switch (_that) {
case _ListPromotionsResponse() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( PromotionCountsBody counts,  List<PromotionBody> items,  int page,  int pageSize,  int total)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ListPromotionsResponse() when $default != null:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( PromotionCountsBody counts,  List<PromotionBody> items,  int page,  int pageSize,  int total)  $default,) {final _that = this;
switch (_that) {
case _ListPromotionsResponse():
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( PromotionCountsBody counts,  List<PromotionBody> items,  int page,  int pageSize,  int total)?  $default,) {final _that = this;
switch (_that) {
case _ListPromotionsResponse() when $default != null:
return $default(_that.counts,_that.items,_that.page,_that.pageSize,_that.total);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ListPromotionsResponse implements ListPromotionsResponse {
  const _ListPromotionsResponse({required this.counts, required  List<PromotionBody> items, required this.page, required this.pageSize, required this.total}): _items = items;
  factory _ListPromotionsResponse.fromJson(Map<String, dynamic> json) => _$ListPromotionsResponseFromJson(json);

@override final  PromotionCountsBody counts;
 final  List<PromotionBody> _items;
@override List<PromotionBody> get items {
  if (_items is EqualUnmodifiableListView) return _items;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_items);
}

@override final  int page;
@override final  int pageSize;
@override final  int total;

/// Create a copy of ListPromotionsResponse
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ListPromotionsResponseCopyWith<_ListPromotionsResponse> get copyWith => __$ListPromotionsResponseCopyWithImpl<_ListPromotionsResponse>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ListPromotionsResponseToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _ListPromotionsResponse&&(identical(other.counts, counts) || other.counts == counts)&&const DeepCollectionEquality().equals(other.items, _items)&&(identical(other.page, page) || other.page == page)&&(identical(other.pageSize, pageSize) || other.pageSize == pageSize)&&(identical(other.total, total) || other.total == total));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,counts,const DeepCollectionEquality().hash(_items),page,pageSize,total);
}

@override
String toString() {
    return 'ListPromotionsResponse(counts: $counts, items: $items, page: $page, pageSize: $pageSize, total: $total)';
}


}

/// @nodoc
abstract mixin class _$ListPromotionsResponseCopyWith<$Res> implements $ListPromotionsResponseCopyWith<$Res> {
  factory _$ListPromotionsResponseCopyWith(_ListPromotionsResponse value, $Res Function(_ListPromotionsResponse) _then) = __$ListPromotionsResponseCopyWithImpl;
@override @useResult
$Res call({
 PromotionCountsBody counts, List<PromotionBody> items, int page, int pageSize, int total
});


@override $PromotionCountsBodyCopyWith<$Res> get counts;

}
/// @nodoc
class __$ListPromotionsResponseCopyWithImpl<$Res>
    implements _$ListPromotionsResponseCopyWith<$Res> {
  __$ListPromotionsResponseCopyWithImpl(this._self, this._then);

  final _ListPromotionsResponse _self;
  final $Res Function(_ListPromotionsResponse) _then;

/// Create a copy of ListPromotionsResponse
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? counts = null,Object? items = null,Object? page = null,Object? pageSize = null,Object? total = null,}) {
  return _then(_ListPromotionsResponse(
counts: null == counts ? _self.counts : counts // ignore: cast_nullable_to_non_nullable
as PromotionCountsBody,items: null == items ? _self._items : items // ignore: cast_nullable_to_non_nullable
as List<PromotionBody>,page: null == page ? _self.page : page // ignore: cast_nullable_to_non_nullable
as int,pageSize: null == pageSize ? _self.pageSize : pageSize // ignore: cast_nullable_to_non_nullable
as int,total: null == total ? _self.total : total // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

/// Create a copy of ListPromotionsResponse
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$PromotionCountsBodyCopyWith<$Res> get counts {
  
  return $PromotionCountsBodyCopyWith<$Res>(_self.counts, (value) {
    return _then(_self.copyWith(counts: value));
  });
}
}

// dart format on
