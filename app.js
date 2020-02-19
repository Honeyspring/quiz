const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const Product= require('./models/product'); //connect table schema


//connect databe mongoose to server
mongoose.connect('mongodb+srv://honeyspring:g%72%65e%6El%61nd@cluster0-xoilo.mongodb.net/test?retryWrites=true&w=majority')
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });
  //implemented CORS to make sure the front end could safely make calls to your app.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
app.use(bodyParser.json());//to extract the JSON object from the request

app.post('/api/products', (req, res, next) => {
//created a new instance of your  Product model, passing it a JavaScript object containing all of the information it needs from the parsed request body
  const product= new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    inStock: req.body.inStock,
  
  });
  //save()method returns a promise, so in our  then()  block, we send back a success response, and in our  catch()  block, 
  //we send back an error response with the error thrown by Mongoose.
  product.save().then(
    (product) => {
      res.status(201).json({
        product:product,
        message: 'Product saved successfully!'
       
      })
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );

});
//get details of individual products through id
app.get('/api/products/:id', (req, res, next) => {
  Product.findOne({
    _id: req.params.id
  }).then(
    (product) => {
      res.status(200).json({ product});
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
});
//update data of products
app.put('/api/products/:id', (req, res, next) => {
  const product = new Product({
    _id: req.params.id,
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    inStock: req.body.inStock,
  
  });
  Product.updateOne({_id: req.params.id}, product).then(
    () => {
      res.status(201).json({
        message: 'Modified!' 
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});

//delete route
app.delete('/api/products/:id', (req, res, next) => {
  Product.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});
//GET route to return all of the products in the database
app.get('/api/products', (req, res, next) => {
  Product.find().then(
    (products) => {
      res.status(200).json({ products: products});
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});


module.exports = app;