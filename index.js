const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ph.gyzqsfs.mongodb.net/?retryWrites=true&w=majority&appName=PH`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const usersCollection = client.db("BloodHelpDB").collection("users");
    const donationsCollection = client
      .db("BloodHelpDB")
      .collection("donations");

    //jwt api
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });
      res.send({ token });
    });

    //add user to database
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exists", insertedId: null });
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    //get user data api
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const result = await usersCollection.findOne({ email: email });
      res.send(result);
    });

    //update donor info
    app.patch("/user/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const updatedUserInfo = req.body;
      const user = {
        $set: {
          name: updatedUserInfo.name,
          photoURL: updatedUserInfo.photoURL,
          bloodGroup: updatedUserInfo.bloodGroup,
          "address.district": updatedUserInfo.address.district,
          "address.upazila": updatedUserInfo.address.upazila,
        },
      };
      const result = await booksCollection.updateOne(filter, user);
      res.send(result);
    });

    //create donation request
    app.post("/create-donation-request", async (req, res) => {
      const donation = req.body;
      const result = await donationsCollection.insertOne(donation);
      res.send(result);
    });

    //get donation request data of a user
    app.get("/donation-requests/:email", async (req, res) => {
      const email = req.params.email;
      const result = await donationsCollection
        .find({ requesterEmail: email })
        .toArray();
      res.send(result);
    });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("BloodHelp is running...");
});

app.listen(port, () => {
  console.log(`BloodHelp is running at port: ${port}`);
});
