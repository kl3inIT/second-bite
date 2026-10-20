// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'accounts_summary_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$AccountsSummaryBody {

/// Accounts created in the range that still exist
 int get newInRange;/// Accounts created on every day of the range, in order
 List<DayCountBody> get newPerDay;/// Every account now, admins included
 int get total;
/// Create a copy of AccountsSummaryBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AccountsSummaryBodyCopyWith<AccountsSummaryBody> get copyWith => _$AccountsSummaryBodyCopyWithImpl<AccountsSummaryBody>(this as AccountsSummaryBody, _$identity);

  /// Serializes this AccountsSummaryBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as AccountsSummaryBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AccountsSummaryBody&&(identical(other.newInRange, _this.newInRange) || other.newInRange == _this.newInRange)&&const DeepCollectionEquality().equals(other.newPerDay, _this.newPerDay)&&(identical(other.total, _this.total) || other.total == _this.total));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as AccountsSummaryBody;
  return Object.hash(runtimeType,_this.newInRange,const DeepCollectionEquality().hash(_this.newPerDay),_this.total);
}

@override
String toString() {
  final _this = this as AccountsSummaryBody;
  return 'AccountsSummaryBody(newInRange: ${_this.newInRange}, newPerDay: ${_this.newPerDay}, total: ${_this.total})';
}


}

/// @nodoc
abstract mixin class $AccountsSummaryBodyCopyWith<$Res>  {
  factory $AccountsSummaryBodyCopyWith(AccountsSummaryBody value, $Res Function(AccountsSummaryBody) _then) = _$AccountsSummaryBodyCopyWithImpl;
@useResult
$Res call({
 int newInRange, List<DayCountBody> newPerDay, int total
});




}
/// @nodoc
class _$AccountsSummaryBodyCopyWithImpl<$Res>
    implements $AccountsSummaryBodyCopyWith<$Res> {
  _$AccountsSummaryBodyCopyWithImpl(this._self, this._then);

  final AccountsSummaryBody _self;
  final $Res Function(AccountsSummaryBody) _then;

/// Create a copy of AccountsSummaryBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? newInRange = null,Object? newPerDay = null,Object? total = null,}) {
  return _then(AccountsSummaryBody(
newInRange: null == newInRange ? _self.newInRange : newInRange // ignore: cast_nullable_to_non_nullable
as int,newPerDay: null == newPerDay ? _self.newPerDay : newPerDay // ignore: cast_nullable_to_non_nullable
as List<DayCountBody>,total: null == total ? _self.total : total // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [AccountsSummaryBody].
extension AccountsSummaryBodyPatterns on AccountsSummaryBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AccountsSummaryBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AccountsSummaryBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AccountsSummaryBody value)  $default,){
final _that = this;
switch (_that) {
case _AccountsSummaryBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AccountsSummaryBody value)?  $default,){
final _that = this;
switch (_that) {
case _AccountsSummaryBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int newInRange,  List<DayCountBody> newPerDay,  int total)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AccountsSummaryBody() when $default != null:
return $default(_that.newInRange,_that.newPerDay,_that.total);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int newInRange,  List<DayCountBody> newPerDay,  int total)  $default,) {final _that = this;
switch (_that) {
case _AccountsSummaryBody():
return $default(_that.newInRange,_that.newPerDay,_that.total);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int newInRange,  List<DayCountBody> newPerDay,  int total)?  $default,) {final _that = this;
switch (_that) {
case _AccountsSummaryBody() when $default != null:
return $default(_that.newInRange,_that.newPerDay,_that.total);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _AccountsSummaryBody implements AccountsSummaryBody {
  const _AccountsSummaryBody({required this.newInRange, required  List<DayCountBody> newPerDay, required this.total}): _newPerDay = newPerDay;
  factory _AccountsSummaryBody.fromJson(Map<String, dynamic> json) => _$AccountsSummaryBodyFromJson(json);

/// Accounts created in the range that still exist
@override final  int newInRange;
/// Accounts created on every day of the range, in order
 final  List<DayCountBody> _newPerDay;
/// Accounts created on every day of the range, in order
@override List<DayCountBody> get newPerDay {
  if (_newPerDay is EqualUnmodifiableListView) return _newPerDay;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_newPerDay);
}

/// Every account now, admins included
@override final  int total;

/// Create a copy of AccountsSummaryBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AccountsSummaryBodyCopyWith<_AccountsSummaryBody> get copyWith => __$AccountsSummaryBodyCopyWithImpl<_AccountsSummaryBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AccountsSummaryBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _AccountsSummaryBody&&(identical(other.newInRange, newInRange) || other.newInRange == newInRange)&&const DeepCollectionEquality().equals(other.newPerDay, _newPerDay)&&(identical(other.total, total) || other.total == total));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,newInRange,const DeepCollectionEquality().hash(_newPerDay),total);
}

@override
String toString() {
    return 'AccountsSummaryBody(newInRange: $newInRange, newPerDay: $newPerDay, total: $total)';
}


}

/// @nodoc
abstract mixin class _$AccountsSummaryBodyCopyWith<$Res> implements $AccountsSummaryBodyCopyWith<$Res> {
  factory _$AccountsSummaryBodyCopyWith(_AccountsSummaryBody value, $Res Function(_AccountsSummaryBody) _then) = __$AccountsSummaryBodyCopyWithImpl;
@override @useResult
$Res call({
 int newInRange, List<DayCountBody> newPerDay, int total
});




}
/// @nodoc
class __$AccountsSummaryBodyCopyWithImpl<$Res>
    implements _$AccountsSummaryBodyCopyWith<$Res> {
  __$AccountsSummaryBodyCopyWithImpl(this._self, this._then);

  final _AccountsSummaryBody _self;
  final $Res Function(_AccountsSummaryBody) _then;

/// Create a copy of AccountsSummaryBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? newInRange = null,Object? newPerDay = null,Object? total = null,}) {
  return _then(_AccountsSummaryBody(
newInRange: null == newInRange ? _self.newInRange : newInRange // ignore: cast_nullable_to_non_nullable
as int,newPerDay: null == newPerDay ? _self._newPerDay : newPerDay // ignore: cast_nullable_to_non_nullable
as List<DayCountBody>,total: null == total ? _self.total : total // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
