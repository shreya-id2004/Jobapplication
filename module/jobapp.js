const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    company : String,
    link : String,
    
    position: {
      type: String,
      required: [true, 'Please provide position'],
      maxlength: 100,
    },

    status: {
      type: String,
      enum: ['interview', 'declined', 'pending'],
      default: 'pending',
    },

    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'remote', 'internship'],
      default: 'full-time',
    },

    jobLocation: {
      type: String,
      default: 'my city',
      required: true,
    },

    createdAt: {type:Date , default: Date.now},
    deadline:Date,
    notes : {type:String , default:""},
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
});

module.exports = mongoose.model('Job', jobSchema);


