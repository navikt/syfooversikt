const fs = require('fs');
const path = require('path');

function isImage(filename) {
    return ["png", "jpg", "jpeg", "gif"].indexOf(filename.split(".").pop()) >= 0;
}

function isJson(filename) {
    return filename.split(".").pop() === "json";
}

const changeLogCache = [];
exports.changeLogCache = changeLogCache;

function readChangelog(changelogDir, versionCode) {
    console.log("Reading changelog dir: " + changelogDir);
    const dir = fs.readdirSync(changelogDir);
    dir.forEach((file) => {
        if (isImage(file) || !isJson(file)) {
            return;
        }
        const ext = file.split('.').pop();
        const fileversion = Number.parseInt(changelogDir.split("/").pop());
        if (!Number.isInteger(fileversion)) {
            throw new Error(`Invalid version, expected an integer but got ${fileversion}`);
        }
        if (!ext === "json") {
            throw new Error(`Invalid changelog format, expected json but got ${ext}`);
        }
        const json = fs.readFileSync(path.join(changelogDir, file), { encoding: 'UTF-8' })
        const changeLogObj = JSON.parse(json);
        const changeLogItems = changeLogObj.items.map((item) => ({
            ...item,
            image: item.image
                ? `/syfooversikt/changelogs/image/${fileversion}/${item.image}`
                : undefined
        }))
        changeLogCache.push({
            ...changeLogObj,
            version: fileversion,
            items: changeLogItems
        });
    })
}

function readDir(dirname) {
    fs.readdir(dirname, (err, files) => {
        if (err) {
            console.error(err)
        } else {
            files.forEach((file) => {
                const obj = fs.lstatSync(path.join(dirname, file));
                if (obj.isDirectory()) {
                    readChangelog(path.join(dirname, file));
                }
            });
        }
    });
}

exports.readChangelogDir = function() {
    readDir(path.join(__dirname, '../changelogs'));
};