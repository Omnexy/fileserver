const Router = require('express');
const router = new Router();
const fs = require('fs');
const config = require('config');
const filesDir = config.get('FILES_DIR');
const formidable = require('formidable');

const makeFilePath = (type) => {
    let filePath = `${filesDir}`;

    console.log(`Type is ${type}`);

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
    return mimeType.indexOf('/') > 0 ? mimeType.slice(0, mimeType.indexOf('/')) : mimeType;
}

const parseExtension = (fileName) => {
    return fileName.slice(fileName.lastIndexOf('.'), fileName.length);
}

router.get(
    `/:type/:filename`,
    async (req, resp) => {

        let filePath = makeFilePath(req.params.type);

        filePath = `${filePath}\\${req.params.filename}`;

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
    '/upload',
    async (req, res) => {

        const form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {
            if (err)
                return res.status(400).json({ error: err.message });
            const type = parseFileType(files.file.mimetype);

            console.log(parseExtension(files.file.originalFilename));
            let filename = `${files.file.newFilename}${parseExtension(files.file.originalFilename)}`;
            fs.cp(files.file.filepath,  `${makeFilePath(type)}\\${filename}`, () => {
                console.log(`Got new file ${filename} (${type})`);
                res.json(
                    {
                        'URL':`${config.get('SERVER_URL')}:${config.get('PORT')}/${type}/${filename}`}
                );
            })
        });
    }
);

module.exports = router;