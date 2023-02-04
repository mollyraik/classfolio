const express = require('express');
const router = express.Router();
const data = require('../data');
const Student = require('../models/student.js');
const Project = require('../models/project.js');
const cloudinary = require('cloudinary').v2;

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
router.get('/student/new', (req,res) => {
    res.render('new-student.ejs', {
        title: 'Add a New Student'
    });
})


// delete
router.delete('/student/:id', (req,res) => {
    Student.findByIdAndDelete(req.params.id, (err, deletedStudent) => {
        res.redirect('/class');
    })
})


// update
router.put('/student/:id', (req,res) => {
    const photo = req.files.photo;
    photo.mv(`./uploads/${photo.name}`);
    const fs = require('fs');
    const path = require('path');
    const projectRoot = path.resolve();
    cloudinary.uploader.upload(`./uploads/${photo.name}`, (err, result) => {
        console.log(err);
        req.body.photo = result.secure_url;
        Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true},
            (err, updatedStudent) => {
                fs.unlink(`${projectRoot}/uploads/${photo.name}`, (err) => {
                    res.redirect(`/student/${updatedStudent._id}`)
                })
            }
        )
    })
})

// create
router.post('/class', (req,res) => {
    const photo = req.files.photo;
    photo.mv(`./uploads/${photo.name}`);
    const fs = require('fs');
    const path = require('path');
    const projectRoot = path.resolve();
    cloudinary.uploader.upload(`./uploads/${photo.name}`, (err, result) => {
        console.log(err);
        req.body.photo = result.secure_url;
        Student.create(req.body, (err, createdStudent) => {
            fs.unlink(`${projectRoot}/uploads/${photo.name}`, (err) => {
                console.log(err);
                res.redirect('/class');
            })
        })
    })
})

// edit
router.get('/student/:id/edit', (req,res) => {
    Student.findById(req.params.id, (err, foundStudent) =>{
        res.render('edit-student.ejs', {
            student: foundStudent,
            title: `Edit ${foundStudent.firstName} ${foundStudent.lastName}`    
        })
    })
})

// show
router.get('/student/:id', (req,res) => {
    Student.findById(req.params.id, (err, foundStudent) => {
        Project.find({createdBy: foundStudent._id}, (err, foundProjects) => {
            res.render('student-show.ejs', {
                student: foundStudent,
                projects: foundProjects,
                title: foundStudent.firstName + ' ' + foundStudent.lastName,
            })
        })
    })
})


module.exports = router;