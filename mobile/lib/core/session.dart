import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'session.g.dart';

/// {@template session_store}
/// The session's Bearer token (SEC-27), kept in the Keychain or the Keystore
/// through `flutter_secure_storage`, never in `shared_preferences`
/// (docs/guidelines/mobile.md › Stack). It is read once and then kept in
/// memory; [cleared] tells the app when it is forgotten.
/// {@endtemplate}
class SessionStore {
  /// {@macro session_store}
  new(this._storage);

  static const _key = 'session_token';

  final FlutterSecureStorage _storage;
  final StreamController<void> _cleared = StreamController.broadcast();

  // Read once: null until then, and a record holding null when there is none.
  (String?,)? _token;

  /// Fires each time the token is forgotten: on sign-out, or when the server
  /// refused it.
  Stream<void> get cleared => _cleared.stream;

  /// The token, or null when no one is signed in. A store that cannot be
  /// read, such as one restored from a backup onto another phone whose
  /// Keystore lacks its key, counts as signed out and is emptied.
  Future<String?> read() async {
    final known = _token;
    if (known != null) return known.$1;
    String? token;
    try {
      token = await _storage.read(key: _key);
    } on Object catch (error) {
      debugPrint('The session store could not be read: ${error.runtimeType}');
      await _storage.delete(key: _key).catchError((Object _) {});
    }
    _token = (token,);
    return token;
  }

  /// Keeps [token] as the session.
  Future<void> write(String token) async {
    _token = (token,);
    await _storage.write(key: _key, value: token);
  }

  /// Forgets the session.
  Future<void> clear() async {
    final had = _token?.$1 != null;
    _token = (null,);
    await _storage.delete(key: _key);
    if (had) _cleared.add(null);
  }

  /// Closes [cleared].
  Future<void> dispose() => _cleared.close();
}

/// The app's one [SessionStore].
@Riverpod(keepAlive: true)
SessionStore sessionStore(Ref ref) {
  final store = SessionStore(const FlutterSecureStorage());
  ref.onDispose(store.dispose);
  return store;
}

/// {@template session_interceptor}
/// Sends the session's token as `Authorization: Bearer` on every call while
/// one is kept. The server refuses a token it no longer knows at once, even
/// on a public call such as `GET /offers` (docs/specs/identity.md), so a
/// call refused with `IDENTITY_SESSION_INVALID` forgets the token and is
/// sent once more without it.
/// {@endtemplate}
class SessionInterceptor extends Interceptor {
  /// {@macro session_interceptor}
  new(this._store, this._dio);

  final SessionStore _store;
  final Dio _dio;

  static const _sentWithToken = 'secondbite.session';

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final token = await _store.read();
    if (token != null && !options.headers.containsKey('Authorization')) {
      options.headers['Authorization'] = 'Bearer $token';
      options.extra[_sentWithToken] = true;
    }
    handler.next(options);
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    final options = err.requestOptions;
    final response = err.response;
    final body = response?.data;
    final refused =
        options.extra[_sentWithToken] == true &&
        response?.statusCode == 401 &&
        body is Map &&
        body['code'] == 'IDENTITY_SESSION_INVALID';
    if (!refused) return handler.next(err);

    await _store.clear();
    options.headers.remove('Authorization');
    options.extra.remove(_sentWithToken);
    try {
      handler.resolve(await _dio.fetch<Object?>(options));
    } on DioException catch (again) {
      handler.next(again);
    }
  }
}
