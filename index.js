const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const BodyParser = require('body-parser');
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bmmo3.mongodb.net/${process.env
.DB_NAME}?retryWrites=true&w=majority`;


const app = express();
app.use(cors());
app.use(BodyParser.json());
const port = 5000;
app.get('/', (req, res) => {
    res.send('Welcome to Advanced carpool system server')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const collection = client.db("test").collection("devices");
  console.log("successfully run");
  const user = {name:"advanced carpool", email:"test@example.com"};
  collection.insertOne(user)
  .then( () => {
      console.log("insert successfully");
  })
});


app.listen(process.env.PORT || port)