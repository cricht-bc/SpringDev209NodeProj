const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const nodemailer = require('nodemailer');
const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(express.static('public'));

let dataFilePath = './data/data.json';

function readData() {
    if (!fs.existsSync(dataFilePath)) {
        fs.writeFileSync(dataFilePath, JSON.stringify({ contacts: [], graphs: [] }, null, 2));
    }
    return JSON.parse(fs.readFileSync(dataFilePath));
}

function writeData(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

app.get('/data', (req, res) => {
    res.json(readData());
});

app.post('/data', (req, res) => {
    let data = readData();
    data.contacts = req.body.contacts || data.contacts;
    data.graphs = req.body.graphs || data.graphs;
    writeData(data);
    res.json({ status: 'success' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
