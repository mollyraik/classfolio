const express = require('express');
const router = express.Router();
// const data = require('../data');
const Project = require('../models/project.js');
const Student = require('../models/student.js');

// mount routes

// seed


// index


// new 
router.get('/projects/new', (req,res) => {
    Student.findById(req.query.studentId, (err, foundStudent) => {
        res.render('new-project.ejs', {
            student: foundStudent,
            title: `Add a New Project`
    })
        
    })
})

// delete


// update


// create
router.post('/student/:id', (req,res) => {
    Student.findById(req.params.id, (err, foundStudent) => {
        req.body.createdBy = foundStudent._id;
        Project.create(req.body, (err, createdProject) => {
            res.redirect(`/student/${foundStudent._id}`);
        })
    })
})

// edit


// show


module.exports = router;