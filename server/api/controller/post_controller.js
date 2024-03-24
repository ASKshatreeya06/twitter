const expresss = require('express')
const { default: mongoose } = require('mongoose');

const router = expresss.Router()
const userModel = mongoose.model('userModel')
const postModel = mongoose.model('postModel')

const Post = async (req, res) => {
    try {
        const { description, } = req.body;
        if (!description) {
            return res.status(400).json({ error: "All fields are mandatory" });
        }
        //   if(!req.file){
        //     return res.status(400).json({error: "Please upload image"});
        //   }
        req.user.password = undefined;


        //   const cloudinaryUpload = await cloudinary.uploader.upload(req.file.path, {
        //     folder: "productImages",
        //   });
        const user = await userModel.findById(req.user._id).select("-password")
        const postObj = new postModel({ description, userDetails: user, userId: req.user._id });
        await postObj.save();
        res.status(201).json({ success: true, message: "post tweeted" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
const DeletePost = async (req, res) => {
    try {
        const postFound = await postModel.findById(req.params.id);
        // console.log(req.params.id);
        if (!postFound) {
            return res.status(400).json({ error: "Post does not exist" });
        }
        // Check if the post author is the same as the logged-in user, then allow deletion
        if (postFound.userId._id.toString() === req.user._id.toString()) {
            await postModel.deleteOne({ _id: req.params.id });
            return res.status(200).json({ message: "Tweet deleted successfully" });
        } else {
            return res.status(401).json({ error: "Unauthorized to delete this post" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const MyPost = async (req, res) => {
    try {

        const tweet = await postModel.find({ userId: req.user.id }).populate("userId", "_id  description ");
        res.status(200).json({ tweets: tweet });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
const likeOrDislike = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const postId = req.params.id;

        // console.log(postId)

        const postInDB = await postModel.findById(postId);

        if (!postInDB) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (postInDB.likes && postInDB.likes.includes(loggedInUserId)) {
            // Dislike
            await postModel.findByIdAndUpdate(postId, { $pull: { likes: loggedInUserId } });
            res.status(200).json({ message: "User disliked your post" });
        } else {
            await postModel.findByIdAndUpdate(postId, { $push: { likes: loggedInUserId } });
            res.status(200).json({ message: "User liked your post" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getAllTwitt = async (req, res) => {
    try {
        const id = req.user._id;
        const loggedInUser = await userModel.findById(id);
        const loggedInUsertweetts = await postModel.find({ userId: id })
        const followinUserTweet = await Promise.all(loggedInUser.following.map((otherUserId) => {
            return postModel.find({ userId: otherUserId })
        }))
        return res.status(200).json({
            tweets: loggedInUsertweetts.concat(...followinUserTweet)
        })
    } catch (error) {
        console.log(error);
    }
}

const getFollowingTweets = async (req, res) => {
    try {
        const id = req.user._id;
        const loggedInUser = await userModel.findById(id);
        const followinUserTweet = await Promise.all(loggedInUser.following.map((otherUserId) => {
            return postModel.find({ userId: otherUserId })
        }))
        return res.status(200).json({
            tweets: [].concat(...followinUserTweet)
        })
    } catch (error) {
        console.log(error);
    }
}


module.exports = { Post, DeletePost, MyPost, likeOrDislike, getAllTwitt, getFollowingTweets };