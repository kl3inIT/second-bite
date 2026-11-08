import 'dart:convert';

import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:second_bite/core/preferences.dart';
import 'package:second_bite/features/order/domain/contact.dart';

part 'last_contact.g.dart';

/// Where the last contact is kept, under the web's own name for it.
const contactKey = 'secondbite.contact';

/// {@template last_contact}
/// Who collected the last order placed on this phone, so the next needs
/// only a check, as the web's `last-contact.ts`; empty until one is given.
/// {@endtemplate}
@Riverpod(keepAlive: true)
class LastContact extends _$LastContact {
  @override
  Future<Contact> build() async {
    final kept = await ref.watch(preferencesProvider).getString(contactKey);
    return readContact(kept);
  }

  /// Keeps [contact] for the next order.
  Future<void> save(Contact contact) async {
    state = AsyncData(contact);
    await ref
        .read(preferencesProvider)
        .setString(
          contactKey,
          jsonEncode({'name': contact.name, 'phone': contact.phone}),
        );
  }
}

/// Reads a contact kept on the phone, which anything may have written: an
/// empty one unless it holds a name and a phone number.
Contact readContact(String? kept) {
  const empty = (name: '', phone: '');
  if (kept == null) return empty;
  try {
    return switch (jsonDecode(kept)) {
      {'name': final String name, 'phone': final String phone} => (
        name: name,
        phone: phone,
      ),
      _ => empty,
    };
  } on FormatException {
    return empty;
  }
}
