import { useState } from "react";
import { useDispatch } from "react-redux";

// states (redux)
import { setAgencies  } from "./../redux/action";


export const useAgencies = () => {
    const [error, setError] = useState(null)
    const [loadingState, setLoadingState] = useState(false)
    const dispatch = useDispatch()

    const getAgencies = async () => {
        try {    
            const fetchres = await fetch(`${process.env.REACT_APP_API_URL}/user/getagencies`, {
                method: 'GET',
                // headers: { 'Authorization': `Bearer ${token}` },
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
                dispatch(setAgencies(json))
                setLoadingState(false)
            }
            
        } catch (err) {
            console.log('try catch error: ', err.message)
            setError('An error occured while processing your request. Please check your internet connection and try again')
            setTimeout(() => { setError(null) }, 3000)
            setLoadingState(false)
        }
    }


    return { getAgencies, loadingState, error } 
}