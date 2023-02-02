const express = require('express');
const { MongoInvalidArgumentError } = require('mongodb');
const router = express.Router();
// const data = require('../data');
const Project = require('../models/project.js');
const Student = require('../models/student.js');
const cloudinary = require('cloudinary').v2;

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
router.delete('/projects/:id', (req,res) => {
    Project.findByIdAndDelete(req.params.id, (err, deletedProject) => {
        res.redirect(`/student/${deletedProject.createdBy}`);
    })
})

// update
router.put('/projects/:id', (req,res) => {
    const photo = req.files.photo;
    photo.mv(`./uploads/${photo.name}`);
    const fs = require('fs');
    const path = require('path');
    const projectRoot = path.resolve('class-minder', '..');
    cloudinary.uploader.upload(`./uploads/${photo.name}`, (err, result) => {
        console.log(err);
        console.log(result);
        const studentName = req.body.createdBy.split(' ');
        Student.findOne({
            firstName: studentName[0],
            lastName: studentName[1]
        }, (err, foundStudent) => {
            req.body.createdBy = foundStudent._id;
            req.body.photo = result.secure_url;
            Project.findByIdAndUpdate(
                req.params.id,
                req.body,
                {new: true},
                (err, updatedProject) => {
                    fs.unlink(`${projectRoot}/uploads/${photo.name}`, (err) => {
                        res.redirect(`/projects/${updatedProject._id}`)
                    })
                }
            )
        })
    })
})


// create
router.post('/student/:id', (req,res) => {
    const photo = req.files.photo;
    photo.mv(`./uploads/${photo.name}`);
    const fs = require('fs');
    const path = require('path');
    const projectRoot = path.resolve('class-minder', '..');
    cloudinary.uploader.upload(`./uploads/${photo.name}`, (err, result) => {
        console.log(err);
        req.body.photo = result.secure_url;
        Student.findById(req.params.id, (err, foundStudent) => {
            req.body.createdBy = foundStudent._id;
            Project.create(req.body, (err, createdProject) => {
                fs.unlink(`${projectRoot}/uploads/${photo.name}`, (err) => {
                    res.redirect(`/student/${foundStudent._id}`);
                })
            })
        })
    })
})

// edit
router.get('/projects/:id/edit', (req,res) => {
    Project.findById(req.params.id, (err, foundProject) => {
        Student.findById(foundProject.createdBy, (err, foundStudent) => {
            res.render('edit-project.ejs', {
                project: foundProject,
                student: foundStudent.firstName + ' ' + foundStudent.lastName,
                title: `Edit ${foundProject.name}`
            })
        })
    })
})

// show
router.get('/projects/:id', (req,res) => {
    Project.findById(req.params.id, (err, foundProject) => {
        Student.findById(foundProject.createdBy, (err, foundStudent) => {
            res.render('project-show.ejs', {
                project: foundProject,
                title: foundProject.name,
                student: foundStudent.firstName + ' ' + foundStudent.lastName,
            })
        })
    })
})

module.exports = router;

