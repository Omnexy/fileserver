const config = require("config");
const fs = require("fs");
const filesDir = config.get('FILES_DIR');
const fileTypes = config.get('FILES_TYPES');
const makeFilePath = (type) => {
    let filePath = `${filesDir}`;

    switch (type) {
        case 'image':
            filePath = `${filePath}\\_IMAGE`;
            break;
        case 'audio':
            filePath = `${filePath}\\_AUDIO`;
            break;
        case 'video':
            filePath = `${filePath}\\_VIDEO`;
            break;
        case 'text':
            filePath = `${filePath}\\_TEXT`;
            break;
        case 'application':
            filePath = `${filePath}\\_APPLICATION`;
            break;
        default:
            filePath = `${filePath}\\_UNSORTED`;
            break;
    }

    return filePath;
}

const parseFileType = (mimeType) => {
    console.log(mimeType.indexOf('/') > 0 ? mimeType.slice(0, mimeType.indexOf('/')) : mimeType)
    return mimeType.indexOf('/') > 0 ? mimeType.slice(0, mimeType.indexOf('/')) : mimeType;
}
const parseExtension = (fileName) => {
    return fileName.slice(fileName.lastIndexOf('.'), fileName.length);
}
const parsePathWOExt = (filePath) => {
    return filePath.slice(0, filePath.lastIndexOf('.'));
}
const parseNameFromPath = (filePath) => {
    return filePath.slice(filePath.lastIndexOf('\\')+1, filePath.length);
}

const initialCheck = (cb) => {
    console.log('Starting directory check...');

    let cnt = 0;

    fs.access(`${filesDir}`, (err) => {
        if(err) {
            cnt++;
            fs.mkdir(`${filesDir}`, () => {
                console.log(`Created initial dirrectory ${filesDir}`);
            });
        }

        fileTypes.forEach((ft) => {
            fs.access(`${filesDir}/${ft}`, err => {
                if(err) {
                    cnt++;
                    fs.mkdir(`${filesDir}/${ft}`, () => {
                        console.log(`Created dirrectory ${ft}`);
                    });
                }
            })
        });

        if(cnt === 0)
            console.log(`File system is OK`);

        cb();
    });


}

module.exports = {
    makeFilePath,
    parseExtension,
    parseFileType,
    initialCheck,
    parsePathWOExt,
    parseNameFromPath
}