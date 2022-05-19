const express = require('express');
const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require("cors")
const dotenv = require("dotenv").config()
const ObjectId=require("mongodb").ObjectId
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("running well")
})

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.lnxuo.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect()
  
        const usersToDoCollection=client.db("todo").collection("usersToDo")

        app.post("/usersToDo",async(req,res)=>{
            const task=req.body
            const result= await usersToDoCollection.insertOne(task)
            res.send(result)
        })
        app.get("/usersToDo",async(req,res)=>{
            const email=req.query.email
           const query={email:email}
            const result= await usersToDoCollection.find(query).toArray()
            res.send(result)
        })
        app.put("/usersToDo/:id",async(req,res)=>{
        const id=req.params.id
        const doc=req.body.completed
        const query={_id:ObjectId(id)}
        const options = { upsert: true }
        const updateDoc = {
          $set: {
           completed:doc
          }
        }

        const result=await usersToDoCollection.updateOne(query,updateDoc,options)
        res.send(result)
        })
        app.delete("/usersToDo/:id",async(req,res)=>{
            const id=req.params.id
            const query={_id:ObjectId(id)}
            const result= await usersToDoCollection.deleteOne(query)
            res.send(result)
        })

    }
    finally {

    }
}
run().catch(console.dir)
app.listen(port, () => {
    console.log("to do server running well")
})