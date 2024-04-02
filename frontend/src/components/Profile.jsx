import React, { useEffect, useState } from 'react'
import Avatar from 'react-avatar'
import { IoMdArrowBack } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import useGetProfile from '../hooks/useGetProfile'
import axios from 'axios'
import { apiurl } from '../apiurl'
import { followingUpdate } from '../redux/slice'
import { getRefresh } from '../redux/tweetSlice'
import { MdOutlineDelete } from 'react-icons/md'
import { CiBookmark, CiHeart } from 'react-icons/ci'
import { FaRegComment } from 'react-icons/fa'
import { AiOutlineRetweet } from "react-icons/ai";
import toast from 'react-hot-toast'
const Profile = () => {
    const dispatch = useDispatch();
    const [updata, setUpdate] = useState(false)

    const { user, profile } = useSelector(store => store.user)
    const [profileData, setProfileData] = useState(null)
    
    const { id } = useParams();

    const [tweets, setTweets] = useState(0)
    useEffect(() => {
        getUserProfileById()
        myTweets(id)
        
    }, [id])
    const token = sessionStorage.getItem("token");
    async function getUserProfileById() {

        const response = await axios.get(apiurl + `getmyprofile/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            withCredentials: true
        });

        setProfileData(response.data.user)
    }
    // console.log(user._id);
   

    const followOrUnfollowHandler = async (id) => {
        
        if (user.following.includes(id)) {
            try {
                const response = await axios.post(apiurl + `unfollow/${id}`, {}, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token

                    },
                })
                console.log(response);
                dispatch(followingUpdate(id))
                dispatch(getRefresh())
            } catch (error) {
                console.log(error);
            }


        } else {
            try {
                const response = await axios.post(apiurl + `follow/${id}`, {}, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token

                    },
                })
                console.log(response);
                dispatch(followingUpdate(id))
                dispatch(getRefresh())
            } catch (error) {
                console.log(error);
            }

        }
    }
   

    const myTweets = async (id) => {
        const response = await axios.get(apiurl + `mypost/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        })
        setTweets(response.data.tweets)
        console.log(response.data.tweets);

    }



    const [fullName, setFullName] = useState(user?.fullName)
    const [email, setEmail] = useState(user?.email)
    const [phone, setPhone] = useState(user?.phone)
    const [description, setDescription] = useState(user?.description)


    const updateProfile = async (e) => {
        try {
            const body = { fullName, email, phone, description };

            console.log(body);
            const response = await axios.put(apiurl + 'profileUpdate', body, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            getUserProfileById()
            console.log(response.data);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const likeOrDislikeHandler = async (_id) => {
        try {
            const response = await axios.put(apiurl + `like/${_id}`, {}, {
                headers: {
                    "Authorization": "Bearer " + token
                },
            });
            dispatch(getRefresh());
            myTweets(id)
            toast.success(response.data.message);
        } catch (error) {
            console.log("Error liking/disliking tweet:", error);
            // Handle error (e.g., display a toast message)
            toast.error("Failed to like/dislike tweet.");
        }
    }
    
    const deleteTweethandler = async (_id) => {
        try {
            const response = await axios.delete(apiurl + `deletetweet/${_id}`, {
                headers: {
                    "Authorization": "Bearer " + token
                },
            });
            dispatch(getRefresh());
            myTweets(id)
            toast.success(response.data.message);
        } catch (error) {
            console.log("Error deleting tweet:", error);
            // Handle error (e.g., display a toast message)
            toast.error("Failed to delete tweet.");
        }
    }
    
//retweet
    const retweet=async(_id)=>{
        try {
            const token = sessionStorage.getItem("token");
            console.log(id);
            const response = await axios.post(apiurl + `retweet/${_id}`,{}, {
                headers: {
                    "Authorization": "Bearer " + token
                },
                withCredentials: true
            });
            dispatch(getRefresh());
            myTweets(id)
            toast.success(response.data.message);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='w-[50%] border-l border-r border-gray-200'>
            {profileData && (<div>
                <div className='flex items-center py-2'>
                    <Link to="/" className='p-2 rounded-full bg-gray-100 cursor-pointer'>
                        <IoMdArrowBack size={"24px"} />
                    </Link>
                    <div className='ml-4'>
                        <h1 className='font-bold text-lg'>{profileData?.fullName}</h1>
                        <p className='text-gray-500 text-sm'>{tweets.length} post</p>
                    </div>

                </div>
                <img className='w-full' style={{ height: "13rem" }} src='https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_1280.jpg' alt='banner' />
                <div className='absolute top-52 ml-3 border-4 border-white rounded-full'>
                    <Avatar src='https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D' size="120" round={true} />
                </div>

                <div className='text-right m-4'>
                    {
                        profileData?._id === user?._id ? (<button className='px-4 py-1 rounded-full hover:bg-gray-200 border border-gray-400 cursor-pointer' onClick={() => setUpdate(true)}>Edit Profile</button>)
                            : (<button onClick={() => followOrUnfollowHandler(profileData?._id)} className='px-4 py-1 rounded-full bg-black text-white cursor-pointer'>{user?.following.includes(id) ? "unfollow" : "follow"}</button>)
                    }

                </div>


                {updata && <div tabindex="-1" aria-hidden="true" className=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                    <div className="relative p-4 w-full max-w-md max-h-full">

                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Update Your Profile
                                </h3>
                                <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal" onClick={() => setUpdate(false)}>
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>

                            <form className="p-4 md:p-5" onSubmit={updateProfile}>
                                <div className="grid gap-4 mb-4 grid-cols-2">
                                    <div className="col-span-2">
                                        <label for="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full Name</label>
                                        <input type="text" name="fullName" id="email"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                                    </div>
                                    <div className="col-span-2">
                                        <label for="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone</label>
                                        <input type="tel" name="phone" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                                    </div>
                                    <div className="col-span-2">
                                        <label for="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                        <input type="email" name="emial" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>

                                    <div className="col-span-2">
                                        <label for="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Bio</label>
                                        <textarea id="description" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                                    </div>
                                </div>
                                <button type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                                    Update Profile
                                </button>
                            </form>
                        </div>
                    </div>
                </div>}


                <div className='m-4'>
                    <h1 className='font-bold text-lg'>{profileData?.fullName}</h1>
                    <p className='text-gray-500 text-sm'>{profileData?.userName}</p>
                </div>
                <div className='m-4 text-sm'>
                    <p>
                        {profileData?.description}
                    </p>
                </div>
            </div>)}
            <hr />



            {tweets.length > 0 ? (<div className='border-b border-gray-200'>
               { tweets.map((tweet,index)=>(<div className='flex p-4' key={index}>
                    <div><Avatar googleId="118096717852922241760" size="40" round={true} /></div>
                    <div className='ml-2 w-full'>
                       
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
                           {user?._id !== tweet?.userId._id && <div className='flex items-center'>
                                <div onClick={() => retweet(tweet?._id)} className='p-2 hover:bg-green-200 rounded-full cursor-pointer'>
                                    <AiOutlineRetweet size={"20px"} />
                                </div>
                                <p>{tweet?.retweets?.length}</p>
                            </div>}
                            <div className='flex items-center'>
                                <div onClick={() => likeOrDislikeHandler(tweet?._id)}  className='p-2 hover:bg-pink-200 rounded-full cursor-pointer'>
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
                                user?._id === tweet?.userId._id && (<div className='flex items-center'>
                                    <div onClick={()=>deleteTweethandler(tweet?._id)}  className='p-2 hover:bg-red-400 rounded-full cursor-pointer'>
                                        <MdOutlineDelete size={"24px"} />
                                    </div>
                                    <p>{tweets?.bookmark?.length}</p>
                                </div>)
                            }

                        </div>
                    </div>
                </div>))}
            </div>) : ''}
            {!profileData && (<div>
                Loading...
            </div>)}
        </div>
    )
}

export default Profile
