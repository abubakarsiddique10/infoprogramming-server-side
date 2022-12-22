const express = require('express');
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors')
require('dotenv').config()
const { connectToServer, getDb, } = require('./utils/dbConnect');
const { ObjectId } = require('mongodb');
const { MongoClient, ServerApiVersion } = require('mongodb');


// middlewares
app.use(cors());
app.use(express.json())


// database connect
const uri = `mongodb+srv://info_programming:yPuhp1Zq0peqUJI3@cluster0.j7jwj49.mongodb.net/?retryWrites=true&w=majority`;
/* const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.j7jwj49.mongodb.net/?retryWrites=true&w=majority`; */
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const blogsCollection = client.db('info_programming').collection('blogs');

        // get all blogs
        app.get('/blogs', async (req, res) => {
            const result = await blogsCollection.find().toArray();
            res.send(result)
        })

        // get single blog
        app.get('/blogs/:id', async (req, res) => {
            const { id } = req.params
            const blog = await blogsCollection.findOne({ _id: ObjectId(id) });
            res.send(blog)
        })

        // post blog
        app.post('/blog', async (req, res) => {
            const result = await blogsCollection.insertOne(req.body);
            res.send({ message: "success" })
        })

        // delete blog
        app.delete('/blog', async (req, res) => {
            const { id } = req.body;
            const result = await blogsCollection.deleteOne({ _id: ObjectId(id) })
            res.send(result)
        })
        // update blog
        app.patch('/blog/:id', async (req, res) => {
            const { author, title, description, imgUrl, date, category } = req.body;
            const filter = { _id: ObjectId(req.params.id) }
            const updateDoc = {
                $set: { author, title, description, imgUrl, date, category }
            }
            const result = await blogsCollection.updateOne(filter, updateDoc)
        })
    } finally {
    }
}
run().catch(console.dir)

/*
connectToServer((err) => {
    if (!err) {
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })
    } else {
        console.log(err)
    }
})

app.get('/blogs', async (req, res) => {
    try {
        const db = getDb()
        const result = await db.collection('blogs').find().toArray();
        res.send(result)
    } catch (error) {
        console.log(error)
    }
})

app.get('/blogs/:id', async (req, res) => {
    try {
        const db = getDb()
        const { id } = req.params;
        const blog = await db.collection('blogs').findOne({ _id: ObjectId(id) })
        res.send(blog)
    } catch (error) {
        console.log(error)
    }
})

// post blog
app.post('/blog', async (req, res) => {
    const db = getDb()
    const result = await db.collection("blogs").insertOne(req.body)
    res.send({ message: "success" })
})

// update blog
app.patch('/blog/:id', async (req, res) => {
    const db = getDb();
    const { author, title, description, imgUrl, date, category } = req.body;
    const filter = { _id: ObjectId(req.params.id) }
    const updateDoc = {
        $set: { author, title, description, imgUrl, date, category }
    }
    const result = await db.collection('blogs').updateOne(filter, updateDoc)
})

// delete blog
app.delete('/blog', async (req, res) => {
    const db = getDb()
    const result = await db.collection('blogs').deleteOne({ _id: ObjectId(req.body.id) })
    res.send(result)
})*/

app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log('database connected')
})
