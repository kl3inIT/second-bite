import 'package:app_ui/app_ui.dart';
import 'package:second_bite/features/legal/ui/legal_text.dart';
import 'package:second_bite/l10n/l10n.dart';

/// {@template legal_screen}
/// A legal page inside the app (SEC-52), as the web's `/terms` and
/// `/privacy`: the page's name in the top bar, the draft notice, then one card
/// with the date, the opening paragraph, the sections listed, each of which
/// scrolls to its section, and the sections themselves.
/// {@endtemplate}
class LegalScreen extends StatefulWidget {
  /// {@macro legal_screen}
  const new({required this.document, super.key});

  /// Which page to show.
  final LegalDocument document;

  @override
  State<LegalScreen> createState() => _LegalScreenState();
}

class _LegalScreenState extends State<LegalScreen> {
  /// One key per section, so the list of sections can scroll to it.
  final List<GlobalKey> _sectionKeys = [];

  /// As the web's `max-w-3xl`.
  static const double _maxWidth = 768;

  void _showSection(int index) {
    final target = _sectionKeys[index].currentContext;
    if (target == null) return;
    Scrollable.ensureVisible(
      target,
      duration: MediaQuery.disableAnimationsOf(context)
          ? Duration.zero
          : const Duration(milliseconds: 300),
    );
  }

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final colors = context.appColors;
    final scheme = Theme.of(context).colorScheme;
    final sections = widget.document.sections(l10n);
    while (_sectionKeys.length < sections.length) {
      _sectionKeys.add(GlobalKey());
    }

    return Scaffold(
      appBar: AppBar(title: Text(widget.document.title(l10n))),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(
          SpacingTokens.space4,
          SpacingTokens.space4,
          SpacingTokens.space4,
          SpacingTokens.space8,
        ),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: _maxWidth),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              spacing: SpacingTokens.space4,
              children: [
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(SpacingTokens.space4),
                    child: Text(l10n.legalDraft, style: text.bodySm),
                  ),
                ),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(SpacingTokens.space4),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      spacing: SpacingTokens.space6,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          spacing: SpacingTokens.space3,
                          children: [
                            Text(
                              l10n.legalUpdated(legalUpdated),
                              style: text.label.copyWith(
                                color: scheme.onSurfaceVariant,
                              ),
                            ),
                            Text(
                              widget.document.intro(l10n),
                              style: text.bodySm,
                            ),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Semantics(
                              header: true,
                              child: Text(
                                l10n.legalContents,
                                style: text.title,
                              ),
                            ),
                            const SizedBox(height: SpacingTokens.space2),
                            for (final (index, section) in sections.indexed)
                              Semantics(
                                link: true,
                                child: InkWell(
                                  onTap: () => _showSection(index),
                                  child: ConstrainedBox(
                                    constraints: const BoxConstraints(
                                      minHeight: 44,
                                    ),
                                    child: Align(
                                      alignment:
                                          AlignmentDirectional.centerStart,
                                      child: Text(
                                        section.title,
                                        style: text.bodySm.copyWith(
                                          color: colors.link,
                                          decoration: TextDecoration.underline,
                                          decorationColor: colors.link,
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                          ],
                        ),
                        for (final (index, section) in sections.indexed)
                          Column(
                            key: _sectionKeys[index],
                            crossAxisAlignment: CrossAxisAlignment.start,
                            spacing: SpacingTokens.space2,
                            children: [
                              Semantics(
                                header: true,
                                child: Text(section.title, style: text.title),
                              ),
                              Text(section.body, style: text.bodySm),
                            ],
                          ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
