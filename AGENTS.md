# Behavioral guidelines for Codex

These rules apply to all work in this repository unless a more specific `AGENTS.md` in a subdirectory overrides them.

Core principle: prefer correctness, simplicity, and minimal changes over speed or speculative improvements.

## 1. Understand before editing

Do not guess when the repository can answer the question. Before changing code, read the relevant implementation and its surroundings; search for existing patterns, utilities, types, tests, conventions, configuration, and dependencies; and understand how the affected code is used.

Do not assume that a library, API, route, schema, environment variable, or convention exists: verify it. Prefer established implementations and materially simpler solutions. State an assumption explicitly when the repository and task context cannot resolve an ambiguity.

Do not implement from filenames or partial snippets when the implementation is available to inspect.

## 2. Simplicity first

Implement only what the request requires. Do not add unrequested features, one-off abstractions, generic frameworks for hypothetical work, unneeded configuration, compatibility layers without a real need, defensive handling for impossible states unless the project convention requires it, or dependencies already covered by the existing stack.

Prefer existing utilities and patterns, straightforward code, and small implementations. Reconsider the approach if it grows substantially beyond the problem.

## 3. Make surgical changes

Every changed line must relate to the task. Change only required files; preserve architecture unless its change is necessary; and match the existing naming, formatting, types, error handling, and file organization.

Do not refactor, reformat, rename, rewrite comments, or remove pre-existing dead code outside the requested scope. Report unrelated problems separately.

Remove imports, variables, functions, and paths made obsolete by your own change. Keep the diff focused.

## 4. Reuse before creating

Before creating a file, helper, hook, component, service, utility, type, interface, abstraction, or dependency, search for an existing equivalent. Reuse or extend it when that does not add complexity. Do not duplicate an implementation merely because a new file is easier.

## 5. Follow project conventions

The repository is the source of truth for project style. Inspect similar code before introducing a pattern and follow existing conventions for structure, naming, imports and exports, error handling, logging, dependency injection, configuration, validation, API responses, data access, state management, tests, comments, and documentation.

Do not replace established conventions with personal preferences unless explicitly asked.

## 6. Plan multi-step work

For non-trivial work, make a short, verifiable plan:

1. Locate the implementation.
2. Identify the smallest required change.
3. Implement it.
4. Run relevant verification.
5. Inspect the final diff.

For trivial changes, proceed directly. Planning is for execution, not unnecessary documentation.

## 7. Work toward verifiable outcomes

Turn vague tasks into observable success criteria. A bug fix requires identifying or reproducing the failing behavior, fixing its cause, and verifying it. Validation requires valid and invalid cases; a refactor requires preserved behavior; an endpoint requires route, input, output, error, and relevant test verification.

Code generation alone is not completion.

## 8. Verify your work

After a change, use the strongest practical verification available: relevant tests, type checks, linting, builds, formatting checks, targeted commands, and application-specific validation. Prefer a sufficient targeted check first.

For bug fixes, test the failing behavior; for features, the added behavior; for refactors, behavior before and after where practical. If verification cannot run, state exactly what was not verified and why. Do not claim it works without verification.

## 9. Inspect the final diff

Before completion, inspect for unrelated changes, accidental formatting, debug code, temporary logging, commented-out code, unused imports, duplication, needless abstractions, or generated files. Remove anything outside the task.

## 10. Do not hide problems

When a meaningful issue appears, identify it, distinguish it from the task, and say whether it blocks completion. Do not silently hide structural issues with hacks and do not claim a root cause without evidence.

Separate confirmed facts, reasonable conclusions, and unresolved assumptions.

## 11. Respect dependencies and APIs

Before using an external library or API, verify the dependency and version, inspect existing usage, and use APIs compatible with that version. Do not invent methods, options, configuration fields, or behavior. Verify uncertain behavior against relevant documentation. Do not upgrade dependencies unless required.

## 12. Tests should prove behavior

Write tests for behavior relevant to the change, not coverage. Prefer tests that reproduce bugs before fixing them, verify externally observable behavior, cover meaningful edges, and survive internal refactors. Avoid implementation-coupled tests unless the project already uses them.

## 13. Preserve user work

Treat uncommitted changes as user work. Do not revert, overwrite, reset, or discard unrelated modifications. In a dirty worktree, isolate your changes from existing work.

## 14. Completion criteria

Complete a task only when the requested behavior is implemented, project conventions are followed, unnecessary changes are avoided, relevant verification is performed where possible, the final diff is inspected, and limitations or unverified behavior are stated.

The objective is the smallest correct change that can be verified, not the most code.
