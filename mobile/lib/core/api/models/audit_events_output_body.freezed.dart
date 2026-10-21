// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'audit_events_output_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$AuditEventsOutputBody {

 List<AuditEventBody>? get items; int get page; int get pageSize; int get total;
/// Create a copy of AuditEventsOutputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AuditEventsOutputBodyCopyWith<AuditEventsOutputBody> get copyWith => _$AuditEventsOutputBodyCopyWithImpl<AuditEventsOutputBody>(this as AuditEventsOutputBody, _$identity);

  /// Serializes this AuditEventsOutputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as AuditEventsOutputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AuditEventsOutputBody&&const DeepCollectionEquality().equals(other.items, _this.items)&&(identical(other.page, _this.page) || other.page == _this.page)&&(identical(other.pageSize, _this.pageSize) || other.pageSize == _this.pageSize)&&(identical(other.total, _this.total) || other.total == _this.total));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as AuditEventsOutputBody;
  return Object.hash(runtimeType,const DeepCollectionEquality().hash(_this.items),_this.page,_this.pageSize,_this.total);
}

@override
String toString() {
  final _this = this as AuditEventsOutputBody;
  return 'AuditEventsOutputBody(items: ${_this.items}, page: ${_this.page}, pageSize: ${_this.pageSize}, total: ${_this.total})';
}


}

/// @nodoc
abstract mixin class $AuditEventsOutputBodyCopyWith<$Res>  {
  factory $AuditEventsOutputBodyCopyWith(AuditEventsOutputBody value, $Res Function(AuditEventsOutputBody) _then) = _$AuditEventsOutputBodyCopyWithImpl;
@useResult
$Res call({
 List<AuditEventBody>? items, int page, int pageSize, int total
});




}
/// @nodoc
class _$AuditEventsOutputBodyCopyWithImpl<$Res>
    implements $AuditEventsOutputBodyCopyWith<$Res> {
  _$AuditEventsOutputBodyCopyWithImpl(this._self, this._then);

  final AuditEventsOutputBody _self;
  final $Res Function(AuditEventsOutputBody) _then;

/// Create a copy of AuditEventsOutputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? items = freezed,Object? page = null,Object? pageSize = null,Object? total = null,}) {
  return _then(AuditEventsOutputBody(
items: freezed == items ? _self.items : items // ignore: cast_nullable_to_non_nullable
as List<AuditEventBody>?,page: null == page ? _self.page : page // ignore: cast_nullable_to_non_nullable
as int,pageSize: null == pageSize ? _self.pageSize : pageSize // ignore: cast_nullable_to_non_nullable
as int,total: null == total ? _self.total : total // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [AuditEventsOutputBody].
extension AuditEventsOutputBodyPatterns on AuditEventsOutputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AuditEventsOutputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AuditEventsOutputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AuditEventsOutputBody value)  $default,){
final _that = this;
switch (_that) {
case _AuditEventsOutputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AuditEventsOutputBody value)?  $default,){
final _that = this;
switch (_that) {
case _AuditEventsOutputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( List<AuditEventBody>? items,  int page,  int pageSize,  int total)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AuditEventsOutputBody() when $default != null:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( List<AuditEventBody>? items,  int page,  int pageSize,  int total)  $default,) {final _that = this;
switch (_that) {
case _AuditEventsOutputBody():
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( List<AuditEventBody>? items,  int page,  int pageSize,  int total)?  $default,) {final _that = this;
switch (_that) {
case _AuditEventsOutputBody() when $default != null:
return $default(_that.items,_that.page,_that.pageSize,_that.total);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _AuditEventsOutputBody implements AuditEventsOutputBody {
  const _AuditEventsOutputBody({required  List<AuditEventBody>? items, required this.page, required this.pageSize, required this.total}): _items = items;
  factory _AuditEventsOutputBody.fromJson(Map<String, dynamic> json) => _$AuditEventsOutputBodyFromJson(json);

 final  List<AuditEventBody>? _items;
@override List<AuditEventBody>? get items {
  final value = _items;
  if (value == null) return null;
  if (_items is EqualUnmodifiableListView) return _items;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(value);
}

@override final  int page;
@override final  int pageSize;
@override final  int total;

/// Create a copy of AuditEventsOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AuditEventsOutputBodyCopyWith<_AuditEventsOutputBody> get copyWith => __$AuditEventsOutputBodyCopyWithImpl<_AuditEventsOutputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AuditEventsOutputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _AuditEventsOutputBody&&const DeepCollectionEquality().equals(other.items, _items)&&(identical(other.page, page) || other.page == page)&&(identical(other.pageSize, pageSize) || other.pageSize == pageSize)&&(identical(other.total, total) || other.total == total));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,const DeepCollectionEquality().hash(_items),page,pageSize,total);
}

@override
String toString() {
    return 'AuditEventsOutputBody(items: $items, page: $page, pageSize: $pageSize, total: $total)';
}


}

/// @nodoc
abstract mixin class _$AuditEventsOutputBodyCopyWith<$Res> implements $AuditEventsOutputBodyCopyWith<$Res> {
  factory _$AuditEventsOutputBodyCopyWith(_AuditEventsOutputBody value, $Res Function(_AuditEventsOutputBody) _then) = __$AuditEventsOutputBodyCopyWithImpl;
@override @useResult
$Res call({
 List<AuditEventBody>? items, int page, int pageSize, int total
});




}
/// @nodoc
class __$AuditEventsOutputBodyCopyWithImpl<$Res>
    implements _$AuditEventsOutputBodyCopyWith<$Res> {
  __$AuditEventsOutputBodyCopyWithImpl(this._self, this._then);

  final _AuditEventsOutputBody _self;
  final $Res Function(_AuditEventsOutputBody) _then;

/// Create a copy of AuditEventsOutputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? items = freezed,Object? page = null,Object? pageSize = null,Object? total = null,}) {
  return _then(_AuditEventsOutputBody(
items: freezed == items ? _self._items : items // ignore: cast_nullable_to_non_nullable
as List<AuditEventBody>?,page: null == page ? _self.page : page // ignore: cast_nullable_to_non_nullable
as int,pageSize: null == pageSize ? _self.pageSize : pageSize // ignore: cast_nullable_to_non_nullable
as int,total: null == total ? _self.total : total // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
