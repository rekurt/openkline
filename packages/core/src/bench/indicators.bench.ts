import { test, describe } from 'vitest';
import { CandleBuffer } from '../data/CandleBuffer';
import type { Candle } from '../types';
import { SMA } from '../indicators/SMA';
import { EMA } from '../indicators/EMA';
import { RSI } from '../indicators/RSI';
import { BollingerBands } from '../indicators/BollingerBands';
import { MACD } from '../indicators/MACD';
import { Ichimoku } from '../indicators/Ichimoku';
import { Supertrend } from '../indicators/Supertrend';
import { VWAP } from '../indicators/VWAP';
import { ParabolicSAR } from '../indicators/ParabolicSAR';

/**
 * Indicator `compute()` throughput on a large buffer. These benchmarks pin the
 * payoff of the A1 refactor (hot loops read zero-copy `sliceView` typed arrays
 * instead of allocating a candle object per access) and guard against
 * regressions if A2 (incremental recompute) or future edits reintroduce
 * per-candle allocation.
 *
 * Run: `npm run bench`. Not part of `vitest run` (test include is *.test.ts).
 */
function buildBuffer(n: number): CandleBuffer {
  const buf = new CandleBuffer(n);
  let price = 100;
  for (let i = 0; i < n; i++) {
    price += Math.sin(i / 10) * 0.5;
    const o = price;
    const c = price + Math.cos(i / 7) * 0.3;
    const candle: Candle = {
      o,
      h: Math.max(o, c) + 0.5,
      l: Math.min(o, c) - 0.5,
      c,
      v: 1000 + (i % 500),
      t: 1_700_000_000 + i * 60,
    };
    buf.append(candle);
  }
  return buf;
}

const N = 50_000;
const buf = buildBuffer(N);

describe(`indicator compute @ ${N} candles`, () => {
  const sma = new SMA(20);
  const ema = new EMA(20);
  const rsi = new RSI(14);
  const bb = new BollingerBands(20, 2);
  const macd = new MACD(12, 26, 9);
  const ichimoku = new Ichimoku();
  const supertrend = new Supertrend(10, 3);
  const vwap = new VWAP('session');
  const psar = new ParabolicSAR();

  test('SMA(20)', async ({ bench }) => {
    await bench('SMA(20)', () => void sma.compute(buf)).run();
  });
  test('EMA(20)', async ({ bench }) => {
    await bench('EMA(20)', () => void ema.compute(buf)).run();
  });
  test('RSI(14)', async ({ bench }) => {
    await bench('RSI(14)', () => void rsi.compute(buf)).run();
  });
  test('BollingerBands(20,2)', async ({ bench }) => {
    await bench('BollingerBands(20,2)', () => void bb.compute(buf)).run();
  });
  test('MACD(12,26,9)', async ({ bench }) => {
    await bench('MACD(12,26,9)', () => void macd.compute(buf)).run();
  });
  test('Ichimoku(9,26,52)', async ({ bench }) => {
    await bench('Ichimoku(9,26,52)', () => void ichimoku.compute(buf)).run();
  });
  test('Supertrend(10,3)', async ({ bench }) => {
    await bench('Supertrend(10,3)', () => void supertrend.compute(buf)).run();
  });
  test('VWAP(session)', async ({ bench }) => {
    await bench('VWAP(session)', () => void vwap.compute(buf)).run();
  });
  test('ParabolicSAR', async ({ bench }) => {
    await bench('ParabolicSAR', () => void psar.compute(buf)).run();
  });
});
