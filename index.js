require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient } = require('mongodb');
const dns = require('dns');
const urlparser = require('url');

const myMongo = new MongoClient('mongodb+srv://new-user-mario:passcluster0.6yumhe1.mongodb.net/db?retryWrites=true&w=majority&appName=Cluster0');

// Connetti a MongoDB
myMongo.connect().then(() => {
  console.log('Connected to MongoDB');
});

const db = myMongo.db('urlshortner');
const urls = db.collection('urls');


const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post("/api/shorturl", function (req, res) {
  const myURL = req.body.url;
  const urlObject = urlparser.parse(myURL);

  
  if (!/^https?:\/\/(?:www\.)?.+/.test(myURL)) {
    return res.json({ error: 'Invalid URL' });
  }

  dns.lookup(urlObject.hostname, async (err, address) => {
    if (err) {
      return res.json({ error: 'Invalid URL' });
    }

    const urlCount = await urls.countDocuments({});
    const urlDoc = {
      myURL,
      short_url: urlCount + 1 
    };

    await urls.insertOne(urlDoc);
    res.json({
      original_url: myURL,
      short_url: urlDoc.short_url
    });
  });
});

app.get("/api/shorturl/:short_url", async (req, res) => {
  const shorturl = req.params.short_url;

  try {
    console.log("Received short_url:", shorturl);
    const urlDoc = await urls.findOne({ short_url: +shorturl });

    if (urlDoc) {
      console.log("Found document:", urlDoc);

      if (urlDoc.myURL) {
        console.log("Redirecting to:", urlDoc.myURL);
        return res.redirect(urlDoc.myURL);
      } else {
        console.log("URL is undefined or empty.");
        return res.json({ error: "URL not found in the document" });
      }
    } else {
      console.log("No document found for short_url:", shorturl);
      return res.json({ error: "No short URL found for the given input" });
    }
  } catch (err) {
    console.error("Error during database lookup:", err);
    return res.json({ error: "Internal server error" });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
