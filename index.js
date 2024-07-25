require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const { MongoCl }= require ('mongodb');
const dns = require('dns');
const urlparser = require('url')

const myMongo = new MongoCl ('mongodb+srv://new-user-mario:s7lWU1Oj8GyuctpW@cluster0.6yumhe1.mongodb.net/urlshortner?retryWrites=true&w=majority&appName=Cluster0')


const db = myMongo.db('urlshortner');
const urls = db.collection('urls');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});







app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
