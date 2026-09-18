# Decision: Repository language policy

Status: accepted
Date: 2026-09-18
Specs: none — repository convention; governs no product spec

## Problem

The repository mixes languages across its files, and without a recorded rule the
mix reads as an accident. A future contributor or agent may "fix" it by
translating the README to English or by re-translating AGENTS.md back to
Chinese, churning the corpus each time. The cost is not hypothetical: when one
machine translated AGENTS.md to English while another still held unported
Chinese additions on the same file, the two language states met as a full-file
merge conflict instead of a trivial integration.

## Decision

The repository maintains two language zones, split by the same criterion the
install procedure already uses — whether a file is copied to other devices and
harnesses:

| Zone | Files | Language | Why |
|---|---|---|---|
| Porting corpus | `AGENTS.md`, `skills/**`, `agents/**`, `references/workflow/**` | English | These files are the methodology that gets copied cross-device and cross-harness. A single source language avoids re-translating the corpus per harness (the Mimo adaptation already translates agent front-ends; English source bounds that work) and keeps cross-machine diffs stable. |
| Owner-facing surfaces | `README.md`, `.gitignore` comments | Chinese | Read only by the owner, whose working language is Chinese. These files are never copied to installs, so English buys nothing there. |

Standalone DRs in `docs/decisions/` are written in English — they belong to the
corpus zone (agents read them on any machine). Chinese inside
`references/style/python.md` (TODO-in-Chinese team rule) and
`skills/trim-cot-leakage/SKILL.md` (leakage-detection patterns) is content
those documents teach and detect, not a language violation; do not translate it.

On any language question for a file, this table decides. Research report
bodies remain governed by
[Standalone DR: Research report language and figures] — that decision owns the
writing language of report deliverables; this one owns repository file
language. Neither extends into the other's scope.

The corpus files carry no repository-bound references to this policy: no
pointers to the README or to `docs/decisions/`. AGENTS.md is deployed as other
harnesses' global AGENTS.md, so it stays harness-agnostic and repository-
agnostic; the README carries the policy pointer instead. At installed
destinations the corpus's own English text is the working guard: an editor
continues in the language the file already uses.

## Alternatives Considered

- **Everything English** — rejected: the README is the owner's steering
  surface and is never ported; English there adds reading friction and no
  portability.
- **Everything Chinese** — rejected: the corpus is exactly what gets copied
  across devices and harnesses; a Chinese source would need re-translation on
  every adaptation, and per-machine translations of AGENTS.md recreate the
  conflict this policy prevents.
- **No recorded rule (ad hoc per file)** — rejected: an unrecorded mix invites
  the next agent to unify file languages, and the churn repeats.

## Consequences

- The mixed language state is intentional. An edit whose language contradicts
  the table is a policy violation, not a style choice; the correction is to
  match the table, not to update it.
- New files follow the table: methodology corpus content is written in
  English, owner-facing content in Chinese.
- Installed mirrors (`~/.kimi-code/`) do not carry `docs/decisions/`; the
  README's policy pointer must stay self-explanatory and not rely on the
  reader opening this record.
