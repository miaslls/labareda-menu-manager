import { describe, expect, test } from 'vitest';

describe('vitest harness', () => {
  test('runs a trivial deterministic assertion', () => {
    const input = 2;
    const output = input + 2;

    expect(output).toBe(4);
  });
});
