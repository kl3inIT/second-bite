import 'package:app_ui/app_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:second_bite/core/not_found_screen.dart';
import 'package:second_bite/core/routes.dart';
import 'package:second_bite/features/offer/ui/seller_offers.dart';
import 'package:second_bite/l10n/l10n.dart';

/// {@template offer_link_screen}
/// A link to one dish, `/offers/:id`: a dish has no page of its own, so it
/// opens its store's page at the dish, as on the web; an offer the server
/// does not know is not found.
/// {@endtemplate}
class OfferLinkScreen extends ConsumerWidget {
  /// {@macro offer_link_screen}
  const new({required this.offerId, super.key});

  /// The dish.
  final String offerId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return switch (ref.watch(sellerOfOfferProvider(offerId))) {
      AsyncData(value: null) => const NotFoundScreen(),
      AsyncData(value: final String sellerId) => _Opening(
        () => SellerRoute(id: sellerId, at: offerId).go(context),
      ),
      AsyncError() => Scaffold(
        appBar: AppBar(),
        body: Center(
          child: FilledButton(
            onPressed: () => ref.invalidate(sellerOfOfferProvider(offerId)),
            child: Text(context.l10n.errorRetry),
          ),
        ),
      ),
      _ => const Scaffold(body: Center(child: CircularProgressIndicator())),
    };
  }
}

/// The store is known: it opens once this frame is drawn, since a route
/// cannot change while one is being built.
class _Opening extends StatelessWidget {
  const new(this.open);

  final VoidCallback open;

  @override
  Widget build(BuildContext context) {
    WidgetsBinding.instance.addPostFrameCallback((_) => open());
    return const Scaffold(body: Center(child: CircularProgressIndicator()));
  }
}
