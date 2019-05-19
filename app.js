const express = require('express');
const bodyParser = require('body-parser');
const volleyball = require('volleyball');
const client = require('./redis');
const { connectDb } = require('./db');

const app = express();

app.use(volleyball);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', require('./api'));

const PORT = process.env.PORT || 8000;

connectDb();
app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
client.on('connect', () => console.log('Redis connected'));
client.on('error', err => console.log('Redis Error: ' + err));
