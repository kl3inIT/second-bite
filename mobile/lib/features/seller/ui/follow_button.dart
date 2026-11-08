import 'package:app_ui/app_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:second_bite/features/seller/data/follows.dart';
import 'package:second_bite/l10n/l10n.dart';

/// How a [FollowButton] looks where it stands.
enum FollowLook {
  /// The white round button over a store's photographs.
  float,

  /// The red heart of a card in "Yêu thích".
  card,
}

/// {@template follow_button}
/// The heart that follows a store (SEC-109), as the web's `FollowButton`:
/// filled while it is followed. A tap says what it did in a short note at
/// the foot, the latest replacing the one before.
/// {@endtemplate}
class FollowButton extends ConsumerStatefulWidget {
  /// {@macro follow_button}
  const new({
    required this.sellerId,
    required this.name,
    required this.look,
    super.key,
  });

  /// The store.
  final String sellerId;

  /// The store's name, read aloud with the button.
  final String name;

  /// Where it stands.
  final FollowLook look;

  @override
  ConsumerState<FollowButton> createState() => _FollowButtonState();
}

class _FollowButtonState extends ConsumerState<FollowButton> {
  bool _pending = false;

  Future<void> _toggle() async {
    final l10n = context.l10n;
    final messenger = ScaffoldMessenger.of(context);
    setState(() => _pending = true);
    String note;
    try {
      final following = await ref
          .read(followsProvider.notifier)
          .toggle(widget.sellerId);
      note = following ? l10n.favouritesAdded : l10n.favouritesRemoved;
    } on Object {
      note = l10n.favouritesFailed;
    }
    if (mounted) setState(() => _pending = false);
    messenger
      ..hideCurrentSnackBar()
      ..showSnackBar(
        SnackBar(
          content: Text(note),
          duration: const Duration(milliseconds: 2500),
        ),
      );
  }

  @override
  Widget build(BuildContext context) {
    final follows = ref.watch(followsProvider);
    final followed = follows.value?.ids.contains(widget.sellerId) ?? false;
    final scheme = Theme.of(context).colorScheme;
    final ready = follows.hasValue && !_pending;
    final icon = Icon(
      followed ? Icons.favorite : LucideIcons.heart,
      size: widget.look == FollowLook.card ? 22 : 20,
    );

    return Semantics(
      toggled: followed,
      child: IconButton(
        onPressed: ready ? _toggle : null,
        tooltip: context.l10n.favouritesFollow(widget.name),
        icon: icon,
        style: switch (widget.look) {
          FollowLook.float => IconButton.styleFrom(
            backgroundColor: scheme.surface,
            foregroundColor: followed ? scheme.error : scheme.onSurface,
            disabledBackgroundColor: scheme.surface,
            fixedSize: const Size.square(44),
          ),
          FollowLook.card => IconButton.styleFrom(
            foregroundColor: scheme.error,
            fixedSize: const Size.square(44),
          ),
        },
      ),
    );
  }
}
