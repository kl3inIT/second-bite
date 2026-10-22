// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'report_store_day_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$ReportStoreDayBody {

 CountsBody get counts; DateTime get day; String get name; String get sellerId;
/// Create a copy of ReportStoreDayBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ReportStoreDayBodyCopyWith<ReportStoreDayBody> get copyWith => _$ReportStoreDayBodyCopyWithImpl<ReportStoreDayBody>(this as ReportStoreDayBody, _$identity);

  /// Serializes this ReportStoreDayBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as ReportStoreDayBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ReportStoreDayBody&&(identical(other.counts, _this.counts) || other.counts == _this.counts)&&(identical(other.day, _this.day) || other.day == _this.day)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.sellerId, _this.sellerId) || other.sellerId == _this.sellerId));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as ReportStoreDayBody;
  return Object.hash(runtimeType,_this.counts,_this.day,_this.name,_this.sellerId);
}

@override
String toString() {
  final _this = this as ReportStoreDayBody;
  return 'ReportStoreDayBody(counts: ${_this.counts}, day: ${_this.day}, name: ${_this.name}, sellerId: ${_this.sellerId})';
}


}

/// @nodoc
abstract mixin class $ReportStoreDayBodyCopyWith<$Res>  {
  factory $ReportStoreDayBodyCopyWith(ReportStoreDayBody value, $Res Function(ReportStoreDayBody) _then) = _$ReportStoreDayBodyCopyWithImpl;
@useResult
$Res call({
 CountsBody counts, DateTime day, String name, String sellerId
});


$CountsBodyCopyWith<$Res> get counts;

}
/// @nodoc
class _$ReportStoreDayBodyCopyWithImpl<$Res>
    implements $ReportStoreDayBodyCopyWith<$Res> {
  _$ReportStoreDayBodyCopyWithImpl(this._self, this._then);

  final ReportStoreDayBody _self;
  final $Res Function(ReportStoreDayBody) _then;

/// Create a copy of ReportStoreDayBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? counts = null,Object? day = null,Object? name = null,Object? sellerId = null,}) {
  return _then(ReportStoreDayBody(
counts: null == counts ? _self.counts : counts // ignore: cast_nullable_to_non_nullable
as CountsBody,day: null == day ? _self.day : day // ignore: cast_nullable_to_non_nullable
as DateTime,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,sellerId: null == sellerId ? _self.sellerId : sellerId // ignore: cast_nullable_to_non_nullable
as String,
  ));
}
/// Create a copy of ReportStoreDayBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$CountsBodyCopyWith<$Res> get counts {
  
  return $CountsBodyCopyWith<$Res>(_self.counts, (value) {
    return _then(_self.copyWith(counts: value));
  });
}
}


/// Adds pattern-matching-related methods to [ReportStoreDayBody].
extension ReportStoreDayBodyPatterns on ReportStoreDayBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ReportStoreDayBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ReportStoreDayBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ReportStoreDayBody value)  $default,){
final _that = this;
switch (_that) {
case _ReportStoreDayBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ReportStoreDayBody value)?  $default,){
final _that = this;
switch (_that) {
case _ReportStoreDayBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( CountsBody counts,  DateTime day,  String name,  String sellerId)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ReportStoreDayBody() when $default != null:
return $default(_that.counts,_that.day,_that.name,_that.sellerId);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( CountsBody counts,  DateTime day,  String name,  String sellerId)  $default,) {final _that = this;
switch (_that) {
case _ReportStoreDayBody():
return $default(_that.counts,_that.day,_that.name,_that.sellerId);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( CountsBody counts,  DateTime day,  String name,  String sellerId)?  $default,) {final _that = this;
switch (_that) {
case _ReportStoreDayBody() when $default != null:
return $default(_that.counts,_that.day,_that.name,_that.sellerId);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ReportStoreDayBody implements ReportStoreDayBody {
  const _ReportStoreDayBody({required this.counts, required this.day, required this.name, required this.sellerId});
  factory _ReportStoreDayBody.fromJson(Map<String, dynamic> json) => _$ReportStoreDayBodyFromJson(json);

@override final  CountsBody counts;
@override final  DateTime day;
@override final  String name;
@override final  String sellerId;

/// Create a copy of ReportStoreDayBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ReportStoreDayBodyCopyWith<_ReportStoreDayBody> get copyWith => __$ReportStoreDayBodyCopyWithImpl<_ReportStoreDayBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ReportStoreDayBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _ReportStoreDayBody&&(identical(other.counts, counts) || other.counts == counts)&&(identical(other.day, day) || other.day == day)&&(identical(other.name, name) || other.name == name)&&(identical(other.sellerId, sellerId) || other.sellerId == sellerId));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,counts,day,name,sellerId);
}

@override
String toString() {
    return 'ReportStoreDayBody(counts: $counts, day: $day, name: $name, sellerId: $sellerId)';
}


}

/// @nodoc
abstract mixin class _$ReportStoreDayBodyCopyWith<$Res> implements $ReportStoreDayBodyCopyWith<$Res> {
  factory _$ReportStoreDayBodyCopyWith(_ReportStoreDayBody value, $Res Function(_ReportStoreDayBody) _then) = __$ReportStoreDayBodyCopyWithImpl;
@override @useResult
$Res call({
 CountsBody counts, DateTime day, String name, String sellerId
});


@override $CountsBodyCopyWith<$Res> get counts;

}
/// @nodoc
class __$ReportStoreDayBodyCopyWithImpl<$Res>
    implements _$ReportStoreDayBodyCopyWith<$Res> {
  __$ReportStoreDayBodyCopyWithImpl(this._self, this._then);

  final _ReportStoreDayBody _self;
  final $Res Function(_ReportStoreDayBody) _then;

/// Create a copy of ReportStoreDayBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? counts = null,Object? day = null,Object? name = null,Object? sellerId = null,}) {
  return _then(_ReportStoreDayBody(
counts: null == counts ? _self.counts : counts // ignore: cast_nullable_to_non_nullable
as CountsBody,day: null == day ? _self.day : day // ignore: cast_nullable_to_non_nullable
as DateTime,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,sellerId: null == sellerId ? _self.sellerId : sellerId // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

/// Create a copy of ReportStoreDayBody
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$CountsBodyCopyWith<$Res> get counts {
  
  return $CountsBodyCopyWith<$Res>(_self.counts, (value) {
    return _then(_self.copyWith(counts: value));
  });
}
}

// dart format on
