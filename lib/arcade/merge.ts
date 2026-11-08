export type MergeDirection = "up" | "down" | "left" | "right";

export type MergeMove = { board: number[]; gained: number; changed: boolean };

// Original 2048-style rules implementation. Keeping the model separate from
// the view lets us test every direction and avoid unnecessary re-renders.
export function moveTiles(board: readonly number[], direction: MergeDirection): MergeMove {
  if (board.length !== 16) throw new Error("Expected a 4 by 4 board");
  const result = Array<number>(16).fill(0);
  let gained = 0;

  for (let line = 0; line < 4; line += 1) {
    const positions = Array.from({ length: 4 }, (_, step) => {
      if (direction === "left") return line * 4 + step;
      if (direction === "right") return line * 4 + (3 - step);
      if (direction === "up") return step * 4 + line;
      return (3 - step) * 4 + line;
    });
    const values = positions.map((index) => board[index]).filter((value) => value !== 0);
    const combined: number[] = [];

    for (let index = 0; index < values.length; index += 1) {
      if (values[index] === values[index + 1]) {
        const merged = values[index] * 2;
        combined.push(merged);
        gained += merged;
        index += 1;
      } else {
        combined.push(values[index]);
      }
    }
    positions.forEach((position, index) => { result[position] = combined[index] ?? 0; });
  }

  return { board: result, gained, changed: result.some((value, index) => value !== board[index]) };
}

export function addRandomTile(board: readonly number[], random: () => number = Math.random): number[] {
  const empties = board.flatMap((value, index) => (value === 0 ? [index] : []));
  if (!empties.length) return [...board];
  const next = [...board];
  const spot = empties[Math.min(empties.length - 1, Math.floor(random() * empties.length))];
  next[spot] = random() < 0.9 ? 2 : 4;
  return next;
}

export function newMergeBoard(random: () => number = Math.random): number[] {
  return addRandomTile(addRandomTile(Array<number>(16).fill(0), random), random);
}

export function canMerge(board: readonly number[]): boolean {
  if (board.some((value) => value === 0)) return true;
  return (["up", "down", "left", "right"] as MergeDirection[]).some((direction) => moveTiles(board, direction).changed);
}
