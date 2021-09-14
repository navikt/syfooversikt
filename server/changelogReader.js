const fs = require('fs');
const path = require('path');

function isJson(filename) {
  return filename.split('.').pop() === 'json';
}

const readSingleFile = (changelogDir, file, versionNumber) => {
  const fileversion = Number.parseInt(versionNumber);

  if (!Number.isInteger(fileversion)) {
    throw new Error(
      `Invalid version, expected an integer but got ${fileversion}`
    );
  }

  const json = fs.readFileSync(path.join(changelogDir, file), {
    encoding: 'utf8',
  });

  const changeLogObj = JSON.parse(json);

  const changeLogItems = changeLogObj.items.map((item) => ({
    ...item,
    image: item.image
      ? `/syfooversikt/changelogs/image/${fileversion}/${item.image}`
      : undefined,
  }));

  return {
    ...changeLogObj,
    version: fileversion,
    items: changeLogItems,
  };
};

const readChangelogsInDirectory = (changelogDir) => {
  const dir = fs.readdirSync(changelogDir);

  const versionNumber = changelogDir.split(path.sep).pop();

  if (!versionNumber) {
    throw new Error(`No version number`);
  }

  return dir
    .filter((file) => isJson(file))
    .map((file) => readSingleFile(changelogDir, file, versionNumber));
};

const getChangelogs = () => {
  const dirname = path.join(__dirname, '../changelogs');

  const changelogs = [];
  fs.readdirSync(dirname)
    .filter((file) => {
      const obj = fs.lstatSync(path.join(dirname, file));
      return obj.isDirectory();
    })
    .forEach((file) => {
      const changelogsInDir = readChangelogsInDirectory(
        path.join(dirname, file)
      );
      changelogs.push(...changelogsInDir);
    });

  return changelogs;
};

module.exports = getChangelogs;
