export const formatNumber = (num: number) => {
  const abs = Math.abs(num);

  const units = [
    { v: 1e30, s: 'Q' }, // quetta
    { v: 1e27, s: 'R' }, // ronna
    { v: 1e24, s: 'Y' }, // yotta
    { v: 1e21, s: 'Z' }, // zetta
    { v: 1e18, s: 'E' }, // exa
    { v: 1e15, s: 'P' }, // peta
    { v: 1e12, s: 'T' }, // tera
    { v: 1e9, s: 'G' }, // giga
    { v: 1e6, s: 'M' }, // mega
    { v: 1e3, s: 'K' }, // kilo
  ];

  for (const u of units) {
    if (abs >= u.v) {
      return `${(num / u.v).toFixed(2).replace(/\.00$/, '')}${u.s}`;
    }
  }

  return num.toString();
};

export const formatUsd = (num: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(num));
