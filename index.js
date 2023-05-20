const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const corsConfig = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}
app.use(cors(corsConfig))
app.options("*", cors(corsConfig));


app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zb2l2qq.mongodb.net/?retryWrites=true&w=majority`;

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

        await client.connect();
        const bookingCollection = client.db("room").collection("bookings");
        const confirmCollection = client.db("confirms").collection("booking");
        const pendingCollection = client.db("pending").collection("post");
        const approvedCollection = client.db("approved").collection("posts");
        const userCollection = client.db("users").collection("user");

        //get room
        app.get('/rooms', async (req, res) => {
            const users = await bookingCollection.find().toArray();
            res.send(users);
        })

        //get room by id
        app.get('/rooms/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await bookingCollection.findOne(query);
            res.send(result);
        });

        // update room by id
        app.put('/rooms/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {

                $set: {
                    name: user.name,
                    img: user.img,
                    room1: user.room1,
                    room2: user.room2,
                    place: user.place,
                    room: user.room,
                    contact: user.contact,
                    hno: user.hno,
                },
            }
            const result = await bookingCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        });

        //add new booking
        app.post('/confirm', async (req, res) => {
            const user = req.body;
            const result = confirmCollection.insertOne(user);
            res.send(result);
        })

        //get bookings
        app.get('/confirm', async (req, res) => {
            const users = await confirmCollection.find().toArray();
            res.send(users);
        })

        //add pending post
        app.post('/pending', async (req, res) => {
            const user = req.body;
            const result = pendingCollection.insertOne(user);
            res.send(result);
        })

        //get pending post
        app.get('/pending', async (req, res) => {
            const users = await pendingCollection.find().toArray();
            res.send(users);
        })

        //delete pending post

        app.delete('/pending/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await pendingCollection.deleteOne(query);
            res.send(result);
        });

        //add approved post
        app.post('/approved', async (req, res) => {
            const user = req.body;
            const result = approvedCollection.insertOne(user);
            res.send(result);
        })

        //get approved post

        app.get('/approved', async (req, res) => {
            const users = await approvedCollection.find().toArray();
            res.send(users);
        })

        //delete approved post

        app.delete('/approved/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await approvedCollection.deleteOne(query);
            res.send(result);
        });

        //add users
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = userCollection.insertOne(user);
            res.send(result);
        })
        // get Admin
        app.get('/admin/:email', async (req, res) => {
            const email = req.params.email;
            const user = await userCollection.findOne({ email: email });
            const isAdmin = user.role === 'Admin';
            res.send({ admin: isAdmin });
        })

    }
    finally {


    }
}
run().catch(console.dir);












app.get('/', (req, res) => {
    res.send('Hello RBS!')
})

app.listen(port, () => {
    console.log(`RBS listening on port ${port}`)
})
