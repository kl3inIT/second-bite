import 'dart:async';

import 'package:app_ui/app_ui.dart';
import 'package:second_bite/l10n/l10n.dart';

/// {@template resend_code}
/// "Gửi lại mã sau 0:28", then the button itself once the wait is over, for
/// the sign-in code and the deletion code alike: the server refuses a new code
/// for a minute (server/internal/identity, codeCooldown).
/// {@endtemplate}
class ResendCode extends StatefulWidget {
  /// {@macro resend_code}
  const new({
    required this.wait,
    required this.enabled,
    required this.onResend,
    super.key,
  });

  /// Seconds to wait before a new code can be asked for.
  final int wait;

  /// Whether the button can be pressed once the wait is over.
  final bool enabled;

  /// Asks for a new code.
  final VoidCallback onResend;

  @override
  State<ResendCode> createState() => _ResendCodeState();
}

class _ResendCodeState extends State<ResendCode> {
  late int _left = widget.wait;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _start();
  }

  @override
  void didUpdateWidget(ResendCode oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.wait == 0 && _left > 0) {
      _timer?.cancel();
      _left = 0;
    }
  }

  void _start() {
    if (_left == 0) return;
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() => _left--);
      if (_left <= 0) timer.cancel();
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    if (_left > 0) {
      final time = '${_left ~/ 60}:${(_left % 60).toString().padLeft(2, '0')}';
      return Text(
        l10n.signInResendIn(time),
        style: context.appTextStyles.label.copyWith(
          color: Theme.of(context).colorScheme.onSurfaceVariant,
        ),
      );
    }
    return TextButton(
      onPressed: widget.enabled ? widget.onResend : null,
      style: TextButton.styleFrom(
        padding: EdgeInsets.zero,
        minimumSize: const Size(0, 44),
        foregroundColor: Theme.of(context).colorScheme.primary,
      ),
      child: Text(l10n.signInResend),
    );
  }
}
