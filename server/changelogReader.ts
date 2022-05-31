import fs from 'fs';
import path from 'path';

const isJson = (filename: any) => {
  return filename.split('.').pop() === 'json';
};

const readSingleFile = (changelogDir: any, file: any, versionNumber: any) => {
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

  const changeLogItems = changeLogObj.items.map((item: any) => ({
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

const readChangelogsInDirectory = (changelogDir: any) => {
  const dir = fs.readdirSync(changelogDir);

  const versionNumber = changelogDir.split(path.sep).pop();

  if (!versionNumber) {
    throw new Error(`No version number`);
  }

  return dir
    .filter((file: any) => isJson(file))
    .map((file: any) => readSingleFile(changelogDir, file, versionNumber));
};

export const getChangelogs = () => {
  const dirname = path.join(__dirname, '../changelogs');

  const changelogs = [] as any[];
  fs.readdirSync(dirname)
    .filter((file: any) => {
      const obj = fs.lstatSync(path.join(dirname, file));
      return obj.isDirectory();
    })
    .forEach((file: any) => {
      const changelogsInDir = readChangelogsInDirectory(
        path.join(dirname, file)
      );
      changelogs.push(...changelogsInDir);
    });

  return changelogs;
};
