// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'admin_accounts_output_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$AdminAccountsOutputBody {

/// How many accounts of each role match the words, whatever the role asked
 RoleCountsBody get counts; List<RecordBody>? get items; int get page; int get pageSize;/// How many accounts match the role and the words
 int get total;
/// Create a copy of AdminAccountsOutputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AdminAccountsOutputBodyCopyWith<AdminAccountsOutputBody> get copyWith => _$AdminAccountsOutputBodyCopyWithImpl<AdminAccountsOutputBody>(this as AdminAccountsOutputBody, _$identity);

  /// Serializes this AdminAccountsOutputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as AdminAccountsOutputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AdminAccountsOutputBody&&(identical(other.counts, _this.counts) || other.counts == _this.counts)&&const DeepCollectionEquality().equals(other.items, _this.items)&&(identical(other.page, _this.page) || other.page == _this.page)&&(identical(other.pageSize, _this.pageSize) || other.pageSize == _this.pageSize)&&(identical(other.total, _this.total) || other.total == _this.total));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as AdminAccountsOutputBody;
  return Object.hash(runtimeType,_this.counts,const DeepCollectionEquality().hash(_this.items),_this.page,_this.pageSize,_this.total);
}

@override
String toString() {
  final _this = this as AdminAccountsOutputBody;
  return 'AdminAccountsOutputBody(counts: ${_this.counts}, items: ${_this.items}, page: ${_this.page}, pageSize: ${_this.pageSize}, total: ${_this.total})';
}


}

/// @nodoc
abstract mixin class $AdminAccountsOutputBodyCopyWith<$Res>  {
  factory $AdminAccountsOutputBodyCopyWith(AdminAccountsOutputBody value, $Res Function(AdminAccountsOutputBody) _then) = _$AdminAccountsOutputBodyCopyWithImpl;
@useResult
$Res call({
 RoleCountsBody counts, List<RecordBody>? items, int page, int pageSize, int total
});


$RoleCountsBodyCopyWith<$Res> get counts;

}
/// @nodoc
class _$AdminAccountsOutputBodyCopyWithImpl<$Res>
    implements $AdminAccountsOutputBodyCopyWith<$Res> {
  _$AdminAccountsOutputBodyCopyWithImpl(this._self, this._then);

  final AdminAccountsOutputBody _self;
  final $Res Function(AdminAccountsOutputBody) _then;

/// Create a copy of AdminAccountsOutputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? counts = null,Object? items = freezed,Object? page = null,Object? pageSize = null,Object? total = null,}) {
  return _then(AdminAccountsOutputBody(
counts: null == counts ? _self.counts : counts // ignore: cast_nullable_to_non_nullable
as RoleCountsBody,items: freezed == items ? _self.items : items // ignore: cast_nullable_to_non_nullable
as List<RecordBody>?,page: null == page ? _self.page : page // ignore: cast_nullable_to_non_nullable
as int,pageSize: null == pageSize ? _self.pageSize : pageSize // ignore: cast_nullable_to_non_nullable
as int,total: null == total ? _self.total : total // ignore: cast_nullable_to_non_nullable
as int,
  ));
}
/// Create a copy of AdminAccountsOutputBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$RoleCountsBodyCopyWith<$Res> get counts {
  
  return $RoleCountsBodyCopyWith<$Res>(_self.counts, (value) {
    return _then(_self.copyWith(counts: value));
  });
}
}


/// Adds pattern-matching-related methods to [AdminAccountsOutputBody].
extension AdminAccountsOutputBodyPatterns on AdminAccountsOutputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AdminAccountsOutputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AdminAccountsOutputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AdminAccountsOutputBody value)  $default,){
final _that = this;
switch (_that) {
case _AdminAccountsOutputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AdminAccountsOutputBody value)?  $default,){
final _that = this;
switch (_that) {
case _AdminAccountsOutputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( RoleCountsBody counts,  List<RecordBody>? items,  int page,  int pageSize,  int total)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AdminAccountsOutputBody() when $default != null:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( RoleCountsBody counts,  List<RecordBody>? items,  int page,  int pageSize,  int total)  $default,) {final _that = this;
switch (_that) {
case _AdminAccountsOutputBody():
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( RoleCountsBody counts,  List<RecordBody>? items,  int page,  int pageSize,  int total)?  $default,) {final _that = this;
switch (_that) {
case _AdminAccountsOutputBody() when $default != null:
return $default(_that.counts,_that.items,_that.page,_that.pageSize,_that.total);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _AdminAccountsOutputBody implements AdminAccountsOutputBody {
  const _AdminAccountsOutputBody({required this.counts, required  List<RecordBody>? items, required this.page, required this.pageSize, required this.total}): _items = items;
  factory _AdminAccountsOutputBody.fromJson(Map<String, dynamic> json) => _$AdminAccountsOutputBodyFromJson(json);

/// How many accounts of each role match the words, whatever the role asked
@override final  RoleCountsBody counts;
 final  List<RecordBody>? _items;
@override List<RecordBody>? get items {
  final value = _items;
  if (value == null) return null;
  if (_items is EqualUnmodifiableListView) return _items;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(value);
}

@override final  int page;
@override final  int pageSize;
/// How many accounts match the role and the words
@override final  int total;

/// Create a copy of AdminAccountsOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AdminAccountsOutputBodyCopyWith<_AdminAccountsOutputBody> get copyWith => __$AdminAccountsOutputBodyCopyWithImpl<_AdminAccountsOutputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AdminAccountsOutputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _AdminAccountsOutputBody&&(identical(other.counts, counts) || other.counts == counts)&&const DeepCollectionEquality().equals(other.items, _items)&&(identical(other.page, page) || other.page == page)&&(identical(other.pageSize, pageSize) || other.pageSize == pageSize)&&(identical(other.total, total) || other.total == total));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,counts,const DeepCollectionEquality().hash(_items),page,pageSize,total);
}

@override
String toString() {
    return 'AdminAccountsOutputBody(counts: $counts, items: $items, page: $page, pageSize: $pageSize, total: $total)';
}


}

/// @nodoc
abstract mixin class _$AdminAccountsOutputBodyCopyWith<$Res> implements $AdminAccountsOutputBodyCopyWith<$Res> {
  factory _$AdminAccountsOutputBodyCopyWith(_AdminAccountsOutputBody value, $Res Function(_AdminAccountsOutputBody) _then) = __$AdminAccountsOutputBodyCopyWithImpl;
@override @useResult
$Res call({
 RoleCountsBody counts, List<RecordBody>? items, int page, int pageSize, int total
});


@override $RoleCountsBodyCopyWith<$Res> get counts;

}
/// @nodoc
class __$AdminAccountsOutputBodyCopyWithImpl<$Res>
    implements _$AdminAccountsOutputBodyCopyWith<$Res> {
  __$AdminAccountsOutputBodyCopyWithImpl(this._self, this._then);

  final _AdminAccountsOutputBody _self;
  final $Res Function(_AdminAccountsOutputBody) _then;

/// Create a copy of AdminAccountsOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? counts = null,Object? items = freezed,Object? page = null,Object? pageSize = null,Object? total = null,}) {
  return _then(_AdminAccountsOutputBody(
counts: null == counts ? _self.counts : counts // ignore: cast_nullable_to_non_nullable
as RoleCountsBody,items: freezed == items ? _self._items : items // ignore: cast_nullable_to_non_nullable
as List<RecordBody>?,page: null == page ? _self.page : page // ignore: cast_nullable_to_non_nullable
as int,pageSize: null == pageSize ? _self.pageSize : pageSize // ignore: cast_nullable_to_non_nullable
as int,total: null == total ? _self.total : total // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

/// Create a copy of AdminAccountsOutputBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$RoleCountsBodyCopyWith<$Res> get counts {
  
  return $RoleCountsBodyCopyWith<$Res>(_self.counts, (value) {
    return _then(_self.copyWith(counts: value));
  });
}
}

// dart format on
