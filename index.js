const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.fjonof5.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   }
});

async function run() {
   try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();

      const productCollection = client.db('CosmicoDB').collection('Product')
      const brandCollection = client.db('CosmicoDB').collection('Brand')

      app.get('/products', async(req, res)=>{
         const cursor = productCollection.find()
         const result = await cursor.toArray()
         res.send(result)
      })

      app.post('/products', async(req, res)=>{
         const addProduct = req.body;
         const result = await productCollection.insertOne(addProduct);
         res.send(result)
      })

      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
   } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
   }
}
run().catch(console.dir);



app.get("/", (req, res) => {
   res.send("Cosmico Brand Shop is Successfully Running on Server...");
});


app.listen(port, () => {
   console.log(`Cosmico Brand Shop is Running on port: ${port}`);
});


