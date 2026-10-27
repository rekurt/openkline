# Proposed grant work packages

[Back to roadmap](../README.md#roadmap)

These work packages turn the roadmap into reviewable deliverables for a grant
or in-kind support proposal. They are **proposed, not funded or completed**.
Scope, browser/device coverage, effort, budget, and delivery dates need
maintainer agreement before any application commits to them.

Baseline inspected on 2026-10-27 at
[`5f5e8a6`](https://github.com/rekurt/openkline/commit/5f5e8a680fab7eaa45d9c5661a1fed93a352a684).
The existing [evaluation guide](COMPARISON.en.md) separates implemented
capabilities from integration and verification limits.

## OK-1: Repeatable browser regression evidence

**Current baseline.** Core tests use [jsdom](../vitest.config.ts).
The [layout check](../examples/playground/tests/layout.browser.js) is a
browser-console script, not an automated browser test. Its existing matrix is
320, 390, 768, 1280, then 320 pixels wide, all at 900 pixels high, with toolbar
controls and themes exercised before repeating without a reload.

**Proposed deliverable.** A repeatable browser test entry point, documented
setup, and a results record using synthetic playground data.

**Acceptance criteria:**

- Run the existing viewport sequence and repeated-control/theme sequence
  without a reload. A failed assertion makes the test command fail.
- Preserve the script's assertions: no horizontal page overflow, visible
  controls within the viewport, at least two non-collapsed canvases, and
  nonempty canvas bitmaps resized with their containers.
- Document and execute pan, zoom, touch, and PNG/SVG export scenarios with
  explicit expected outcomes. Report automated checks separately from
  manual checks; emulated touch is not evidence of real-device compatibility.
- Record commit, browser/version, OS, viewport, device or emulator, commands,
  and pass/fail results. Retain reproduction steps and screenshots or export
  files for failures. State untested combinations explicitly.

**Review evidence.** Test source, a clean-checkout reproduction command,
results for the agreed browser/device matrix, and links to regression fixes.
Unit-test success alone does not complete this package.

## OK-2: Marker hover detection

**Current baseline.**
[`CrosshairController`](../packages/core/src/interaction/CrosshairController.ts)
reports drawings and primitives; its documented drawing > primitive > marker
priority reserves marker detection but does not implement it.
[Existing tests](../packages/core/src/interaction/CrosshairController.test.ts)
cover primitive hits, drawing priority, and replay-capped candle selection.

**Proposed deliverable.** Marker hit-testing wired into hover and double-click
payloads, with regression tests and updated API usage documentation.

**Acceptance criteria:**

- A visible marker hit reports its stable identifier and `kind: 'marker'`;
  empty space reports no interactive object.
- Overlapping objects preserve drawing > primitive > marker priority.
  Define and test the tie-break rule for overlapping markers.
- Markers hidden beyond the replay cap are not reported. Test the replay
  boundary, pan/zoom coordinate changes, marker replacement, and removal.
- Hover and double-click report the same marker identity at the same point;
  existing outside-plot and destroyed-controller behavior stays covered.

**Review evidence.** Focused failing-before/passing-after tests, full core
verification results, and a synthetic browser reproduction. Update capability
documentation only after the implementation and checks exist.

## Verification and application handoff

Use the repository's checked-in toolchain and scripts. The developer-toolchain
correction remains separate in [PR #45](https://github.com/rekurt/openkline/pull/45).

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run build:examples
npm run docs
```

Record the toolchain and exact commit with every result; add the browser
command introduced by OK-1 to its review evidence. These commands describe
verification to perform, not results claimed by this document.

A proposal can select either package independently. Confirm the selected
scope, responsible contributors, resources, and reporting expectations before
submission. Neither package asserts adoption, performance gains, a release
date, or compatibility beyond the combinations actually tested.
