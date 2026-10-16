# Production-first persistence

## Policy

Data with a lifecycle beyond one process, or data that must survive a restart or a deployment, uses PostgreSQL, versioned migrations, database-enforced constraints, transactions, backup and recovery in the same increment.

In-memory or embedded databases are allowed only for isolated tests of code that does not touch SQL, or for explicitly disposable experiments. They never replace the PostgreSQL path to reduce scope; store and migration tests run against PostgreSQL in a container.

A temporary runtime mode, command or endpoint is not a substitute for a missing product write flow ([change design](../conventions.md#change-design)).

## Schema ownership

- Versioned migrations own the schema. Application code never creates or alters tables at runtime.
- Migrations are numbered, named `<n>_<module>_<description>.sql` in snake case, for example `0003_reservation_create_reservations.sql`, and kept with the backend.
- A version belongs to one migration. Branches open at the same time take the same next number, so the number is settled when the branch takes in `main` before it merges: renumber yours after the highest on `main`, and fix the references to the old name. A check fails on a shared version and on a name outside the rule.
- Every table has exactly one owning module. Only the owner writes it and only the owner's persistence code reads it; other modules use the owner's published API.
- A table a library reads and writes (a job queue, a session store) is created by a migration too, in the migration of the module that first needs it, and only the library touches it.
- Uniqueness, referential integrity, non-negative quantities and deletion behavior belong in database constraints when the database is the final concurrency authority.

## Implementation boundaries

- Application code owns authorization, input validation, orchestration, transaction boundaries, domain transition decisions and typed failure mapping. It does not build SQL strings, map rows or implement lock mechanics.
- Persistence lives in the owning module's store. SQL is written as SQL and checked at build time (the backend's choice is in the [backend guideline](backend.md#persistence)).
- A module has what its screens need, not a fixed set of files: the writes of its create, edit and state-change flows, and read queries that map rows straight to the response a list or detail needs.
- Group queries by aggregate, use case, projection or consistency boundary, not one store per table. Read projections get their own queries rather than inflating a write path.
- Do not add an interface in front of a module's own store; its one implementation is tested against PostgreSQL.
- Do not create parallel domain, row, DTO and mapper layers. A row type stays inside its module; a module never holds another module's row type, only its identifier.
- One transaction per command that coordinates several writes, opened by the application code that owns the command.
- A quantity that concurrent commands may change, such as the units left on an offer, is changed by a conditional update (`... WHERE units_left >= $n`) or under an explicit row lock, never by reading, computing and writing back.
- Choose the read plan per use case and never let a list issue one query per row.
- Money is stored as whole Vietnamese đồng in `bigint`; never as a floating-point number.
- Times are stored as `timestamptz` and shown in Vietnam time (`Asia/Ho_Chi_Minh`).
- Locations are PostGIS `geography(Point, 4326)`; a distance query uses an index-backed predicate such as `ST_DWithin`.

## Deletion

- Soft delete is not a default of every table. A record that others have seen or acted on (a published offer, a reservation, a verified seller) changes status instead of being deleted: it carries the time it was withdrawn, cancelled or closed, keeps its row and its history, and leaves every public read.
- A draft nobody else saw, and personal data its owner deletes, are really deleted.
- Technical data (logs, expired codes, delivered jobs) is deleted by retention, not by a person.

## Schema evolution

- **Until the first staging deployment holds data**, migrations may be rewritten and local databases recreated. A pull request that rewrites a merged migration says so, because every developer must recreate their local database.
- **From the first staging deployment onward**, record its date here. Migrations are then forward-only and append-only: never edit an applied migration, and never reset, recreate or squash a database, schema or table to reach a cleaner model.
- A change to an existing shape transforms the existing rows in the migration, or in a bounded, idempotent backfill, and states what is kept, converted or deliberately lost. Losing data that people created needs a recorded owner decision.
- A migration that the previous release cannot run against is called out in the pull request, because rollback is then a database restore.

## Operations

- Local development uses a PostgreSQL container with PostGIS, pinned to the same image as the tests.
- Once a database holds real data, a backup is taken before every migration, and a restore is tested.
- The connection pool has an explicit size, connection lifetime and acquisition timeout, sized for the database host.
- Database credentials are managed values outside Git ([data and security](../conventions.md#data-and-security)).
