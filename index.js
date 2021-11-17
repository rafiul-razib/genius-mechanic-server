const express = require("express");
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const cors = require("cors");
const app = express();
const port = process.env.PORT|| 5000;
require('dotenv').config()

// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gnvic.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
      await client.connect();
      console.log("database connected")
      const database = client.db("geniusMechanic");
      const servicesCollection = database.collection("services");
      
    //   POST API
    app.post("/services", async(req, res)=>{

        const newService = req.body;
        const result = await servicesCollection.insertOne(newService);
        res.json(result)
    })

    // GET API
    app.get("/services", async(req, res)=>{
        const cursor = servicesCollection.find({});
        const services = await cursor.toArray();
        res.send(services)
    })

    // GET SINGLE SERVICE
    app.get("/services/:id", async(req, res)=>{
        const id = req.params.id;
        const query ={_id: ObjectId(id)};
        const service = await servicesCollection.findOne(query)
        res.send(service)
    })

    app.delete("/services/:id", async(req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const result = await servicesCollection.deleteOne(query)
        res.json(result)
    })


      
     
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);



app.get("/", (req, res)=>{
    res.send("Hello from mechanics")
})
app.get("/hello", (req, res)=>{
    res.send("Hello from car mechanics")
})

app.listen(port, ()=>{
    console.log("Listening to port", port)
})


