const mongoose = require('mongoose');

const AuthenticationSchema = new mongoose.Schema({
  ID: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    required: true
  },
 
});

const Authentication = mongoose.model('Department', AuthenticationSchema);

module.exports = Authentication;
