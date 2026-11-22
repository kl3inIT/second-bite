// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analysis_kind_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_AnalysisKindBody _$AnalysisKindBodyFromJson(Map<String, dynamic> json) =>
    _AnalysisKindBody(
      collected: (json['collected'] as num).toInt(),
      kind: AnalysisKindBodyKind.fromJson(json['kind'] as String),
      posted: (json['posted'] as num).toInt(),
    );

Map<String, dynamic> _$AnalysisKindBodyToJson(_AnalysisKindBody instance) =>
    <String, dynamic>{
      'collected': instance.collected,
      'kind': _$AnalysisKindBodyKindEnumMap[instance.kind]!,
      'posted': instance.posted,
    };

const _$AnalysisKindBodyKindEnumMap = {
  AnalysisKindBodyKind.bakery: 'bakery',
  AnalysisKindBodyKind.preparedFood: 'prepared_food',
  AnalysisKindBodyKind.ingredients: 'ingredients',
  AnalysisKindBodyKind.drinks: 'drinks',
  AnalysisKindBodyKind.mixedBox: 'mixed_box',
  AnalysisKindBodyKind.dessert: 'dessert',
  AnalysisKindBodyKind.snacks: 'snacks',
  AnalysisKindBodyKind.produce: 'produce',
  AnalysisKindBodyKind.other: 'other',
  AnalysisKindBodyKind.$unknown: r'$unknown',
};
