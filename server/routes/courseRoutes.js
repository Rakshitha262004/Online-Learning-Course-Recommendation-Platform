const express = require("express");

const Course = require("../models/Course");

const router = express.Router();


// ADD COURSE
router.post("/add", async (req, res) => {

    try {

        const course = new Course(req.body);

        await course.save();

        res.json({
            message: "Course Added Successfully"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});


// GET ALL COURSES
router.get("/", async (req, res) => {

    try {

        const courses = await Course.find();

        res.json(courses);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

module.exports = router;