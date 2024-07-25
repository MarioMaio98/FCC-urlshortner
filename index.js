require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient }= require ('mongodb');
const dns = require('dns');
const urlparser = require('url')

const myMongo = new MongoClient ('mongodb+srv://new-user:pass@cluster0.6yumhe1.mongodb.net/urlshortner?retryWrites=true&w=majority&appName=Cluster0')


const db = myMongo.db('urlshortner');
const urls = db.collection('urls');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post ("/api/shorturl", function (req, res) {
    const myURL= req.body.url;
    

    const urlObject = urlparser.parse(myURL);

      // Check if URL is valid
      if (!/^https?:\/\/(?:www\.)?.+/.test(myURL)) {
        res.json({ error: 'Invalid URL' });
        return;
      }
})








app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
