// Create web server

// Import modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

// Create server
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let commentsCollection = null;
client.connect(err => {
  commentsCollection = client.db("comments").collection("comments");
  console.log("Connected to MongoDB");
});

// Create routes
app.get('/', (req, res) => {
  res.send('Hello world');
});

app.get('/comments', (req, res) => {
  commentsCollection.find().toArray((err, comments) => {
    res.send(comments);
  });
});

app.post('/comments', (req, res) => {
  const newComment = req.body;
  commentsCollection.insertOne(newComment, (err, result) => {
    res.send(result.ops[0]);
  });
});

app.delete('/comments/:id', (req, res) => {
  const id = req.params.id;
  commentsCollection.deleteOne({ _id: ObjectId(id) }, (err, result) => {
    res.send(result);
  });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));