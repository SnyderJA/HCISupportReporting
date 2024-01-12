const fg = require('fast-glob');
const fs = require('fs');

const configs = {
  crud: {
    path: 'src/configs/templates/crud',
    extension: '.tsx',
  },
};

Object.values(configs).forEach((config) => {
  const patterns = `${config.path}/*${config.extension}`;
  const targetFileImport = `index${config.extension}`;
  const entries = fg.sync([patterns, `!**/${targetFileImport}`]);

  const requireModules = entries.map((filePath) => {
    const filePaths = filePath.split('/');
    const fileName = filePaths[filePaths.length - 1].replace(config.extension, '');
    return `require('./${fileName}').default`;
  });

  const requireAllModules = `export default [${requireModules.join(',')}];`;
  fs.writeFileSync(`${config.path}/${targetFileImport}`, requireAllModules, 'utf8');
});
