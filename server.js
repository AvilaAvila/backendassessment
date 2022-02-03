const mongoose = require('mongoose');
const express = require('express');
const app = express();

var cors = require('cors');

const usersRoutes = require('./auth');
const adminRoutes = require('./admin');

app.use(cors());

mongoose.connect('mongodb+srv://Avila:Avila123@clustera.z1tjo.mongodb.net/MEAN',{ useNewUrlParser: true })
    .then('Connected to DB')
    .catch('Something went wrong while connecting to DB!');

app.use(express.json());

app.use('/auth',usersRoutes);
app.use('/admin',adminRoutes);

app.listen(3000,()=>{console.log("Server connected on port 3000")});