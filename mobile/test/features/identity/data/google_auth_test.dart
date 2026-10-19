import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:mocktail/mocktail.dart';
import 'package:second_bite/features/identity/data/google_auth.dart';

class _MockGoogleSignIn extends Mock implements GoogleSignIn;

class _MockAccount extends Mock implements GoogleSignInAccount;

void main() {
  group(GoogleAuth, () {
    late GoogleSignIn google;

    setUp(() {
      google = _MockGoogleSignIn();
      when(
        () => google.initialize(
          clientId: any(named: 'clientId'),
          serverClientId: any(named: 'serverClientId'),
          nonce: any(named: 'nonce'),
        ),
      ).thenAnswer((_) async {});
    });

    group('available', () {
      test('on Android', () {
        expect(
          GoogleAuth(
            signIn: google,
            platform: TargetPlatform.android,
          ).available,
          isTrue,
        );
      });

      test('on iOS only with its client', () {
        expect(
          GoogleAuth(signIn: google, platform: TargetPlatform.iOS).available,
          isFalse,
        );
        expect(
          GoogleAuth(
            signIn: google,
            platform: TargetPlatform.iOS,
            iosClientId: 'ios-client',
          ).available,
          isTrue,
        );
      });

      test('never in the browser preview', () {
        expect(
          GoogleAuth(
            signIn: google,
            platform: TargetPlatform.android,
            isWeb: true,
          ).available,
          isFalse,
        );
      });
    });

    group('signIn', () {
      test('gives Google the hash of the nonce it returns, once', () async {
        final account = _MockAccount();
        when(() => account.authentication)
            .thenReturn(const GoogleSignInAuthentication(idToken: 'id'));
        when(google.authenticate).thenAnswer((_) async => account);
        final identity = GoogleAuth(
          signIn: google,
          platform: TargetPlatform.android,
        );

        final first = await identity.signIn('web-client');
        final second = await identity.signIn('web-client');

        final hashed =
            verify(
                  () => google.initialize(
                    serverClientId: 'web-client',
                    nonce: captureAny(named: 'nonce'),
                  ),
                ).captured.single
                as String;
        expect(first!.idToken, 'id');
        expect(hashed, sha256Hex(first.nonce));
        expect(second!.nonce, first.nonce);
      });

      test('passes the iOS client on iOS', () async {
        when(google.authenticate).thenThrow(
          const GoogleSignInException(code: GoogleSignInExceptionCode.canceled),
        );
        final identity = GoogleAuth(
          signIn: google,
          platform: TargetPlatform.iOS,
          iosClientId: 'ios-client',
        );

        expect(await identity.signIn('web-client'), isNull);
        verify(
          () => google.initialize(
            clientId: 'ios-client',
            serverClientId: 'web-client',
            nonce: any(named: 'nonce'),
          ),
        ).called(1);
      });

      test("throws Google's other failures", () async {
        when(google.authenticate).thenThrow(
          const GoogleSignInException(
            code: GoogleSignInExceptionCode.clientConfigurationError,
          ),
        );
        final identity = GoogleAuth(
          signIn: google,
          platform: TargetPlatform.android,
        );

        await expectLater(
          identity.signIn('web-client'),
          throwsA(isA<GoogleSignInException>()),
        );
      });
    });
  });

  test('randomNonce draws 32 bytes as hex', () {
    final nonce = randomNonce();
    expect(nonce, matches(RegExp(r'^[0-9a-f]{64}$')));
    expect(randomNonce(), isNot(nonce));
  });

  test('sha256Hex is the hex SHA-256', () {
    expect(
      sha256Hex('abc'),
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    );
  });

  test('emailInToken reads the address and nothing else', () {
    String part(Object value) =>
        base64Url.encode(utf8.encode(jsonEncode(value))).replaceAll('=', '');
    expect(
      emailInToken('${part({})}.${part({'email': 'lan@công-ty.vn'})}.s'),
      'lan@công-ty.vn',
    );
    expect(emailInToken('${part({})}.${part({'sub': '1'})}.s'), isNull);
    expect(emailInToken('garbage'), isNull);
  });
}
