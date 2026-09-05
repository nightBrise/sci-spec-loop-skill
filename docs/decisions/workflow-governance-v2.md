# Decision: Spec-loop workflow governance, v2

Status: accepted
Date: 2026-09-05
Specs: none — governs the workflow skill repo itself

Location note: this repo has no product `docs/specs/` tree, so its own
governance decisions stay in `docs/decisions/` (see the README tree). Product
repos follow the `docs/specs/decisions/` path that the skills legislate.

## Problem

The `v2` in the title marks the second design iteration of this workflow's
decision governance; it is not a file revision and no v1 record exists.

The decision-recording vocabulary was duplicated across skills. The two
standalone Decision Record templates — one in `manage-decision-records`, one in
`simplification-audit` — conflicted in status vocabulary and section sets, and
the same decision was written twice (a `## Decisions` section in every spec plus
its mirror in the `.decisions.md` Decision Log). Both templates trace to the
same dsh Agent Note lifecycle machine, which the port split in two and
flattened: dsh carried the proposed / implemented / rejected lifecycle in
directory paths; the port flattened that into a single `Status:` line, kept
only `accepted`, and lost the migration rules. This design keeps the
`accepted` vocabulary and defines the state machine in the Decision section
below. (dsh = the
deepseek-harness Agent Notes lifecycle; its originals live only in the
local `archive/` directory, not in this repo.)

## Decision

Converge decision governance on the following model.

- A spec is a pure contract: `[Sn]` sections, Claims, Global Constraints. It
  carries no `## Decisions` section. Existing frozen specs that still contain
  one keep it as a frozen historical snapshot.
- The Decision Log (`<slug>.decisions.md`) is the single per-feature decision
  home. D1, D2, ... numbering runs continuously from brainstorm through
  acceptance. The `## Dn` entries are append-only and never deleted; the only
  sanctioned edits to an entry are appending a supersession or Status note in
  place and restating implemented decisions as present-tense shipped reality.
  The `## Progress` board in the same file is updated in place by the main
  agent.
- Standalone Decision Records (`docs/specs/decisions/`) hold durable
  cross-feature or cross-spec proposals and decisions (architecture choices,
  simplification-audit proposals, research guardrails). They are the only
  artifact with a lifecycle state machine: `proposed` → `accepted` or
  `rejected`, with `superseded` as a marker on top. Migration from proposed to
  accepted happens when the decision first ships, executed by the main agent on
  main after the implementing change merges; partial implementations note
  remaining gaps in `## Consequences`. The only physical deletion window is an
  audit-time verdict of obsolete rejected.
- The main agent is the single writer for decisions and progress. write-spec
  writes brainstorm-phase entries at freeze time; coders never write
  `docs/specs/*` and report design choices upward.
- The spec-freeze regime is retained unchanged: a frozen spec is not modified
  during implementation; substantial requirement changes abandon the spec and
  produce a new one; deviations are recorded in task reports and reconciled at
  the acceptance gate.
- One home per rule: manage-decision-records owns status vocabulary, migration,
  supersession, retention, and deletion; write-spec owns the spec and Decision
  Log entry formats; prose-quality owns the present-tense shipped-state rule;
  simplification-audit and structured-code-review reference, never duplicate.

## Alternatives Considered

- **Keep two templates with declared subordination (rejected):** the conflict
  merely downgrades from mutually exclusive to latent, and draft records have
  no defined home.
- **Single accepted-only template, proposals as log entries or TODOs
  (rejected):** durable cross-feature proposals become homeless again, and the
  shipped-reality review check loses the proposed-to-shipped transition it
  verifies.
- **One dsh-style artifact for everything (rejected):** dsh had no frozen work
  contract; a frozen, gated spec forces a separate appendable history, and
  per-feature bounded history cannot merge with a global topic corpus without
  exploding it.
- **Wave-scoped spec freezing (rejected for now):** keeping the spec mutable
  between dispatch waves buys flexibility that small specs plus cheap abandon
  already provide, at the cost of version bookkeeping and weaker autonomous
  acceptance. Revisit if freeze friction becomes real.

## Consequences

- Decision vocabulary has exactly two scopes: per-feature history (log) and
  cross-feature decisions (standalone). "Decision Record" now reads as the
  standalone artifact unless qualified.
- The spec approval gate must display the Decision Log's brainstorm entries
  alongside the spec, or brainstorm choices freeze without user review.
- Dispatch must bind specs to standalone records: the main agent reads the
  log's brainstorm entries and attaches referenced standalone DRs to
  implementer prompts.
- Supersession notes still apply to legacy frozen specs that carry a `## Decisions`
  section: do not edit the spec; append the note to that feature's Decision Log.
- Audits are explicitly triggered by the user or the main agent; they are not
  part of the dispatch loop, so the delete window opens only at audit time.
- The reviewer's Layer 2 gains a reverse check: flag design choices visible in
  the diff that no Decision Record or Log entry covers, so autonomous runs do
  not under-record decisions.
