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

## File Naming Conventions

- **UI component files**: File names in `ui/` must match the component name in `kebab-case`. For example, `EmployeeDetailsSheet` → `employee-details-sheet.tsx`, `DeleteConfirmationSheet` → `delete-confirmation-sheet.tsx`.
- **Model files**: Hooks, schemas, types and state files must be in `kebab-case` (`use-get-employees.ts`, `schema.ts`, `types.ts`, `mock-employees.ts`, `schedule-data.ts`).
- **No `index.ts` inside internal segments**: NEVER create `index.ts` inside `model/`, `ui/`, `api/`, or `lib/`. Files inside segments must have specific, descriptive names. `index.ts` is placed ONLY at the slice root.
- **API files**: API query/mutation files in `kebab-case` (`get-employees.ts`, `add-schedule-status.ts`).
- **Lib/helpers**: Private helper files in `kebab-case` (`prepare-weekly-data.ts`).

## Public API & Re-exports (`index.ts`)

Every slice (`entities/*`, `features/*`, `widgets/*`, `pages/*`) must have an `index.ts` file ONLY at its root acting as its single public entry point.

- **Explicit named exports only**: Explicitly re-export only what is intended for public consumption from `ui/`, `model/`, `api/`, `lib/`:
  ```ts
  export { EmployeeDetailsSheet } from './ui/employee-details-sheet';
  export { useGetEmployees } from './model/use-get-employees';
  export { getEmployees, type Employee } from './api/get-employees';
  ```
- **No wildcard exports**: Do not use `export * from ...`.
- **No internal imports**: Never import internal files of another slice directly (e.g. do not do `import { ... } from '@/features/employee-details/ui/...'`). Always import through the slice root:
  ```ts
  import { EmployeeDetailsSheet } from '@/features/employee-details';
  ```
- **Strict typing (No `any`)**: Never use `any` or `as any`. Use strict domain types and interfaces everywhere.
- Do not expose private slice implementation details without necessity.

Reusable UI components should accept an optional `className` prop and merge it
with their default classes through `cn`. Default styles must apply without
`className`; a passed value must extend or override them.

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
