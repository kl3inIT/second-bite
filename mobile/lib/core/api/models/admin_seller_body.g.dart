// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'admin_seller_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_AdminSellerBody _$AdminSellerBodyFromJson(Map<String, dynamic> json) =>
    _AdminSellerBody(
      address: json['address'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
      id: json['id'] as String,
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      name: json['name'] as String,
      phone: json['phone'] as String,
      status: AdminSellerBodyStatus.fromJson(json['status'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      deletionRequestedAt: json['deletionRequestedAt'] == null
          ? null
          : DateTime.parse(json['deletionRequestedAt'] as String),
      ownerEmail: json['ownerEmail'] as String?,
      photoId: json['photoId'] as String?,
      statusChangedAt: json['statusChangedAt'] == null
          ? null
          : DateTime.parse(json['statusChangedAt'] as String),
      statusReason: json['statusReason'] as String?,
    );

Map<String, dynamic> _$AdminSellerBodyToJson(_AdminSellerBody instance) =>
    <String, dynamic>{
      'address': instance.address,
      'createdAt': instance.createdAt.toIso8601String(),
      'id': instance.id,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
      'name': instance.name,
      'phone': instance.phone,
      'status': _$AdminSellerBodyStatusEnumMap[instance.status]!,
      'updatedAt': instance.updatedAt.toIso8601String(),
      'deletionRequestedAt': instance.deletionRequestedAt?.toIso8601String(),
      'ownerEmail': instance.ownerEmail,
      'photoId': instance.photoId,
      'statusChangedAt': instance.statusChangedAt?.toIso8601String(),
      'statusReason': instance.statusReason,
    };

const _$AdminSellerBodyStatusEnumMap = {
  AdminSellerBodyStatus.pending: 'pending',
  AdminSellerBodyStatus.active: 'active',
  AdminSellerBodyStatus.rejected: 'rejected',
  AdminSellerBodyStatus.blocked: 'blocked',
  AdminSellerBodyStatus.deleted: 'deleted',
  AdminSellerBodyStatus.$unknown: r'$unknown',
};
