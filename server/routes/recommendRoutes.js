const express = require("express");
const User = require("../models/User");
const Course = require("../models/Course");

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.interests || user.interests.length === 0) {
      // No interests saved — return all courses as fallback
      const allCourses = await Course.find().limit(10);
      return res.json(allCourses);
    }

    // Build case-insensitive regex for each interest
    const interestRegexes = user.interests.map(
      (interest) => new RegExp(`^${interest.trim()}$`, "i")
    );

    const recommendedCourses = await Course.find({
      $or: [
        { category: { $in: interestRegexes } },  // match category
        { tags:     { $in: interestRegexes } },  // match tags too
      ],
    });

    // If still nothing matched, return all courses as fallback
    if (recommendedCourses.length === 0) {
      const allCourses = await Course.find().limit(10);
      return res.json(allCourses);
    }

    res.json(recommendedCourses);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;