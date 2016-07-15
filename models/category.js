var mongoose = require('mongoose');

var categorySchema = {

  _id: {
    type: String,
    required: true,
    trim: true
  },

  name: {
    type: String,
    required: true,
    maxlength: 200,
    trim: true
  },

  icon: {
    type: String,
    trim: true
  },

  description: {
    type: String,
    maxlength: 5000,
    trim: true
  },

  level: {
    type: String,
    maxlength: 100,
    trim: true,
    required: true
  },

  topic_count: {
    type: Number,
    default: 0
  },

  disp_order: {
    type: Number,
    default: 0
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
};

var schema = new mongoose.Schema(categorySchema);

schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });

// export the model for mongoose
module.exports = schema;
module.exports.categorySchema = categorySchema;
