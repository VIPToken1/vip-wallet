const fs = require('fs');
const path = require('path');

const assetsPath = path.join(__dirname, '..', 'src', 'assets', 'icons');
const iconsFilePath = path.join(__dirname, '..', 'src', 'theme', 'icons.ts');

const toCamelCase = str => {
  const s =
    str &&
    str
      ?.match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
      )
      ?.map(x => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
      ?.join('');
  return s.slice(0, 1).toLowerCase() + s.slice(1);
};

fs.readdir(assetsPath, (err, files) => {
  if (err) {
    console.log('Error reading assets: ', err);
    throw err;
  }
  const data =
    files
      .reduce((result, file) => {
        if (
          !(
            file.includes('@2x') ||
            file.includes('@3x') ||
            file.includes('.DS_Store')
          )
        ) {
          let iconName = `${toCamelCase(file.replace('.png', ''))}`;
          if (!iconName.endsWith('Icon')) {
            iconName += 'Icon';
          }
          const exported = `export { default as ${iconName} } from '../assets/icons/${file}';`;
          result.push(exported);
        }
        return result;
      }, [])
      .join('\n') + '\n';

  console.log('****************************************************');
  console.log('************* 🎉🎉🎉 Assets 🎉🎉🎉  ****************');
  console.log('****************************************************');
  console.log(data);

  fs.writeFile(iconsFilePath, data, (err, response) => {
    if (err) {
      console.log('Error exporting assets: ', err);
      throw err;
    }
    console.log(`Assets exported at "${iconsFilePath}"`);
  });
});
