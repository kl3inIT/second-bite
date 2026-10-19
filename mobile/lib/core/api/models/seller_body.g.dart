// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'seller_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_SellerBody _$SellerBodyFromJson(Map<String, dynamic> json) => _SellerBody(
  address: json['address'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  id: json['id'] as String,
  latitude: (json['latitude'] as num).toDouble(),
  longitude: (json['longitude'] as num).toDouble(),
  name: json['name'] as String,
  phone: json['phone'] as String,
  status: SellerBodyStatus.fromJson(json['status'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  myRole: json['myRole'] == null
      ? null
      : SellerBodyMyRole.fromJson(json['myRole'] as String),
  photoId: json['photoId'] as String?,
  statusChangedAt: json['statusChangedAt'] == null
      ? null
      : DateTime.parse(json['statusChangedAt'] as String),
);

Map<String, dynamic> _$SellerBodyToJson(_SellerBody instance) =>
    <String, dynamic>{
      'address': instance.address,
      'createdAt': instance.createdAt.toIso8601String(),
      'id': instance.id,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
      'name': instance.name,
      'phone': instance.phone,
      'status': _$SellerBodyStatusEnumMap[instance.status]!,
      'updatedAt': instance.updatedAt.toIso8601String(),
      'myRole': _$SellerBodyMyRoleEnumMap[instance.myRole],
      'photoId': instance.photoId,
      'statusChangedAt': instance.statusChangedAt?.toIso8601String(),
    };

const _$SellerBodyStatusEnumMap = {
  SellerBodyStatus.pending: 'pending',
  SellerBodyStatus.active: 'active',
  SellerBodyStatus.blocked: 'blocked',
  SellerBodyStatus.$unknown: r'$unknown',
};

const _$SellerBodyMyRoleEnumMap = {
  SellerBodyMyRole.owner: 'owner',
  SellerBodyMyRole.staff: 'staff',
  SellerBodyMyRole.$unknown: r'$unknown',
};
