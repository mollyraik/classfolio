// dependencies
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const studentsRouter = require('./controllers/students');
const projectsRouter = require('./controllers/projects');

// initialize app
const app = express();

// config settings
require('dotenv').config();
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

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

// mount routes
app.get('/', (req,res) => res.render('home.ejs', {title: 'ClassMinder Home'}));
app.use(studentsRouter);
app.use(projectsRouter);

// app listener
app.listen(PORT, () => console.log(`Express is listening on port: ${PORT}`));