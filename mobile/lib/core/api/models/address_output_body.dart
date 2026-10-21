// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'address_output_body.freezed.dart';
part 'address_output_body.g.dart';

@Freezed()
abstract class AddressOutputBody with _$AddressOutputBody {
  const factory AddressOutputBody({
    /// As people write it; empty when the point has no known address
    required String address,
  }) = _AddressOutputBody;

  factory AddressOutputBody.fromJson(Map<String, Object?> json) =>
      _$AddressOutputBodyFromJson(json);
}
