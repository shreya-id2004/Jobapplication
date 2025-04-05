const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PLM = require('passport-local-mongoose');

const UserSchema = new Schema({
    username: String,
    email:{
        type : String,
        require : true,
    },
    jobs:[{
        type: Schema.Types.ObjectId,
        ref: 'Job'
    }]
});

UserSchema.plugin(PLM);
module.exports = mongoose.model('User',UserSchema);

