import axios from 'axios';
import React from 'react';
import Avatar from 'react-avatar';
import { CiBookmark, CiHeart } from 'react-icons/ci';
import { FaRegComment } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { apiurl } from '../apiurl';
import toast from 'react-hot-toast';
import { getRefresh } from '../redux/tweetSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineRetweet } from 'react-icons/ai';

const Tweet = ({ tweet }) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user)
    console.log(tweet);
    const likeOrDislikeHandler = async (id) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.put(apiurl + `like/${id}`, {}, {
                headers: {

                    "Authorization": "Bearer " + token
                },
                // withCredentials: true
            });
            dispatch(getRefresh());
            toast.success(response.data.message);
        } catch (error) {
            console.log(error);
        }
    }
    const deleteTweethandler = async (id) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.delete(apiurl + `deletetweet/${id}`, {
                headers: {
                    "Authorization": "Bearer " + token
                },
                // withCredentials: true
            });
            dispatch(getRefresh());
            toast.success(response.data.message);
        } catch (error) {
            console.log(error);
        }
    }
    const retweet=async(id)=>{
        try {
            const token = sessionStorage.getItem("token");
            console.log(id);
            const response = await axios.post(apiurl + `retweet/${id}`,{}, {
                headers: {
                    "Authorization": "Bearer " + token
                },
                withCredentials: true
            });
            dispatch(getRefresh());
            toast.success(response.data.message);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='border-b border-gray-200'>
            <div className='flex p-4'>
                <div><Avatar googleId="118096717852922241760" size="40" round={true} /></div>
                <div className='ml-2 w-full'>
                    <div className='flex items-center'>
                        <h1 className='font-bold'>{tweet?.userDetails[0].fullName}</h1>
                        <p className='text-gray-500 text-sm ml-1'>{tweet?.userDetails[0].userName}</p>
                    </div>
                    <div>
                        <p>{tweet?.description}</p>
                    </div>
                    <div className='flex justify-between my-3'>
                        <div className='flex items-center'>
                            <div className='p-2 hover:bg-green-200 rounded-full cursor-pointer'>
                                <FaRegComment size={"20px"} />
                            </div>
                            <p>0</p>
                        </div>
                        {user?._id !== tweet?.userId && <div className='flex items-center'>
                            <div onClick={() => retweet(tweet?._id)} className='p-2 hover:bg-green-200 rounded-full cursor-pointer'>
                                <AiOutlineRetweet size={"20px"} />
                            </div>
                            <p>{tweet?.retweets?.length}</p>
                        </div>}
                        <div className='flex items-center'>
                            <div onClick={() => likeOrDislikeHandler(tweet?._id)} className='p-2 hover:bg-pink-200 rounded-full cursor-pointer'>
                                <CiHeart size={"24px"} />
                            </div>
                            <p><p>{tweet?.likes?.length}</p>
                            </p>
                        </div>
                        <div className='flex items-center'>
                            <div className='p-2 hover:bg-yellow-200 rounded-full cursor-pointer'>
                                <CiBookmark size={"24px"} />
                            </div>
                            <p>{tweet?.bookmark?.length}</p>
                        </div>
                        {
                            user?._id === tweet?.userId && (<div className='flex items-center'>
                                <div onClick={() => deleteTweethandler(tweet?._id)} className='p-2 hover:bg-red-400 rounded-full cursor-pointer'>
                                    <MdOutlineDelete size={"24px"} />
                                </div>
                                <p>{tweet?.bookmark?.length}</p>
                            </div>)
                        }

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tweet;
