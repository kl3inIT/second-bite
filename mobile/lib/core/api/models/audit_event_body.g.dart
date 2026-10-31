// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'audit_event_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_AuditEventBody _$AuditEventBodyFromJson(Map<String, dynamic> json) =>
    _AuditEventBody(
      action: AuditEventBodyAction.fromJson(json['action'] as String),
      details: AuditDetailsBody.fromJson(
        json['details'] as Map<String, dynamic>,
      ),
      id: json['id'] as String,
      occurredAt: DateTime.parse(json['occurredAt'] as String),
      resourceId: json['resourceId'] as String,
      resourceType: AuditEventBodyResourceType.fromJson(
        json['resourceType'] as String,
      ),
      actorId: json['actorId'] as String?,
      actorLabel: json['actorLabel'] as String?,
      resourceLabel: json['resourceLabel'] as String?,
    );

Map<String, dynamic> _$AuditEventBodyToJson(
  _AuditEventBody instance,
) => <String, dynamic>{
  'action': _$AuditEventBodyActionEnumMap[instance.action]!,
  'details': instance.details,
  'id': instance.id,
  'occurredAt': instance.occurredAt.toIso8601String(),
  'resourceId': instance.resourceId,
  'resourceType': _$AuditEventBodyResourceTypeEnumMap[instance.resourceType]!,
  'actorId': instance.actorId,
  'actorLabel': instance.actorLabel,
  'resourceLabel': instance.resourceLabel,
};

const _$AuditEventBodyActionEnumMap = {
  AuditEventBodyAction.undefined0: 'offer_settings.change',
  AuditEventBodyAction.undefined1: 'email_settings.change',
  AuditEventBodyAction.undefined2: 'admin.grant',
  AuditEventBodyAction.undefined3: 'admin.revoke',
  AuditEventBodyAction.undefined4: 'seller.approve',
  AuditEventBodyAction.undefined5: 'seller.reject',
  AuditEventBodyAction.undefined6: 'seller.block',
  AuditEventBodyAction.undefined7: 'seller.unblock',
  AuditEventBodyAction.undefined8: 'seller.delete',
  AuditEventBodyAction.undefined9: 'seller.restore',
  AuditEventBodyAction.undefined10: 'seller.change_owner',
  AuditEventBodyAction.undefined11: 'review.hide',
  AuditEventBodyAction.undefined12: 'review.show',
  AuditEventBodyAction.undefined13: 'promotion.create',
  AuditEventBodyAction.undefined14: 'promotion.change',
  AuditEventBodyAction.undefined15: 'seller.mark_payout',
  AuditEventBodyAction.$unknown: r'$unknown',
};

const _$AuditEventBodyResourceTypeEnumMap = {
  AuditEventBodyResourceType.account: 'account',
  AuditEventBodyResourceType.seller: 'seller',
  AuditEventBodyResourceType.order: 'order',
  AuditEventBodyResourceType.offerSettings: 'offer_settings',
  AuditEventBodyResourceType.emailSettings: 'email_settings',
  AuditEventBodyResourceType.promotion: 'promotion',
  AuditEventBodyResourceType.$unknown: r'$unknown',
};
