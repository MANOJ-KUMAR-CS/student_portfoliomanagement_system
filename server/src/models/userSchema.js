const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  st_id: { type: Number, required: true, unique: true },

  header: {
    name: { type: String ,required: true },
    email: { type: String , required: true },
    phone_no: { type: String, required: true },
    dept: { type: String, required: true },
    year: { type: String, required: true },
    sem: { type: String, required: true },
    git_link: { type: String, required: true }, 
    linkedin_link: { type: String, required: true }, 
    leetcode_link: { type: String, required: true } 
  },

  objective: { type: String, required: true },

  academic: {
    cgpa: { type: Number, max:10 , required: true },
    sgpas: { type: [Number], required: true }, 
    tenth_percentage: { type: Number, max:100, required: true },
    twelfth_percentage: { type: Number, max:100 , required: true }
  },

  skills: { type: [String], required: true },
  projects: [{
    title: { type: String, required: true },
    tech_stack: { type: [String], required: true },
    description: { type: String, required: true }
  }],

  certifications: { type: [String], required: true },
  achievements: { type: [String], required: true },
  hobbies: { type: [String], required: true }
});

    
module.exports = mongoose.model('User', userSchema , "portfolio_details");
