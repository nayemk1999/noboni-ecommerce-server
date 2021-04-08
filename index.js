const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')

const port = 3001
require('dotenv').config()
const { DB_USER, DB_PASS, DB_NAME } = process.env
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.3q4kc.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const app = express();
app.use(bodyParser.json());
app.use(cors())

client.connect(err => {
  const productsCollection = client.db("noboniecommercesite").collection("products");
  const ordersCollection = client.db("noboniecommercesite").collection("orders");

  app.post('/addProducts', (req, res) => {
    const products = req.body
    productsCollection.insertMany(products)
      .then(products => {
        res.send(products.insertedCount);
      })
  });

  app.get('/products', (req, res) => {
    const search = req.query.search
    productsCollection.find({name: {$regex: search}})
    .toArray((err, documents) => {
      res.send(documents);
    })
  });
  app.get('/products/:key', (req, res) => {
    const productsKey = req.params.key;
    // console.log(productsKey);
    productsCollection.find({key: productsKey})
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  });

  app.post('/productsKeys', (req , res) => {
    const productsKeys = req.body;
    productsCollection.find({ key: { $in: productsKeys }})
    .toArray((err, documents) => {
      res.send(documents)
    })
  });

  app.post('/orderProduct', (req, res) => {
    const orders = req.body
    ordersCollection.insertOne(orders)
      .then(products => {
        res.send(products.insertedCount > 0);
      })
  });

});


app.get('/', (req, res) => {
  res.send('Hello Noboni Website...!')
})



app.listen(process.env.PORT || port)