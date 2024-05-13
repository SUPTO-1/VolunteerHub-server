const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

// middle ware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8iumwdu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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


    const volunteersCollection = client.db('volunteerHub').collection('volunteer');
    const requestsCollection = client.db('volunteerHub').collection('requests');

    app.get('/volunteers', async (req,res)=>{
        const cursor = volunteersCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })

    app.get('/volunteers/search/:postTitle', async(req,res)=>{
        const postTitle = req.params.postTitle;
        const query = {postTitle: postTitle};
        const result = await volunteersCollection.find(query).toArray();
        res.send(result);
    })


    app.get('/volunteers/:id', async(req,res)=>{
      const id = req.params.id;
      // const query = {_id: new ObjectId(id)};
      // const result = await volunteersCollection.findOne(query);
      // res.send(result);
      const query = {_id: new ObjectId(id)};
      const result = await volunteersCollection.findOne(query);
      res.send(result);
    })

    app.post('/volunteers', async (req,res)=>{
        const newVolunteer = req.body;
        const result = await volunteersCollection.insertOne(newVolunteer);
        res.send(result)
    });

    app.get('/volunteers/user/:email', async(req,res)=>{
      const email = req.params.email;
      const query = {organizationEmail: email};
      const result = await volunteersCollection.find(query).toArray();
      res.send(result);
    })

    app.delete('/volunteers/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await volunteersCollection.deleteOne(query);
      res.send(result);
    })


    app.put('/volunteers/:id', async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updatedPost = req.body;
      const post = {
        $set: {
          organizationName: updatedPost.organizationName,
          organizationEmail: updatedPost.organizationEmail,
          thumbnail: updatedPost.thumbnail,
          postTitle: updatedPost.postTitle,
          category: updatedPost.category,
          description: updatedPost.description,
          location: updatedPost.location,
          volunteers: updatedPost.volunteers,
          date: updatedPost.date,
        },
      };

      const result = await volunteersCollection.updateOne(filter, post, options);
      res.send(result)

    })

    //request collection
    app.get('/requests', async (req,res)=>{
      const cursor = requestsCollection.find();
      const result = await cursor.toArray();
      res.send(result)
  })


     app.post('/requests', async (req,res)=>{
      const newRequest = req.body;
      const result = await requestsCollection.insertOne(newRequest);
      res.send(result)
     })


     app.get('/requests/:email', async(req,res)=>{
      const email = req.params.email;
      const query = {volunteerEmail: email};
      const result = await requestsCollection.find(query).toArray();
      res.send(result);
     })

     app.delete('/requests/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await requestsCollection.deleteOne(query);
      res.send(result);
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
    res.send('volunteer hub server is running')
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})