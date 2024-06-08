require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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
    const blogsCollection = client.db("BloodHelpDB").collection("blogs");
    const fundsCollection = client.db("BloodHelpDB").collection("funds");

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

    //get single donation request data
    app.get("/edit-donation-request/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await donationsCollection.findOne(query);
      res.send(result);
    });

    //update single donation request data
    app.patch("/edit-donation-request/:id", async (req, res) => {
      const data = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedRequest = {
        $set: {
          recipientName: data.recipientName,
          recipientDistrict: data.recipientDistrict,
          recipientUpazila: data.recipientUpazila,
          hospitalName: data.hospitalName,
          addressLine: data.addressLine,
          donationDate: data.donationDate,
          donationTime: data.donationTime,
          requestMessage: data.requestMessage,
        },
      };
      const result = await donationsCollection.updateOne(
        filter,
        updatedRequest
      );
      res.send(result);
    });

    //delete single donation data
    app.delete("/donation-request/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await donationsCollection.deleteOne(query);
      res.send(result);
    });

    //get admin
    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let admin = false;
      if (user) {
        admin = user?.role === "admin";
      }
      res.send({ admin });
    });

    //get all users
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    //get all donation requests
    app.get("/donation-requests", async (req, res) => {
      const result = await donationsCollection.find().toArray();
      res.send(result);
    });

    //update user status
    app.patch("/user/status/:id", async (req, res) => {
      const data = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedUser = {
        $set: {
          status: data.status,
        },
      };
      const result = await usersCollection.updateOne(filter, updatedUser);
      res.send(result);
    });

    //update user role
    app.patch("/user/role/:id", async (req, res) => {
      const data = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedUser = {
        $set: {
          role: data.role,
        },
      };
      const result = await usersCollection.updateOne(filter, updatedUser);
      res.send(result);
    });

    //get all blogs
    app.get("/blogs", async (req, res) => {
      // const result = await blogsCollection.find().toArray();
      // res.send(result);
      const status = req.query.status;
      const query = status && status !== "all" ? { status } : {};
      const blogs = await blogsCollection.find(query).toArray();
      res.send(blogs);
    });

    //create blog
    app.post("/blogs", async (req, res) => {
      const blog = req.body;
      const result = await blogsCollection.insertOne(blog);
      res.send(result);
    });

    //delete blog
    app.delete("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const result = await blogsCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    //update blog status
    app.patch("/blogs/status/:id", async (req, res) => {
      const data = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedBlog = {
        $set: {
          status: data.status,
        },
      };
      const result = await blogsCollection.updateOne(filter, updatedBlog);
      res.send(result);
    });

    //search donation requests
    app.get("/search-donors", async (req, res) => {
      const { bloodGroup, district, upazila } = req.query;
      console.log(req.query);
      // Create a query object based on the query parameters
      const query = {
        bloodGroup: bloodGroup,
        district: district,
        upazila: upazila,
      };
      // if (bloodGroup && bloodGroup !== "all") {
      //   query.bloodGroup = bloodGroup;
      // }
      // if (district && district !== "all") {
      //   query.district = district;
      // }
      // if (upazila && upazila !== "all") {
      //   query.upazila = upazila;
      // }

      try {
        const donations = await donationsCollection.find(query).toArray();
        res.send(donations);
        // console.log(donations);
      } catch (error) {
        console.error("Error fetching donors:", error);
        res.status(500).send("An error occurred while fetching donors");
      }
    });

    //update donation status
    app.patch("/donation/status/:id", async (req, res) => {
      const data = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedStatus = {
        $set: {
          status: data.status,
        },
      };
      const result = await donationsCollection.updateOne(filter, updatedStatus);
      res.send(result);
    });

    //get single blog data
    app.get("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await blogsCollection.findOne(query);
      res.send(result);
    });

    //payment intent api
    app.post("/create-payment-intent", async (req, res) => {
      const { fund } = req.body;
      const amount = parseInt(fund * 100);
      // console.log(amount, "amount inside the intent");

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        // payment_method_types: ["card"],
        payment_method_types: ["card"],
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });

    //store donation in db
    app.post("/fund", async (req, res) => {
      const fundInfo = req.body;
      const result = await fundsCollection.insertOne(fundInfo);
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
