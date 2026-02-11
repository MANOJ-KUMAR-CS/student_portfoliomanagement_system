const User = require('../models/userSchema');

const updatePortfolio = async (req, res) => {
    try {
    
        // verify the user's id matches with token
        if (req.user.id !== req.params.id) {
            return res.status(403).json({ 
                message: "Access denied! You can't access another user's portfolio" 
            });
        }

        // verify the details to update is given or not
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "Details are necessary for updating" });
        }

        // prevent updating the student id itself
        delete req.body.st_id;

        // update query
        const updatedDetails = await User.findOneAndUpdate(
            { st_id: req.params.id },
            { $set: req.body },
            { new: true, runValidators: true }
        );

        // verify update
        if (!updatedDetails) {
            return res.status(404).json({ message: "No student details found" });
        }

        // return updated data
        return res.status(200).json({ 
            message: "Successfully updated details", 
            data: updatedDetails 
        });
    }
    
    // catch if any error occurred
    catch (err) {
        return res.status(500).json({ 
            message: "Internal server error", 
            error: err.message 
        });
    }
};

module.exports = { updatePortfolio };