const User = require("../models/userSchema");

const skillBasedSearch = async(req, res) => {
  try {
    const { skill } = req.body; // 1. Extract skill from body

    if (!skill) {
      return res.status(403).json({ message: "Please enter Skill to search" });
    }

    // 2. Use $in with regex for case-insensitive matching
    const regexSkills = (Array.isArray(skill) ? skill : [skill]).map(s => new RegExp(`^${s}$`, 'i'));
    const userData = await User.find({ skills: { $in: regexSkills } });

    // 3. Return 200 even for empty results to avoid console errors
    return res.status(200).json({
      message: userData.length > 0 ? "Students found with the skill" : "No match found",
      data: userData
    });
  } catch (err) {
    return res.status(500).json({ message: `Internal server error: ${err.message}` });
  }
};

module.exports = {skillBasedSearch};