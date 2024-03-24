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
const Profile = () => {
    const { user, profile } = useSelector(store => store.user)
    const [profileData,setProfileData] = useState(null)
    const { id } = useParams();
    useEffect(()=>{
        getUserProfileById()
    },[id])
    const token = sessionStorage.getItem("token");
    async function getUserProfileById(){
       
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
    const dispatch = useDispatch();
    
    const followOrUnfollowHandler = async (id) => {
        debugger
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
                const response = await axios.post(apiurl + `follow/${id}`,{}, {
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

    return (
        <div className='w-[50%] border-l border-r border-gray-200'>
          {profileData&&(  <div>
                <div className='flex items-center py-2'>
                    <Link to="/" className='p-2 rounded-full bg-gray-100 cursor-pointer'>
                        <IoMdArrowBack size={"24px"} />
                    </Link>
                    <div className='ml-4'>
                        <h1 className='font-bold text-lg'>{profileData?.fullName}</h1>
                        <p className='text-gray-500 text-sm'>10 post</p>
                    </div>

                </div>
                <img className='w-full' style={{ height: "13rem" }} src='https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_1280.jpg' alt='banner' />
                <div className='absolute top-52 ml-3 border-4 border-white rounded-full'>
                    <Avatar src='https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D' size="120" round={true} />
                </div>

                <div className='text-right m-4'>
                    {
                        profileData?._id === user?._id ? (<button className='px-4 py-1 rounded-full hover:bg-gray-200 border border-gray-400 cursor-pointer'>Edit Profile</button>)
                            : (<button onClick={() => followOrUnfollowHandler(profileData?._id)} className='px-4 py-1 rounded-full bg-black text-white cursor-pointer'>{user?.following.includes(id) ? "unfollow" : "follow"}</button>)
                    }

                </div>
                <div className='m-4'>
                    <h1 className='font-bold text-lg'>{profileData?.fullName}</h1>
                    <p className='text-gray-500 text-sm'>{profileData?.userName}</p>
                </div>
                <div className='m-4 text-sm'>
                    <p>
                        “मोदी परिवार” BJP Warriors, Parody, Spiritual Speaker of Sanatan Dharma,
                        the account is not affiliated with the subject portrayed in the profile.
                    </p>
                </div>
            </div>)}

            {!profileData&&(  <div>
               Loading...
            </div>)}
        </div>
    )
}

export default Profile
