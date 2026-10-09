# @rekurt/openkline-core

Framework-agnostic OHLCV (candlestick) chart library. Zero runtime dependencies. Canvas-based rendering. TypedArray buffers.

This is the core of the [**OpenKline**](https://github.com/rekurt/openkline) monorepo. For framework wrappers see [`@rekurt/openkline-react`](https://github.com/rekurt/openkline-react) and [`@rekurt/openkline-vue`](https://github.com/rekurt/openkline-vue).

## Install

```bash
npm install @rekurt/openkline-core
```

## Quick start

```ts
import { OHLCVChart } from '@rekurt/openkline-core';

const container = document.createElement('div');
container.style.cssText = 'width: 100%; height: 400px';
document.body.appendChild(container);

const chart = new OHLCVChart({
  container,
  symbol: 'BTC/USDT',
  resolution: '1H',
  theme: 'auto',
  onError: (err) => console.error('[openkline]', err),
});

// Small synthetic hourly dataset.
chart.setData([
  { o: 42000, h: 42100, l: 41900, c: 42050, v: 1000, t: 1700000000 },
  { o: 42050, h: 42200, l: 42000, c: 42100, v: 1200, t: 1700003600 },
  { o: 42100, h: 42250, l: 42050, c: 42150, v: 1600, t: 1700007200 },
]);

// Replace the current last candle with a synthetic update.
chart.updateLastCandle({
  o: 42100, h: 42300, l: 42050, c: 42200, v: 1800, t: 1700007200,
});

// When removing this view, call chart.destroy().
```

## Features

- Candlesticks, volume, grid, price + time axes, crosshair, current-price line, legend, "Go to live" pill
- Alternative renderers: `LineRenderer`, `AreaRenderer`, `OHLCBarRenderer`
- Multi-pane support via `Pane` + `PaneLayout` (linear / log Y-axis per pane)
- Indicators: `SMA`, `EMA`, `BollingerBands`, `RSI` — extend via the `Indicator` base class
- Mouse drag + momentum (respects `prefers-reduced-motion`), smooth wheel zoom, trackpad horizontal swipe → pan
- Keyboard shortcuts: arrows, +/-, Home/End, F (fit-all), 0 (fit-visible)
- Auto-follow state machine: live updates track the right edge unless the user panned away
- Transports: `PollingTransport`, `WebSocketTransport` (abstract base for custom WS adapters)
- Structured error dispatch via `onError` callback and `ErrorReporter`
- Runtime candle validation: `validateCandles`
- Exponential backoff with jitter for WS reconnects

## Status

Active development. Core rendering, data, and interaction layers are stable with extensive unit tests (450+). Sub-pane indicators (RSI, MACD, Stochastic, ATR) render in their own stacked panes via the `Pane`/`PaneLayout` abstraction. Advanced drawing tools and a larger indicator catalog are on the roadmap.

## License

MIT
