import fs from 'fs';

const { n, stats } = JSON.parse(
  fs
    .readFileSync('./out/probs.json', 'utf8')
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''),
);

let text = 'nederland';

function pick(text: string) {
  let prob = stats;
  for (let i = 0; i < n; i++) {
    prob = prob[text.charAt(text.length - n + i)];
  }

  const rnd = Math.random();
  let sum = 0;

  for (const char in prob) {
    sum += prob[char];

    if (rnd < sum) {
      return char;
    }
  }
}

for (let i = 1; i < 1000; i++) {
  try {
    text += pick(text);
  } catch (e) {
    break;
  }
}

console.log(text);
