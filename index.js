// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const cors = require('cors');
const jwt = require('jsonwebtoken');

const privateKey = 'sdghhfdshgfhsdgjkfvcXCVXCV';

// Create Express application
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://admin:TCrNPm0EJDeNofCG@cluster0.pzes7qf.mongodb.net/ecom')
    .then(() => console.log('DB Connected!'))
    .catch((e) => console.log("Database not connected"));

// Define User Schema and Model
const { Schema } = mongoose;
const userSchema = new Schema({
    firstName: String,
    lastName: String,
    contact: String,
    email: String,
    password: String,
    confirmpassword: String,
});

// Define Product Schema and Model
const productSchema = new Schema({
    productId: String,
    productName: String,
    productRate: Number,
    productQuantity: Number,
});

// Create User and Product models
const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);

// Routes
app.get('/', function (req, res) {
    res.send('Hello World');
});

// User registration
app.post('/register', jsonParser, (req, res) => {
    console.log("body data:", req.body);

    const { firstName, lastName, contact, email, password, confirmpassword } = req.body;

    const createNewUser = new User({
        firstName: firstName,
        lastName: lastName,
        contact: contact,
        email: email,
        password: password,
        confirmpassword: confirmpassword,
    });

    createNewUser.save().then((result) => {
        res.status(201).json({ msg: 'New User created successfully!', result });
    }).catch(error => {
        console.error("Error:", error);
        res.status(500).json({ msg: 'An error occurred while saving user.', error });
    });
    app.delete('/product/:productId', (req, res) => {
        const productId = req.params.productId;
    
        Product.findByIdAndDelete(productId)
            .then((result) => {
                if (result) {
                    res.status(200).json({ msg: 'Product deleted successfully!', result });
                } else {
                    res.status(404).json({ msg: 'Product not found.' });
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                res.status(500).json({ msg: 'An error occurred while deleting product.', error });
            });
    });
});

// User login
app.post('/login', jsonParser, (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;

    User.findOne({ email: email })
        .then((result) => {
            if (result) {
                if (result.password === password) {
                    res.status(200).send({ msg: 'Login Successful', result, token: generateToken({ email: email, password: password }) });
                } else {
                    res.status(500).send({ msg: 'Please Enter Valid Email & Password', result });
                }
            } else {
                res.status(500).send({ msg: 'Please Enter Valid Email', result });
            }
        })
});

// Add new product
app.post("/product", jsonParser,(req, res) => {
    console.log(req.body)

    const { productId, productName, productRate, productQuantity } = req.body;

    const createNewProduct = new Product({
        productId: productId,
        productName: productName,
        productRate: productRate,
        productQuantity: productQuantity,
    });

    createNewProduct.save().then((result) => {
        res.status(201).send({ msg: "New Product added successfully!", result });
    }).catch(error => {
        console.error("Error:", error);
        res.status(500).json({ msg: 'An error occurred while saving product.', error });
    });
});

// Function to generate JWT token
function generateToken(payload) {
    const token = jwt.sign(payload, privateKey);
    return token;
}

// Start server
app.listen(port, () => {
    console.log("Server running on port:", port);
});
