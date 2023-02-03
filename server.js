// dependencies
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const studentsRouter = require('./controllers/students');
const projectsRouter = require('./controllers/projects');
const usersRouter = require('./controllers/users');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;

// initialize app
const app = express();

// config settings
require('dotenv').config();
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });

// database connection
mongoose.set('strictQuery', true);
mongoose.connect(DATABASE_URL);

// database connection error/message
const db = mongoose.connection;
db.on('error', (err) => console.log(err.message + 'is mongo not running?'));
db.on('connected', () => console.log('mongo connected'));

// mount middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

app.use(session({
  // secret should be in .env file and should be very random
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(fileUpload({ createParentPath: true }));

app.use((req,res,next) => {
  if (req.session.userId) {
      res.locals.user = req.session.userId;
  } else {
      res.locals.user = null;
  }
  next();
});

// authentication middleware
function isAuthenticated(req, res, next) {
  if (!req.session.userId) {
      return res.redirect('/');
  }
  next();
}

// mount routes
app.get('/', (req,res) => res.render('home.ejs', {title: 'Classfolio Home'}));
app.use(usersRouter);
app.use(isAuthenticated, studentsRouter);
app.use(isAuthenticated, projectsRouter);

// app listener
app.listen(PORT, () => console.log(`Express is listening on port: ${PORT}`));
