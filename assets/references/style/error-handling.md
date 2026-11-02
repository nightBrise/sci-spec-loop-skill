# Error-handling principles

The general principles for designing and reviewing failures, recovery,
retries, background work, and user-visible error reports. Project-specific
error conventions and report formats stay with the project; this file owns
the principles those conventions must satisfy.

## Typed, structured failures

- Give expected failures declared types, stable discriminants, and the details
  handling needs.
- Reuse the owning package's error conventions; preserve causes; keep machine
  identity separate from display text.
- Never route handling by parsing messages.
- Unexpected defects may remain plain errors; containment must never turn
  them into success.

## Catch, recover, or stop

- For each failure, define the handling owner, the reporting owner,
  containment, and guarantees in the owning API's documentation: valid
  invariants; absent, partial, committed, or unknown effects; cleanup
  responsibility. Background work carries the same obligations.
- Catching limits propagation, not mutations. Only the owner of the affected
  state can establish safe continuation; otherwise stop dependent work,
  discard invalid state or instances, or escalate.
- Logging alone is not recovery.
- Retry only when repetition is safe, cancelable, and owned. Finite operations
  need budgets; continuing supervision needs lifecycle ownership and
  observable degradation.

## Localized, actionable, visible reports

- Every final report states a readable summary, the affected operation, and a
  safe next action.
- Localize through the receiving application's localization mechanism where
  one exists; other diagnostics use their existing output language.
- Keep sensitive internal details out of user-facing text.
- Untrusted state and unknown outcomes must be visible through the
  user-facing surface or default-enabled, accessible logs: impact,
  uncertainty, system disposition, and safe next step. Persistent invalid
  state needs persistent visibility.
- Never claim success, rollback, or safe retry without guarantees; a failing
  reporting path needs an independent fallback.
- Verify resulting state and visible outcomes, not merely that an exception
  was caught.

## Foundations

Meyer's *Object-Oriented Software Construction* (1997): contracts and
invariants. Sutter's *Exceptional C++* (1999): exception-safety guarantees.
Armstrong's [thesis](https://www.erlang.org/download/armstrong_thesis_2003.pdf)
(2003): isolation and supervision.
