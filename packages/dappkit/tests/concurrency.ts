/**
 * Concurrency behaviour of PromiseState.call and Cache.wrap.
 *
 * Run with: bun run packages/dappkit/tests/concurrency.ts
 *
 * Asserts that:
 *  - two concurrent getOrCall() issue one request and both receive the value
 *  - Cache.wrap shares one in-flight promise between concurrent callers
 *  - Cache.wrap does not keep a rejected promise for the rest of the ttl
 */
import { Cache } from "../aiem";
import { PromiseState } from "../store/standard/PromiseState";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

let failures = 0;
function check(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}: got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)}`);
}

function makeState() {
  let calls = 0;
  const state = new PromiseState({
    function: async () => {
      calls++;
      await sleep(50);
      return { v: calls };
    },
    autoAlert: false,
  });
  return { state, calls: () => calls };
}

async function promiseStateSameTick() {
  const { state, calls } = makeState();
  const [a, b] = await Promise.all([state.getOrCall(), state.getOrCall()]);
  check("PromiseState same tick - requests", calls(), 1);
  check("PromiseState same tick - both callers get the value", [a, b], [{ v: 1 }, { v: 1 }]);
}

async function promiseStateStaggered() {
  const { state, calls } = makeState();
  const first = state.getOrCall();
  await sleep(10);
  const second = state.getOrCall();
  const [a, b] = await Promise.all([first, second]);
  check("PromiseState mid-flight - requests", calls(), 1);
  check("PromiseState mid-flight - both callers get the value", [a, b], [{ v: 1 }, { v: 1 }]);
}

async function promiseStateAfterSettle() {
  const { state, calls } = makeState();
  await state.getOrCall();
  await state.getOrCall();
  check("PromiseState after settle - requests", calls(), 1);
}

async function promiseStateSequentialCallsStillWork() {
  const { state, calls } = makeState();
  await state.call();
  await state.call();
  check("PromiseState explicit refetch - requests", calls(), 2);
}

async function cacheConcurrent() {
  const cache = new Cache();
  let calls = 0;
  const fn = async () => {
    calls++;
    await sleep(50);
    return "ok";
  };
  const [a, b] = await Promise.all([cache.wrap("k", fn), cache.wrap("k", fn)]);
  check("Cache.wrap concurrent - invocations", calls, 1);
  check("Cache.wrap concurrent - both callers get the value", [a, b], ["ok", "ok"]);
}

async function cacheRejection() {
  const cache = new Cache();
  let calls = 0;
  const fn = async () => {
    calls++;
    await sleep(10);
    throw new Error(`boom#${calls}`);
  };
  const seen: string[] = [];
  for (let i = 0; i < 3; i++) {
    try {
      await cache.wrap("bad", fn);
    } catch (e: any) {
      seen.push(e.message);
    }
  }
  check("Cache.wrap rejection - fn retried", calls, 3);
  check("Cache.wrap rejection - errors not replayed from cache", seen, ["boom#1", "boom#2", "boom#3"]);
}

await promiseStateSameTick();
await promiseStateStaggered();
await promiseStateAfterSettle();
await promiseStateSequentialCallsStillWork();
await cacheConcurrent();
await cacheRejection();

console.log(failures === 0 ? "\nall checks passed" : `\n${failures} check(s) failed`);
process.exit(failures === 0 ? 0 : 1);
