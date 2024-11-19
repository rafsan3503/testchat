import { useState } from "react";
import { useDispatch } from "react-redux";

// states (redux)
import { setTerminalHistory  } from "./../redux/action";


export const useGetAgencyChats = () => {
    const [error, setError] = useState(null)
    const [loadingState, setLoadingState] = useState(false)
    const [agencyChatData, setTheData] = useState(null)
    const dispatch = useDispatch()

    const getAgencyChats = async (token, agencyname) => {
        try {    
            const fetchres = await fetch(`${process.env.REACT_APP_API_URL}/user/getagencychat/${agencyname}`, {
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
                localStorage.setItem('agencyterminalhistory', JSON.stringify(json))
                setTheData(json)
                setLoadingState(false)
            }
            
        } catch (err) {
            console.log('try catch error: ', err.message)
            setError('An error occured while processing your request. Please check your internet connection and try again')
            setTimeout(() => { setError(null) }, 3000)
            setLoadingState(false)
        }
    }


    return { getAgencyChats, loadingState, error, agencyChatData } 
}