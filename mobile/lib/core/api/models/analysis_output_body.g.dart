// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analysis_output_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_AnalysisOutputBody _$AnalysisOutputBodyFromJson(Map<String, dynamic> json) =>
    _AnalysisOutputBody(
      discounts: (json['discounts'] as List<dynamic>)
          .map((e) => AnalysisDiscountBody.fromJson(e as Map<String, dynamic>))
          .toList(),
      failures: (json['failures'] as List<dynamic>)
          .map((e) => AnalysisCountBody.fromJson(e as Map<String, dynamic>))
          .toList(),
      kinds: (json['kinds'] as List<dynamic>)
          .map((e) => AnalysisKindBody.fromJson(e as Map<String, dynamic>))
          .toList(),
      leadTimes: LeadTimesStruct.fromJson(
        json['leadTimes'] as Map<String, dynamic>,
      ),
      problems: (json['problems'] as List<dynamic>)
          .map((e) => AnalysisCountBody.fromJson(e as Map<String, dynamic>))
          .toList(),
      sellOut: SellOutStruct.fromJson(json['sellOut'] as Map<String, dynamic>),
      since: DateTime.parse(json['since'] as String),
      slots: (json['slots'] as List<dynamic>)
          .map((e) => AnalysisSlotBody.fromJson(e as Map<String, dynamic>))
          .toList(),
      sources: (json['sources'] as List<dynamic>)
          .map((e) => AnalysisCountBody.fromJson(e as Map<String, dynamic>))
          .toList(),
      tags: (json['tags'] as List<dynamic>)
          .map((e) => AnalysisCountBody.fromJson(e as Map<String, dynamic>))
          .toList(),
      topLeftover: (json['topLeftover'] as List<dynamic>)
          .map((e) => AnalysisDishBody.fromJson(e as Map<String, dynamic>))
          .toList(),
      topSold: (json['topSold'] as List<dynamic>)
          .map((e) => AnalysisDishBody.fromJson(e as Map<String, dynamic>))
          .toList(),
      until: DateTime.parse(json['until'] as String),
      visits: (json['visits'] as List<dynamic>)
          .map((e) => AnalysisCountBody.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$AnalysisOutputBodyToJson(_AnalysisOutputBody instance) =>
    <String, dynamic>{
      'discounts': instance.discounts,
      'failures': instance.failures,
      'kinds': instance.kinds,
      'leadTimes': instance.leadTimes,
      'problems': instance.problems,
      'sellOut': instance.sellOut,
      'since': instance.since.toIso8601String(),
      'slots': instance.slots,
      'sources': instance.sources,
      'tags': instance.tags,
      'topLeftover': instance.topLeftover,
      'topSold': instance.topSold,
      'until': instance.until.toIso8601String(),
      'visits': instance.visits,
    };
