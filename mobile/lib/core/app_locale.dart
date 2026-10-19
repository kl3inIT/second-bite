import 'dart:ui';

import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'app_locale.g.dart';

/// The language the person chose in the app, or null to follow the device.
@Riverpod(keepAlive: true)
class AppLocale extends _$AppLocale {
  @override
  Locale? build() => null;

  /// Switches from [current], the language on screen, to the other one.
  void switchFrom(Locale current) {
    state = Locale(current.languageCode == 'vi' ? 'en' : 'vi');
  }
}
