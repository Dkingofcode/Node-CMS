const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    title: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: 'public'
    },
    
    allowComments:{
        type: Boolean,
        required: true,
        default: false
    },

    body:{
        type: String,
        required: true
    },

    file: {
        type: String,
        
    }
});


module.exports = mongoose.model('Post', PostSchema); 























