import React from 'react'
import Avatar from 'react-avatar'
import { CiSearch } from 'react-icons/ci'
import { Link } from 'react-router-dom'
const RightSidebar = ({ otherUsers }) => {
  return (
    <div className='w-[25%]'>
      <div className=' flex items-center p-2 bg-gray-200 rounded-full outline-none'>
        <CiSearch size={"20px"} />
        <input className='bg-transparent outline-none px-2' type='text' placeholder='Search' />
      </div>
      <div className='p-4 my-4 bg-gray-200 rounded-2xl'>
        <h1 className='font-bold text-lg '>Who to follow</h1>
        {
          otherUsers?.map((user) => {
            return (
              <div key={user?._id} className='flex items-center justify-between my-3'>
                <div className='flex '>
                  <div><Avatar googleId="118096717852922241760" size="40" round={true} /></div>
                  <div className='ml-2'>
                    <h1 className='font-bold'>{user?.fullName}</h1>
                    <p className='text-sm'>{user?.userName}</p>
                  </div>
                </div>
                <div>
                  <Link to={`/home/profile/${user?._id}`}>
                    <button className='px-4 py-1 bg-black text-white rounded-full'>Profile</button>
                  </Link>
                </div>
              </div>
            )
          })
        }


      </div>
    </div>
  )
}

export default RightSidebar
