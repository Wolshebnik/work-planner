# Architecture — FSD

Use Feature-Sliced Design adapted for Expo + React Native.

## Layers

Use:

```text
src/
├── app/
├── pages/
├── widgets/
├── features/
├── entities/
└── shared/
```

Dependencies go only downward:

```text
app → pages → widgets → features → entities → shared
```

Do not import between unrelated slices of the same layer.

## Expo Router

`src/app` contains only Expo Router routes and layouts.

Route files must stay thin and only connect routing with pages.

Every route must use a folder with `index.tsx`:

```text
settings/index.tsx
settings/notifications/index.tsx
users/[id]/index.tsx
```

Do not create route files like `settings.tsx` or `notifications.tsx`.

## FSD placement

`pages` — complete application screens.

`widgets` — large independent UI blocks used to compose pages.

`features` — user actions and business capabilities: `create-shift`, `edit-shift`, `filter-schedule`, `login`.

`entities` — business/domain objects: `user`, `employee`, `shift`, `schedule`.

`shared` — generic code without project-specific business meaning: buttons, inputs, date helpers, Supabase client, config.

Start screen-specific code in `pages` and move it lower only when there is a real architectural reason.

Do not create features/entities/widgets for hypothetical future reuse.

## Slice segments

Use segments only when they are needed:

```text
ui/
model/
api/
lib/
config/
```

`ui` — React Native components, visual composition and presentation logic.

`model` — state, business rules, hooks, types, schemas and validation.

`api` — Supabase queries, mutations and external data access.

`lib` — private helpers belonging to the slice.

`config` — slice-specific configuration.

Do not create empty folders just to satisfy FSD structure.

## Decomposition

Do not put an entire screen, business logic, API calls and UI into one large file.

Split code by responsibility, not by arbitrary file length.

Extract UI when a block has its own responsibility, meaningful structure or reuse.

Extract state/business logic into `model` when it becomes non-trivial or independent from rendering.

Extract Supabase and network operations into `api`.

Keep small local handlers, trivial calculations, constants and component-specific logic in the component when extraction would only create meaningless files.

Prefer cohesive files over artificial decomposition.

A file may stay as one file when it represents one clear responsibility and remains easy to understand.

If a file starts handling multiple responsibilities, decompose it.

## Public API

Each reusable slice should expose its external API through `index.ts`.

Prefer:

```ts
import { ShiftCard } from '@/entities/shift';
```

instead of importing internal files of another slice.

Do not expose private implementation without a reason.

## Decision process

Before creating code, determine:

1. Route → `app`
2. Full screen → `pages`
3. Large reusable screen block → `widgets`
4. User/business action → `features`
5. Domain object → `entities`
6. Generic infrastructure/UI/helper → `shared`

Then determine the segment:

```text
rendering/UI        → ui
state/business      → model
Supabase/network    → api
private helper      → lib
configuration       → config
```

Always inspect the existing structure before creating a new slice.

Prefer extending an existing appropriate slice instead of creating duplicate concepts.

Keep routes thin, pages readable, components focused, and business/API logic separated from presentation.
