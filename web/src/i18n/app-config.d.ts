import type messages from "../../messages/vi.json";

import type { formats } from "./formats";
import type { routing } from "./routing";

// Message keys, named formats and locales are checked by the compiler; vi.json is the reference catalog.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
    Formats: typeof formats;
  }
}
