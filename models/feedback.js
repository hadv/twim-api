var mongoose = require('mongoose');

var feedbackSchema = {

  talk: {
    type: String,
    required: true
  },

  topic: {
    type: String,
    required: true
  },

  rater: {
    type: String,
    required: true,
    index: true
  },

  ratee: {
    type: String,
    required: true,
    index: true
  },

  feedbacks: [{
      title: {
        type: String
      },
      point: {
        type: Number,
        default: 0
      },
      note: {
        type: String
      }
  }],

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

var schema = new mongoose.Schema(feedbackSchema);

schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });

// export the model for mongoose
module.exports = schema;
