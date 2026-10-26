// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'report_order_problem_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_ReportOrderProblemRequest _$ReportOrderProblemRequestFromJson(
  Map<String, dynamic> json,
) => _ReportOrderProblemRequest(
  kind: ReportOrderProblemRequestKind.fromJson(json['kind'] as String),
  note: json['note'] as String?,
);

Map<String, dynamic> _$ReportOrderProblemRequestToJson(
  _ReportOrderProblemRequest instance,
) => <String, dynamic>{
  'kind': _$ReportOrderProblemRequestKindEnumMap[instance.kind]!,
  'note': instance.note,
};

const _$ReportOrderProblemRequestKindEnumMap = {
  ReportOrderProblemRequestKind.missingItem: 'missing_item',
  ReportOrderProblemRequestKind.wrongItem: 'wrong_item',
  ReportOrderProblemRequestKind.poorQuality: 'poor_quality',
  ReportOrderProblemRequestKind.storeClosed: 'store_closed',
  ReportOrderProblemRequestKind.$unknown: r'$unknown',
};
