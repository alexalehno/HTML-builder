const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, '/secret-folder');

fs.readdir(folderPath, (err, data) => {
  if (err) {
    throw err;
  }

  data.forEach(file => {
    fs.stat(`${folderPath}/${file}`, (err, st) => {
      if (err) {
        throw err;
      }

      let ext = path.extname(file).slice(1);
      let name = path.parse(file).name;
      let size = `${st.size}b`;

      if (st.isFile()) {
        let info = `${name} - ${ext} - ${size}`;
        console.log(info);
      }
    })
  })
})