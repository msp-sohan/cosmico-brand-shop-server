const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()

app.use(cors())
app.use(express.json())

// const uri = "mongodb://localhost:27017"
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
      const advertisement = client.db('CosmicoDB').collection('Advertisement')
      const testimonials = client.db('CosmicoDB').collection('Testimonial')
      const cartCollection = client.db('CosmicoDB').collection('MyCart')

      app.get('/products', async(req, res)=>{
         const cursor = productCollection.find()
         const result = await cursor.toArray()
         res.send(result)
      })

      app.get('/products/brands', async(req, res)=>{
         const cursor = brandCollection.find()
         const result = await cursor.toArray()
         res.send(result)
      })
      app.get('/advertisement', async(req, res)=>{
         const cursor = advertisement.find()
         const result = await cursor.toArray()
         res.send(result)
      })

      app.get('/products/:id', async(req, res)=>{
         const id = req.params.id
         const query = {_id: new ObjectId(id)}
         const product = await productCollection.findOne(query)
         res.send(product)
      })

      app.get('/testimonial', async(req, res)=>{
         const cursor = testimonials.find()
         const result = await cursor.toArray()
         res.send(result)
      })

      app.get('/mycart', async(req, res)=>{
         const cursor = cartCollection.find()
         const result = await cursor.toArray()
         res.send(result)
      })

      app.post('/products', async(req, res)=>{
         const addProduct = req.body;
         const result = await productCollection.insertOne(addProduct);
         res.send(result)
      })

      app.post('/mycart', async(req, res)=>{
         const myCart = req.body
         const result = await cartCollection.insertOne(myCart)
         res.send(result)
      })

      app.put('/products/:id', async(req, res)=>{
         const id = req.params.id
         const product = req.body
         const filter = {_id: new ObjectId(id)}
         const options = {upsert: true}
         const updateProduct = {
            $set: {
               name: product.name,
               brand: product.brand,
               type: product.type,
               price: product.price,
               rating: product.rating,
               image: product.image,
            }
         }
         const result = await productCollection.updateOne(filter, updateProduct, options)
         res.send(result)
      })

      app.delete('/mycart/:id', async(req, res)=>{
         const id = req.params.id
         const query = { _id: new ObjectId(id) };
         const result = await cartCollection.deleteOne(query);
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


