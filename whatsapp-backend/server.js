import express from 'express'
import mongoose from 'mongoose'
import Messages from './dbMessages.js'
import cors from 'cors'
import Pusher from 'pusher'
// app config
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
    appId: "1190588",
    key: "510b1b8ab1e64e0d0d3e",
    secret: "34a7b39c948fb03a0a92",
    cluster: "eu",
    useTLS: true
  });

// middleware
app.use(express.json());
app.use((req,res,next)=>{
res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Headers", "*");
next();
});
app.use(cors());


// db config

const connection_url = "mongodb+srv://oliviertest:1980@cluster-marketplace.jabcp.mongodb.net/whatsappdb?retryWrites=true&w=majority";
mongoose.connect(connection_url,{ useCreateIndex:true,useNewUrlParser: true, useUnifiedTopology: true });


const db = mongoose.connection;
db.once("open",()=>{
    console.log('db connected');

    const msgCollection = db.collection("messagecontents");

    const changeStream = msgCollection.watch();
    changeStream.on("change", (change)=>{
        console.log('le changement sest produit' ,change);

        if(change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            pusher.trigger('messages','inserted',
            {
            name:messageDetails.name,
            message : messageDetails.message,
            timestamp : messageDetails.timestamp,
            received : messageDetails.received
        });
        } else {
            console.log('Error triggering Pusher')
        }
    });

});




// api routes
app.get('/',(req,res)=>res.status(200).send('hello olivier'));


app.get("/messages/sync", (req,res) =>{
    Messages.find((err,data)=>{
        if(err){
            res.status(500).send(err)
        } else  {
            res.status(200).send(data)
        }
    })
})


app.post("/messages/new", (req,res) =>{
    const dbMessage = req.body
    Messages.create(dbMessage, (err,data)=>{
        if(err){
            res.status(500).send(err)
        } else  {
            res.status(201).send(data)
        }
    })
})




// listen
app.listen(port, ()=> console.log(`listening on localhost:${port}`))