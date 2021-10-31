const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 8080;

// Middleware

app.use(cors());
app.use(express.json());

// Databse URI with environment variable of username & password
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bauja.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

//  Create mongo client
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const run = () => {
  try {
    client.connect();
    const database = client.db("aerodod");
    const liveAnywhereCollection = database.collection("liveAnywhere");
    const discoverThingsCollection = database.collection("discoverThings");
    const tourPlansCollection = database.collection("tourPlans");
    const customerToursCollection = database.collection("myTours");

    // Getting live anywhere category data from the server
    app.get("/liveanywhere", async (req, res) => {
      const result = await liveAnywhereCollection.find({}).toArray();
      res.send(result);
    });

    // Getting Discover things data from the server
    app.get("/discoverthings", async (req, res) => {
      const result = await discoverThingsCollection.find({}).toArray();
      res.send(result);
    });

    app.post("/tourplans", async (req, res) => {
      const tourHost = req.body;
      console.log(req.body);
      const result = await tourPlansCollection.insertOne(tourHost);
      res.send(result);
    });

    // Getting Tour plans data from the server
    app.get("/tourplans", async (req, res) => {
      const result = await tourPlansCollection.find({}).toArray();
      res.send(result);
    });

    // Getting Single Tour plans data from the server
    app.get("/tourplans/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await tourPlansCollection.findOne(query);
      res.send(result);
    });

    // Posting customer/client tour
    app.post("/mytours", async (req, res) => {
      const tours = req.body;
      const result = await customerToursCollection.insertOne(tours);
      res.send(result);
    });

    // Getting All Tours
    app.get("/mytours", async (req, res) => {
      const result = await customerToursCollection.find({}).toArray();
      res.send(result);
    });

    // Getting tours by email
    app.get("/mytours/:email", async (req, res) => {
      const result = await customerToursCollection
        .find({
          email: req.params.email,
        })
        .toArray();
      res.send(result);
    });

    // Delete Tours From My Tours
    app.delete("/mytours/:id", async (req, res) => {
      const query = {
        _id: ObjectId(req.params.id),
      };
      const result = await customerToursCollection.deleteOne(query);
      res.send(result);
    });

    // // Delete tour from manages tours
    // app.delete("/mytours/:id", async (req, res) => {
    //   const query = {
    //     _id: ObjectId(req.params.id),
    //   };
    // });
  } finally {
    // client.close()
  }
};

run();

app.get("/", (req, res) => {
  console.log("running");
  res.send("from the server");
});

app.listen(port, () => {
  console.log("listening to the port", port);
});
