import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// states (redux)
import { setUser  } from "./../redux/action";


export const useQuitAgency = () => {
    const { user } = useSelector(state=>state.appReducer);
    const dispatch = useDispatch()
    const [loadingState, setLoadingState] = useState(false)
    const [error, setError] = useState(null)
    const [succmesg, setSucmsg] = useState(null)
    
    const quitAgency =  async (agencyname) => {
        setLoadingState(true)
        setError(null)
            try {
                var storeditem = localStorage.getItem('superluminaluser')
                if(storeditem !== null) {
                    // user detected
                    var parsed = JSON.parse(storeditem)
                    var currentDate = new Date().getTime()
                    
                    
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/user/quitagency`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${parsed.token}`
                        },
                        body: JSON.stringify({ agencyname })
                    })
                    const json = await response.json()

                    if(!response.ok) {
                        setError(json.error)
                        setTimeout(() => { setError(null) }, 3000)
                        setLoadingState(false)
                        console.log(response)
                    }
                    if(response.ok) {
                        // console.log(json)
                        var updateUser = {...user, agency: '' }
                        dispatch(setUser(updateUser))
                        setSucmsg('quited successfully')
                        setTimeout(() => { setSucmsg(null) }, 3000)
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


        return { quitAgency, loadingState, succmesg, error } 
}