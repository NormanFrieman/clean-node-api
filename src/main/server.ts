import express = require('express');

const app = express();

app.listen(3333, () => {
    console.log('server running at http://localhost:3333');
});