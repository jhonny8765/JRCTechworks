export type CashItem = { name: string; price: number; quantity: number };
export type CashQuestion = {
  items: CashItem[];
  total: number;
  tendered: number;
  change: number;
  choices: number[];
};

const products = [
  { name: "Bigas / rice", price: 58 },
  { name: "Kape / coffee", price: 15 },
  { name: "Tinapay / bread", price: 38 },
  { name: "Gatas / milk", price: 45 },
  { name: "Itlog / eggs", price: 12 },
  { name: "De-lata / canned goods", price: 42 },
  { name: "Sabon / soap", price: 29 },
  { name: "Tubig / water", price: 22 },
  { name: "Noodles", price: 18 },
  { name: "Notebook", price: 35 },
];

const wrongOffsets = [-50, -25, -20, -10, -5, 5, 10, 20, 25, 50];

function pick<T>(values: readonly T[], random: () => number): T {
  return values[Math.min(values.length - 1, Math.floor(random() * values.length))];
}

function shuffled<T>(values: readonly T[], random: () => number): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const selected = Math.min(index, Math.floor(random() * (index + 1)));
    [result[index], result[selected]] = [result[selected], result[index]];
  }
  return result;
}

export function generateCashQuestion(random: () => number = Math.random): CashQuestion {
  const first = pick(products, random);
  const second = pick(products.filter((product) => product.name !== first.name), random);
  const items: CashItem[] = [
    { ...first, quantity: 1 + Math.floor(random() * 3) },
    { ...second, quantity: 1 + Math.floor(random() * 2) },
  ];
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const possibleCash = [100, 200, 500, 1000].filter((cash) => cash > total);
  const tendered = pick(possibleCash, random);
  const change = tendered - total;
  const choices = new Set<number>([change]);
  for (const offset of shuffled(wrongOffsets, random)) {
    const candidate = change + offset;
    if (candidate > 0 && candidate < tendered) choices.add(candidate);
    if (choices.size === 4) break;
  }
  return { items, total, tendered, change, choices: shuffled([...choices], random) };
}

export function pesos(amount: number): string {
  return `₱${amount.toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;
}
