const fs = require('fs');
const path = require('path');

const pathFiles = path.join(__dirname, '/files');
const pathFilesCopy = path.join(__dirname, '/files-copy');

function copyDir() {
  fs.stat(pathFilesCopy, (err, st) => {
    if (!err) {
      fs.readdir(pathFilesCopy, (err, dataCopy) => {
        if (err) {
          throw err;
        }

        dataCopy.forEach(fileCopy => {
          fs.unlink(`${pathFilesCopy}/${fileCopy}`, (err) => {
            if (err) {
              throw err;
            }
          });
        })
      })
    }
  })

  fs.mkdir(pathFilesCopy, { recursive: true }, (err) => {
    if (err) {
      throw err;
    }

    fs.readdir(pathFiles, (err, data) => {
      if (err) {
        throw err;
      }

      data.forEach(file => {
        fs.copyFile(`${pathFiles}/${file}`, `${pathFilesCopy}/${file}`, (err) => {
          if (err) {
            throw err;
          }
        });
      })
    })
  });
}

copyDir();
