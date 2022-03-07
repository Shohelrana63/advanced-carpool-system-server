const express = require('express');
const cors = require('cors');
const BodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bmmo3.mongodb.net/${process.env
  .DB_NAME}?retryWrites=true&w=majority`;


const app = express();
app.use(cors());
app.use(BodyParser.json());
const port = 8000;
app.get('/', (req, res) => {
  res.send('Welcome to Advanced carpool system server')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const createTripCollection = client.db("advancedCarpool").collection("trips");
  console.log("successfully run");

  //post trip
  app.post("/createTrips", (req, res) => {
    const driverName = req.body.driverName;
    const carName = req.body.carName;
    const carModelNumber = req.body.carModelNumber;
    const startLocation = req.body.startLocation;
    const destination = req.body.destination;
    const fare = req.body.fare;
    const seat = req.body.seat;
    const smoke = req.body.smoke;
    const children = req.body.children;
    const isConfirmed = req.body.isConfirmed;
    const uid = req.body.uid;
    console.log("body", req.body.isConfirmed);
    createTripCollection
      .insertOne({driverName,  carName, carModelNumber, startLocation, destination, fare, seat, smoke, children, isConfirmed, uid })
      .then((result) => {
        res.send(result)
      });
  });
  // Get all doctors Information
  app.get('/myTrips/:uid', (req, res) => {
    createTripCollection.find({isConfirmed: false, uid: req.params.uid}).toArray((err, documents) => {
        res.send(documents);
    });
  }); 

//post for searching
  app.post("/search", (req, res) => {
    const startLocation = req.body.startLocation;
    const destination = req.body.destination;
    const trips = createTripCollection.find({ startLocation: startLocation, destination: destination})
    trips.toArray((err, trips) => {
      res.send(trips);
    })
  })

  //update
  app.put('/confirmed/:id', async (req, res) => {
    console.log("confirmbodyu",req.body)
    let trips = await createTripCollection.findOneAndUpdate({_id: ObjectId(req.params.id)}, {$set: { isConfirmed: true, confirmBy: req.body.uid}}, {new: true})
    trips = await createTripCollection.findOne({_id: ObjectId(req.params.id)});
    res.send({
      confirmed : "confirmation successfully done",
      sucess : true
    });
  })

  //bookingDETAILS
  app.get("/bookingDetails/:uid", (req, res) => {
    createTripCollection.find({ confirmBy: req.params.uid}).toArray((err, documents) => {
      res.send(documents);
  });
  })

});


app.listen(process.env.PORT || port)