// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'membership_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_MembershipBody _$MembershipBodyFromJson(Map<String, dynamic> json) =>
    _MembershipBody(
      accountId: json['accountId'] as String,
      role: MembershipBodyRole.fromJson(json['role'] as String),
      sellerId: json['sellerId'] as String,
      sellerName: json['sellerName'] as String,
      sellerStatus: MembershipBodySellerStatus.fromJson(
        json['sellerStatus'] as String,
      ),
    );

Map<String, dynamic> _$MembershipBodyToJson(
  _MembershipBody instance,
) => <String, dynamic>{
  'accountId': instance.accountId,
  'role': _$MembershipBodyRoleEnumMap[instance.role]!,
  'sellerId': instance.sellerId,
  'sellerName': instance.sellerName,
  'sellerStatus': _$MembershipBodySellerStatusEnumMap[instance.sellerStatus]!,
};

const _$MembershipBodyRoleEnumMap = {
  MembershipBodyRole.owner: 'owner',
  MembershipBodyRole.staff: 'staff',
  MembershipBodyRole.$unknown: r'$unknown',
};

const _$MembershipBodySellerStatusEnumMap = {
  MembershipBodySellerStatus.pending: 'pending',
  MembershipBodySellerStatus.active: 'active',
  MembershipBodySellerStatus.rejected: 'rejected',
  MembershipBodySellerStatus.blocked: 'blocked',
  MembershipBodySellerStatus.deleted: 'deleted',
  MembershipBodySellerStatus.$unknown: r'$unknown',
};
