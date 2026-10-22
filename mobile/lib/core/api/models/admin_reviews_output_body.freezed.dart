// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'admin_reviews_output_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$AdminReviewsOutputBody {

/// Reviews of each number of stars matching the other filters, whatever stars asks
 ReviewCountsBody get counts; List<AdminReviewBody> get items; int get page; int get pageSize; int get total;/// The mean stars of the shown reviews matching every filter; absent when none does
 double? get average;
/// Create a copy of AdminReviewsOutputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AdminReviewsOutputBodyCopyWith<AdminReviewsOutputBody> get copyWith => _$AdminReviewsOutputBodyCopyWithImpl<AdminReviewsOutputBody>(this as AdminReviewsOutputBody, _$identity);

  /// Serializes this AdminReviewsOutputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as AdminReviewsOutputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AdminReviewsOutputBody&&(identical(other.counts, _this.counts) || other.counts == _this.counts)&&const DeepCollectionEquality().equals(other.items, _this.items)&&(identical(other.page, _this.page) || other.page == _this.page)&&(identical(other.pageSize, _this.pageSize) || other.pageSize == _this.pageSize)&&(identical(other.total, _this.total) || other.total == _this.total)&&(identical(other.average, _this.average) || other.average == _this.average));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as AdminReviewsOutputBody;
  return Object.hash(runtimeType,_this.counts,const DeepCollectionEquality().hash(_this.items),_this.page,_this.pageSize,_this.total,_this.average);
}

@override
String toString() {
  final _this = this as AdminReviewsOutputBody;
  return 'AdminReviewsOutputBody(counts: ${_this.counts}, items: ${_this.items}, page: ${_this.page}, pageSize: ${_this.pageSize}, total: ${_this.total}, average: ${_this.average})';
}


}

/// @nodoc
abstract mixin class $AdminReviewsOutputBodyCopyWith<$Res>  {
  factory $AdminReviewsOutputBodyCopyWith(AdminReviewsOutputBody value, $Res Function(AdminReviewsOutputBody) _then) = _$AdminReviewsOutputBodyCopyWithImpl;
@useResult
$Res call({
 ReviewCountsBody counts, List<AdminReviewBody> items, int page, int pageSize, int total, double? average
});


$ReviewCountsBodyCopyWith<$Res> get counts;

}
/// @nodoc
class _$AdminReviewsOutputBodyCopyWithImpl<$Res>
    implements $AdminReviewsOutputBodyCopyWith<$Res> {
  _$AdminReviewsOutputBodyCopyWithImpl(this._self, this._then);

  final AdminReviewsOutputBody _self;
  final $Res Function(AdminReviewsOutputBody) _then;

/// Create a copy of AdminReviewsOutputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? counts = null,Object? items = null,Object? page = null,Object? pageSize = null,Object? total = null,Object? average = freezed,}) {
  return _then(AdminReviewsOutputBody(
counts: null == counts ? _self.counts : counts // ignore: cast_nullable_to_non_nullable
as ReviewCountsBody,items: null == items ? _self.items : items // ignore: cast_nullable_to_non_nullable
as List<AdminReviewBody>,page: null == page ? _self.page : page // ignore: cast_nullable_to_non_nullable
as int,pageSize: null == pageSize ? _self.pageSize : pageSize // ignore: cast_nullable_to_non_nullable
as int,total: null == total ? _self.total : total // ignore: cast_nullable_to_non_nullable
as int,average: freezed == average ? _self.average : average // ignore: cast_nullable_to_non_nullable
as double?,
  ));
}
/// Create a copy of AdminReviewsOutputBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$ReviewCountsBodyCopyWith<$Res> get counts {
  
  return $ReviewCountsBodyCopyWith<$Res>(_self.counts, (value) {
    return _then(_self.copyWith(counts: value));
  });
}
}


/// Adds pattern-matching-related methods to [AdminReviewsOutputBody].
extension AdminReviewsOutputBodyPatterns on AdminReviewsOutputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AdminReviewsOutputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AdminReviewsOutputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AdminReviewsOutputBody value)  $default,){
final _that = this;
switch (_that) {
case _AdminReviewsOutputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AdminReviewsOutputBody value)?  $default,){
final _that = this;
switch (_that) {
case _AdminReviewsOutputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( ReviewCountsBody counts,  List<AdminReviewBody> items,  int page,  int pageSize,  int total,  double? average)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AdminReviewsOutputBody() when $default != null:
return $default(_that.counts,_that.items,_that.page,_that.pageSize,_that.total,_that.average);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( ReviewCountsBody counts,  List<AdminReviewBody> items,  int page,  int pageSize,  int total,  double? average)  $default,) {final _that = this;
switch (_that) {
case _AdminReviewsOutputBody():
return $default(_that.counts,_that.items,_that.page,_that.pageSize,_that.total,_that.average);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( ReviewCountsBody counts,  List<AdminReviewBody> items,  int page,  int pageSize,  int total,  double? average)?  $default,) {final _that = this;
switch (_that) {
case _AdminReviewsOutputBody() when $default != null:
return $default(_that.counts,_that.items,_that.page,_that.pageSize,_that.total,_that.average);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _AdminReviewsOutputBody implements AdminReviewsOutputBody {
  const _AdminReviewsOutputBody({required this.counts, required  List<AdminReviewBody> items, required this.page, required this.pageSize, required this.total, this.average}): _items = items;
  factory _AdminReviewsOutputBody.fromJson(Map<String, dynamic> json) => _$AdminReviewsOutputBodyFromJson(json);

/// Reviews of each number of stars matching the other filters, whatever stars asks
@override final  ReviewCountsBody counts;
 final  List<AdminReviewBody> _items;
@override List<AdminReviewBody> get items {
  if (_items is EqualUnmodifiableListView) return _items;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_items);
}

@override final  int page;
@override final  int pageSize;
@override final  int total;
/// The mean stars of the shown reviews matching every filter; absent when none does
@override final  double? average;

/// Create a copy of AdminReviewsOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AdminReviewsOutputBodyCopyWith<_AdminReviewsOutputBody> get copyWith => __$AdminReviewsOutputBodyCopyWithImpl<_AdminReviewsOutputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AdminReviewsOutputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _AdminReviewsOutputBody&&(identical(other.counts, counts) || other.counts == counts)&&const DeepCollectionEquality().equals(other.items, _items)&&(identical(other.page, page) || other.page == page)&&(identical(other.pageSize, pageSize) || other.pageSize == pageSize)&&(identical(other.total, total) || other.total == total)&&(identical(other.average, average) || other.average == average));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,counts,const DeepCollectionEquality().hash(_items),page,pageSize,total,average);
}

@override
String toString() {
    return 'AdminReviewsOutputBody(counts: $counts, items: $items, page: $page, pageSize: $pageSize, total: $total, average: $average)';
}


}

/// @nodoc
abstract mixin class _$AdminReviewsOutputBodyCopyWith<$Res> implements $AdminReviewsOutputBodyCopyWith<$Res> {
  factory _$AdminReviewsOutputBodyCopyWith(_AdminReviewsOutputBody value, $Res Function(_AdminReviewsOutputBody) _then) = __$AdminReviewsOutputBodyCopyWithImpl;
@override @useResult
$Res call({
 ReviewCountsBody counts, List<AdminReviewBody> items, int page, int pageSize, int total, double? average
});


@override $ReviewCountsBodyCopyWith<$Res> get counts;

}
/// @nodoc
class __$AdminReviewsOutputBodyCopyWithImpl<$Res>
    implements _$AdminReviewsOutputBodyCopyWith<$Res> {
  __$AdminReviewsOutputBodyCopyWithImpl(this._self, this._then);

  final _AdminReviewsOutputBody _self;
  final $Res Function(_AdminReviewsOutputBody) _then;

/// Create a copy of AdminReviewsOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? counts = null,Object? items = null,Object? page = null,Object? pageSize = null,Object? total = null,Object? average = freezed,}) {
  return _then(_AdminReviewsOutputBody(
counts: null == counts ? _self.counts : counts // ignore: cast_nullable_to_non_nullable
as ReviewCountsBody,items: null == items ? _self._items : items // ignore: cast_nullable_to_non_nullable
as List<AdminReviewBody>,page: null == page ? _self.page : page // ignore: cast_nullable_to_non_nullable
as int,pageSize: null == pageSize ? _self.pageSize : pageSize // ignore: cast_nullable_to_non_nullable
as int,total: null == total ? _self.total : total // ignore: cast_nullable_to_non_nullable
as int,average: freezed == average ? _self.average : average // ignore: cast_nullable_to_non_nullable
as double?,
  ));
}

/// Create a copy of AdminReviewsOutputBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$ReviewCountsBodyCopyWith<$Res> get counts {
  
  return $ReviewCountsBodyCopyWith<$Res>(_self.counts, (value) {
    return _then(_self.copyWith(counts: value));
  });
}
}

// dart format on
