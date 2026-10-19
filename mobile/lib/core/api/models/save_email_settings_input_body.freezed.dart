// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'save_email_settings_input_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$SaveEmailSettingsInputBody {

 SaveEmailSettingsInputBodyProvider get provider; String get senderAddress; String get senderName;/// Empty keeps the stored key
 String? get brevoApiKey; String? get smtpHost;/// Empty keeps the stored password
 String? get smtpPassword; int? get smtpPort; SaveEmailSettingsInputBodySmtpSecurity? get smtpSecurity; String? get smtpUsername;
/// Create a copy of SaveEmailSettingsInputBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$SaveEmailSettingsInputBodyCopyWith<SaveEmailSettingsInputBody> get copyWith => _$SaveEmailSettingsInputBodyCopyWithImpl<SaveEmailSettingsInputBody>(this as SaveEmailSettingsInputBody, _$identity);

  /// Serializes this SaveEmailSettingsInputBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as SaveEmailSettingsInputBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is SaveEmailSettingsInputBody&&(identical(other.provider, _this.provider) || other.provider == _this.provider)&&(identical(other.senderAddress, _this.senderAddress) || other.senderAddress == _this.senderAddress)&&(identical(other.senderName, _this.senderName) || other.senderName == _this.senderName)&&(identical(other.brevoApiKey, _this.brevoApiKey) || other.brevoApiKey == _this.brevoApiKey)&&(identical(other.smtpHost, _this.smtpHost) || other.smtpHost == _this.smtpHost)&&(identical(other.smtpPassword, _this.smtpPassword) || other.smtpPassword == _this.smtpPassword)&&(identical(other.smtpPort, _this.smtpPort) || other.smtpPort == _this.smtpPort)&&(identical(other.smtpSecurity, _this.smtpSecurity) || other.smtpSecurity == _this.smtpSecurity)&&(identical(other.smtpUsername, _this.smtpUsername) || other.smtpUsername == _this.smtpUsername));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as SaveEmailSettingsInputBody;
  return Object.hash(runtimeType,_this.provider,_this.senderAddress,_this.senderName,_this.brevoApiKey,_this.smtpHost,_this.smtpPassword,_this.smtpPort,_this.smtpSecurity,_this.smtpUsername);
}

@override
String toString() {
  final _this = this as SaveEmailSettingsInputBody;
  return 'SaveEmailSettingsInputBody(provider: ${_this.provider}, senderAddress: ${_this.senderAddress}, senderName: ${_this.senderName}, brevoApiKey: ${_this.brevoApiKey}, smtpHost: ${_this.smtpHost}, smtpPassword: ${_this.smtpPassword}, smtpPort: ${_this.smtpPort}, smtpSecurity: ${_this.smtpSecurity}, smtpUsername: ${_this.smtpUsername})';
}


}

/// @nodoc
abstract mixin class $SaveEmailSettingsInputBodyCopyWith<$Res>  {
  factory $SaveEmailSettingsInputBodyCopyWith(SaveEmailSettingsInputBody value, $Res Function(SaveEmailSettingsInputBody) _then) = _$SaveEmailSettingsInputBodyCopyWithImpl;
@useResult
$Res call({
 SaveEmailSettingsInputBodyProvider provider, String senderAddress, String senderName, String? brevoApiKey, String? smtpHost, String? smtpPassword, int? smtpPort, SaveEmailSettingsInputBodySmtpSecurity? smtpSecurity, String? smtpUsername
});




}
/// @nodoc
class _$SaveEmailSettingsInputBodyCopyWithImpl<$Res>
    implements $SaveEmailSettingsInputBodyCopyWith<$Res> {
  _$SaveEmailSettingsInputBodyCopyWithImpl(this._self, this._then);

  final SaveEmailSettingsInputBody _self;
  final $Res Function(SaveEmailSettingsInputBody) _then;

/// Create a copy of SaveEmailSettingsInputBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? provider = null,Object? senderAddress = null,Object? senderName = null,Object? brevoApiKey = freezed,Object? smtpHost = freezed,Object? smtpPassword = freezed,Object? smtpPort = freezed,Object? smtpSecurity = freezed,Object? smtpUsername = freezed,}) {
  return _then(SaveEmailSettingsInputBody(
provider: null == provider ? _self.provider : provider // ignore: cast_nullable_to_non_nullable
as SaveEmailSettingsInputBodyProvider,senderAddress: null == senderAddress ? _self.senderAddress : senderAddress // ignore: cast_nullable_to_non_nullable
as String,senderName: null == senderName ? _self.senderName : senderName // ignore: cast_nullable_to_non_nullable
as String,brevoApiKey: freezed == brevoApiKey ? _self.brevoApiKey : brevoApiKey // ignore: cast_nullable_to_non_nullable
as String?,smtpHost: freezed == smtpHost ? _self.smtpHost : smtpHost // ignore: cast_nullable_to_non_nullable
as String?,smtpPassword: freezed == smtpPassword ? _self.smtpPassword : smtpPassword // ignore: cast_nullable_to_non_nullable
as String?,smtpPort: freezed == smtpPort ? _self.smtpPort : smtpPort // ignore: cast_nullable_to_non_nullable
as int?,smtpSecurity: freezed == smtpSecurity ? _self.smtpSecurity : smtpSecurity // ignore: cast_nullable_to_non_nullable
as SaveEmailSettingsInputBodySmtpSecurity?,smtpUsername: freezed == smtpUsername ? _self.smtpUsername : smtpUsername // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [SaveEmailSettingsInputBody].
extension SaveEmailSettingsInputBodyPatterns on SaveEmailSettingsInputBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _SaveEmailSettingsInputBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _SaveEmailSettingsInputBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _SaveEmailSettingsInputBody value)  $default,){
final _that = this;
switch (_that) {
case _SaveEmailSettingsInputBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _SaveEmailSettingsInputBody value)?  $default,){
final _that = this;
switch (_that) {
case _SaveEmailSettingsInputBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( SaveEmailSettingsInputBodyProvider provider,  String senderAddress,  String senderName,  String? brevoApiKey,  String? smtpHost,  String? smtpPassword,  int? smtpPort,  SaveEmailSettingsInputBodySmtpSecurity? smtpSecurity,  String? smtpUsername)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _SaveEmailSettingsInputBody() when $default != null:
return $default(_that.provider,_that.senderAddress,_that.senderName,_that.brevoApiKey,_that.smtpHost,_that.smtpPassword,_that.smtpPort,_that.smtpSecurity,_that.smtpUsername);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( SaveEmailSettingsInputBodyProvider provider,  String senderAddress,  String senderName,  String? brevoApiKey,  String? smtpHost,  String? smtpPassword,  int? smtpPort,  SaveEmailSettingsInputBodySmtpSecurity? smtpSecurity,  String? smtpUsername)  $default,) {final _that = this;
switch (_that) {
case _SaveEmailSettingsInputBody():
return $default(_that.provider,_that.senderAddress,_that.senderName,_that.brevoApiKey,_that.smtpHost,_that.smtpPassword,_that.smtpPort,_that.smtpSecurity,_that.smtpUsername);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( SaveEmailSettingsInputBodyProvider provider,  String senderAddress,  String senderName,  String? brevoApiKey,  String? smtpHost,  String? smtpPassword,  int? smtpPort,  SaveEmailSettingsInputBodySmtpSecurity? smtpSecurity,  String? smtpUsername)?  $default,) {final _that = this;
switch (_that) {
case _SaveEmailSettingsInputBody() when $default != null:
return $default(_that.provider,_that.senderAddress,_that.senderName,_that.brevoApiKey,_that.smtpHost,_that.smtpPassword,_that.smtpPort,_that.smtpSecurity,_that.smtpUsername);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _SaveEmailSettingsInputBody implements SaveEmailSettingsInputBody {
  const _SaveEmailSettingsInputBody({required this.provider, required this.senderAddress, required this.senderName, this.brevoApiKey, this.smtpHost, this.smtpPassword, this.smtpPort, this.smtpSecurity, this.smtpUsername});
  factory _SaveEmailSettingsInputBody.fromJson(Map<String, dynamic> json) => _$SaveEmailSettingsInputBodyFromJson(json);

@override final  SaveEmailSettingsInputBodyProvider provider;
@override final  String senderAddress;
@override final  String senderName;
/// Empty keeps the stored key
@override final  String? brevoApiKey;
@override final  String? smtpHost;
/// Empty keeps the stored password
@override final  String? smtpPassword;
@override final  int? smtpPort;
@override final  SaveEmailSettingsInputBodySmtpSecurity? smtpSecurity;
@override final  String? smtpUsername;

/// Create a copy of SaveEmailSettingsInputBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$SaveEmailSettingsInputBodyCopyWith<_SaveEmailSettingsInputBody> get copyWith => __$SaveEmailSettingsInputBodyCopyWithImpl<_SaveEmailSettingsInputBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$SaveEmailSettingsInputBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _SaveEmailSettingsInputBody&&(identical(other.provider, provider) || other.provider == provider)&&(identical(other.senderAddress, senderAddress) || other.senderAddress == senderAddress)&&(identical(other.senderName, senderName) || other.senderName == senderName)&&(identical(other.brevoApiKey, brevoApiKey) || other.brevoApiKey == brevoApiKey)&&(identical(other.smtpHost, smtpHost) || other.smtpHost == smtpHost)&&(identical(other.smtpPassword, smtpPassword) || other.smtpPassword == smtpPassword)&&(identical(other.smtpPort, smtpPort) || other.smtpPort == smtpPort)&&(identical(other.smtpSecurity, smtpSecurity) || other.smtpSecurity == smtpSecurity)&&(identical(other.smtpUsername, smtpUsername) || other.smtpUsername == smtpUsername));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,provider,senderAddress,senderName,brevoApiKey,smtpHost,smtpPassword,smtpPort,smtpSecurity,smtpUsername);
}

@override
String toString() {
    return 'SaveEmailSettingsInputBody(provider: $provider, senderAddress: $senderAddress, senderName: $senderName, brevoApiKey: $brevoApiKey, smtpHost: $smtpHost, smtpPassword: $smtpPassword, smtpPort: $smtpPort, smtpSecurity: $smtpSecurity, smtpUsername: $smtpUsername)';
}


}

/// @nodoc
abstract mixin class _$SaveEmailSettingsInputBodyCopyWith<$Res> implements $SaveEmailSettingsInputBodyCopyWith<$Res> {
  factory _$SaveEmailSettingsInputBodyCopyWith(_SaveEmailSettingsInputBody value, $Res Function(_SaveEmailSettingsInputBody) _then) = __$SaveEmailSettingsInputBodyCopyWithImpl;
@override @useResult
$Res call({
 SaveEmailSettingsInputBodyProvider provider, String senderAddress, String senderName, String? brevoApiKey, String? smtpHost, String? smtpPassword, int? smtpPort, SaveEmailSettingsInputBodySmtpSecurity? smtpSecurity, String? smtpUsername
});




}
/// @nodoc
class __$SaveEmailSettingsInputBodyCopyWithImpl<$Res>
    implements _$SaveEmailSettingsInputBodyCopyWith<$Res> {
  __$SaveEmailSettingsInputBodyCopyWithImpl(this._self, this._then);

  final _SaveEmailSettingsInputBody _self;
  final $Res Function(_SaveEmailSettingsInputBody) _then;

/// Create a copy of SaveEmailSettingsInputBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? provider = null,Object? senderAddress = null,Object? senderName = null,Object? brevoApiKey = freezed,Object? smtpHost = freezed,Object? smtpPassword = freezed,Object? smtpPort = freezed,Object? smtpSecurity = freezed,Object? smtpUsername = freezed,}) {
  return _then(_SaveEmailSettingsInputBody(
provider: null == provider ? _self.provider : provider // ignore: cast_nullable_to_non_nullable
as SaveEmailSettingsInputBodyProvider,senderAddress: null == senderAddress ? _self.senderAddress : senderAddress // ignore: cast_nullable_to_non_nullable
as String,senderName: null == senderName ? _self.senderName : senderName // ignore: cast_nullable_to_non_nullable
as String,brevoApiKey: freezed == brevoApiKey ? _self.brevoApiKey : brevoApiKey // ignore: cast_nullable_to_non_nullable
as String?,smtpHost: freezed == smtpHost ? _self.smtpHost : smtpHost // ignore: cast_nullable_to_non_nullable
as String?,smtpPassword: freezed == smtpPassword ? _self.smtpPassword : smtpPassword // ignore: cast_nullable_to_non_nullable
as String?,smtpPort: freezed == smtpPort ? _self.smtpPort : smtpPort // ignore: cast_nullable_to_non_nullable
as int?,smtpSecurity: freezed == smtpSecurity ? _self.smtpSecurity : smtpSecurity // ignore: cast_nullable_to_non_nullable
as SaveEmailSettingsInputBodySmtpSecurity?,smtpUsername: freezed == smtpUsername ? _self.smtpUsername : smtpUsername // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
