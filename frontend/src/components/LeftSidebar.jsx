import React from 'react'
import { CiBookmark, CiHashtag, CiHome, CiUser, } from 'react-icons/ci'
import { IoIosNotifications } from "react-icons/io";
import { AiOutlineLogout } from "react-icons/ai";
import { MdDeveloperBoard } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import axios from 'axios';
import { apiurl } from '../apiurl';
import toast from 'react-hot-toast';
import { getMyProfile, getOtherUsers, getUser } from '../redux/slice';
const LeftSidebar = () => {
    const { user,profile} = useSelector(store => store.user)
    // console.log(user._id);
    const dispatch = useDispatch()
    const nav = useNavigate();
    const logoutHandler = async () => {
        try {
            const response = await axios.get(apiurl + `logout`)
            sessionStorage.removeItem("token");
            dispatch(getUser(null));
            dispatch(getOtherUsers(null));
            dispatch(getMyProfile(null));
            console.log(response);
            toast.success(response.data.message)
            nav("/login")
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='w-[20%]'>
            <div>
                <div>
                    <img className='ml-3' width={"25px"} src='https://img.freepik.com/free-vector/twitter-new-2023-x-logo-white-background-vector_1017-45422.jpg?w=740&t=st=1710642358~exp=1710642958~hmac=4674aad1cdeb4604ef1afc830cced23818876bb5a01015bea8fd0ecd9401e2a7' alt='' />
                </div>
                <Link to="/home" className='flex items-center my-2  px-4 hover:bg-gray-200 hover:cursor-pointer rounded-full'>
                    <div><CiHome size="24px" /></div>
                    <h1 className='font-bold text-lg ml-3'>Home</h1>
                </Link>
                <div className='flex items-center my-2  px-4 hover:bg-gray-200 hover:cursor-pointer rounded-full'>
                    <div><CiHashtag size="24px" /></div>
                    <h1 className='font-bold text-lg ml-3'>Explore</h1>
                </div>
                <div className='flex items-center my-2  px-4 hover:bg-gray-200 hover:cursor-pointer rounded-full'>
                    <div><IoIosNotifications size="24px" /></div>
                    <h1 className='font-bold text-lg ml-3'>Notification</h1>
                </div>
                <Link to={`/home/profile/${user?._id}`} className='flex items-center my-2  px-4 hover:bg-gray-200 hover:cursor-pointer rounded-full'>
                    <div><CiUser size="24px" /></div>
                    <h1 className='font-bold text-lg ml-3'>Profile</h1>
                </Link>

                <div className='flex items-center my-2  px-4 hover:bg-gray-200 hover:cursor-pointer rounded-full'>
                    <div><CiBookmark size="24px" /></div>
                    <h1 className='font-bold text-lg ml-3'>Bookmark</h1>
                </div>
                <div className='flex items-center my-2  px-4 hover:bg-gray-200 hover:cursor-pointer rounded-full'>
                    <div><MdDeveloperBoard size="24px" /></div>
                    <h1 className='font-bold text-lg ml-3'>About</h1>
                </div>
                <div onClick={logoutHandler} className='flex items-center my-2  px-4 hover:bg-gray-200 hover:cursor-pointer rounded-full'>
                    <div><AiOutlineLogout size="24px" /></div>
                    <h1 className='font-bold text-lg ml-3'>Logout</h1>
                </div>
                <button className='px-4 py-2 border-none text-md bg-[#1D9BF0] w-full rounded-full text-white font-bold'>Post</button>


            </div>
        </div>
    )
}

export default LeftSidebar
