// User.js

const mongoose = require('mongoose'); // declaring mongoose.
const userSchema = mongoose.Schema({  // making a schema called userSchema.
  id: { 
    type: String,
    maxLength: 50,
    unique: 1, // exists one unique value
  },
  pw: {
    type: String,
    maxLength: 50,
  },
  pwc: {
    type: String,
    maxLength: 50,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User; // exporting user schema.
