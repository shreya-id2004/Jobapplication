const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    jobname: String,
    company : String,
    link : String,
    createdAt: {type:Date , default: Date.now},
    deadline:Date,
    status: { type: String, default: "Pending" },
    notes : {type:String , default:""},
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
});

module.exports = mongoose.model('Job', jobSchema);


