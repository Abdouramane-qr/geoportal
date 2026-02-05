import '@testing-library/jest-dom';
import { expect } from 'vitest';

const testGlobals = globalThis as typeof globalThis & {
  expect?: typeof expect;
  IntersectionObserver?: typeof IntersectionObserver;
};

testGlobals.expect = expect;

if (!testGlobals.IntersectionObserver) {
  testGlobals.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver;
}
