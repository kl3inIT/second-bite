import 'dart:convert';
import 'dart:typed_data';

import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:second_bite/core/session.dart';

class _MockStorage extends Mock implements FlutterSecureStorage;

/// Answers each call from [answer], and records the calls.
class _FakeAdapter implements HttpClientAdapter {
  new(this.answer);

  final (int, Object) Function(RequestOptions options) answer;
  final List<RequestOptions> requests = [];

  @override
  Future<ResponseBody> fetch(
    RequestOptions options,
    Stream<Uint8List>? requestStream,
    Future<void>? cancelFuture,
  ) async {
    requests.add(options);
    final (status, body) = answer(options);
    return ResponseBody.fromString(
      jsonEncode(body),
      status,
      headers: {
        Headers.contentTypeHeader: [Headers.jsonContentType],
      },
    );
  }

  @override
  void close({bool force = false}) {}
}

void main() {
  late FlutterSecureStorage storage;
  late SessionStore store;

  setUp(() {
    storage = _MockStorage();
    when(
      () => storage.write(
        key: any(named: 'key'),
        value: any(named: 'value'),
      ),
    ).thenAnswer((_) async {});
    when(() => storage.delete(key: any(named: 'key'))).thenAnswer((_) async {});
    store = SessionStore(storage);
  });

  group(SessionStore, () {
    test('reads the kept token once', () async {
      when(() => storage.read(key: any(named: 'key')))
          .thenAnswer((_) async => 'tok');

      expect(await store.read(), 'tok');
      expect(await store.read(), 'tok');
      verify(() => storage.read(key: 'session_token')).called(1);
    });

    test('writes and clears the token, and says when it is cleared', () async {
      when(() => storage.read(key: any(named: 'key')))
          .thenAnswer((_) async => null);
      final cleared = expectLater(store.cleared, emits(null));

      await store.write('tok');
      expect(await store.read(), 'tok');
      await store.clear();

      expect(await store.read(), isNull);
      verify(() => storage.write(key: 'session_token', value: 'tok')).called(1);
      verify(() => storage.delete(key: 'session_token')).called(1);
      await cleared;
    });

    test('counts a store that cannot be read as signed out', () async {
      when(() => storage.read(key: any(named: 'key')))
          .thenThrow(Exception('key lost'));

      expect(await store.read(), isNull);
      verify(() => storage.delete(key: 'session_token')).called(1);
    });
  });

  group(SessionInterceptor, () {
    late Dio dio;

    Dio client(_FakeAdapter adapter) {
      dio = Dio(BaseOptions(baseUrl: 'http://api'))
        ..httpClientAdapter = adapter;
      dio.interceptors.add(SessionInterceptor(store, dio));
      return dio;
    }

    test('sends no header without a session', () async {
      when(() => storage.read(key: any(named: 'key')))
          .thenAnswer((_) async => null);
      final adapter = _FakeAdapter((_) => (200, <String, Object?>{}));

      await client(adapter).get<Object?>('/offers');

      expect(adapter.requests.single.headers['Authorization'], isNull);
    });

    test('sends the token as Bearer', () async {
      await store.write('tok');
      final adapter = _FakeAdapter((_) => (200, <String, Object?>{}));

      await client(adapter).get<Object?>('/accounts/me');

      expect(adapter.requests.single.headers['Authorization'], 'Bearer tok');
    });

    test(
      'forgets a refused token and sends the call again without it',
      () async {
        await store.write('ended');
        final adapter = _FakeAdapter(
          (options) => options.headers.containsKey('Authorization')
              ? (401, {'code': 'IDENTITY_SESSION_INVALID', 'status': 401})
              : (200, {'offers': <Object?>[]}),
        );

        final answer = await client(adapter).get<Object?>('/offers');

        expect(answer.statusCode, 200);
        expect(adapter.requests, hasLength(2));
        expect(adapter.requests.last.headers['Authorization'], isNull);
        expect(await store.read(), isNull);
      },
    );

    test('lets any other failure through', () async {
      await store.write('tok');
      final adapter = _FakeAdapter(
        (_) => (401, {'code': 'IDENTITY_CODE_INCORRECT', 'status': 401}),
      );

      await expectLater(
        client(adapter).get<Object?>('/auth/sessions'),
        throwsA(isA<DioException>()),
      );
      expect(adapter.requests, hasLength(1));
      expect(await store.read(), 'tok');
    });
  });
}
