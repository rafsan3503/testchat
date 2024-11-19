import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// states (redux)
import { setTerminalHistory  } from "./../redux/action";


export const useSendAC = () => {
    const { terminalHistory } = useSelector(state=>state.appReducer);
    const dispatch = useDispatch()
    const [loadingState, setLoadingState] = useState(false)
    const [error, setError] = useState(null)

        const sendAgencyChat =  async (username, agencyname, colorCode, content, socket, agencychats) => {
            setLoadingState(true)
            setError(null)
            try {
                var storeditem = localStorage.getItem('superluminaluser')
                if(storeditem !== null) {
                    // user detected
                    var parsed = JSON.parse(storeditem)
                    var time = new Date().getTime()
                    
                    
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/user/sendagencychat`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${parsed.token}`
                        },
                        body: JSON.stringify({ username, agencyname, time, colorCode, content })
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
                        // console.log(agencychats)
                        if(agencychats) {
                            console.log('is agency')
                            var itemagency = json.agencyname
                            var itemnew = { label: 'chat', username: json.username, agencyname: json.agencyname, time: json.time, colocrCode: json.colorCode, content: json.content, }
                            var itemupdate = [...agencychats, itemnew]
                            socket.emit('send_agency_message', {itemupdate, itemagency})
                            setLoadingState(false)
                        } else {
                            console.log('not agency')
                            var itemagency = json.agencyname
                            var itemnew = { label: 'chat', username: json.username, agencyname: json.agencyname, time: json.time, colocrCode: json.colorCode, content: json.content, }
                            var itemupdate = [ itemnew ]
                            socket.emit('send_agency_message', {itemupdate, itemagency})
                            setLoadingState(false)
                        }

                        // var terminalItem = localStorage.getItem('agencyterminalhistory')
                        // if(terminalItem) {
                        //     var parsedTI = JSON.parse(terminalItem)
                        //     var newItem = { label: 'chat', username: json.username, agencyname: json.agencyname, time: json.time, colocrCode: json.colorCode, content: json.content, }
                        //     var updateTerminal = [ ...parsedTI, newItem ]
                        //     localStorage.setItem('agencyterminalhistory', JSON.stringify(updateTerminal))
                        //     setLoadingState(false)
                        //     // socket.emit('send_agency_message', newItem)
                        // } else {
                        //     var newItem = { label: 'chat', username: json.username, useragency: json.useragency, time: json.time, colocrCode: json.colorCode, content: json.content, }
                        //     var updateTerminal = [ newItem ]
                        //     localStorage.setItem('agencyterminalhistory', JSON.stringify(updateTerminal))
                        //     setLoadingState(false)
                        //     // socket.emit('send_agency_message', newItem)
                        // }
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


        return { sendAgencyChat, loadingState, error } 
}