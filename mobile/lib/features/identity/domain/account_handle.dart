import 'package:second_bite/core/api.dart';

/// How an account is named where its address would be (SEC-196), as the
/// web's `accountHandle`.
extension AccountHandle on AccountBody {
  /// The address, or the username of an account made with one, which has
  /// no address.
  String get handle => email.isEmpty ? username : email;
}
