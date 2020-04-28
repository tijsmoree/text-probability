import fs from 'fs';

if (process.argv.length < 4) {
  console.log('You have to provide an amount of characters and a file name!');
  process.exit(1);
}

const text = fs
  .readFileSync(process.argv[3], 'utf8')
  .toLocaleLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '');

const probs: { [prev: string]: { [cur: string]: number } } = {};

const n = parseInt(process.argv[2]);

for (let i = 0; i < text.length - n; i++) {
  const prev = text.substring(i, i + n);
  const cur = text.charAt(i + n);

  if (!probs[prev]) {
    probs[prev] = {};
  }

  if (!probs[prev][cur]) {
    probs[prev][cur] = 0;
  }

  probs[prev][cur]++;
}

for (const prob in probs) {
  const sum = Object.values(probs[prob]).reduce<number>(
    (a: number, c: number) => a + c,
    0,
  );

  for (const p in probs[prob]) {
    probs[prob][p] = Number((probs[prob][p] / sum).toFixed(4));
  }
}

fs.writeFile(
  './out/probs.json',
  JSON.stringify({ n, probs }),
  err => err && console.log(err),
);
