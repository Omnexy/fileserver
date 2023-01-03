const Router = require('express');
const router = new Router();
const fs = require('fs');
const config = require('config');
const filesDir = config.get('FILES_DIR');

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
        default:
            filePath = `${filePath}\\_UNSORTED`;
            break;
    }

    return filePath;
}

router.get(
    `/:type/:filename`,
    async (req, resp) => {

        let filePath = makeFilePath(req.params.type);

        filePath = `${filePath}\\${req.params.filename}`;

        fs.readFile(filePath, (err, data) => {
            if(err) {
                resp.statusCode = 404;
                resp.end(`No file named "${req.params.filename}"`);
            } else {
                resp.end(data);
            }
        })
    }
);

router.post(
    '/upload/:type',
    async (req, resp) => {
        let filePath = makeFilePath(req.params.type);
    }
);

module.exports = router;