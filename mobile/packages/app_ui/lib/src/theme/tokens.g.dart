// Generated from DESIGN.md by web/scripts/generate-tokens.mjs; do not edit.
// Run `pnpm generate:tokens` in web/.

import 'package:flutter/painting.dart';

/// The colour roles of DESIGN.md.
abstract final class ColorTokens {
  static const background = Color(0xFFEEF8FD);
  static const foreground = Color(0xFF0E1D19);
  static const card = Color(0xFFFFFFFF);
  static const cardForeground = Color(0xFF0E1D19);
  static const popover = Color(0xFFFFFFFF);
  static const popoverForeground = Color(0xFF0E1D19);
  static const primary = Color(0xFF0061AF);
  static const primaryForeground = Color(0xFFFFFFFF);
  static const primaryHover = Color(0xFF004E8C);
  static const inverseMuted = Color(0xFFD8F0FA);
  static const shell = Color(0xFFFFFFFF);
  static const shellForeground = Color(0xFF0E1D19);
  static const header = Color(0xFF0061AF);
  static const headerForeground = Color(0xFFFFFFFF);
  static const headerRaised = Color(0xFFFFFFFF);
  static const headerRaisedForeground = Color(0xFF0E1D19);
  static const headerBorder = Color(0xFFE0E8E4);
  static const sweep = Color(0xFF1C77BB);
  static const sweepEdge = Color(0xFF4395CC);
  static const deal = Color(0xFF004E8C);
  static const dealForeground = Color(0xFFFFFFFF);
  static const secondary = Color(0xFFD8F0FA);
  static const secondaryForeground = Color(0xFF004E8C);
  static const secondaryHover = Color(0xFFB1E1F5);
  static const muted = Color(0xFFEEF8FD);
  static const mutedForeground = Color(0xFF5A6B66);
  static const accent = Color(0xFFD8F0FA);
  static const accentForeground = Color(0xFF0061AF);
  static const link = Color(0xFF0061AF);
  static const fresh = Color(0xFFC6E67A);
  static const freshForeground = Color(0xFF2C4709);
  static const freshMuted = Color(0xFFEEF7D9);
  static const rating = Color(0xFFD99A12);
  static const destructive = Color(0xFFB42318);
  static const destructiveForeground = Color(0xFFFFFFFF);
  static const destructiveHover = Color(0xFF912018);
  static const success = Color(0xFF2E6B3F);
  static const successForeground = Color(0xFFFFFFFF);
  static const warning = Color(0xFFFFF6E5);
  static const warningForeground = Color(0xFF5E4200);
  static const warningBorder = Color(0xFFF0DBA8);
  static const border = Color(0xFFE0E8E4);
  static const input = Color(0xFF7D8C87);
  static const ring = Color(0xFF0061AF);
  static const avatarForeground = Color(0xFFFFFFFF);
  static const avatarClay = Color(0xFFA4512A);
  static const avatarRose = Color(0xFFB03B4E);
  static const avatarIndigo = Color(0xFF3A4F9A);
  static const avatarOlive = Color(0xFF5E6B1F);
}

/// The type roles of DESIGN.md.
abstract final class TypeTokens {
  static const label = TextStyle(
    fontFamily: 'Be Vietnam Pro',
    package: 'app_ui',
    fontSize: 12,
    fontWeight: FontWeight.w400,
    fontVariations: [FontVariation('wght', 400)],
    height: 17 / 12,
    letterSpacing: 0,
    leadingDistribution: TextLeadingDistribution.even,
  );
  static const labelStrong = TextStyle(
    fontFamily: 'Be Vietnam Pro',
    package: 'app_ui',
    fontSize: 12,
    fontWeight: FontWeight.w600,
    fontVariations: [FontVariation('wght', 600)],
    height: 17 / 12,
    letterSpacing: 0,
    leadingDistribution: TextLeadingDistribution.even,
  );
  static const bodySm = TextStyle(
    fontFamily: 'Be Vietnam Pro',
    package: 'app_ui',
    fontSize: 14,
    fontWeight: FontWeight.w400,
    fontVariations: [FontVariation('wght', 400)],
    height: 21 / 14,
    letterSpacing: 0,
    leadingDistribution: TextLeadingDistribution.even,
  );
  static const bodySmStrong = TextStyle(
    fontFamily: 'Be Vietnam Pro',
    package: 'app_ui',
    fontSize: 14,
    fontWeight: FontWeight.w600,
    fontVariations: [FontVariation('wght', 600)],
    height: 21 / 14,
    letterSpacing: 0,
    leadingDistribution: TextLeadingDistribution.even,
  );
  static const body = TextStyle(
    fontFamily: 'Be Vietnam Pro',
    package: 'app_ui',
    fontSize: 16,
    fontWeight: FontWeight.w400,
    fontVariations: [FontVariation('wght', 400)],
    height: 24 / 16,
    letterSpacing: 0,
    leadingDistribution: TextLeadingDistribution.even,
  );
  static const title = TextStyle(
    fontFamily: 'Be Vietnam Pro',
    package: 'app_ui',
    fontSize: 15,
    fontWeight: FontWeight.w600,
    fontVariations: [FontVariation('wght', 600)],
    height: 21 / 15,
    letterSpacing: 0,
    leadingDistribution: TextLeadingDistribution.even,
  );
  static const button = TextStyle(
    fontFamily: 'Be Vietnam Pro',
    package: 'app_ui',
    fontSize: 16,
    fontWeight: FontWeight.w600,
    fontVariations: [FontVariation('wght', 600)],
    height: 20 / 16,
    letterSpacing: 0,
    leadingDistribution: TextLeadingDistribution.even,
  );
  static const barTitle = TextStyle(
    fontFamily: 'Be Vietnam Pro',
    package: 'app_ui',
    fontSize: 17,
    fontWeight: FontWeight.w600,
    fontVariations: [FontVariation('wght', 600)],
    height: 22 / 17,
    letterSpacing: 0,
    leadingDistribution: TextLeadingDistribution.even,
  );
  static const headline = TextStyle(
    fontFamily: 'Be Vietnam Pro',
    package: 'app_ui',
    fontSize: 20,
    fontWeight: FontWeight.w700,
    fontVariations: [FontVariation('wght', 700)],
    height: 28 / 20,
    letterSpacing: 0,
    leadingDistribution: TextLeadingDistribution.even,
  );
  static const figureSm = TextStyle(
    fontFamily: 'Bricolage Grotesque',
    package: 'app_ui',
    fontSize: 12,
    fontWeight: FontWeight.w700,
    fontVariations: [FontVariation('wght', 700)],
    height: 16 / 12,
    letterSpacing: -0.12,
    leadingDistribution: TextLeadingDistribution.even,
  );
  static const price = TextStyle(
    fontFamily: 'Bricolage Grotesque',
    package: 'app_ui',
    fontSize: 16,
    fontWeight: FontWeight.w700,
    fontVariations: [FontVariation('wght', 700)],
    height: 18 / 16,
    letterSpacing: -0.16,
    leadingDistribution: TextLeadingDistribution.even,
  );
  static const priceLg = TextStyle(
    fontFamily: 'Bricolage Grotesque',
    package: 'app_ui',
    fontSize: 22,
    fontWeight: FontWeight.w700,
    fontVariations: [FontVariation('wght', 700)],
    height: 25 / 22,
    letterSpacing: -0.22,
    leadingDistribution: TextLeadingDistribution.even,
  );
  static const display = TextStyle(
    fontFamily: 'Bricolage Grotesque',
    package: 'app_ui',
    fontSize: 36,
    fontWeight: FontWeight.w700,
    fontVariations: [FontVariation('wght', 700)],
    height: 40 / 36,
    letterSpacing: -0.36,
    leadingDistribution: TextLeadingDistribution.even,
  );
}

/// The corner radii of DESIGN.md, in logical pixels.
abstract final class RadiusTokens {
  static const double sm = 8;
  static const double md = 12;
  static const double lg = 14;
  static const double xl = 16;
  static const double radius2xl = 20;
  static const double radius3xl = 24;
  static const double radius4xl = 32;
  static const double full = 9999;
}

/// The spacing steps of DESIGN.md, in logical pixels.
abstract final class SpacingTokens {
  static const double space1 = 4;
  static const double space2 = 8;
  static const double space3 = 12;
  static const double space4 = 16;
  static const double space6 = 24;
  static const double space8 = 32;
}

/// The shadows of DESIGN.md.
abstract final class ShadowTokens {
  static const sheet = [
    BoxShadow(color: Color(0x1F0E1D19), offset: Offset(0, -4), blurRadius: 24),
  ];
}
