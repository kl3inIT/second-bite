import 'package:app_ui/app_ui.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/core/routes.dart';
import 'package:second_bite/features/offer/domain/offer_summary.dart';
import 'package:second_bite/features/offer/ui/offer_format.dart';
import 'package:second_bite/features/offer/ui/seller_dish.dart';
import 'package:second_bite/features/offer/ui/seller_offers.dart';
import 'package:second_bite/features/order/ui/cart_parts.dart';
import 'package:second_bite/features/seller/ui/follow_button.dart';
import 'package:second_bite/l10n/l10n.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';

/// Where the site answers, for a store's link to share: the address a
/// person opens in a browser, whichever API the app calls.
const siteOrigin = 'https://secondbite.vadan.app';

/// {@template seller_screen}
/// A store's dishes tonight, as the web's `/sellers/[id]` on a phone (Figma
/// K4b): its dishes' photographs with back and share; its name and floor;
/// tonight's window, the counter and the way there; a search of its dishes;
/// tabs by kind when it sells more than one; each dish with its − and +,
/// opening its sheet; and the cart's bar. [at] is the dish a link led to,
/// [q] the words searched for.
/// {@endtemplate}
class SellerScreen extends ConsumerStatefulWidget {
  /// {@macro seller_screen}
  const new({required this.sellerId, this.kind, this.q, this.at, super.key});

  /// The store.
  final String sellerId;

  /// The tab: one kind, or every kind when null.
  final FoundBodyKind? kind;

  /// Words to look for among its dishes.
  final String? q;

  /// The dish a link led to.
  final String? at;

  @override
  ConsumerState<SellerScreen> createState() => _SellerScreenState();
}

class _SellerScreenState extends ConsumerState<SellerScreen> {
  final GlobalKey _focused = GlobalKey();
  bool _scrolled = false;

  static const int _coverPhotos = 3;

  // Once the dishes show, the page scrolls to the dish a link led to.
  void _scrollToFocused() {
    if (_scrolled || widget.at == null) return;
    _scrolled = true;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final target = _focused.currentContext;
      if (target != null) Scrollable.ensureVisible(target, alignment: 0.2);
    });
  }

  void _back() {
    if (context.canPop()) {
      context.pop();
    } else {
      const HomeRoute().go(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    final offers = ref.watch(sellerOffersProvider(widget.sellerId));
    final available = offers.value
        ?.where((offer) => offer.isAvailable)
        .toList();

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.light,
      child: Scaffold(
        bottomNavigationBar: const CartBar(),
        body: switch (offers) {
          AsyncData() when available!.isEmpty => _NothingTonight(onBack: _back),
          AsyncData(:final value) => _page(value, available!),
          AsyncError(:final error) => _Failure(
            error: error,
            onBack: _back,
            onRetry: () => ref
                .read(sellerOffersProvider(widget.sellerId).notifier)
                .reload(),
          ),
          _ => const Center(child: CircularProgressIndicator()),
        },
      ),
    );
  }

  Widget _page(List<OfferSummary> offers, List<OfferSummary> available) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;
    final lead = offers.first;
    final kind = widget.kind;
    final tabs = kindsByCount(offers);
    final words = plainText(widget.q?.trim() ?? '');
    final shown = available
        .where(
          (offer) =>
              (kind == null || offer.kind == kind) &&
              (words.isEmpty || plainText(offer.name).contains(words)),
        )
        .toList();
    _scrollToFocused();

    return RefreshIndicator(
      onRefresh: () =>
          ref.read(sellerOffersProvider(widget.sellerId).notifier).reload(),
      child: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: _Cover(
              offers: available.take(_coverPhotos).toList(),
              onBack: _back,
              onShare: () => SharePlus.instance.share(
                ShareParams(
                  title: lead.seller.name,
                  uri: Uri.parse('$siteOrigin/sellers/${lead.sellerId}'),
                ),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Transform.translate(
              offset: const Offset(0, -24),
              child: DecoratedBox(
                decoration: BoxDecoration(
                  color: scheme.surface,
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(RadiusTokens.radius3xl),
                  ),
                ),
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(
                    SpacingTokens.space4,
                    SpacingTokens.space4,
                    SpacingTokens.space4,
                    0,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    spacing: 14,
                    children: [
                      _Heading(lead: lead),
                      _Facts(lead: lead, offers: available),
                      _Search(
                        seller: lead.seller.name,
                        initial: widget.q,
                        onSubmitted: (q) => SellerRoute(
                          id: widget.sellerId,
                          kind: kind?.json,
                          q: q.trim().isEmpty ? null : q.trim(),
                        ).go(context),
                      ),
                      if (tabs.length > 1)
                        _KindTabs(
                          tabs: tabs,
                          current: kind,
                          onSelected: (each) => SellerRoute(
                            id: widget.sellerId,
                            kind: each?.json,
                          ).go(context),
                        ),
                      Semantics(
                        header: true,
                        child: Text(
                          kind == null
                              ? l10n.sellerTonight
                              : l10n.offerKind(kind.json ?? ''),
                          style: text.headline,
                        ),
                      ),
                      if (shown.isEmpty)
                        Text(
                          l10n.sellerNoMatch(widget.q ?? ''),
                          style: text.bodySm.copyWith(
                            color: scheme.onSurfaceVariant,
                          ),
                        )
                      else
                        for (final offer in shown)
                          SellerDish(
                            offer,
                            focused: offer.id == widget.at,
                            key: offer.id == widget.at ? _focused : null,
                          ),
                      const SizedBox(height: SpacingTokens.space4),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// The dishes' photographs side by side, under a scrim with back and share.
class _Cover extends StatelessWidget {
  const new({
    required this.offers,
    required this.onBack,
    required this.onShare,
  });

  final List<OfferSummary> offers;
  final VoidCallback onBack;
  final VoidCallback onShare;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final scheme = Theme.of(context).colorScheme;
    final placeholder = ColoredBox(color: scheme.secondary);

    return SizedBox(
      height: 200 + 24,
      child: Stack(
        fit: StackFit.expand,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              for (final offer in offers)
                Expanded(
                  child: Image.network(
                    photoUri(offer.photo.smallPath).toString(),
                    fit: BoxFit.cover,
                    excludeFromSemantics: true,
                    errorBuilder: (_, _, _) => placeholder,
                  ),
                ),
            ],
          ),
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            height: 120,
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    scheme.onSurface.withValues(alpha: 0.35),
                    scheme.onSurface.withValues(alpha: 0),
                  ],
                ),
              ),
            ),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: SpacingTokens.space4,
                vertical: SpacingTokens.space3,
              ),
              child: Align(
                alignment: Alignment.topCenter,
                child: Row(
                  spacing: SpacingTokens.space2,
                  children: [
                    _FloatButton(
                      icon: LucideIcons.chevronLeft,
                      label: l10n.topBarBack,
                      onPressed: onBack,
                    ),
                    const Spacer(),
                    // The heart that follows the store (SEC-109), between
                    // back and share as on the web.
                    if (offers.firstOrNull?.seller case final seller?)
                      FollowButton(
                        sellerId: seller.id,
                        name: seller.name,
                        look: FollowLook.float,
                      ),
                    _FloatButton(
                      icon: LucideIcons.share2,
                      label: l10n.sellerShare,
                      onPressed: onShare,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// A white round button over a photograph, as the web's `float` button.
class _FloatButton extends StatelessWidget {
  const new({required this.icon, required this.label, required this.onPressed});

  final IconData icon;
  final String label;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return IconButton(
      onPressed: onPressed,
      tooltip: label,
      icon: Icon(icon, size: 20),
      style: IconButton.styleFrom(
        backgroundColor: scheme.surface,
        foregroundColor: scheme.onSurface,
        fixedSize: const Size.square(44),
      ),
    );
  }
}

/// The store's avatar beside its name, over its floor.
class _Heading extends StatelessWidget {
  const new({required this.lead});

  final OfferSummary lead;

  @override
  Widget build(BuildContext context) {
    final text = context.appTextStyles;
    final photo = lead.seller.photo;

    return Row(
      spacing: SpacingTokens.space3,
      children: [
        AppSellerAvatar(
          name: lead.seller.name,
          seed: lead.seller.id,
          photo: photo == null
              ? null
              : NetworkImage(photoUri(photo.smallPath).toString()),
        ),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: 2,
            children: [
              Semantics(
                header: true,
                child: Text(lead.seller.name, style: text.headline),
              ),
              Text(
                lead.seller.address,
                style: text.bodySm.copyWith(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

/// Tonight's window over the counter, with the way there.
class _Facts extends StatelessWidget {
  const new({required this.lead, required this.offers});

  final OfferSummary lead;
  final List<OfferSummary> offers;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;
    final opens = offers
        .map((offer) => offer.windowStart)
        .reduce((a, b) => a.isBefore(b) ? a : b);
    final closes = offers
        .map((offer) => offer.windowEnd)
        .reduce((a, b) => a.isAfter(b) ? a : b);

    return DecoratedBox(
      decoration: BoxDecoration(
        border: Border.all(color: scheme.outlineVariant),
        borderRadius: BorderRadius.circular(RadiusTokens.lg),
      ),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(
          14,
          SpacingTokens.space3,
          6,
          SpacingTokens.space3,
        ),
        child: Row(
          spacing: SpacingTokens.space3,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                spacing: 2,
                children: [
                  Text(
                    l10n.sellerWindow(formatTime(opens), formatTime(closes)),
                    style: text.title,
                  ),
                  Text(
                    lead.collectionPoint.address,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: text.label.copyWith(color: scheme.onSurfaceVariant),
                  ),
                ],
              ),
            ),
            TextButton(
              onPressed: () => launchUrl(
                directionsUri(lead.collectionPoint),
                mode: LaunchMode.externalApplication,
              ),
              style: TextButton.styleFrom(
                foregroundColor: context.appColors.link,
                textStyle: text.labelStrong,
                minimumSize: const Size(44, 44),
              ),
              child: Text(l10n.sellerDirections),
            ),
          ],
        ),
      ),
    );
  }
}

/// A search of the store's dishes tonight (Figma K4b "tìm trong thực đơn").
class _Search extends StatelessWidget {
  const new({
    required this.seller,
    required this.initial,
    required this.onSubmitted,
  });

  final String seller;
  final String? initial;
  final ValueChanged<String> onSubmitted;

  @override
  Widget build(BuildContext context) {
    final label = context.l10n.sellerSearch(seller);
    final scheme = Theme.of(context).colorScheme;

    return TextFormField(
      initialValue: initial,
      textInputAction: TextInputAction.search,
      onFieldSubmitted: onSubmitted,
      decoration: InputDecoration(
        hintText: label,
        filled: true,
        fillColor: scheme.secondary,
        prefixIcon: const Icon(LucideIcons.search, size: 20),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(RadiusTokens.full),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }
}

/// The tabs by kind, every kind first.
class _KindTabs extends StatelessWidget {
  const new({
    required this.tabs,
    required this.current,
    required this.onSelected,
  });

  final List<FoundBodyKind> tabs;
  final FoundBodyKind? current;
  final ValueChanged<FoundBodyKind?> onSelected;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;

    return Semantics(
      label: l10n.sellerKinds,
      container: true,
      child: DecoratedBox(
        decoration: BoxDecoration(
          border: Border(bottom: BorderSide(color: scheme.outlineVariant)),
        ),
        child: SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            spacing: SpacingTokens.space6,
            children: [
              for (final each in <FoundBodyKind?>[null, ...tabs])
                Semantics(
                  selected: each == current,
                  button: true,
                  child: InkWell(
                    onTap: () => onSelected(each),
                    child: Container(
                      constraints: const BoxConstraints(minHeight: 44),
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        border: Border(
                          bottom: BorderSide(
                            width: 3,
                            color: each == current
                                ? scheme.primary
                                : Colors.transparent,
                          ),
                        ),
                      ),
                      child: Text(
                        each == null
                            ? l10n.sellerOnSale
                            : l10n.offerKind(each.json ?? ''),
                        style: text.title.copyWith(
                          color: each == current
                              ? scheme.primary
                              : scheme.onSurfaceVariant,
                        ),
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

/// A store with nothing on sale tonight, which the API gives no name for.
class _NothingTonight extends StatelessWidget {
  const new({required this.onBack});

  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    return _CardPage(
      onBack: onBack,
      children: [
        Semantics(
          header: true,
          child: Text(
            l10n.sellerNothing,
            style: context.appTextStyles.headline,
            textAlign: TextAlign.center,
          ),
        ),
        AppButton(
          variant: AppButtonVariant.secondary,
          onPressed: () => const HomeRoute().go(context),
          child: Text(l10n.sellerHome),
        ),
      ],
    );
  }
}

/// The store's dishes could not be loaded: the server's words when it gave
/// some, its reference, and a retry.
class _Failure extends StatelessWidget {
  const new({required this.error, required this.onBack, required this.onRetry});

  final Object error;
  final VoidCallback onBack;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final problem = problemOf(error);
    final reference = problem?.requestId;

    return _CardPage(
      onBack: onBack,
      children: [
        Semantics(
          header: true,
          child: Text(l10n.errorTitle, style: text.headline),
        ),
        Text(
          problem?.detail ??
              (problem == null ? l10n.errorOffline : l10n.errorBody),
        ),
        if (reference != null)
          Text(l10n.errorReference(reference), style: text.label),
        FilledButton(onPressed: onRetry, child: Text(l10n.errorRetry)),
      ],
    );
  }
}

class _CardPage extends StatelessWidget {
  const new({required this.onBack, required this.children});

  final VoidCallback onBack;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.all(SpacingTokens.space4),
        children: [
          Align(
            alignment: AlignmentDirectional.centerStart,
            child: IconButton(
              onPressed: onBack,
              tooltip: context.l10n.topBarBack,
              icon: const Icon(LucideIcons.chevronLeft),
            ),
          ),
          const SizedBox(height: SpacingTokens.space4),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(SpacingTokens.space6),
              child: Semantics(
                liveRegion: true,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  spacing: SpacingTokens.space4,
                  children: children,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
