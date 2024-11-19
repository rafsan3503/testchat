import { useState } from "react";
import { useDispatch } from "react-redux";

export const useAgenciesUsers = () => {
    const [error, setError] = useState(null)
    const [loadingState, setLoadingState] = useState(false)
    const [agusers, setUsers] = useState(null)
    const dispatch = useDispatch()

    const getAgenciesUsers = async (agencyname) => {
        try {
            var storeditem = localStorage.getItem('superluminaluser')
            if(storeditem !== null) {
                // user detected
                var parsed = JSON.parse(storeditem)

                const fetchres = await fetch(`${process.env.REACT_APP_API_URL}/user/getagency/${agencyname}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${parsed.token}` },
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
                    var theUsers = json.memebers.length
                    setUsers(theUsers)
                    setLoadingState(false)
                }
            } else {
                setError('no user detected. please, sign in to continue')
                setTimeout(() => { setError(null) }, 3000)
                setLoadingState(false)
            }
            
        } catch (err) {
            console.log('try catch error: ', err.message)
            setError('An error occured while processing your request. Please check your internet connection and try again')
            setTimeout(() => { setError(null) }, 3000)
            setLoadingState(false)
        }
    }


    return { getAgenciesUsers, loadingState, error, agusers } 
}