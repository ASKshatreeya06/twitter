import axios from "axios"
import { apiurl } from "../apiurl"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllTweets } from "../redux/tweetSlice"
const useGetMyTweet = (id) => {
    const dispatch = useDispatch()
    const { refresh, isActive } = useSelector(state => state.tweet);
    const followingTweetHandler = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(apiurl + `getfollowingtweets`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token

                },
            })
            // console.log(response.data.tweets);
            dispatch(getAllTweets(response.data.tweets));


        } catch (error) {

            console.log(error);
        }
    }

    const fetchMyTweets = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const res = await axios.get(apiurl + `getalltweet`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token

                },
                withCredentials: true
            })
            // console.log(res);
            dispatch(getAllTweets(res.data.tweets))
            // dispatch(getAllTweets(response.data.tweets))
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (isActive) {
            fetchMyTweets();
        } else {
            followingTweetHandler()
        }


    }, [isActive,refresh])

}

export default useGetMyTweet;