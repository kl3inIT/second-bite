// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'last_contact.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// {@template last_contact}
/// Who collected the last order placed on this phone, so the next needs
/// only a check, as the web's `last-contact.ts`; empty until one is given.
/// {@endtemplate}

@ProviderFor(LastContact)
final lastContactProvider = LastContactProvider._();

/// {@template last_contact}
/// Who collected the last order placed on this phone, so the next needs
/// only a check, as the web's `last-contact.ts`; empty until one is given.
/// {@endtemplate}
final class LastContactProvider
    extends $AsyncNotifierProvider<LastContact, Contact> {
  /// {@template last_contact}
  /// Who collected the last order placed on this phone, so the next needs
  /// only a check, as the web's `last-contact.ts`; empty until one is given.
  /// {@endtemplate}
  LastContactProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'lastContactProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$lastContactHash();

  @$internal
  @override
  LastContact create() => LastContact();
}

String _$lastContactHash() => r'ce950026b2710bfc1692713da2136c106bbf5655';

/// {@template last_contact}
/// Who collected the last order placed on this phone, so the next needs
/// only a check, as the web's `last-contact.ts`; empty until one is given.
/// {@endtemplate}

abstract class _$LastContact extends $AsyncNotifier<Contact> {
  FutureOr<Contact> build();
  @$mustCallSuper
  @override
  WhenComplete runBuild() {
    final ref = this.ref as $Ref<AsyncValue<Contact>, Contact>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<AsyncValue<Contact>, Contact>,
              AsyncValue<Contact>,
              Object?,
              Object?
            >;
    return element.handleCreate(ref, build);
  }
}
