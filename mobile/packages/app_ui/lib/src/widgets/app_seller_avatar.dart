import 'package:app_ui/app_ui.dart';

/// The two sizes of an [AppSellerAvatar].
enum AppSellerAvatarSize {
  /// 36 points with two initials, on an offer card's photograph.
  medium,

  /// 18 points with one initial, beside a seller's name in a grid card.
  small,
}

/// {@template app_seller_avatar}
/// A seller's photograph, or their initials on one of the avatar colours,
/// chosen from [seed] so the same seller always looks the same (DESIGN.md ›
/// Seller avatars), in a white ring. It repeats the name written beside it,
/// so screen readers skip it.
/// {@endtemplate}
class AppSellerAvatar extends StatelessWidget {
  /// {@macro app_seller_avatar}
  const new({
    required this.name,
    required this.seed,
    this.photo,
    this.size = AppSellerAvatarSize.medium,
    super.key,
  });

  /// The seller's name, from which the initials are taken.
  final String name;

  /// What picks the colour, such as the seller's id.
  final String seed;

  /// The seller's photograph, shown instead of the initials when given.
  final ImageProvider? photo;

  /// How large the avatar is drawn.
  final AppSellerAvatarSize size;

  /// The first letter of the first and of the last word, as "Lò Bánh Mây"
  /// becomes "LM"; one letter for a one-word name.
  static String initialsOf(String name) {
    final words = name.trim().split(RegExp(r'\s+'))
      ..removeWhere((word) => word.isEmpty);
    if (words.isEmpty) return '';
    String first(String word) => String.fromCharCode(word.runes.first);
    final letters = words.length == 1
        ? first(words.first)
        : first(words.first) + first(words.last);
    return letters.toUpperCase();
  }

  /// A stable index into [count] colours for [seed], the same small hash as
  /// the web's, so a seller has one colour in both apps.
  static int toneOf(String seed, int count) {
    var hash = 0;
    for (final rune in seed.runes) {
      hash = (hash * 31 + rune) & 0xFFFFFFFF;
    }
    return hash % count;
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final small = size == AppSellerAvatarSize.small;
    final diameter = small ? 18.0 : 36.0;
    final avatars = [
      colors.avatarClay,
      colors.avatarRose,
      colors.avatarIndigo,
      colors.avatarOlive,
    ];
    final initials = initialsOf(name);
    final letters = small && initials.isNotEmpty
        ? String.fromCharCode(initials.runes.first)
        : initials;
    final fallback = ColoredBox(
      color: avatars[toneOf(seed, avatars.length)],
      child: Center(
        // The circle keeps its size at any text scale; the letters shrink
        // into it instead of overflowing.
        child: FittedBox(
          fit: BoxFit.scaleDown,
          child: Text(
            letters,
            style: context.appTextStyles.labelStrong.copyWith(
              color: colors.avatarForeground,
              height: 1,
            ),
          ),
        ),
      ),
    );
    final image = photo;

    return ExcludeSemantics(
      child: Container(
        width: diameter,
        height: diameter,
        foregroundDecoration: ShapeDecoration(
          shape: CircleBorder(
            side: BorderSide(
              color: Theme.of(context).colorScheme.surface,
              width: small ? 1 : 2,
            ),
          ),
        ),
        child: ClipOval(
          child: image == null
              ? fallback
              : Image(
                  image: image,
                  fit: BoxFit.cover,
                  errorBuilder: (_, _, _) => fallback,
                ),
        ),
      ),
    );
  }
}
