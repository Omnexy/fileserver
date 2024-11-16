const Router = require('express');
const router = new Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './_FILES/_UNSORTED');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + Date.now() + parseExtension(file.originalname))
    }
})

const upload = multer({storage: storage});

const {getFile, sendFile, uploadFIle, deleteFile} = require("../Model/filemodel");
const {parseExtension} = require("../Model/utils");





router.get(
    `/:type/:filename`,
    async (req, res) => {

        const [fReadStream, stat] = getFile(req.params.type, req.params.filename);

        res.writeHeader(200, {"Content-Length": stat.size});

        sendFile(fReadStream, res);
    }
);

router.post(
    '/upload',
    upload.single('file'),
    async (req, res) => {
        try {
            uploadFIle(req.file, response => {
                if (response.err) {
                    console.log('Ошибка при загрузке!');
                    res.status(400).json(response.err);
                } else
                    res.json(response);
            });
        }
        catch (e) {
            res.status(400).json({err: e.message});
        }
    }
);

router.delete(
    '/:type/:filename',
    async (req, res) => {
        console.log(`Delete file ${req.params.filename}(${req.params.type})`);

        deleteFile(req.params.type, req.params.filename, (result) => {
            res.status(200).json(result);
        });
    }
);

module.exports = router;