import 'package:app_ui/app_ui.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:second_bite/features/order/data/last_contact.dart';
import 'package:second_bite/features/order/domain/contact.dart';
import 'package:second_bite/l10n/l10n.dart';

/// Asks who collects in a sheet over the cart, then checks the phone number
/// once in a dialog, as the web's `OrderButton` (SEC-76 › decision 7):
/// "Sửa" goes back to the sheet. The contact confirmed is remembered on the
/// phone and answered; null when the person closes either.
Future<Contact?> askContact(BuildContext context, WidgetRef ref) async {
  var contact = await ref.read(lastContactProvider.future);
  while (true) {
    if (!context.mounted) return null;
    final given = await showModalBottomSheet<Contact>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      showDragHandle: true,
      builder: (_) => ContactSheet(initial: contact),
    );
    if (given == null || !context.mounted) return null;
    contact = given;
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (_) => PhoneCheck(phone: given.phone),
    );
    if (confirmed == null) return null;
    if (confirmed) {
      await ref.read(lastContactProvider.notifier).save(given);
      return given;
    }
  }
}

/// {@template contact_sheet}
/// "Người đến nhận": the name the store calls and the number it rings if
/// needed, with the web's rules (`contact.ts`, the server's); the fields
/// are checked when sent, then as they change. Pops the contact, trimmed and
/// normalized.
/// {@endtemplate}
class ContactSheet extends StatefulWidget {
  /// {@macro contact_sheet}
  const new({required this.initial, super.key});

  /// The contact given last on this phone.
  final Contact initial;

  @override
  State<ContactSheet> createState() => _ContactSheetState();
}

class _ContactSheetState extends State<ContactSheet> {
  late final _name = TextEditingController(text: widget.initial.name);
  late final _phone = TextEditingController(text: widget.initial.phone);
  bool _checked = false;

  @override
  void dispose() {
    _name.dispose();
    _phone.dispose();
    super.dispose();
  }

  void _submit() {
    setState(() => _checked = true);
    if (nameInvalid(_name.text) || phoneInvalid(_phone.text)) return;
    Navigator.of(context)
        .pop((name: _name.text.trim(), phone: normalizedPhone(_phone.text)));
  }

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;
    final nameError = _checked && nameInvalid(_name.text)
        ? l10n.cartNameInvalid
        : null;
    final phoneError = _checked && phoneInvalid(_phone.text)
        ? l10n.cartPhoneInvalid
        : null;

    return Padding(
      padding: EdgeInsets.only(
        left: SpacingTokens.space4,
        right: SpacingTokens.space4,
        bottom: MediaQuery.viewInsetsOf(context).bottom + SpacingTokens.space6,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: SpacingTokens.space4,
        children: [
          Row(
            children: [
              Expanded(
                child: Semantics(
                  header: true,
                  child: Text(l10n.cartContactTitle, style: text.headline),
                ),
              ),
              IconButton(
                onPressed: () => Navigator.of(context).pop(),
                tooltip: l10n.cartClose,
                icon: const Icon(LucideIcons.x),
              ),
            ],
          ),
          Text(
            l10n.cartContactHint,
            style: text.bodySm.copyWith(color: scheme.onSurfaceVariant),
          ),
          TextField(
            controller: _name,
            textInputAction: TextInputAction.next,
            textCapitalization: TextCapitalization.words,
            autofillHints: const [AutofillHints.name],
            inputFormatters: [LengthLimitingTextInputFormatter(maxNameLength)],
            onChanged: (_) => setState(() {}),
            decoration: InputDecoration(
              labelText: l10n.cartNameLabel,
              errorText: nameError,
            ),
          ),
          TextField(
            controller: _phone,
            keyboardType: TextInputType.phone,
            textInputAction: TextInputAction.done,
            autofillHints: const [AutofillHints.telephoneNumberNational],
            inputFormatters: [LengthLimitingTextInputFormatter(20)],
            onChanged: (_) => setState(() {}),
            onSubmitted: (_) => _submit(),
            decoration: InputDecoration(
              labelText: l10n.cartPhoneLabel,
              errorText: phoneError,
            ),
          ),
          AppButton(onPressed: _submit, child: Text(l10n.cartContactSubmit)),
        ],
      ),
    );
  }
}

/// {@template phone_check}
/// The phone number read back once before ordering, grouped as 0900 000 000:
/// pops true to order, false to edit.
/// {@endtemplate}
class PhoneCheck extends StatelessWidget {
  /// {@macro phone_check}
  const new({required this.phone, super.key});

  /// The number, normalized.
  final String phone;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;

    return AlertDialog(
      title: Text(l10n.cartConfirmTitle),
      content: Text(groupedPhone(phone), style: context.appTextStyles.headline),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(false),
          child: Text(l10n.cartConfirmEdit),
        ),
        FilledButton(
          onPressed: () => Navigator.of(context).pop(true),
          child: Text(l10n.cartConfirmYes),
        ),
      ],
    );
  }
}
