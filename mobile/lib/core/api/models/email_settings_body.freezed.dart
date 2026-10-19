// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'email_settings_body.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$EmailSettingsBody {

/// Whether a Brevo API key is stored; it is never returned
 bool get brevoApiKeySet; EmailSettingsBodyProvider get provider; String get senderAddress; String get senderName; String get smtpHost;/// Whether an SMTP password is stored; it is never returned
 bool get smtpPasswordSet; int get smtpPort; EmailSettingsBodySmtpSecurity get smtpSecurity; String get smtpUsername; DateTime get updatedAt;
/// Create a copy of EmailSettingsBody
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$EmailSettingsBodyCopyWith<EmailSettingsBody> get copyWith => _$EmailSettingsBodyCopyWithImpl<EmailSettingsBody>(this as EmailSettingsBody, _$identity);

  /// Serializes this EmailSettingsBody to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as EmailSettingsBody;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is EmailSettingsBody&&(identical(other.brevoApiKeySet, _this.brevoApiKeySet) || other.brevoApiKeySet == _this.brevoApiKeySet)&&(identical(other.provider, _this.provider) || other.provider == _this.provider)&&(identical(other.senderAddress, _this.senderAddress) || other.senderAddress == _this.senderAddress)&&(identical(other.senderName, _this.senderName) || other.senderName == _this.senderName)&&(identical(other.smtpHost, _this.smtpHost) || other.smtpHost == _this.smtpHost)&&(identical(other.smtpPasswordSet, _this.smtpPasswordSet) || other.smtpPasswordSet == _this.smtpPasswordSet)&&(identical(other.smtpPort, _this.smtpPort) || other.smtpPort == _this.smtpPort)&&(identical(other.smtpSecurity, _this.smtpSecurity) || other.smtpSecurity == _this.smtpSecurity)&&(identical(other.smtpUsername, _this.smtpUsername) || other.smtpUsername == _this.smtpUsername)&&(identical(other.updatedAt, _this.updatedAt) || other.updatedAt == _this.updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as EmailSettingsBody;
  return Object.hash(runtimeType,_this.brevoApiKeySet,_this.provider,_this.senderAddress,_this.senderName,_this.smtpHost,_this.smtpPasswordSet,_this.smtpPort,_this.smtpSecurity,_this.smtpUsername,_this.updatedAt);
}

@override
String toString() {
  final _this = this as EmailSettingsBody;
  return 'EmailSettingsBody(brevoApiKeySet: ${_this.brevoApiKeySet}, provider: ${_this.provider}, senderAddress: ${_this.senderAddress}, senderName: ${_this.senderName}, smtpHost: ${_this.smtpHost}, smtpPasswordSet: ${_this.smtpPasswordSet}, smtpPort: ${_this.smtpPort}, smtpSecurity: ${_this.smtpSecurity}, smtpUsername: ${_this.smtpUsername}, updatedAt: ${_this.updatedAt})';
}


}

/// @nodoc
abstract mixin class $EmailSettingsBodyCopyWith<$Res>  {
  factory $EmailSettingsBodyCopyWith(EmailSettingsBody value, $Res Function(EmailSettingsBody) _then) = _$EmailSettingsBodyCopyWithImpl;
@useResult
$Res call({
 bool brevoApiKeySet, EmailSettingsBodyProvider provider, String senderAddress, String senderName, String smtpHost, bool smtpPasswordSet, int smtpPort, EmailSettingsBodySmtpSecurity smtpSecurity, String smtpUsername, DateTime updatedAt
});




}
/// @nodoc
class _$EmailSettingsBodyCopyWithImpl<$Res>
    implements $EmailSettingsBodyCopyWith<$Res> {
  _$EmailSettingsBodyCopyWithImpl(this._self, this._then);

  final EmailSettingsBody _self;
  final $Res Function(EmailSettingsBody) _then;

/// Create a copy of EmailSettingsBody
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? brevoApiKeySet = null,Object? provider = null,Object? senderAddress = null,Object? senderName = null,Object? smtpHost = null,Object? smtpPasswordSet = null,Object? smtpPort = null,Object? smtpSecurity = null,Object? smtpUsername = null,Object? updatedAt = null,}) {
  return _then(EmailSettingsBody(
brevoApiKeySet: null == brevoApiKeySet ? _self.brevoApiKeySet : brevoApiKeySet // ignore: cast_nullable_to_non_nullable
as bool,provider: null == provider ? _self.provider : provider // ignore: cast_nullable_to_non_nullable
as EmailSettingsBodyProvider,senderAddress: null == senderAddress ? _self.senderAddress : senderAddress // ignore: cast_nullable_to_non_nullable
as String,senderName: null == senderName ? _self.senderName : senderName // ignore: cast_nullable_to_non_nullable
as String,smtpHost: null == smtpHost ? _self.smtpHost : smtpHost // ignore: cast_nullable_to_non_nullable
as String,smtpPasswordSet: null == smtpPasswordSet ? _self.smtpPasswordSet : smtpPasswordSet // ignore: cast_nullable_to_non_nullable
as bool,smtpPort: null == smtpPort ? _self.smtpPort : smtpPort // ignore: cast_nullable_to_non_nullable
as int,smtpSecurity: null == smtpSecurity ? _self.smtpSecurity : smtpSecurity // ignore: cast_nullable_to_non_nullable
as EmailSettingsBodySmtpSecurity,smtpUsername: null == smtpUsername ? _self.smtpUsername : smtpUsername // ignore: cast_nullable_to_non_nullable
as String,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}

}


/// Adds pattern-matching-related methods to [EmailSettingsBody].
extension EmailSettingsBodyPatterns on EmailSettingsBody {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _EmailSettingsBody value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _EmailSettingsBody() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _EmailSettingsBody value)  $default,){
final _that = this;
switch (_that) {
case _EmailSettingsBody():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _EmailSettingsBody value)?  $default,){
final _that = this;
switch (_that) {
case _EmailSettingsBody() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( bool brevoApiKeySet,  EmailSettingsBodyProvider provider,  String senderAddress,  String senderName,  String smtpHost,  bool smtpPasswordSet,  int smtpPort,  EmailSettingsBodySmtpSecurity smtpSecurity,  String smtpUsername,  DateTime updatedAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _EmailSettingsBody() when $default != null:
return $default(_that.brevoApiKeySet,_that.provider,_that.senderAddress,_that.senderName,_that.smtpHost,_that.smtpPasswordSet,_that.smtpPort,_that.smtpSecurity,_that.smtpUsername,_that.updatedAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( bool brevoApiKeySet,  EmailSettingsBodyProvider provider,  String senderAddress,  String senderName,  String smtpHost,  bool smtpPasswordSet,  int smtpPort,  EmailSettingsBodySmtpSecurity smtpSecurity,  String smtpUsername,  DateTime updatedAt)  $default,) {final _that = this;
switch (_that) {
case _EmailSettingsBody():
return $default(_that.brevoApiKeySet,_that.provider,_that.senderAddress,_that.senderName,_that.smtpHost,_that.smtpPasswordSet,_that.smtpPort,_that.smtpSecurity,_that.smtpUsername,_that.updatedAt);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( bool brevoApiKeySet,  EmailSettingsBodyProvider provider,  String senderAddress,  String senderName,  String smtpHost,  bool smtpPasswordSet,  int smtpPort,  EmailSettingsBodySmtpSecurity smtpSecurity,  String smtpUsername,  DateTime updatedAt)?  $default,) {final _that = this;
switch (_that) {
case _EmailSettingsBody() when $default != null:
return $default(_that.brevoApiKeySet,_that.provider,_that.senderAddress,_that.senderName,_that.smtpHost,_that.smtpPasswordSet,_that.smtpPort,_that.smtpSecurity,_that.smtpUsername,_that.updatedAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _EmailSettingsBody implements EmailSettingsBody {
  const _EmailSettingsBody({required this.brevoApiKeySet, required this.provider, required this.senderAddress, required this.senderName, required this.smtpHost, required this.smtpPasswordSet, required this.smtpPort, required this.smtpSecurity, required this.smtpUsername, required this.updatedAt});
  factory _EmailSettingsBody.fromJson(Map<String, dynamic> json) => _$EmailSettingsBodyFromJson(json);

/// Whether a Brevo API key is stored; it is never returned
@override final  bool brevoApiKeySet;
@override final  EmailSettingsBodyProvider provider;
@override final  String senderAddress;
@override final  String senderName;
@override final  String smtpHost;
/// Whether an SMTP password is stored; it is never returned
@override final  bool smtpPasswordSet;
@override final  int smtpPort;
@override final  EmailSettingsBodySmtpSecurity smtpSecurity;
@override final  String smtpUsername;
@override final  DateTime updatedAt;

/// Create a copy of EmailSettingsBody
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$EmailSettingsBodyCopyWith<_EmailSettingsBody> get copyWith => __$EmailSettingsBodyCopyWithImpl<_EmailSettingsBody>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$EmailSettingsBodyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _EmailSettingsBody&&(identical(other.brevoApiKeySet, brevoApiKeySet) || other.brevoApiKeySet == brevoApiKeySet)&&(identical(other.provider, provider) || other.provider == provider)&&(identical(other.senderAddress, senderAddress) || other.senderAddress == senderAddress)&&(identical(other.senderName, senderName) || other.senderName == senderName)&&(identical(other.smtpHost, smtpHost) || other.smtpHost == smtpHost)&&(identical(other.smtpPasswordSet, smtpPasswordSet) || other.smtpPasswordSet == smtpPasswordSet)&&(identical(other.smtpPort, smtpPort) || other.smtpPort == smtpPort)&&(identical(other.smtpSecurity, smtpSecurity) || other.smtpSecurity == smtpSecurity)&&(identical(other.smtpUsername, smtpUsername) || other.smtpUsername == smtpUsername)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,brevoApiKeySet,provider,senderAddress,senderName,smtpHost,smtpPasswordSet,smtpPort,smtpSecurity,smtpUsername,updatedAt);
}

@override
String toString() {
    return 'EmailSettingsBody(brevoApiKeySet: $brevoApiKeySet, provider: $provider, senderAddress: $senderAddress, senderName: $senderName, smtpHost: $smtpHost, smtpPasswordSet: $smtpPasswordSet, smtpPort: $smtpPort, smtpSecurity: $smtpSecurity, smtpUsername: $smtpUsername, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class _$EmailSettingsBodyCopyWith<$Res> implements $EmailSettingsBodyCopyWith<$Res> {
  factory _$EmailSettingsBodyCopyWith(_EmailSettingsBody value, $Res Function(_EmailSettingsBody) _then) = __$EmailSettingsBodyCopyWithImpl;
@override @useResult
$Res call({
 bool brevoApiKeySet, EmailSettingsBodyProvider provider, String senderAddress, String senderName, String smtpHost, bool smtpPasswordSet, int smtpPort, EmailSettingsBodySmtpSecurity smtpSecurity, String smtpUsername, DateTime updatedAt
});




}
/// @nodoc
class __$EmailSettingsBodyCopyWithImpl<$Res>
    implements _$EmailSettingsBodyCopyWith<$Res> {
  __$EmailSettingsBodyCopyWithImpl(this._self, this._then);

  final _EmailSettingsBody _self;
  final $Res Function(_EmailSettingsBody) _then;

/// Create a copy of EmailSettingsBody
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? brevoApiKeySet = null,Object? provider = null,Object? senderAddress = null,Object? senderName = null,Object? smtpHost = null,Object? smtpPasswordSet = null,Object? smtpPort = null,Object? smtpSecurity = null,Object? smtpUsername = null,Object? updatedAt = null,}) {
  return _then(_EmailSettingsBody(
brevoApiKeySet: null == brevoApiKeySet ? _self.brevoApiKeySet : brevoApiKeySet // ignore: cast_nullable_to_non_nullable
as bool,provider: null == provider ? _self.provider : provider // ignore: cast_nullable_to_non_nullable
as EmailSettingsBodyProvider,senderAddress: null == senderAddress ? _self.senderAddress : senderAddress // ignore: cast_nullable_to_non_nullable
as String,senderName: null == senderName ? _self.senderName : senderName // ignore: cast_nullable_to_non_nullable
as String,smtpHost: null == smtpHost ? _self.smtpHost : smtpHost // ignore: cast_nullable_to_non_nullable
as String,smtpPasswordSet: null == smtpPasswordSet ? _self.smtpPasswordSet : smtpPasswordSet // ignore: cast_nullable_to_non_nullable
as bool,smtpPort: null == smtpPort ? _self.smtpPort : smtpPort // ignore: cast_nullable_to_non_nullable
as int,smtpSecurity: null == smtpSecurity ? _self.smtpSecurity : smtpSecurity // ignore: cast_nullable_to_non_nullable
as EmailSettingsBodySmtpSecurity,smtpUsername: null == smtpUsername ? _self.smtpUsername : smtpUsername // ignore: cast_nullable_to_non_nullable
as String,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}


}

// dart format on
