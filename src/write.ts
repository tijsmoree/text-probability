import fs from 'fs';

if (process.argv.length < 4) {
  console.log('You have to provide an amount of words and a file name!');
  process.exit(1);
}

const { n, probs } = <
  { n: number; probs: { [prev: string]: { [cur: string]: number } } }
>JSON.parse(
  fs
    .readFileSync(process.argv[3], 'utf8')
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''),
);

let text = Object.keys(probs)[0];

for (let i = 1; i < parseInt(process.argv[2]); i++) {
  const prev = text.substring(text.length - n);
  const prob = probs[prev];

  const rnd = Math.random();
  let sum = 0;

  if (prob) {
    for (const char in prob) {
      sum += prob[char];

      if (rnd < sum) {
        text += char;

        break;
      }
    }
  }
}

console.log(text);
