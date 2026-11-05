# Second Bite

*A second chance for good food.*

Second Bite is a non-profit, bilingual (Vietnamese and English) platform for genuine food surplus in Vietnam. Shops and restaurants offer edible food and ingredients they would otherwise throw away, at a lower price and without paying any commission; nearby customers order confirmed stock, pay the seller at the counter during the pilot, and collect it there, the seller's staff matching the order by its QR code or by name and phone number. The first pilot runs with the food and beverage outlets of Tasco Mall in Việt Hưng ward, Hanoi.

## State of the repository

The pilot runs on production at `secondbite.vadan.app`, with staging at `preview.secondbite.vadan.app`: a Go service over PostgreSQL ([how to run it](docs/runbooks/backend.md)), the Next.js web for customers, stores and admins, and a Flutter app still short of its ordering and store screens; [ARCHITECTURE.md](ARCHITECTURE.md) says what each does. The repository also holds the product brief, the vision and roadmap, the engineering conventions, the research done before design, and the pilot's domain model.

| Start here | For |
| --- | --- |
| [AGENTS.md](AGENTS.md) | The map of the repository and the working rules, for people and coding agents |
| [docs/brief/](docs/brief/second-bite-app-requirements-it.md) | The founder's requirements and brief |
| [docs/vision.md](docs/vision.md) | What the product must achieve and its principles |
| [docs/roadmap.md](docs/roadmap.md) | What is delivered, active and next |
| [docs/conventions.md](docs/conventions.md) | Engineering rules that hold in any language |
| [ARCHITECTURE.md](ARCHITECTURE.md) | What is built today |

Work is tracked in Linear.
