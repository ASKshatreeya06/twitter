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
        
        const tweet = await postModel.find({ userId: req.params.id }).populate("userId", "_id  description ");
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

const retweets = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const postId = req.params.id;

        // console.log(postId)

        const postInDB = await postModel.findById(postId);

        if (!postInDB) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (postInDB.userId.toString() === loggedInUserId.toString()) {
                  return res
                    .status(400)
                    .json({ message: "Can't repost with same account" });
                }
        if (postInDB.retweets && postInDB.retweets.includes(loggedInUserId)) {
            // 
            await postModel.findByIdAndUpdate(postId, { $pull: { retweets: loggedInUserId } });
            res.status(200).json({ message: "User remove retweet your post" });
        } else {
            await postModel.findByIdAndUpdate(postId, { $push: { retweets: loggedInUserId } });
            res.status(200).json({ message: "User retweet your post" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }



    // try {
    //     const tweetId = req.params.id;
    //     if (!tweetId) {
    //       return res.status(400).json({ message: "Please provide tweet id" });
    //     }
    //     const userId = req.user._id; // Corrected
    //     const user = await userModel.findById(userId);
    //     if (!user) {
    //       return res.status(400).json({ message: "User not found" });
    //     }
    //     const tweet = await postModel.findById(tweetId);
    //     if (!tweet) {
    //       return res.status(400).json({ message: "Tweet not found" });
    //     }
    //     if (tweet.userId.toString() === userId.toString()) { // Corrected and moved
    //       return res
    //         .status(400)
    //         .json({ message: "Can't repost with same account" });
    //     }
    //     const repostedIndex = user.retweets.indexOf(tweetId);
    //     if (repostedIndex !== -1) {
    //       user.retweets.splice(repostedIndex, 1);
    //       const tweetRepostedIndex = tweet.retweets.indexOf(userId);
    //       if (tweetRepostedIndex !== -1) {
    //         tweet.retweets.splice(tweetRepostedIndex, 1);
    //         await tweet.save();
    //       }
    //       await user.save();
    //       return res.status(200).json({ message: "Undo repost success" });
    //     } else {
    //       user.retweets.push(tweetId);
    //       tweet.retweets.push(userId);
    //       await user.save();
    //       await tweet.save();
    //       return res.status(200).json({ message: "Tweet reposted" });
    //     }
    //   } catch (error) {
    //     return res.status(500).json({ message: "Internal server error" });
    //   }
}

module.exports = { Post, DeletePost, MyPost, likeOrDislike, getAllTwitt, getFollowingTweets, retweets };