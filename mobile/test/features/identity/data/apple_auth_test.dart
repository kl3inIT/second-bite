import 'package:flutter/foundation.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:second_bite/features/identity/data/apple_auth.dart';
import 'package:second_bite/features/identity/data/google_auth.dart';
import 'package:sign_in_with_apple/sign_in_with_apple.dart';

void main() {
  group(AppleAuth, () {
    group('available', () {
      test('on iOS', () {
        expect(AppleAuth(platform: TargetPlatform.iOS).available, isTrue);
      });

      test('not on Android nor in the browser preview', () {
        expect(AppleAuth(platform: TargetPlatform.android).available, isFalse);
        expect(
          AppleAuth(platform: TargetPlatform.iOS, isWeb: true).available,
          isFalse,
        );
      });
    });

    test('asks for the name and the address with the SHA-256 of a nonce, '
        'and hands back the nonce itself', () async {
      List<AppleIDAuthorizationScopes>? asked;
      String? sentNonce;
      final apple = AppleAuth(
        platform: TargetPlatform.iOS,
        request: ({required scopes, nonce}) async {
          asked = scopes;
          sentNonce = nonce;
          return const AuthorizationCredentialAppleID(
            userIdentifier: 'sub-1',
            givenName: 'Lan',
            familyName: 'Nguyễn',
            email: 'x@privaterelay.appleid.com',
            authorizationCode: 'code-1',
            identityToken: 'id-token',
            state: null,
          );
        },
      );

      final credential = await apple.signIn();

      expect(asked, [
        AppleIDAuthorizationScopes.email,
        AppleIDAuthorizationScopes.fullName,
      ]);
      expect(credential?.idToken, 'id-token');
      expect(credential?.authorizationCode, 'code-1');
      expect(credential?.givenName, 'Lan');
      expect(credential?.familyName, 'Nguyễn');
      expect(sentNonce, sha256Hex(credential!.nonce));
    });

    test('gives no name after the first authorization', () async {
      final apple = AppleAuth(
        platform: TargetPlatform.iOS,
        request: ({required scopes, nonce}) async =>
            const AuthorizationCredentialAppleID(
              userIdentifier: 'sub-1',
              givenName: null,
              familyName: null,
              email: null,
              authorizationCode: 'code-2',
              identityToken: 'id-token',
              state: null,
            ),
      );

      final credential = await apple.signIn();

      expect(credential?.givenName, isEmpty);
      expect(credential?.familyName, isEmpty);
    });

    test('is null when the sheet is closed', () async {
      final apple = AppleAuth(
        platform: TargetPlatform.iOS,
        request: ({required scopes, nonce}) =>
            throw const SignInWithAppleAuthorizationException(
              code: AuthorizationErrorCode.canceled,
              message: 'closed',
            ),
      );

      expect(await apple.signIn(), isNull);
    });

    test("passes on Apple's other failures, and a missing token", () async {
      final failing = AppleAuth(
        platform: TargetPlatform.iOS,
        request: ({required scopes, nonce}) =>
            throw const SignInWithAppleAuthorizationException(
              code: AuthorizationErrorCode.failed,
              message: 'failed',
            ),
      );
      await expectLater(
        failing.signIn(),
        throwsA(isA<SignInWithAppleAuthorizationException>()),
      );

      final tokenless = AppleAuth(
        platform: TargetPlatform.iOS,
        request: ({required scopes, nonce}) async =>
            const AuthorizationCredentialAppleID(
              userIdentifier: 'sub-1',
              givenName: null,
              familyName: null,
              email: null,
              authorizationCode: 'code-3',
              identityToken: null,
              state: null,
            ),
      );
      await expectLater(
        tokenless.signIn(),
        throwsA(isA<SignInWithAppleAuthorizationException>()),
      );
    });
  });
}
