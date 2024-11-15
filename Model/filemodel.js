const config = require("config");
const fs = require("fs");
const {makeFilePath, parseFileType} = require("./utils");


const getFile = (type, filename) => {
    let filePath = makeFilePath(type);

    filePath = `${filePath}\\${filename}`;

    let stat = fs.statSync(filePath);


    const  fReadStream = fs.createReadStream(filePath);

    return [fReadStream, stat];
};

const sendFile = (fileStream, res) => {
    fileStream.on('data', function (chunk) {
        if(!res.write(chunk)){
            fileStream.pause();
        }
    });
    fileStream.on('end', function () {
        res.end();
    });
    res.on("drain", function () {
        fileStream.resume();
    });
};

const uploadFIle = async (file, callback) => {
    console.log(file);
    let response = {URL:'',
        delURL: '',
        err: ''}

    const type = parseFileType(file.mimetype);

    await fs.rename(file.path, `${makeFilePath(type)}\\${file.filename}`, () => {
        console.log(`Got new file ${file.filename} (${type})`);
        response.URL = `${config.get('SERVER_URL')}:${config.get('PORT')}/${type}/${file.filename}`;
        response.delURL = `${config.get('SERVER_URL')}:${config.get('PORT')}/delete/${type}/${file.filename}`;
        callback(response);
    });
}



const deleteFile = (type, filename, callback) => {
    const filePath = makeFilePath(type);

    fs.exists(`${filePath}\\${filename}`, function (res) {
        if(res) {
            fs.rm(`${filePath}\\${filename}`, () => {
                console.log(`Delete succesful`);
                callback(true);
            });
        }
        else {
            console.log(`File doesn't exist`);
            callback(false);
        }
    })


}

module.exports = {
    getFile,
    sendFile,
    uploadFIle,
    deleteFile
}