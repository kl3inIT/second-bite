import 'package:app_ui/app_ui.dart';
import 'package:app_ui/src/theme/tokens.g.dart';

/// {@template app_text_styles}
/// DESIGN.md's thirteen type roles, under the same names as the web's
/// `text-*` utilities. [AppTheme] also fills Material's [TextTheme] from them.
/// {@endtemplate}
class AppTextStyles extends ThemeExtension<AppTextStyles> {
  /// {@macro app_text_styles}
  const new({
    this.label = TypeTokens.label,
    this.labelStrong = TypeTokens.labelStrong,
    this.bodySm = TypeTokens.bodySm,
    this.bodySmStrong = TypeTokens.bodySmStrong,
    this.body = TypeTokens.body,
    this.title = TypeTokens.title,
    this.button = TypeTokens.button,
    this.barTitle = TypeTokens.barTitle,
    this.headline = TypeTokens.headline,
    this.figureSm = TypeTokens.figureSm,
    this.price = TypeTokens.price,
    this.priceLg = TypeTokens.priceLg,
    this.display = TypeTokens.display,
  });

  /// Times, ratings, helper and legal lines, tab labels.
  final TextStyle label;

  /// Stock and status chips, the active tab, counters, initials.
  final TextStyle labelStrong;

  /// Supporting lines, item details, messages.
  final TextStyle bodySm;

  /// Names in lists, small actions.
  final TextStyle bodySmStrong;

  /// Running text and input values.
  final TextStyle body;

  /// Field labels, block titles, the name on a card.
  final TextStyle title;

  /// Button labels.
  final TextStyle button;

  /// The title in the top bar.
  final TextStyle barTitle;

  /// Section and sheet titles, a page's heading.
  final TextStyle headline;

  /// The discount chip.
  final TextStyle figureSm;

  /// The price on a card.
  final TextStyle price;

  /// The price on an offer and at checkout, totals.
  final TextStyle priceLg;

  /// Big figures only: the pickup code, the best discount tonight.
  final TextStyle display;

  @override
  AppTextStyles copyWith({
    TextStyle? label,
    TextStyle? labelStrong,
    TextStyle? bodySm,
    TextStyle? bodySmStrong,
    TextStyle? body,
    TextStyle? title,
    TextStyle? button,
    TextStyle? barTitle,
    TextStyle? headline,
    TextStyle? figureSm,
    TextStyle? price,
    TextStyle? priceLg,
    TextStyle? display,
  }) {
    return AppTextStyles(
      label: label ?? this.label,
      labelStrong: labelStrong ?? this.labelStrong,
      bodySm: bodySm ?? this.bodySm,
      bodySmStrong: bodySmStrong ?? this.bodySmStrong,
      body: body ?? this.body,
      title: title ?? this.title,
      button: button ?? this.button,
      barTitle: barTitle ?? this.barTitle,
      headline: headline ?? this.headline,
      figureSm: figureSm ?? this.figureSm,
      price: price ?? this.price,
      priceLg: priceLg ?? this.priceLg,
      display: display ?? this.display,
    );
  }

  @override
  AppTextStyles lerp(AppTextStyles? other, double t) {
    if (other is! AppTextStyles) return this;
    return AppTextStyles(
      label: TextStyle.lerp(label, other.label, t)!,
      labelStrong: TextStyle.lerp(labelStrong, other.labelStrong, t)!,
      bodySm: TextStyle.lerp(bodySm, other.bodySm, t)!,
      bodySmStrong: TextStyle.lerp(bodySmStrong, other.bodySmStrong, t)!,
      body: TextStyle.lerp(body, other.body, t)!,
      title: TextStyle.lerp(title, other.title, t)!,
      button: TextStyle.lerp(button, other.button, t)!,
      barTitle: TextStyle.lerp(barTitle, other.barTitle, t)!,
      headline: TextStyle.lerp(headline, other.headline, t)!,
      figureSm: TextStyle.lerp(figureSm, other.figureSm, t)!,
      price: TextStyle.lerp(price, other.price, t)!,
      priceLg: TextStyle.lerp(priceLg, other.priceLg, t)!,
      display: TextStyle.lerp(display, other.display, t)!,
    );
  }
}
