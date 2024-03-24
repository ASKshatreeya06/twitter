import axios from 'axios'
import React, { useState } from 'react'
import Avatar from 'react-avatar'
import { CiImageOn } from 'react-icons/ci'
import { apiurl } from '../apiurl'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { getAllTweets, getIsActive, getRefresh } from '../redux/tweetSlice'
const CreatePost = () => {
    const [description, setDescription] = useState('')
    const dispatch = useDispatch()
    const { isActive } = useSelector(state => state.tweet)
    const submitHandler = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.post(apiurl + `post`, { description }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token

                },
            })
            console.log(response);
            dispatch(getRefresh());
            if (response.data.success) {
                toast.success(response.data.message)
            }
            setDescription('')
        } catch (error) {
            toast.error(error.response.data.message)
            console.log(error);
        }
    }

    const forYouHandler = () => {
        dispatch(getIsActive(true))
    }
    const followingHandler = () => {
        dispatch(getIsActive(false))
    }
    return (
        <div className='w-[100%]'>
            <div >
                <div className='flex intems-center justify-between border border-gray-200'>
                    <div onClick={forYouHandler} className={`${isActive ? "border-b-4 border-blue-600" : null} cursor-pointer hover:bg-gray-200 w-full text-center px-4 py-3`}><h1 className='font-semibold text-gray-600 text-lg'>For you</h1></div>
                    <div onClick={followingHandler} className={`${isActive ? null : "border-b-4 border-blue-600"} cursor-pointer hover:bg-gray-200 w-full text-center px-4 py-3`}><h1 className='font-semibold text-gray-600 text-lg'>Following</h1></div>
                </div>
                <div >
                    <div className='flex items-center p-4'>
                        <div><Avatar googleId="118096717852922241760" size="40" round={true} /></div>
                        <input className='w-full outline-none border-none text-xl ml-2' type='text' value={description} onChange={(e) => setDescription(e.target.value)} placeholder='What is happening?!' />
                    </div>
                    <div className='flex justify-between p-4 border-b border-gray-300 '>
                        <div>
                            <CiImageOn size={"24px"} />
                        </div>
                        <button className='bg-[#1D9BF0] px-4 py-1 border-none rounded-full text-white ' onClick={submitHandler}>Post</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatePost
