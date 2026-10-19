import 'package:app_ui/app_ui.dart';
import 'package:second_bite/l10n/l10n.dart';

/// {@template home_screen}
/// The customer home: tonight's offers at Tasco Mall, as on the web's `/vi`.
/// The list arrives with the offer repository; for now it shows the heading.
/// {@endtemplate}
class HomeScreen extends StatelessWidget {
  /// {@macro home_screen}
  const new({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(context.l10n.appTitle)),
      body: Center(
        child: Text(
          context.l10n.homeTitle,
          style: Theme.of(context).textTheme.headlineSmall,
        ),
      ),
    );
  }
}
