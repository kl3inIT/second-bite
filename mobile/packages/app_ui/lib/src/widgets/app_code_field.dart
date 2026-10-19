import 'package:app_ui/app_ui.dart';
import 'package:flutter/services.dart';

/// {@template app_code_field}
/// The emailed code's field, as the web's `InputOTP` (DESIGN.md, Figma
/// "Đăng nhập" L2): one real text field drawn as [length] separate 48 by
/// 56 slots, so a paste or the keyboard's one-time-code suggestion fills
/// every slot at once. Whatever arrives keeps only its digits, at most
/// [length]: a code copied from a mail app often carries spaces or a line
/// break (WCAG 2.2, 3.3.8). [onCompleted] runs when the last digit arrives.
/// {@endtemplate}
class AppCodeField extends StatefulWidget {
  /// {@macro app_code_field}
  const new({
    required this.controller,
    required this.semanticLabel,
    this.length = 6,
    this.onCompleted,
    this.focusNode,
    this.invalid = false,
    this.enabled = true,
    super.key,
  });

  /// Holds the digits typed so far.
  final TextEditingController controller;

  /// What a screen reader calls the field, such as "The 6-digit code".
  final String semanticLabel;

  /// How many digits the code has.
  final int length;

  /// Called with the code once all [length] digits are in.
  final ValueChanged<String>? onCompleted;

  /// The field's focus, to move it here when the step opens.
  final FocusNode? focusNode;

  /// Whether the code was refused: the slots turn red.
  final bool invalid;

  /// Whether the field takes input.
  final bool enabled;

  @override
  State<AppCodeField> createState() => _AppCodeFieldState();
}

class _AppCodeFieldState extends State<AppCodeField> {
  FocusNode? _ownFocus;
  FocusNode get _focus => widget.focusNode ?? (_ownFocus ??= FocusNode());

  static const double _slotWidth = 48;
  static const double _slotHeight = 56;

  @override
  void initState() {
    super.initState();
    widget.controller.addListener(_changed);
    _focus.addListener(_changed);
  }

  @override
  void didUpdateWidget(AppCodeField oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller != widget.controller) {
      oldWidget.controller.removeListener(_changed);
      widget.controller.addListener(_changed);
    }
    if (oldWidget.focusNode != widget.focusNode) {
      (oldWidget.focusNode ?? _ownFocus)?.removeListener(_changed);
      _focus.addListener(_changed);
    }
  }

  @override
  void dispose() {
    widget.controller.removeListener(_changed);
    _focus.removeListener(_changed);
    _ownFocus?.dispose();
    super.dispose();
  }

  void _changed() => setState(() {});

  @override
  Widget build(BuildContext context) {
    final digits = widget.controller.text;
    final focused = _focus.hasFocus;
    final active = digits.length.clamp(0, widget.length - 1);

    final slots = Row(
      mainAxisSize: MainAxisSize.min,
      spacing: SpacingTokens.space2,
      children: [
        for (var i = 0; i < widget.length; i++)
          _Slot(
            digit: i < digits.length ? digits[i] : null,
            active: focused && i == active,
            invalid: widget.invalid,
            width: _slotWidth,
            height: _slotHeight,
          ),
      ],
    );

    return Opacity(
      opacity: widget.enabled ? 1 : 0.5,
      child: Stack(
        children: [
          ExcludeSemantics(child: slots),
          // The real field lies over the slots, unseen, so a tap focuses it
          // and a long press offers paste.
          Positioned.fill(
            child: Semantics(
              label: widget.semanticLabel,
              child: TextField(
                controller: widget.controller,
                focusNode: _focus,
                enabled: widget.enabled,
                keyboardType: TextInputType.number,
                textInputAction: TextInputAction.done,
                autofillHints: const [AutofillHints.oneTimeCode],
                inputFormatters: [
                  FilteringTextInputFormatter.digitsOnly,
                  LengthLimitingTextInputFormatter(widget.length),
                ],
                onChanged: (value) {
                  if (value.length == widget.length) {
                    widget.onCompleted?.call(value);
                  }
                },
                showCursor: false,
                enableSuggestions: false,
                autocorrect: false,
                style: const TextStyle(color: Colors.transparent),
                cursorColor: Colors.transparent,
                decoration: const InputDecoration(
                  filled: false,
                  border: InputBorder.none,
                  enabledBorder: InputBorder.none,
                  focusedBorder: InputBorder.none,
                  disabledBorder: InputBorder.none,
                  counterText: '',
                  contentPadding: EdgeInsets.zero,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _Slot extends StatelessWidget {
  const new({
    required this.digit,
    required this.active,
    required this.invalid,
    required this.width,
    required this.height,
  });

  final String? digit;
  final bool active;
  final bool invalid;
  final double width;
  final double height;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final edge = invalid
        ? scheme.error
        : active
        ? scheme.primary
        : scheme.outline;

    return Container(
      width: width,
      height: height,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: invalid
            ? Color.alphaBlend(
                scheme.error.withValues(alpha: 0.05),
                scheme.surface,
              )
            : scheme.surface,
        borderRadius: const BorderRadius.all(Radius.circular(RadiusTokens.lg)),
        border: Border.all(color: edge),
        boxShadow: active
            ? [
                BoxShadow(
                  color: edge.withValues(alpha: invalid ? 0.2 : 0.5),
                  spreadRadius: 3,
                ),
              ]
            : null,
      ),
      child: Text(digit ?? '', style: context.appTextStyles.priceLg),
    );
  }
}
