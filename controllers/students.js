const express = require('express');
const router = express.Router();
const data = require('../data');
const Student = require('../models/student.js');

// mount routes

// seed
router.get('/class/seed', (req,res) => {
    Student.create(data, (err, students) => {
        res.redirect('/class');
    });
})

// index
router.get('/class', (req, res) => {
    Student.find({}, (error, allStudents) => {
        res.render('class-index.ejs', {
            students: allStudents,
            title: "Class Page"
        })
    })
})

// new 


// delete


// update


// create


// edit


// show


module.exports = router;