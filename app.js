const express = require('express');
const cors = require('cors');
require('dotenv').config()
const mongoSanitize = require('express-mongo-sanitize')
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');//import helmet

const sauceRoutes = require('./routes/Sauce');
const userRoutes = require('./routes/User');
const limiter = require('./middleware/limiter');

let aaa = 'mongodb+srv://aicha_user:Afafa12345@cluster0.k6gp0jr.mongodb.net/test?retryWrites=true&w=majority'

mongoose.connect(process.env.URI_MongoDB,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: false //modifiy middleware resource origin
})); //use middleware helmet
app.use(mongoSanitize());
app.use(express.json());
app.use(limiter);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
