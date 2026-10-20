import 'dart:async';

import 'package:app_ui/app_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:second_bite/core/routes.dart';
import 'package:second_bite/features/identity/ui/current_account.dart';
import 'package:second_bite/l10n/l10n.dart';

/// {@template account_action}
/// The header's account capsule, as the web's `AccountAction`: "Đăng nhập"
/// for anyone, back to [returnTo] afterwards, or the signed-in account's
/// capsule with its display name, else the start of its address, whose menu
/// names the address and signs out. While the kept session is read, nothing
/// shows in its place.
/// {@endtemplate}
class AccountAction extends ConsumerWidget {
  /// {@macro account_action}
  const new({required this.returnTo, super.key});

  /// The path of the screen the header is on.
  final String returnTo;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final account = ref.watch(currentAccountProvider);
    if (account.isLoading && !account.hasValue) return const SizedBox.shrink();
    final value = account.value;
    if (value == null) return _SignInCapsule(returnTo: returnTo);
    return _AccountMenu(
      email: value.email,
      name: value.displayName.isEmpty
          ? value.email.split('@').first
          : value.displayName,
    );
  }
}

class _SignInCapsule extends StatelessWidget {
  const new({required this.returnTo});

  final String returnTo;

  @override
  Widget build(BuildContext context) {
    return AppHeaderCapsule(
      icon: LucideIcons.userRound,
      label: context.l10n.accountSignIn,
      onPressed: () => unawaited(SignInRoute(returnTo: returnTo).push(context)),
    );
  }
}

class _AccountMenu extends ConsumerWidget {
  const new({required this.email, required this.name});

  final String email;

  /// What the capsule shows.
  final String name;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = context.l10n;
    final text = context.appTextStyles;

    return MenuAnchor(
      menuChildren: [
        Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: SpacingTokens.space3,
            vertical: SpacingTokens.space2,
          ),
          child: Text(
            l10n.accountSignedInAs(email),
            style: text.labelStrong.copyWith(
              color: Theme.of(context).colorScheme.onSurfaceVariant,
            ),
          ),
        ),
        const Divider(),
        MenuItemButton(
          leadingIcon: const Icon(LucideIcons.logOut, size: 16),
          onPressed: () =>
              unawaited(ref.read(currentAccountProvider.notifier).signOut()),
          child: Text(l10n.accountSignOut, style: text.body),
        ),
      ],
      builder: (context, controller, _) => AppHeaderCapsule(
        icon: LucideIcons.userRound,
        label: name,
        tooltip: l10n.accountMenu(email),
        onPressed: () =>
            controller.isOpen ? controller.close() : controller.open(),
      ),
    );
  }
}
