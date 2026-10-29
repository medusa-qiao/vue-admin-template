---
name: typescript-best-practices
description: Use when implementing or reviewing TypeScript, Vue script setup, API DTOs, component contracts, state models, type narrowing, or reusable utilities in this Vue and Element Plus project.
license: MIT
---

# TypeScript best practices

Installed from `cursor/plugins` (pstack), then adapted for this project; source and changes are recorded in [SOURCE.md](SOURCE.md).

**First read [Project implementation rules](references/project-implementation.md).** Reuse existing domain types, utilities, composables, components and the HTTP client before adding abstractions. Preserve the target project's Vue syntax, compiler settings, formatting and validation commands. The necessary type and boundary principles are included locally; no additional principle skills are required.

| Rule                  | Summary                                                                                                                                                                                                                       |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Discriminated unions  | Model variants with a `kind` literal discriminant so impossible states can't be represented. No optional-field bags.                                                                                                          |
| Branded types         | Reuse existing ID types. Introduce a brand only for an actual risk of mixing distinct domain values; establish it with validation, not an unchecked cast.                                                                     |
| Constructive modeling | Represent valid states directly with unions or tuples where useful. Numeric ranges still require boundary checks; a plain `number` does not prove non-negative or finite values.                                              |
| Simplest total type   | Keep `T[]` while every operation on it stays total. Strengthen to `NonEmpty<T>` only where the loose type forces `!`, a cast, or a "should never happen" throw.                                                               |
| `unknown` over `any`  | External data is `unknown`.                                                                                                                                                                                                   |
| Schemas before guards | Before hand-writing a property-by-property type guard, use the repository's runtime schema library and infer the type from the schema, such as `z.infer`.                                                                     |
| Assertions            | Narrow or validate before claiming a type. No `as any`, double assertion or unchecked external-data assertion to silence errors. `as const` is a compile-time literal/readonly tool, not data validation or runtime freezing. |
| Narrowing hierarchy   | Discriminant switch > `in` operator > `typeof`/`instanceof` > user-defined type guard > `as`.                                                                                                                                 |
| Type guards           | Must verify the claim. A lying guard is worse than `as` because the bug hides behind a name that says it's safe. Name them `isX` or `hasX`.                                                                                   |
| Exhaustiveness        | Inline `const _exhaustive: never = x;` in default arms so the compiler errors when a new variant is added.                                                                                                                    |
| `satisfies` over `as` | Checks assignability at compile time while retaining the expression's inferred type. It does not parse, sanitize or validate runtime input.                                                                                   |
| Boundary validation   | Parse untrusted inputs into a named domain type at their entry point. Reuse existing validators; do not duplicate validation throughout internal calls or assume legacy data was already validated.                           |
| Schema-derived types  | Reach for `Pick`/`Omit`/`Parameters`/`ReturnType`/`Awaited`/`typeof` before declaring a new interface.                                                                                                                        |
| Object args           | Follow existing public signatures. Use an options object when multiple same-typed parameters create ambiguity; do not rewrite a simple function or library API merely to enforce a style.                                     |
| Verification          | Use existing vue-tsc, ESLint and project tests. Test parsing failures and changed behavior when relevant; Node tests do not verify Vue interaction. Development API mocks remain valid when no backend is available.          |
| Structured telemetry  | Prefer structured logger diagnostics with enough context to debug from an id. No `console.log` in shipped code.                                                                                                               |

Examples: [TypeScript patterns](references/patterns.md). Zod examples illustrate an existing schema library, not an instruction to install it. Advanced types, brands and builders are optional techniques, not a requirement for every page.
