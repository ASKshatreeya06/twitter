const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const userModel = mongoose.model('userModel');



const profileUpdate = async (req, res) => {
    try {
        const { fullName, email, phone, description } = req.body
        // console.log(req.body);
        const user = await userModel.findById(req.user._id)
        // console.log(user);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.fullName = fullName;
        user.phone = phone;
        user.description = description
        user.email = email;

        // Save the updated user
        await user.save();

        // Send response with updated user profile
        res.status(200).json({ message: "User profile updated successfully", user });
    } catch (error) {
        console.log(error);
    }
}

const Register = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;
        if (!firstName || !lastName || !email || !phone || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const fullName = firstName + ' ' + lastName;
        const capitalizeWords = (fullName) => {
            return fullName
                .toLowerCase()
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        };
        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();
        const userName = '@' + (trimmedFirstName === trimmedLastName ? trimmedFirstName.replace(/\s/g, '') : (trimmedLastName + trimmedFirstName).replace(/\s/g, '')) + Math.floor(Math.random() * 10000); // Generate username
        const emailInDb = await userModel.findOne({ email: email });
        const phoneInDb = await userModel.findOne({ phone: phone });
        if (emailInDb) {
            return res.status(401).json({ message: "This email is already in use" });
        } else if (phoneInDb) {
            return res.status(400).json({ message: "This phone number is already in use" });
        }
        const hashPassword = await bcryptjs.hash(password, 16);
        const user = new userModel({ fullName: capitalizeWords(fullName), userName: userName, password: hashPassword, email: email, phone: phone });
        await user.save();
        res.status(201).json({ message: "Account created successfully", success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const Login = async (req, res) => {
    try {
        const { userdata, password } = req.body;
        if (!userdata || !password) {
            return res.status(400).json({ message: "Please provide email/phone/username and password" });
        }
        const userInDb = await userModel.findOne({ $or: [{ email: userdata }, { phone: userdata }, { userName: userdata }] });
        if (!userInDb) {
            return res.status(404).json({ message: "User not found" });
        }
        const match = await bcryptjs.compare(password, userInDb.password);
        if (!match) {
            return res.status(401).json({ message: "Incorrect password" });
        }
        const jwtToken = jwt.sign({ _id: userInDb._id }, process.env.JWT_KEY, { expiresIn: "1d" });
        const user = await userModel.find(userInDb._id).select("-password")
        // console.log(user)
        res.cookie('token', jwtToken, { expiresIn: "1d", httpOnly: true });
        res.status(200).json({ token: jwtToken, user: user, message: `welcome back ${userInDb.fullName}`, success: true });
        // console.log("user logged in");
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const Logout = async (req, res) => {
    return res.cookie("token", "", { expiresIn: new Date(Date.now()) }).json({ message: "user Logged out ssf", success: true });
};

const Bookmark = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const postId = req.params.id;

        const user = await userModel.findById(loggedInUserId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.bookmark && user.bookmark.includes(postId)) {
            // Remove bookmark
            await userModel.findByIdAndUpdate(loggedInUserId, { $pull: { bookmark: postId } });
            res.status(200).json({ message: "Bookmark removed successfully" });
        } else {
            // Bookmark
            await userModel.findByIdAndUpdate(loggedInUserId, { $push: { bookmark: postId } });
            res.status(200).json({ message: "Post bookmarked successfully" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
const getMyProfile = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userModel.findById(id).select("-password")
        return res.status(200).json({ user })
    } catch (error) {
        console.log(error);
    }
}
const getOtherUser = async (req, res) => {
    try {
        const otherUser = await userModel.find({ _id: { $ne: req.user._id } }).select("-password")
        if (!otherUser) {
            return res.status(401).json({ message: "currently do not have any users" })
        }
        return res.status(201).json({ otherUser })
    } catch (error) {
        console.log(error);
    }
}

const Follow = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const userId = req.params.id;
        // console.log(userId);
        const loggedInUser = await userModel.findById(loggedInUserId);
        const user = await userModel.findById(userId);
        if (!user.followers.includes(loggedInUserId)) {
            await user.updateOne({ $push: { followers: loggedInUserId } });
            await loggedInUser.updateOne({ $push: { following: userId } });
            return res.status(201).json({ message: `Successfully followed ${user.fullName}`, success: true });
        } else {
            return res.status(400).json({ message: "Already followed", success: false });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}
const UnFollow = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const userId = req.params.id;
        const loggedInUser = await userModel.findById(loggedInUserId);
        const user = await userModel.findById(userId);
        if (loggedInUser.following.includes(userId)) {
            await user.updateOne({ $pull: { followers: loggedInUserId } });
            await loggedInUser.updateOne({ $pull: { following: userId } });
            return res.status(201).json({ message: `Successfully unfollowed ${user.fullName}`, success: true });
        } else {
            return res.status(400).json({ message: "Already unfollowed", success: false });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

module.exports = { Register, Login, Logout, Bookmark, getMyProfile, getOtherUser, Follow, UnFollow, profileUpdate };