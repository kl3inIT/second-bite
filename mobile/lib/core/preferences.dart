import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:shared_preferences/shared_preferences.dart';

part 'preferences.g.dart';

/// What the app remembers on the phone that is no secret, as the web keeps
/// it in `localStorage`: the cart, the last contact, the follows, the recent
/// searches and the chosen place (SEC-204 › design 2). A session's token is
/// never here; it is in the secure store (SEC-43).
@Riverpod(keepAlive: true)
SharedPreferencesAsync preferences(Ref ref) => SharedPreferencesAsync();
