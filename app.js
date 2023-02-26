const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://aicha_user:Afafa12345@cluster0.k6gp0jr.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use('/api/sauces', (req, res, next) => {
    const sauce = [
      {
        _id: 'oeihfzeoi',
        
      },
      {
        _id: 'oeihfzeomoihi',
       
      },
    ];
    res.status(200).json(sauce);
  });

  app.post('/api/sauces', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
      message: 'Objet créé !'
    });
  });

app.use('/api/auth', userRoutes);

module.exports = app;