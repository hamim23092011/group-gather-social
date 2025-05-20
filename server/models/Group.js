
const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

const groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  maxMembers: {
    type: Number,
    required: true,
    min: 1
  },
  startDate: {
    type: Date,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  createdBy: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  members: {
    type: [memberSchema],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Group', groupSchema);
