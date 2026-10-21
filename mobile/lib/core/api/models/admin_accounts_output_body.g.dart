// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'admin_accounts_output_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_AdminAccountsOutputBody _$AdminAccountsOutputBodyFromJson(
  Map<String, dynamic> json,
) => _AdminAccountsOutputBody(
  counts: RoleCountsBody.fromJson(json['counts'] as Map<String, dynamic>),
  items: (json['items'] as List<dynamic>?)
      ?.map((e) => RecordBody.fromJson(e as Map<String, dynamic>))
      .toList(),
  page: (json['page'] as num).toInt(),
  pageSize: (json['pageSize'] as num).toInt(),
  total: (json['total'] as num).toInt(),
);

Map<String, dynamic> _$AdminAccountsOutputBodyToJson(
  _AdminAccountsOutputBody instance,
) => <String, dynamic>{
  'counts': instance.counts,
  'items': instance.items,
  'page': instance.page,
  'pageSize': instance.pageSize,
  'total': instance.total,
};
