import 'dart:ui';

import 'package:dio/dio.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:second_bite/core/api/export.dart';
import 'package:second_bite/core/app_locale.dart';
import 'package:second_bite/core/session.dart';

export 'package:second_bite/core/api/export.dart';

part 'api.g.dart';

/// Where the API answers, given at build time with
/// `--dart-define=SECONDBITE_API_ORIGIN=…`. The default is the stub backend
/// (`pnpm stub:backend` in web/) as an Android emulator reaches the
/// computer it runs on.
const apiOrigin = String.fromEnvironment(
  'SECONDBITE_API_ORIGIN',
  defaultValue: 'http://10.0.2.2:3190',
);

/// The generated client of `api/openapi.yaml`, configured once: the origin,
/// lists sent comma-separated as the contract asks (`kind=bakery,drinks`),
/// the reader's language on every call so the server's words come back in
/// it, and the session's token while someone is signed in.
@Riverpod(keepAlive: true)
SecondBiteApi api(Ref ref) {
  final dio = Dio(BaseOptions(baseUrl: apiOrigin, listFormat: ListFormat.csv));
  dio.interceptors.addAll([
    InterceptorsWrapper(
      onRequest: (options, handler) {
        final chosen = ref.read(appLocaleProvider);
        final language =
            chosen?.languageCode ??
            PlatformDispatcher.instance.locale.languageCode;
        options.headers['Accept-Language'] = language == 'en' ? 'en' : 'vi';
        handler.next(options);
      },
    ),
    SessionInterceptor(ref.watch(sessionStoreProvider), dio),
  ]);
  ref.onDispose(dio.close);
  return SecondBiteApi(dio);
}

/// The address of a photograph the API names by its path, such as
/// `/photos/ph-1/400.jpg`.
Uri photoUri(String path) => Uri.parse('$apiOrigin$path');

/// The problem the server answered with (RFC 9457, SEC-28), when [error] is
/// a response that carries one.
Problem? problemOf(Object error) {
  if (error is! DioException) return null;
  final body = error.response?.data;
  if (body is! Map<String, Object?>) return null;
  try {
    return Problem.fromJson(body);
  } on Object {
    return null;
  }
}
