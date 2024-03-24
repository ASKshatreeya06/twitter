import axios from "axios"
import { apiurl } from "../apiurl"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { getOtherUsers } from "../redux/slice"


const useOtherUsers = (id)=>{
    const dispatch = useDispatch()
    useEffect(()=>{
        const fetchOtherProfile=async()=>{
            try {
                const token = sessionStorage.getItem("token");
                const response = await axios.get(apiurl+`getotheruser`,{
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
    
                    },
                    withCredentials:true
                })
                // console.log(response);
                dispatch(getOtherUsers(response.data.otherUser))
            } catch (error) {
                console.log(error);
            }
        }
       fetchOtherProfile();
    },[])
   
}

export default useOtherUsers;