const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');

require('dotenv').config()
const cros = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const port = 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.luy9u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
     try {
       await client.connect();
       
       const database = client.db("carMeachanic");
       const servicesCollection = database.collection("services");

       //GET API
       app.get('/services', async(req, res)=>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)

       })
       //GET SINGLE Servise With id
       app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            console.log('Hitting the id', id);
            const query = { _id: ObjectId(id)}
            const service = await servicesCollection.findOne(query)
            res.json(service)
       })
       //POST API
       app.post('/services', async(req, res)=>{
            const service = req.body;
            const result = await servicesCollection.insertOne(service)
            console.log(result);
            res.json(result)
       })

       //DELETE API
       app.delete('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query ={ _id: ObjectId(id)}
            const result = await servicesCollection.deleteOne(query)
            res.json(result)
       })
   
       
     } finally {
     //   await client.close();
     }
   }
   run().catch(console.dir);


app.get('/', (req, res)=>{
     res.send('Runnig Genius server')
});

app.listen(port, ()=>{
     console.log('Listen Genius server on port', port);
})