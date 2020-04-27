import fs from 'fs';

if (process.argv.length < 3) {
  console.log('You have to provide a file name!');
  process.exit(1);
}

const text = fs
  .readFileSync(process.argv[2], 'utf8')
  .toLocaleLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '');

const stats = {};

const n = 5;

for (let i = n; i < text.length; i++) {
  let stat = stats;
  for (let j = 0; j < n + 1; j++) {
    const char = text.charAt(i - n + j + 1);

    if (j === n) {
      if (!stat[char]) {
        stat[char] = 1;
      } else {
        stat[char]++;
      }
    } else if (!stat[char]) {
      stat[char] = {};
    }

    stat = stat[char];
  }
}

function normalize(stats: any) {
  if (typeof Object.values(stats)[0] === 'number') {
    const sum = Object.values(stats).reduce<number>(
      (a: number, c: number) => a + c,
      0,
    );

    for (const stat in stats) {
      stats[stat] /= sum;
    }
  } else {
    for (const stat in stats) {
      normalize(stats[stat]);
    }
  }
}

normalize(stats);

fs.writeFile(
  './out/probs.json',
  JSON.stringify({ n, stats }),
  err => err && console.log(err),
);
