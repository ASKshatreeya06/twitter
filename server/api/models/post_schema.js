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
    userDetails: {
        type: Array,
        default: []
    },
    comments: [
        {
            commnet: {type:String},
            userId: { type: ObjectId, ref: "userModel" }
        }
    ],
    retweets: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'userModel' ,
        require:true}
    ],
    userId: {
        type: ObjectId,
        ref: "userModel"
    }
})
mongoose.model('postModel', postModel);
module.exports = postModel;