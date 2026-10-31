// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

@JsonEnum()
enum AuditEventBodyAction {
  /// Incorrect name has been replaced. Original name: `offer_settings.change`.
  @JsonValue('offer_settings.change')
  undefined0('offer_settings.change'),

  /// Incorrect name has been replaced. Original name: `email_settings.change`.
  @JsonValue('email_settings.change')
  undefined1('email_settings.change'),

  /// Incorrect name has been replaced. Original name: `admin.grant`.
  @JsonValue('admin.grant')
  undefined2('admin.grant'),

  /// Incorrect name has been replaced. Original name: `admin.revoke`.
  @JsonValue('admin.revoke')
  undefined3('admin.revoke'),

  /// Incorrect name has been replaced. Original name: `seller.approve`.
  @JsonValue('seller.approve')
  undefined4('seller.approve'),

  /// Incorrect name has been replaced. Original name: `seller.reject`.
  @JsonValue('seller.reject')
  undefined5('seller.reject'),

  /// Incorrect name has been replaced. Original name: `seller.block`.
  @JsonValue('seller.block')
  undefined6('seller.block'),

  /// Incorrect name has been replaced. Original name: `seller.unblock`.
  @JsonValue('seller.unblock')
  undefined7('seller.unblock'),

  /// Incorrect name has been replaced. Original name: `seller.delete`.
  @JsonValue('seller.delete')
  undefined8('seller.delete'),

  /// Incorrect name has been replaced. Original name: `seller.restore`.
  @JsonValue('seller.restore')
  undefined9('seller.restore'),

  /// Incorrect name has been replaced. Original name: `seller.change_owner`.
  @JsonValue('seller.change_owner')
  undefined10('seller.change_owner'),

  /// Incorrect name has been replaced. Original name: `review.hide`.
  @JsonValue('review.hide')
  undefined11('review.hide'),

  /// Incorrect name has been replaced. Original name: `review.show`.
  @JsonValue('review.show')
  undefined12('review.show'),

  /// Incorrect name has been replaced. Original name: `promotion.create`.
  @JsonValue('promotion.create')
  undefined13('promotion.create'),

  /// Incorrect name has been replaced. Original name: `promotion.change`.
  @JsonValue('promotion.change')
  undefined14('promotion.change'),

  /// Incorrect name has been replaced. Original name: `seller.mark_payout`.
  @JsonValue('seller.mark_payout')
  undefined15('seller.mark_payout'),

  /// Default value for all unparsed values, allows backward compatibility when adding new values on the backend.
  $unknown(null);

  const AuditEventBodyAction(this.json);

  factory AuditEventBodyAction.fromJson(String json) =>
      values.firstWhere((e) => e.json == json, orElse: () => $unknown);

  final String? json;

  @override
  String toString() => json?.toString() ?? super.toString();

  /// Returns all defined enum values excluding the $unknown value.
  static List<AuditEventBodyAction> get $valuesDefined =>
      values.where((value) => value != $unknown).toList();
}
