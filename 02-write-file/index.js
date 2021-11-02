const fs = require('fs');
const readline = require('readline');
const path = require('path');
const process = require('process');
const textPath = path.join(__dirname, 'text.txt');

const stream = fs.createWriteStream(textPath);

const rl = readline.createInterface(
  {
    input: process.stdin,
    output: process.stdout
  }
)

rl.on('line', (input) => {
  if (input === 'exit') {
    rl.close();
    return;
  }

  fs.appendFile(textPath, `${input}\n`, (err) => {
    if (err) {
      throw err;
    }
  })
});

console.log('Write something, please.');
process.on('exit', () => console.log('Have a nice day!!!'));
