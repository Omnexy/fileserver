const express = require('express');
const cors = require('cors');

const app = express();
const config = require('config');
const PORT = config.get('PORT');
const routes = require('./Routes/routes');

app.use(express.json());
app.use(cors());
app.use(routes);


const main = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Listening port ${PORT}`);
        });
    }
    catch (e) {
        console.error(e);
    }
}

main().then(() => {
    console.log('thank you!');
});