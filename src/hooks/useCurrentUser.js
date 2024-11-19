import { useState } from "react";
import { useDispatch } from "react-redux";

// states (redux)
import { setUser  } from "./../redux/action";


export const useCurrentUser = () => {
    const [error, setError] = useState(null)
    const [loadingState, setLoadingState] = useState(false)
    const dispatch = useDispatch()

    const getCurrentUser = async (token) => {
        try {    
            const fetchres = await fetch(`${process.env.REACT_APP_API_URL}/user/getuser`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
            })
            const json = await fetchres.json()

            if(!fetchres.ok) {
                setLoadingState(false)
                setError(json.error)
                setTimeout(() => { setError(null) }, 3000)
                console.log(fetchres)
            }
            
            if(fetchres.ok) {
                // console.log(json)
                dispatch(setUser(json))
                setLoadingState(false)
            }
            
        } catch (err) {
            console.log('try catch error: ', err.message)
            setError('An error occured while processing your request. Please check your internet connection and try again')
            setTimeout(() => { setError(null) }, 3000)
            setLoadingState(false)
        }
    }


    return { getCurrentUser, loadingState, error } 
}