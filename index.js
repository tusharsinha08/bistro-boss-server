const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

require('dotenv').config()

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n7fvplr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n7fvplr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        const database = client.db('bistro_boss_db')
        const menuCollection = database.collection('menu')
        const reviewCollection = database.collection('reviews')
        const cartCollection = database.collection('carts')


        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // menu collection 
        app.get('/menu', async (req, res) => {
            const cursor = menuCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        // reviews collection
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        // carts collection
        app.post('/carts', async (req, res) => {
            const cartItem = req.body;
            const result = await cartCollection.insertOne(cartItem)
            res.send(result)
        })

        app.get('/carts', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const result = await cartCollection.find(query).toArray()
            res.send(result)
        })

        app.delete('/carts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await cartCollection.deleteOne(query)
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


app.get('/', (req, res) => {
    res.send("bistro boss server is online now.")
})

app.listen(port, () => {
    console.log(`bistro boss server is on port ${port}`);

})