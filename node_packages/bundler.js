const fse = require('fs-extra');

const srcDir = `node_packages`;
const destDir = `node_modules`;
                                 
// To copy a folder or file, select overwrite accordingly
try {
  fse.copySync(srcDir, destDir, { overwrite: true|false })
  console.log('success!')
} catch (err) {
  console.error(err)
}