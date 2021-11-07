const fs = require('fs');
const path = require('path');

const projectPath = path.join(__dirname, 'project-dist');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const templatePath = path.join(__dirname, 'template.html');
const indexPath = path.join(projectPath, 'index.html');
const stylePath = path.join(projectPath, 'style.css');

const projectAssetsPath = path.join(projectPath, 'assets');


createPage();

async function createPage() {
  await makekDir(projectPath);
  const components = await readDir(componentsPath);
  const template = await readFile(templatePath);
  const htmlPage = await buildHtml(template, components, componentsPath);
  writeFile(htmlPage, indexPath);


  const styles = await readDir(stylesPath);
  const style = await buildStyle(styles, stylesPath);
  writeFile(style, stylePath);


  const assets = await readDir(assetsPath);
  await makekDir(projectAssetsPath);
  await deleteFile(projectAssetsPath);

  const depth = await dirDepth(projectAssetsPath);

  for (let i = 0; i < depth; i++) {
    await deleteDir(projectAssetsPath);
  }

  copyDir(assets, assetsPath, projectPath);
}

async function dirDepth(dataPath) {
  const data = await readDir(dataPath);
  let count = 0;

  for (let item of data) {
    if (data.length) {
      const itemPath = path.join(dataPath, item);
      count = Math.max(await dirDepth(itemPath), count);
    }
  }

  return count + 1;
}

async function deleteDir(dataPath) {
  const data = await readDir(dataPath);

  if (data.length) {
    for (let item of data) {
      const itemPath = path.join(dataPath, item);
      await deleteDir(itemPath);
    }

  } else {
    await rmDir(dataPath);
  }
}

async function deleteFile(dataPath) {
  const dir = await isDir(dataPath);

  if (dir) {
    const data = await readDir(dataPath);

    for (let item of data) {
      const itemPath = path.join(dataPath, item);
      await deleteFile(itemPath);
    }

  } else {
    await rmFile(dataPath);
  }
}

async function copyDir(data, dataPath, destDir) {
  const dirName = path.basename(dataPath);
  const dirPath = path.join(destDir, dirName);

  await makekDir(dirPath);

  for (item of data) {
    const pathItem = path.join(dataPath, item);
    const dir = await isDir(pathItem);

    if (dir) {
      const data = await readDir(pathItem);
      await copyDir(data, pathItem, dirPath);
    } else {
      const distPath = path.join(dirPath, item);
      await copyFile(pathItem, distPath);
    }
  }
}

async function buildStyle(arr, dataPath) {
  const order = ['header.css', 'main.css', 'footer.css'];
  let orderArr = [...arr].fill(null);

  arr.forEach(el => {
    order.includes(el) ? orderArr.splice(order.indexOf(el), 1, el) : orderArr.push(el);
  });

  arr = orderArr.filter(el => el);

  let style = '';

  for (let file of arr) {
    let ext = await checkExt(file, '.css', path.join(dataPath, file));

    if (ext) {
      let content = await readFile(path.join(dataPath, file));
      style += content += '\n';
    }
  }

  return style;
}

async function buildHtml(data, arr, dataPath) {
  for (let file of arr) {
    let name = path.parse(file).name;
    let ext = await checkExt(file, '.html', path.join(dataPath, file));

    if (ext) {
      let content = await readFile(path.join(dataPath, file));
      data = data.replace(new RegExp(`{{${name}}}`), content);
    }
  }

  return data;
}

function copyFile(src, dist) {
  return new Promise(function (resolve, reject) {
    fs.copyFile(src, dist, (err) => {
      if (err) reject(err);
      resolve();
    });
  })
}

function writeFile(data, dataPath) {
  return new Promise(function (resolve, reject) {
    const writeStream = fs.createWriteStream(dataPath);
    writeStream.write(data);
    resolve();
  })
}

function readFile(dataPath) {
  return new Promise(function (resolve, reject) {
    fs.readFile(dataPath, "utf8", (err, data) => {
      if (err) reject(err);
      resolve(data);
    })
  })
}

function readDir(dataPath) {
  return new Promise(function (resolve, reject) {
    fs.readdir(dataPath, (err, data) => {
      if (err) reject(err);
      resolve(data);
    })
  })
}

function makekDir(dataPath) {
  return new Promise(function (resolve, reject) {
    fs.mkdir(dataPath, { recursive: true }, (err) => {
      if (err) reject(err);
      resolve();
    })
  })
}

function checkExt(data, ext, dataPath) {
  return new Promise(function (resolve, reject) {
    fs.stat(dataPath, (err, st) => {
      if (err) reject(err);
      resolve(st.isFile() && path.extname(data) === ext);
    })
  })
}

function rmFile(dataPath) {
  return new Promise(function (resolve, reject) {
    fs.unlink(dataPath, err => {
      if (err) reject(err);
      resolve();
    });
  })
}

function rmDir(dataPath) {
  return new Promise(function (resolve, reject) {
    fs.rmdir(dataPath, err => {
      if (err) reject(err);
      resolve();
    });
  })
}

function isDir(dataPath) {
  return new Promise(function (resolve, reject) {
    fs.stat(dataPath, (err, st) => {
      if (err) reject(err);
      resolve(st.isDirectory());
    })
  })
}
