const express = require("express");
const { MongoClient } = require("mongodb");
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

    app.get("/liveanywhere", async (req, res) => {
      const result = await liveAnywhereCollection.find({}).toArray();
      res.send(result);
    });
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
