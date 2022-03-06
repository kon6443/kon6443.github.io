// User.js

const mongoose = require('mongoose'); // declaring mongoose
const userSchema = mongoose.Schema({  // userSchema라는 이름의 schema를 작성해준다. 
  id: { 
    type: String,
    maxLength: 50,
    unique: 1, // 같은값은 하나만 존재할 수 있다.
  },
  pw: {
    type: String,
    maxLength: 50,
  },
  pwc: {
    type: String,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = { User }; // exporting user schema