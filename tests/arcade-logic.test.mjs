import test from "node:test";
import assert from "node:assert/strict";
import { addRandomTile, canMerge, moveTiles, newMergeBoard } from "../lib/arcade/merge.ts";
import { generateCashQuestion } from "../lib/arcade/cashier.ts";

test("2048 merges once per tile and adds score", () => {
  const board = [2, 2, 2, 2, ...Array(12).fill(0)];
  const result = moveTiles(board, "left");
  assert.deepEqual(result.board.slice(0, 4), [4, 4, 0, 0]);
  assert.equal(result.gained, 8);
  assert.equal(result.changed, true);
});

test("2048 directional moves and initial tiles are correct", () => {
  const board = [2, 0, 0, 0, 2, 0, 0, 0, ...Array(8).fill(0)];
  assert.equal(moveTiles(board, "up").board[0], 4);
  assert.equal(moveTiles(board, "down").board[12], 4);
  assert.equal(newMergeBoard(() => 0).filter(Boolean).length, 2);
  assert.equal(addRandomTile(Array(16).fill(2), () => 0).length, 16);
});

test("2048 detects no moves on full board", () => {
  const board = [2, 4, 2, 4, 4, 2, 4, 2, 2, 4, 2, 4, 4, 2, 4, 2];
  assert.equal(canMerge(board), false);
  assert.equal(canMerge([2, 2, ...board.slice(2)]), true);
});

test("Cashier Rush always creates exactly one mathematically correct choice", () => {
  for (let seed = 0; seed < 500; seed += 1) {
    let state = seed + 1;
    const random = () => ((state = (state * 16807) % 2147483647) - 1) / 2147483646;
    const question = generateCashQuestion(random);
    const total = question.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    assert.equal(total, question.total);
    assert.equal(question.tendered - total, question.change);
    assert.equal(question.choices.length, 4);
    assert.equal(new Set(question.choices).size, 4);
    assert.equal(question.choices.filter((value) => value === question.change).length, 1);
  }
});
