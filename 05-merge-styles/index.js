const fs = require('fs');
const path = require('path');
const stylePath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

fs.createWriteStream(bundlePath);

fs.readdir(stylePath, (err, data) => {
  if (err) {
    throw err;
  }

  data.forEach(file => {
    fs.stat(`${stylePath}/${file}`, (err, st) => {
      if (err) {
        throw err;
      }

      const stream = new fs.ReadStream(`${stylePath}/${file}`, { encoding: 'utf-8' });

      if (st.isFile() && path.extname(file) === '.css') {
        stream.on('readable', () => {
          let styles = stream.read();

          if (styles) {
            fs.appendFile(bundlePath, styles += '\n', (err) => {
              if (err) {
                throw err;
              }
            })
          }
        })
      }
    })
  })
})

