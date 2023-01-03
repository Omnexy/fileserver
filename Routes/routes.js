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
        case 'unsorted':
            filePath = `${filePath}\\_UNSORTED`;
            break;
        default:
            filePath = `${filePath}`;
            break;
    }

    return filePath;
}

router.get(
    `/:type/:filename`,
    async (req, resp) => {

        let filePath = makeFilePath(req.params.type);

        filePath = `${filePath}\\${req.params.filename}`;

        /*fs.readFile(filePath, (err, data) => {
            if(err) {
                resp.statusCode = 404;
                resp.end(`${err.message}`);
            } else {
                resp.end(data);
            }
        })*/

        let stat = fs.statSync(filePath);
        resp.writeHeader(200, {"Content-Length": stat.size});

        const  fReadStream = fs.createReadStream(filePath);

        fReadStream.on('data', function (chunk) {
            if(!resp.write(chunk)){
                fReadStream.pause();
            }
        });
        fReadStream.on('end', function () {
            resp.end();
        });
        resp.on("drain", function () {
            fReadStream.resume();
        });
    }
);

router.post(
    '/upload/:type',
    async (req, resp) => {
        let filePath = makeFilePath(req.params.type);
    }
);

module.exports = router;