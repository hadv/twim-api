var mongoose = require('mongoose');

var topicSchema = {

  // plain text title
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },

  icon: {
    type: String,
    trim: true
  },

  // plain text short description to display on the overview list
  short_desc: {
    type: String,
    required: true,
    maxlength: 1000
  },

  // html detail descriptiom to display the detail about the topic
  // can be input rich text by HTML editor.
  description: {
    type: String,
    required: true
  },

  // a topic can be classify into a category
  category: {
    type: String,
    ref: 'Category',
    index: true
  },

  // display order on the screen
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
}

var schema = new mongoose.Schema(topicSchema);

schema.set('toJSON', { virtuals: true });

module.exports = schema;
