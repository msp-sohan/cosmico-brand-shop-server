const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()

const stripe = require('stripe')(process.env.PAYMENT_SECRET_KEY);

app.use(cors({
   origin: ['http://localhost:5173']
}))
app.use(express.json())

// const uri = "mongodb://localhost:27017"
const uri = process.env.MONGODB_URI;

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
      // await client.connect();
      client.connect();

      const productCollection = client.db('CosmicoDB').collection('Product')
      const brandCollection = client.db('CosmicoDB').collection('Brand')
      const advertisement = client.db('CosmicoDB').collection('Advertisement')
      const testimonials = client.db('CosmicoDB').collection('Testimonial')
      const cartCollection = client.db('CosmicoDB').collection('MyCart')

      app.get('/products', async (req, res) => {
         const cursor = productCollection.find()
         const result = await cursor.toArray()
         res.send(result)
      })

      app.get('/products/brands', async (req, res) => {
         const cursor = brandCollection.find()
         const result = await cursor.toArray()
         res.send(result)
      })
      app.get('/advertisement', async (req, res) => {
         const cursor = advertisement.find()
         const result = await cursor.toArray()
         res.send(result)
      })

      app.get('/products/:id', async (req, res) => {
         const id = req.params.id
         console.log(id)
         const query = { _id: new ObjectId(id) }
         const product = await productCollection.findOne(query)
         res.send(product)
      })

      app.get('/testimonial', async (req, res) => {
         const cursor = testimonials.find()
         const result = await cursor.toArray()
         res.send(result)
      })

      app.get('/mycart/:email', async (req, res) => {
         const email = req.params.email
         const result = await cartCollection.find({ email: email }).toArray()
         res.send(result)
      })

      // app.get('/mycart/:id', async (req, res) => {
      //    const id = req.params.id
      //    const query = { _id: new ObjectId(id) }
      //    const result = await cartCollection.findOne(query)
      //    res.send(result)
      // })

      app.post('/products', async (req, res) => {
         const addProduct = req.body;
         const result = await productCollection.insertOne(addProduct);
         res.send(result)
      })

      app.post('/mycart', async (req, res) => {
         const myCart = req.body
         const result = await cartCollection.insertOne(myCart)
         res.send(result)
      })

      app.put('/products/:id', async (req, res) => {
         const id = req.params.id
         const product = req.body
         const filter = { _id: new ObjectId(id) }
         const options = { upsert: true }
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

      app.delete('/products/:id', async (req, res) => {
         const id = req.params.id;
         console.log(id)
         const query = { _id: new ObjectId(id) }
         const result = await productCollection.deleteOne(query);
         res.send(result);
      })

      app.delete('/mycart/:id', async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) }
         const result = await cartCollection.deleteOne(query);
         res.send(result);
      })

      app.post("/create-payment-intent", async (req, res) => {
         const { price } = req.body;
         const amount = parseInt(price * 100);
         if (!price || amount < 1) return;
         // Create a PaymentIntent with the order amount and currency
         const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "usd",
            payment_method_types: ['card'],
         });
         res.send({
            clientSecret: paymentIntent.client_secret,
         });
      });

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


