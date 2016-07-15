var mongoose = require('mongoose');

var userSchema = {

  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
    trim: true,
    index: { unique: true }
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 20
  },

  token: {
    type: String,
    minlength: 8,
    maxlength: 20,
    trim: true,
    index: { unique: true }
  },

  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },

  firstname: {
    type: String,
    trim: true,
  },

  lastname: {
    type: String,
    trim: true
  },

  // base64 image for user profile
  avatar: {
    type: String,
    trim: true,
  },

  created_by: {
    type: String
  },

  created_at: {
    type: Date,
    default: Date.now
  },

  updated_by: {
    type: String
  },

  updated_at: {
    type: Date,
    default: Date.now
  }
}

var schema = new mongoose.Schema(userSchema);

schema.virtual('fullname').get(function() {
  return this.firstname + ' ' + this.lastname;
});

schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });

module.exports = schema;
