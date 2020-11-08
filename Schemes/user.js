const mongoose = require('mongoose');
const validatestring = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: {
      validator(v) {
        return validatestring.isEmail(v);
      },
      message: (props) => `${props.value} is not an email`,
    },
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});
module.exports = mongoose.model('user', userSchema);
