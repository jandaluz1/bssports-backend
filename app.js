const express = require('express');

const app = express();

app.use('/api', require('./api'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
