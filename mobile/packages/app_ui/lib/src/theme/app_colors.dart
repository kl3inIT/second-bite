import 'package:app_ui/app_ui.dart';
import 'package:app_ui/src/theme/tokens.g.dart';

/// {@template app_colors}
/// DESIGN.md's colour roles that Material's [ColorScheme] has no slot for,
/// under the same names as the web's. The rest are in [AppTheme]'s scheme.
/// {@endtemplate}
class AppColors extends ThemeExtension<AppColors> {
  /// {@macro app_colors}
  const new({
    required this.primaryHover,
    required this.secondaryHover,
    required this.destructiveHover,
    required this.inverseMuted,
    required this.header,
    required this.headerForeground,
    required this.headerRaised,
    required this.headerRaisedForeground,
    required this.headerBorder,
    required this.sweep,
    required this.sweepEdge,
    required this.link,
    required this.fresh,
    required this.freshForeground,
    required this.freshMuted,
    required this.rating,
    required this.success,
    required this.successForeground,
    required this.warning,
    required this.warningForeground,
    required this.warningBorder,
    required this.avatarForeground,
    required this.avatarClay,
    required this.avatarRose,
    required this.avatarIndigo,
    required this.avatarOlive,
  });

  /// The roles' values in DESIGN.md.
  static const light = AppColors(
    primaryHover: ColorTokens.primaryHover,
    secondaryHover: ColorTokens.secondaryHover,
    destructiveHover: ColorTokens.destructiveHover,
    inverseMuted: ColorTokens.inverseMuted,
    header: ColorTokens.header,
    headerForeground: ColorTokens.headerForeground,
    headerRaised: ColorTokens.headerRaised,
    headerRaisedForeground: ColorTokens.headerRaisedForeground,
    headerBorder: ColorTokens.headerBorder,
    sweep: ColorTokens.sweep,
    sweepEdge: ColorTokens.sweepEdge,
    link: ColorTokens.link,
    fresh: ColorTokens.fresh,
    freshForeground: ColorTokens.freshForeground,
    freshMuted: ColorTokens.freshMuted,
    rating: ColorTokens.rating,
    success: ColorTokens.success,
    successForeground: ColorTokens.successForeground,
    warning: ColorTokens.warning,
    warningForeground: ColorTokens.warningForeground,
    warningBorder: ColorTokens.warningBorder,
    avatarForeground: ColorTokens.avatarForeground,
    avatarClay: ColorTokens.avatarClay,
    avatarRose: ColorTokens.avatarRose,
    avatarIndigo: ColorTokens.avatarIndigo,
    avatarOlive: ColorTokens.avatarOlive,
  );

  /// Deep Leaf under the finger, on a primary button.
  final Color primaryHover;

  /// The leaf wash under the finger, on a soft button.
  final Color secondaryHover;

  /// Stamp Red under the finger.
  final Color destructiveHover;

  /// Secondary text on Deep Leaf or a dark photo scrim.
  final Color inverseMuted;

  /// The home's lime header, under the leaf sweep.
  final Color header;

  /// The place on the header.
  final Color headerForeground;

  /// The capsule and the search field on the header.
  final Color headerRaised;

  /// Text on [headerRaised].
  final Color headerRaisedForeground;

  /// The capsule's edge.
  final Color headerBorder;

  /// The leaf that sweeps across the header's top right.
  final Color sweep;

  /// The lighter band between the leaf and the lime.
  final Color sweepEdge;

  /// Text links and secondary actions.
  final Color link;

  /// Lime: the stock sticker, the discount chip, figures on Deep Leaf.
  final Color fresh;

  /// Lime ink, on [fresh] and [freshMuted].
  final Color freshForeground;

  /// A quiet lime surface.
  final Color freshMuted;

  /// The star beside a rating, always next to the figure.
  final Color rating;

  /// Paid, ready and collected orders, with an icon or a label.
  final Color success;

  /// Text on [success].
  final Color successForeground;

  /// The pale amber box of an allergen, waiting state or notice.
  final Color warning;

  /// Amber ink, on [warning].
  final Color warningForeground;

  /// The edge of a notice.
  final Color warningBorder;

  /// The initials of a seller without a photo.
  final Color avatarForeground;

  /// A seller avatar colour.
  final Color avatarClay;

  /// A seller avatar colour.
  final Color avatarRose;

  /// A seller avatar colour.
  final Color avatarIndigo;

  /// A seller avatar colour.
  final Color avatarOlive;

  @override
  AppColors copyWith({
    Color? primaryHover,
    Color? secondaryHover,
    Color? destructiveHover,
    Color? inverseMuted,
    Color? header,
    Color? headerForeground,
    Color? headerRaised,
    Color? headerRaisedForeground,
    Color? headerBorder,
    Color? sweep,
    Color? sweepEdge,
    Color? link,
    Color? fresh,
    Color? freshForeground,
    Color? freshMuted,
    Color? rating,
    Color? success,
    Color? successForeground,
    Color? warning,
    Color? warningForeground,
    Color? warningBorder,
    Color? avatarForeground,
    Color? avatarClay,
    Color? avatarRose,
    Color? avatarIndigo,
    Color? avatarOlive,
  }) {
    return AppColors(
      primaryHover: primaryHover ?? this.primaryHover,
      secondaryHover: secondaryHover ?? this.secondaryHover,
      destructiveHover: destructiveHover ?? this.destructiveHover,
      inverseMuted: inverseMuted ?? this.inverseMuted,
      header: header ?? this.header,
      headerForeground: headerForeground ?? this.headerForeground,
      headerRaised: headerRaised ?? this.headerRaised,
      headerRaisedForeground:
          headerRaisedForeground ?? this.headerRaisedForeground,
      headerBorder: headerBorder ?? this.headerBorder,
      sweep: sweep ?? this.sweep,
      sweepEdge: sweepEdge ?? this.sweepEdge,
      link: link ?? this.link,
      fresh: fresh ?? this.fresh,
      freshForeground: freshForeground ?? this.freshForeground,
      freshMuted: freshMuted ?? this.freshMuted,
      rating: rating ?? this.rating,
      success: success ?? this.success,
      successForeground: successForeground ?? this.successForeground,
      warning: warning ?? this.warning,
      warningForeground: warningForeground ?? this.warningForeground,
      warningBorder: warningBorder ?? this.warningBorder,
      avatarForeground: avatarForeground ?? this.avatarForeground,
      avatarClay: avatarClay ?? this.avatarClay,
      avatarRose: avatarRose ?? this.avatarRose,
      avatarIndigo: avatarIndigo ?? this.avatarIndigo,
      avatarOlive: avatarOlive ?? this.avatarOlive,
    );
  }

  @override
  AppColors lerp(AppColors? other, double t) {
    if (other is! AppColors) return this;
    return AppColors(
      primaryHover: Color.lerp(primaryHover, other.primaryHover, t)!,
      secondaryHover: Color.lerp(secondaryHover, other.secondaryHover, t)!,
      destructiveHover: Color.lerp(
        destructiveHover,
        other.destructiveHover,
        t,
      )!,
      inverseMuted: Color.lerp(inverseMuted, other.inverseMuted, t)!,
      header: Color.lerp(header, other.header, t)!,
      headerForeground: Color.lerp(
        headerForeground,
        other.headerForeground,
        t,
      )!,
      headerRaised: Color.lerp(headerRaised, other.headerRaised, t)!,
      headerRaisedForeground: Color.lerp(
        headerRaisedForeground,
        other.headerRaisedForeground,
        t,
      )!,
      headerBorder: Color.lerp(headerBorder, other.headerBorder, t)!,
      sweep: Color.lerp(sweep, other.sweep, t)!,
      sweepEdge: Color.lerp(sweepEdge, other.sweepEdge, t)!,
      link: Color.lerp(link, other.link, t)!,
      fresh: Color.lerp(fresh, other.fresh, t)!,
      freshForeground: Color.lerp(freshForeground, other.freshForeground, t)!,
      freshMuted: Color.lerp(freshMuted, other.freshMuted, t)!,
      rating: Color.lerp(rating, other.rating, t)!,
      success: Color.lerp(success, other.success, t)!,
      successForeground: Color.lerp(
        successForeground,
        other.successForeground,
        t,
      )!,
      warning: Color.lerp(warning, other.warning, t)!,
      warningForeground: Color.lerp(
        warningForeground,
        other.warningForeground,
        t,
      )!,
      warningBorder: Color.lerp(warningBorder, other.warningBorder, t)!,
      avatarForeground: Color.lerp(
        avatarForeground,
        other.avatarForeground,
        t,
      )!,
      avatarClay: Color.lerp(avatarClay, other.avatarClay, t)!,
      avatarRose: Color.lerp(avatarRose, other.avatarRose, t)!,
      avatarIndigo: Color.lerp(avatarIndigo, other.avatarIndigo, t)!,
      avatarOlive: Color.lerp(avatarOlive, other.avatarOlive, t)!,
    );
  }
}
