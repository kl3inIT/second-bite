import 'dart:async';

import 'package:app_ui/app_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:second_bite/core/routes.dart';
import 'package:second_bite/features/identity/ui/current_account.dart';
import 'package:second_bite/l10n/l10n.dart';

/// {@template account_action}
/// The header's account capsule, as the web's `AccountAction`: "Đăng nhập"
/// for anyone, back to [returnTo] afterwards, or the signed-in account's
/// button, whose menu names the address and signs out. While the kept
/// session is read, nothing shows in its place.
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
    final email = account.value?.email;
    if (email == null) return _SignInCapsule(returnTo: returnTo);
    return _AccountMenu(email: email);
  }
}

class _SignInCapsule extends StatelessWidget {
  const new({required this.returnTo});

  final String returnTo;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Semantics(
      button: true,
      child: InkWell(
        onTap: () => unawaited(SignInRoute(returnTo: returnTo).push(context)),
        customBorder: const StadiumBorder(),
        // The 32 point capsule inside a 44 point target, as on the web.
        child: ConstrainedBox(
          constraints: const BoxConstraints(minHeight: 44),
          child: Center(
            widthFactor: 1,
            child: DecoratedBox(
              decoration: BoxDecoration(
                color: colors.headerRaised,
                border: Border.all(color: colors.headerBorder),
                borderRadius: const BorderRadius.all(
                  Radius.circular(RadiusTokens.full),
                ),
              ),
              child: SizedBox(
                height: 32,
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: SpacingTokens.space3,
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    spacing: 6,
                    children: [
                      Icon(
                        LucideIcons.userRound,
                        size: 16,
                        color: colors.headerRaisedForeground,
                      ),
                      Text(
                        context.l10n.accountSignIn,
                        style: context.appTextStyles.labelStrong.copyWith(
                          color: colors.headerRaisedForeground,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _AccountMenu extends ConsumerWidget {
  const new({required this.email});

  final String email;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = context.l10n;
    final colors = context.appColors;
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
      builder: (context, controller, _) => IconButton(
        tooltip: l10n.accountMenu(email),
        onPressed: () =>
            controller.isOpen ? controller.close() : controller.open(),
        style: IconButton.styleFrom(
          backgroundColor: colors.headerRaised,
          foregroundColor: colors.headerRaisedForeground,
          side: BorderSide(color: colors.headerBorder),
        ),
        icon: const Icon(LucideIcons.userRound, size: 16),
      ),
    );
  }
}
