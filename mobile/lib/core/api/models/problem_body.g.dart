// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'problem_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_ProblemBody _$ProblemBodyFromJson(Map<String, dynamic> json) => _ProblemBody(
  kind: ProblemBodyKind.fromJson(json['kind'] as String),
  reportedAt: DateTime.parse(json['reportedAt'] as String),
  answer: json['answer'] as String?,
  answeredAt: json['answeredAt'] == null
      ? null
      : DateTime.parse(json['answeredAt'] as String),
  note: json['note'] as String?,
);

Map<String, dynamic> _$ProblemBodyToJson(_ProblemBody instance) =>
    <String, dynamic>{
      'kind': _$ProblemBodyKindEnumMap[instance.kind]!,
      'reportedAt': instance.reportedAt.toIso8601String(),
      'answer': instance.answer,
      'answeredAt': instance.answeredAt?.toIso8601String(),
      'note': instance.note,
    };

const _$ProblemBodyKindEnumMap = {
  ProblemBodyKind.missingItem: 'missing_item',
  ProblemBodyKind.wrongItem: 'wrong_item',
  ProblemBodyKind.poorQuality: 'poor_quality',
  ProblemBodyKind.storeClosed: 'store_closed',
  ProblemBodyKind.$unknown: r'$unknown',
};
