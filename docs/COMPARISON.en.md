# OpenKline and Lightweight Charts: an evaluation guide

[Back to README](../README.md) · [Guides](./GUIDES.md) ·
[Original Russian analysis](./COMPARISON.md)

## Scope and evidence

Reviewed on 2026-10-09 against OpenKline default-branch commit
[`3df583d`](https://github.com/rekurt/openkline/commit/3df583da4eb68588111dfb04427d5cf6f7bb190a).
The [core manifest](../packages/core/package.json) identifies version `0.2.0`.
This is a maintained English evaluation summary of the Russian analysis,
updated against current source and tests rather than a literal translation.
The Russian original is preserved as a historical record: its June update
and earlier sections describe different states of the project.

For Lightweight Charts, this guide uses TradingView's official **5.2**
[getting-started documentation](https://tradingview.github.io/lightweight-charts/docs)
and [plugin documentation](https://tradingview.github.io/lightweight-charts/docs/plugins/intro),
checked on the review date. That library was not installed or tested for this
review. Links to OpenKline tests below identify repository evidence; passing
unit tests do not establish production reliability or independent validation.

## Choosing an integration model

Both libraries can render financial chart data. Their APIs put different
amounts of application behavior inside the library:

| Evaluation question | OpenKline | Lightweight Charts 5.2 |
| --- | --- | --- |
| How do I provide history and live data? | `OHLCVChart.setData`, `prependHistory`, and `updateLastCandle`; optional `DataFeed` and transport infrastructure. | Series `setData` and `update` accept application-supplied data, as shown in the official getting-started guide. |
| How do I add indicator calculations? | Built-in calculation classes and a declarative `IndicatorConfig` registry, with overlay and sub-pane rendering. | The official plugin guide describes indicators as functionality that can be added through plugins. Evaluate your selected calculation and plugin implementation. |
| How do I extend rendering? | Custom series registration and series/pane primitives; see [Plugin API](./PLUGINS.md). | Custom series, series primitives, and pane primitives are documented extension points. |
| How much UI do I still build? | Host applications wire controls, transport adapters, storage, and optional controllers. Available modules are listed below. | Host applications compose series, data handling, controls, and selected plugins around the chart API. |

The useful distinction is integration scope. Having more bundled modules does
not demonstrate faster rendering, better correctness, or feature parity.
Choose against your required behavior and maintenance constraints.

## What exists in OpenKline today

The [public export barrel](../packages/core/src/index.ts) is the entry-point
inventory. These capabilities exist in source and have associated tests;
optional modules require explicit application integration.

| Capability | Implementation and tests | Integration boundary |
| --- | --- | --- |
| Indicators and sub-panes | [Registry](../packages/core/src/indicators/registry.ts), [registry tests](../packages/core/src/indicators/registry.test.ts), [pane renderer tests](../packages/core/src/rendering/IndicatorPaneRenderer.test.ts) | Configured indicators render in overlays or sub-panes. Validate the formulas and settings needed by your application. |
| Drawing tools | [Drawing layer](../packages/core/src/drawings/DrawingLayer.ts), [selection tests](../packages/core/src/drawings/selection.test.ts) | Selection, deletion, and undo/redo APIs exist; input controls are wired by the host. |
| Price alerts | [AlertManager](../packages/core/src/alerts/AlertManager.ts), [alert tests](../packages/core/src/alerts/AlertManager.test.ts), [chart facade](../packages/core/src/OHLCVChart.ts) | In-memory, one-shot price conditions driven by live close-price updates; the host handles `onAlert` delivery. |
| Replay | [ReplayController](../packages/core/src/interaction/ReplayController.ts), [replay tests](../packages/core/src/interaction/ReplayController.test.ts) | Facade methods start, play, pause, step, seek, and stop bar-by-bar history playback. Host controls are still needed. |
| Compare overlays | [CompareController](../packages/core/src/compare/CompareController.ts), [compare tests](../packages/core/src/compare/compare.test.ts) | Explicitly construct the controller and supply series points; percentage, indexed, and price normalization are supported. |
| Volume profile | [Controller](../packages/core/src/profile/VolumeProfileController.ts), [distribution model](../packages/core/src/profile/computeVolumeProfile.ts), [profile tests](../packages/core/src/profile/volumeProfile.test.ts) | Opt-in estimate from OHLCV candles: volume is distributed proportionally across each candle's low/high range, not measured from individual trades. |
| Localization | [Formatters](../packages/core/src/i18n/format.ts), [messages](../packages/core/src/i18n/messages.ts), [engine tests](../packages/core/src/i18n/chartEngineI18n.test.ts) | Locale-aware number/date formatting; chart text defaults to English. Supply chart translations through message overrides and translate the application's own UI separately. |
| Persistence | [State types](../packages/core/src/state/ChartState.ts), [save/load tests](../packages/core/src/state/saveLoadState.test.ts) | Layout and full snapshots are available. Workspace navigation, storage, and synchronization belong to the application. |
| Export | [PNG tests](../packages/core/src/rendering/ChartEngine-export.test.ts), [SVG helper](../packages/core/src/export/toSVG.ts), [SVG tests](../packages/core/src/export/svg.test.ts) | PNG is available through the chart; the explicitly imported SVG helper exports the chart layer, excluding the UI layer and crosshair. Check output with the features you enable. |

For data integration, inspect [DataFeed](../packages/core/src/data/DataFeed.ts)
and its [race/error tests](../packages/core/src/data/DataFeed.test.ts).
[WebSocketTransport](../packages/core/src/data/WebSocketTransport.ts) is an
abstract adapter base, not a ready-made connection to every exchange.

## Performance: what the evidence supports

OpenKline uses columnar buffers, zero-copy views, render-layer invalidation,
and cached indicator computation. See [CandleBuffer](../packages/core/src/data/CandleBuffer.ts),
[ChartEngine](../packages/core/src/rendering/ChartEngine.ts), and
[Indicator](../packages/core/src/indicators/Indicator.ts).
Some indicators implement incremental tail updates; this does not imply
constant-time computation or allocation-free updates for every indicator.
[Incremental tests](../packages/core/src/indicators/incremental.test.ts)
check the implemented paths against full computation.

The repository provides [buffer microbenchmarks](../packages/core/src/bench/buffer.bench.ts)
and [indicator microbenchmarks](../packages/core/src/bench/indicators.bench.ts)
via `npm run bench`. They measure selected operations on synthetic data, not
end-to-end browser frame rate, transport latency, or a head-to-head comparison.
The [size script](../scripts/size.mjs) measures a synthetic tree-shaken import
and gzip output; CI marks this step `continue-on-error`, so it is not a blocking
size gate. Actual application bundles depend on imports and bundler settings.

The historical Russian document includes throughput and bundle numbers,
production-maturity judgments, and broad superiority/parity claims. They are
not repeated here because this review has no matched browser benchmark,
independent deployment evidence, or reproducible competitor build measurement.
It also omits competitor commercial/license conclusions; consult each
project's own current terms for your intended use.

## A practical evaluation path

1. Run the [playground](https://rekurt.github.io/openkline/) and the
   [README quick start](../README.md#quick-start) with your target browser.
2. Supply representative history and live updates through your own adapter.
   Check symbol switches, history loading, replay, and retention limits.
3. Enable only the indicators, drawings, and optional modules you need.
   Check rendering, interaction, localization, state round-trips, and export.
4. Measure your bundled application and browser responsiveness on target
   hardware. Record dataset size, update rate, enabled features, and build
   settings before comparing another library.
5. Review the [API reference](https://rekurt.github.io/openkline/api/),
   [core manifest](../packages/core/package.json), and test suite for the exact
   version you plan to adopt. For React or Vue, also evaluate the separately
   maintained wrappers linked from the README.
