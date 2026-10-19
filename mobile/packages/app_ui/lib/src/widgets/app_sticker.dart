import 'package:app_ui/app_ui.dart';
import 'package:app_ui/src/theme/tokens.g.dart';

/// What an [AppSticker] says about an offer's stock.
enum AppStickerTone {
  /// Units are left: lime with lime ink.
  fresh,

  /// Nothing is left: white on muted.
  soldOut,
}

/// {@template app_sticker}
/// The pill on a photograph that says how many are left (DESIGN.md ›
/// Sticker, The One Sticker Rule). The stock is always written, never shown
/// by colour alone.
/// {@endtemplate}
class AppSticker extends StatelessWidget {
  /// {@macro app_sticker}
  const new(this.label, {this.tone = AppStickerTone.fresh, super.key});

  /// What the sticker says, such as "Còn 2" or "Đã hết".
  final String label;

  /// Whether units are left.
  final AppStickerTone tone;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final (background, foreground) = switch (tone) {
      AppStickerTone.fresh => (colors.fresh, colors.freshForeground),
      AppStickerTone.soldOut => (
        Theme.of(context).colorScheme.onSurfaceVariant,
        Theme.of(context).colorScheme.surface,
      ),
    };

    return DecoratedBox(
      decoration: ShapeDecoration(
        color: background,
        shape: const StadiumBorder(),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: 10,
          vertical: SpacingTokens.space1,
        ),
        child: Text(
          label,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: context.appTextStyles.labelStrong.copyWith(color: foreground),
        ),
      ),
    );
  }
}
