import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// states (redux)
import { setTerminalHistory  } from "./../redux/action";


export const useSendGC = () => {
    const { terminalHistory } = useSelector(state=>state.appReducer);
    const dispatch = useDispatch()
    const [loadingState, setLoadingState] = useState(false)
    const [error, setError] = useState(null)

        const sendGlobalChat =  async (username, useragency, colorCode, content, socket) => {
            setLoadingState(true)
            setError(null)
            try {
                var storeditem = localStorage.getItem('superluminaluser')
                if(storeditem !== null) {
                    // user detected
                    var parsed = JSON.parse(storeditem)
                    var time = new Date().getTime()
                    
                    
                    // const response = await fetch(`${process.env.REACT_APP_API_URL}/user/sendglobalchat`, {
                    //     method: 'POST',
                    //     headers: {
                    //         'Content-Type': 'application/json',
                    //         'Authorization': `Bearer ${parsed.token}`
                    //     },
                    //     body: JSON.stringify({ username, useragency, time, colorCode, content })
                    // })
                    // const json = await response.json()

                    // if(!response.ok) {
                    //     setError(json.error)
                    //     setTimeout(() => { setError(null) }, 3000)
                    //     setLoadingState(false)
                    //     console.log(response)
                    // }
                    // if(response.ok) {
                        // console.log(json)
                        // var terminalItem = localStorage.getItem('terminalhistory')
                        // if(terminalItem) {
                            // var parsedTI = JSON.parse(terminalItem)
                            var newItem = { label: 'chat', username: username, useragency: useragency, time: time, colocrCode: colorCode, content: content, }
                            // var updateTerminal = [ ...parsedTI, newItem ]
                            // localStorage.setItem('terminalhistory', JSON.stringify(updateTerminal))
                            // dispatch(setTerminalHistory(updateTerminal))
                            setLoadingState(false)
                            socket.emit('send_global_message', newItem)
                        // } else {
                            // var newItem = { label: 'chat', username: json.username, useragency: json.useragency, time: json.time, colocrCode: json.colorCode, content: json.content, }
                            // var updateTerminal = [ newItem ]
                            // localStorage.setItem('terminalhistory', JSON.stringify(updateTerminal))
                            // dispatch(setTerminalHistory(updateTerminal))
                            // setLoadingState(false)
                            // socket.emit('send_global_message', newItem)
                        // }
                    // }
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


        return { sendGlobalChat, loadingState, error } 
}