const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({

  user: {

    type: mongoose.Schema.Types.ObjectId,

    ref: 'User',

    required: true

  },

  title: {

    type: String,

    required: true,

    trim: true

  },

  amount: {

    type: Number,

    required: true

  },

  dueDate: {

    type: Date,

    required: true

  },

  completed: {

    type: Boolean,

    default: false

  }

},
{
  timestamps: true
});

module.exports = mongoose.model(
  'Reminder',
  reminderSchema
);