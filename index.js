const express = require('express');
const cors = require('cors');

const app = express();
const config = require('config');
const PORT = config.get('PORT');
const routes = require('./Routes/routes');
const {initialCheck} = require("./Model/utils");

app.use(express.json());
app.use(cors());
app.use(routes);


const main = async (cb) => {
    try {
        await initialCheck(() => {
            app.listen(PORT, () => {
                console.log(`Listening port ${PORT}`);
            });
            cb();
        });

    }
    catch (e) {
        console.error(e);
    }
}

main(() => {
    console.log('thank you!');
});