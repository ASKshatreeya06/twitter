const { default: mongoose, ObjectId } = require('mongoose');

const postModel = mongoose.Schema({
    image: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    likes: {
        type: Array,
        default: []
    },
    userDetails:{
        type: Array,
        default: []
    },
    userId: {
        type: ObjectId,
        ref: "userModel"
    }
})
mongoose.model('postModel', postModel);
module.exports = postModel;