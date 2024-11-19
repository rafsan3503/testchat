import { useState } from "react";
import { useDispatch } from "react-redux";

// states (redux)
import { setTerminalHistory  } from "./../redux/action";


export const useGetGlobalChats = () => {
    const [error, setError] = useState(null)
    const [loadingState, setLoadingState] = useState(false)
    const [theData, setTheData] = useState(null)
    const dispatch = useDispatch()

    const getGlobalChats = async () => {
        try {    
            const fetchres = await fetch(`${process.env.REACT_APP_API_URL}/user/getglobalchats`, {
                method: 'GET',
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
                localStorage.setItem('terminalhistory', JSON.stringify(json))
                setTheData(json)
                dispatch(setTerminalHistory(json))
                setLoadingState(false)
            }
            
        } catch (err) {
            console.log('try catch error: ', err.message)
            setError('An error occured while processing your request. Please check your internet connection and try again')
            setTimeout(() => { setError(null) }, 3000)
            setLoadingState(false)
        }
    }


    return { getGlobalChats, loadingState, error, theData } 
}