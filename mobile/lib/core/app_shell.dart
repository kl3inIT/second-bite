import 'package:app_ui/app_ui.dart';
import 'package:go_router/go_router.dart';
import 'package:second_bite/l10n/l10n.dart';

/// {@template app_shell}
/// The customer screens with the bottom bar, as the web's on a phone: home,
/// orders, saved and account. Orders and saved sellers have no screen yet
/// (SEC-15), so their tabs are shown but cannot be pressed, and a screen
/// reader hears that they are coming.
/// {@endtemplate}
class AppShell extends StatelessWidget {
  /// {@macro app_shell}
  const new({required this.navigationShell, super.key});

  /// The tabs' navigators, one per branch of the shell route.
  final StatefulNavigationShell navigationShell;

  // The bar's tabs by position, and the shell branch each one opens; null for
  // a tab without a screen yet.
  static const List<int?> _branches = [0, null, null, 1];

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final scheme = Theme.of(context).colorScheme;
    Widget soon(Widget destination) =>
        Semantics(hint: l10n.navSoon, child: destination);

    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: DecoratedBox(
        decoration: BoxDecoration(
          border: Border(top: BorderSide(color: scheme.outlineVariant)),
        ),
        child: Semantics(
          container: true,
          label: l10n.navLabel,
          child: NavigationBar(
            selectedIndex: _branches.indexOf(navigationShell.currentIndex),
            onDestinationSelected: (index) {
              final branch = _branches[index];
              if (branch == null) return;
              navigationShell.goBranch(
                branch,
                initialLocation: branch == navigationShell.currentIndex,
              );
            },
            destinations: [
              NavigationDestination(
                icon: const Icon(Icons.home_outlined),
                label: l10n.navHome,
              ),
              soon(
                NavigationDestination(
                  icon: const Icon(Icons.receipt_long_outlined),
                  label: l10n.navOrders,
                  enabled: false,
                ),
              ),
              soon(
                NavigationDestination(
                  icon: const Icon(Icons.favorite_border),
                  label: l10n.navSaved,
                  enabled: false,
                ),
              ),
              NavigationDestination(
                icon: const Icon(Icons.person_outline),
                label: l10n.navAccount,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
