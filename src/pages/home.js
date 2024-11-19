import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import io from 'socket.io-client'
import { format, formatISO9075 } from 'date-fns'

import splt from './../media/img/splt.png'
import splt2 from './../media/img/splt2.png'
import lead_text from './../media/img/lead-text.png'
import menu_icon from './../media/icons/menu.png'
import close_icon from './../media/icons/close.png'

import { setTerminalHistory, setUser } from "../redux/action";

// hooks
import { useAuth } from './../hooks/useAuth';
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useCreateAgency } from "../hooks/useCreateAgency";
import { useJoinAgency } from "../hooks/useJoinAgency";
import { useQuitAgency } from "../hooks/useQuitAgency";
import { useGetAgency } from "../hooks/useGetAgency";
import { useAgencies } from "../hooks/useAgencies";
import { useSendGC } from "../hooks/useSendGC";
import { useGetGlobalChats } from "../hooks/useGetGlobalChats";
import { useSendAC } from "../hooks/useSendAC";
import { useGetAgencyChats } from "../hooks/useGetAgencyChats";
import { useAgenciesUsers } from "../hooks/useAgenciesUsers";
import { useListAgencies } from "../hooks/useListAgencies";
import { logOut } from "../Firebase";

// components
import ToastGeneral from "../components/toast";
import { helpContent } from "../utilities/help-content";
import { detailsContent } from "../utilities/details";
import { listContent } from "../utilities/list";



const Home = () => {
    
    const socket = io.connect('https://superlamina.onrender.com')
    const dispatch = useDispatch()
    const chatEndRef = useRef(null);
    const { signInWithGoogle, error: authError, loadingState: authLoading, succmesg: authSuccess } = useAuth()
    const { getCurrentUser, error: getusererror, loadingState: getuserLoading } = useCurrentUser()
    const { createAgency, error: caError, loadingState: caLoading, succmesg: caSucmessage } = useCreateAgency()
    const { joinAgency, error: jaError, loadingState: jaLoading, succmesg: jaSucmessage } = useJoinAgency()
    const { quitAgency, error: qaError, loadingState: qaLoading, succmesg: qaSucmessage } = useQuitAgency()
    const { getAgency, error: gaError, loadingState: gaLoading, succmesg: gaSucmessage, tmpagency } = useGetAgency()
    const { getAgenciesUsers, error: gauError, loadingState: gauLoading, succmesg: gauSucmessage, agusers } = useAgenciesUsers()
    const { getAgencies, error: agenciesError, loadingState: agenciesLoading } = useAgencies()
    const { sendGlobalChat, error: gcError, loadingState: gcLoading } = useSendGC()
    const { getGlobalChats, error: getgcError, loadingState: getgcLoading, theData } = useGetGlobalChats()
    const { sendAgencyChat, error: acError, loadingState: acLoading } = useSendAC()
    const { listAgencies, error: listError, loadingState: listLoading, thelist } = useListAgencies()
    const { getAgencyChats, error: getacError, loadingState: getacLoading, agencyChatData } = useGetAgencyChats()
    
    const { user, agencies, terminalHistory } = useSelector(state => state.appReducer)

    const [welcomestatus, setWelcomestatus] = useState(true)
    const [globalchats, setGlobalchats] = useState(null)
    const [agencychats, setAgencychats] = useState(null)
    const [agmemberscount, setAgmemberscount] = useState(null)
    const [connectedUsers, setConnectedusers] = useState(null)
    const [chatStatus, setChatstatus] = useState('global')

    const [commandvalue, setCommandValue] = useState()
    const [gcInputvalue, setgcInputvalue] = useState('')
    const [acInputvalue, setacInputvalue] = useState('')

    const [toastmssg, settoastmessg] = useState(null)
    const [toaststatus, settoaststatus] = useState('')

    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [showsidebar, setshowsidebar] = useState(null)

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            // console.log(window.innerWidth)
        };

        window.addEventListener('resize', handleResize);

        // Cleanup: Remove the event listener when the component is unmounted
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleSideBar = () => {
        if(!showsidebar) {
            setshowsidebar(true)
        } else {
            setshowsidebar(false)
        }
    }

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // useEffect(() => {
    //     logOut()
    // }, [])

    const handleLogOut = () => {
        logOut()
        localStorage.removeItem('superluminaluser')
        dispatch(setUser(null))
        setgcInputvalue('')
        setAgencychats(null)
    }

    useEffect(() => {
        var count = 1
        // socket.emit('send_connected_users', count)
    }, [])

    useEffect(() => {
        socket.emit('join_global_chat', 1234567)
    }, [])

    useEffect(() => {

        socket.on('receive_global_message', (data) => {
            try {
                // console.log('received global message:', data);
                
                if (!data) {
                    handleToast('invalid message data received', false);
                    return
                }
    
                setGlobalchats(data)
                
                // if(globalchats) {
                //     var newItem = { label: data.label, username: data.username, useragency: data.useragency, time: data.time, colocrCode: data.colorCode, content: data.content, }
                //     var updateItem = [...globalchats, newItem]
                //     setGlobalchats(updateItem)
                // } else {
                //     var newItem = { label: data.label, username: data.username, useragency: data.useragency, time: data.time, colocrCode: data.colorCode, content: data.content, }
                //     var updateItem = [ newItem ]
                //     setGlobalchats(updateItem)
                // }
    
                
            } catch (error) {
                console.log('Error processing message:', error);
                handleToast(`error processing message: ${error.message}`, false);
            }
        });
        
        socket.on("receive_agency_message", (data) => {
            console.log(data)
            setAgencychats(data)
        })
        
    }, [])
    
    // useEffect(() => {
    //     // socket.on('connect', () => {
    //     //     // var count = 1
    //     //     // socket.emit('send_connected_users', count)
    //     //     // console.log('connected')
    //     // })
        
    //     socket.on('receive_global_message', (data) => {
    //         try {
    //             // console.log('received global message:', data);
                
    //             if (!data) {
    //                 handleToast('invalid message data received', false);
    //                 return
    //             }

    //             setGlobalchats(data)
                
    //             // if(globalchats) {
    //             //     var newItem = { label: data.label, username: data.username, useragency: data.useragency, time: data.time, colocrCode: data.colorCode, content: data.content, }
    //             //     var updateItem = [...globalchats, newItem]
    //             //     setGlobalchats(updateItem)
    //             // } else {
    //             //     var newItem = { label: data.label, username: data.username, useragency: data.useragency, time: data.time, colocrCode: data.colorCode, content: data.content, }
    //             //     var updateItem = [ newItem ]
    //             //     setGlobalchats(updateItem)
    //             // }

                
    //         } catch (error) {
    //             console.log('Error processing message:', error);
    //             handleToast(`error processing message: ${error.message}`, false);
    //         }
    //     });
        
    //     socket.on("receive_agency_message", (data) => {
    //         console.log(data)
    //         setAgencychats(data)
    //     })
        
    //     // socket.on('disconnect', () => {
    //     //     // var count = 1
    //     //     // socket.emit('send_connected_users', count)
    //     //     // console.log('disconnected')
    //     // })

    //     // socket.on('receive_connected_users', (data) => {
    //     //     // console.log(data)
    //     //     setConnectedusers(data)
    //     // })

    // }, [socket])


    // const handleGetGlobalChats = async () => {
    //     await getGlobalChats()
    // }

    useEffect(() => {
        scrollToBottom();
    }, [globalchats]); // runs when global chats state changes

    const handleGetAgencyChats = async () => {
        var storeditem = localStorage.getItem('superluminaluser')
        if(storeditem) {
            var parsed = JSON.parse(storeditem)
            var token = parsed.token
            if(user) {
                if(user.agency !== '') {
                    await getAgencyChats(token, user.agency)
                }
            }
        }
    }

    const handleAgenciesUsers = async () => {
        if(user) {
            if(user.agency !== '') {
                await getAgenciesUsers(user.agency)
            }
        }
    }

    // run whenever there's change in the agusers from hook to set agency users count
    useEffect(() => {
        setAgmemberscount(agusers)
    }, [agusers])

    // when there's any change in theData for getting globalchats or agencyChat
    useEffect(() => {
        // setGlobalchats(theData)
        setAgencychats(agencyChatData)
    }, [agencyChatData])

    // run when there's change in user to get the user agency chat and join agency room down if there's one or not 
    useEffect(() => {
        if(user) {
            socket.emit('join_agency_chat', user.agency)

            handleGetAgencyChats()
            handleAgenciesUsers()
        }
    }, [user])

    // run whenever page reloads to get global chats again - localstorage is already set in the get func of it
    useEffect(() => {
        // handleGetGlobalChats()
        handleGetAgencyChats()
        handleAgenciesUsers()
    }, [])

    // run whenener there's change in tmpagency to serve on the terminal
    useEffect(() => {
        var time = new Date().getTime()
        if(globalchats && tmpagency) {
            var createdOn = formatISO9075(new Date(tmpagency.date))
            var memberscount = tmpagency.memebers.length
            if(user) {
                // var createdOn = format(new Date(tmpagency.date), 'MM/dd/yyyy')
                var newItem = { 
                    username: user.username, useragency: user.agency, time, colorCode: '', label: 'cmd-return', 
                    content: detailsContent(tmpagency.name, memberscount, createdOn)
                }
                var updateItem = [...globalchats, newItem]
                setGlobalchats(updateItem)
            } else {
                var newItem = { 
                    username: 'NONE', useragency: 'NONE', time, colorCode: '', label: 'cmd-return', 
                    content: detailsContent(tmpagency.name, memberscount, createdOn)
                }
                var updateItem = [...globalchats, newItem]
                setGlobalchats(updateItem)
            }
        } else if (!globalchats && tmpagency) {
            if(user) {
                var newItem = { 
                    username: user.username, useragency: user.agency, time, colorCode: '', label: 'cmd-return', 
                    content: detailsContent(tmpagency.name, memberscount, createdOn)
                }
                var updateItem = [ newItem ]
                setGlobalchats(updateItem)
            } else {
                var newItem = { 
                    username: 'NONE', useragency: 'NONE', time, colorCode: '', label: 'cmd-return', 
                    content: detailsContent(tmpagency.name, memberscount, createdOn)
                }
                var updateItem = [ newItem ]
                setGlobalchats(updateItem)
            }
        }
    }, [tmpagency])

    // run whenener there's change in listagencies to serve on the terminal
    useEffect(() => {
        var time = new Date().getTime()
        if(globalchats && thelist) {
            if(user) {
                var newItem = { 
                    username: user.username, useragency: user.agency, time, colorCode: '', label: 'cmd-return', islist: true,
                    content: `${thelist ? thelist.map((list, index) => (
                        `${calcLeadIndex(index)} ${list.name} - ${list.memebers.length} member ${list.memebers.length > 1 ? 's' : ''}  - Vault: N/A SOL`
                    )) : null}`  
                }
                var updateItem = [...globalchats, newItem]
                setGlobalchats(updateItem)
            } else {
                var newItem = { 
                    username: 'NONE', useragency: 'NONE', time, colorCode: '', label: 'cmd-return', islist: true,
                    content: `${thelist ? thelist.map((list, index) => (
                        `${calcLeadIndex(index)} ${list.name} - ${list.memebers.length} member ${list.memebers.length > 1 ? 's' : ''}  - Vault: N/A SOL`
                    )) : null}`                      
                }
                var updateItem = [...globalchats, newItem]
                setGlobalchats(updateItem)
            }
        } else if (!globalchats && thelist) {
            if(user) {
                var newItem = { 
                    username: user.username, useragency: user.agency, time, colorCode: '', label: 'cmd-return', islist: true,
                    content: `${thelist ? thelist.map((list, index) => (
                        `${calcLeadIndex(index)} ${list.name} - ${list.memebers.length} member ${list.memebers.length > 1 ? 's' : ''}  - Vault: N/A SOL`
                    )) : null}`  
                }
                var updateItem = [ newItem ]
                setGlobalchats(updateItem)
            } else {
                var newItem = { 
                    username: 'NONE', useragency: 'NONE', time, colorCode: '', label: 'cmd-return', islist: true,
                    content: `${thelist ? thelist.map((list, index) => (
                        `${calcLeadIndex(index)} ${list.name} - ${list.memebers.length} member ${list.memebers.length > 1 ? 's' : ''}  - Vault: N/A SOL`
                    )) : null}`  
                }
                var updateItem = [ newItem ]
                setGlobalchats(updateItem)
            }
        }
    }, [thelist])

    const handleHelpCommands = () => {
        var time = new Date().getTime()
        if(globalchats) {
            if(user) {
                var newItem = { 
                    username: user.username, useragency: user.agency, time, colorCode: '', label: 'cmd-return', 
                    content: helpContent  
                }
                var updateItem = [...globalchats, newItem]
                setGlobalchats(updateItem)
                setgcInputvalue('')
            } else {
                var newItem = { 
                    username: '', useragency: '', time, colorCode: '', label: 'cmd-return', 
                    content: helpContent  
                }
                var updateItem = [...globalchats, newItem]
                setGlobalchats(updateItem)
                setgcInputvalue('')
            }
        } else {
            if(user) {
                var newItem = { 
                    username: user.username, useragency: user.agency, time, colorCode: '', label: 'cmd-return', 
                    content: helpContent  
                }
                var updateItem = [ newItem ]
                setGlobalchats(updateItem)
                setgcInputvalue('')
            } else {
                var newItem = { 
                    username: '', useragency: '', time, colorCode: '', label: 'cmd-return', 
                    content: helpContent  
                }
                var updateItem = [ newItem ]
                setGlobalchats(updateItem)
                setgcInputvalue('')
            }
        }
    }

    const handleToast = (value, status) => {
        settoastmessg(value)
        settoaststatus(status)
        setTimeout(() => { settoastmessg(null) }, 3000)
    }

    const handleGetAgencies = async () => {
        if(!agencies) {
            await getAgencies()
        }
    }

    const handleAgenciesReload = async () => {
        await getAgencies()
    }

    // run after reloads to get welcome status and set it's state plus agencies
    useEffect(() => {
        var welcomeitem = localStorage.getItem('welcomeitem')
        if(welcomeitem) {
            var parsed = JSON.parse(welcomeitem)
            setWelcomestatus(parsed.status)
        } else {
            localStorage.setItem('welcomeitem', JSON.stringify({status: true}))
        }

        handleGetAgencies()
    }, [])
    
    const handleWelcome = () => {
        // if(welcomestatus === true) {
        localStorage.setItem('welcomeitem', JSON.stringify({status: false}))
        setWelcomestatus(false)
        setgcInputvalue('')
        // } else {
        //     localStorage.setItem('welcomeitem', JSON.stringify({status: true}))
        //     setWelcomestatus(true)
        // }
    }

    // run when pages reloads to get current user
    useEffect(() => {
        if(!user) {
            var storeditem = localStorage.getItem('superluminaluser')
            if(storeditem) {
                var parsed = JSON.parse(storeditem)
                var token = parsed.token
                if(!user) {
                    if(!authLoading && !getuserLoading) {
                        getCurrentUser(token)
                    }
                }
            }
        }
    }, [])

    const createUserCommands = async (username) => {
        console.log(username)
        try {
            var storeditem = localStorage.getItem('superluminaluser')
            if(!storeditem || !user) {
                if(!authLoading && !getuserLoading) {
                    await signInWithGoogle(username)
                    setgcInputvalue('')
                }
            }
        } catch(err) {
            console.log(err)
        }
    }

    const handleAgencyCreation = async (agencyname) => {
        console.log(agencyname)
        
        if(user.agency !== '') {
            handleToast('quit your current user before creating new one', false)
        } else {
            if(!caLoading) {
                await createAgency(agencyname)
                setgcInputvalue('')
            } else {
                handleToast('please wait for your previous request to be completed')
            }
        }
        
    }
    
    const handleJoinAgency = async (agencyname) => {
        if(user.agency !== '') {
            handleToast('quit your current user before joining new one', false)
        } else {
            if(!jaLoading) {
                await joinAgency(agencyname)
                setgcInputvalue('')
            } else {
                handleToast('please wait for your previous request to be completed')
            }
        }
    }
    
    const handleQuiteAgency = async (agencyname) => {
        if(user.agency !== '') {
            if(user.agency !== agencyname) {
                handleToast('you are not in the entered agency', false)
            } else {
                await quitAgency(agencyname)
                setgcInputvalue('')
            }
        } else {
            handleToast('you are not in any agency', false)
        }
    }
    
    const handleGetAgency = async (agencyname) => {
        await getAgency(agencyname)
        setgcInputvalue('')
    }
    
    const handleSendGlobal = (colorCode, content) => {
        if(!user) {
            handleToast('login to interact in global chat')
        } else {
            if (!socket) {
                handleToast('Error: Not connected to server, please refresh', false)
                return;
            }

            try {
                var time = new Date().getTime()

                // var messageData = { label: 'chat', username: user.username, useragency: user.agency, time, colorCode, content, }
                // socket.emit('send_global_message', messageData)
                // setgcInputvalue('')

                if(globalchats) {
                    // const filtered = globalchats.filter(e => e.label === 'chat')
                    var newItem = { label: 'chat', username: user.username, useragency: user.agency, time, colorCode, content, }
                    var messageData = [...globalchats, newItem]
                    socket.emit('send_global_message', messageData)
                    setgcInputvalue('')
                } else {
                    var newItem = { label: 'chat', username: user.username, useragency: user.agency, time, colorCode, content, }
                    var messageData = [ newItem ]
                    socket.emit('send_global_message', messageData)
                    setgcInputvalue('')
                }

                // Create message data
                // var messageData = { label: 'chat', username: user.username, useragency: user.agency, time, colorCode, content, }
                
                // Send to server and wait for broadcast
                // socket.emit('send_global_message', messageData)
            } catch (error) {
                console.log('Error sending message:', error);
                handleToast(`error sending message: ${error.message}`, 'error');
            }
            
            // await sendGlobalChat(user.username, user.agency, colorCode, content, socket)
        }
    }
    
    const handleSendAgencyChat = async (colorCode, content) => {
        if (!user) {
            handleToast('login and join an agency to interact in agency chat')
        } else {
            if(user.agency === '') {
                handleToast('join an agency to interact in agency chat')
            } else {
                if(!acLoading) {
                    await sendAgencyChat(user.username, user.agency, colorCode, content, socket, agencychats)
                    setacInputvalue('')
                } else {
                    handleToast('please wait while your previous message get sent')
                }
            }
        }
    }

    const handleListAgencies = async () => {
        if(!listLoading) {
            await listAgencies()
            setgcInputvalue('')
        } else {
            handleToast('please wait while your previous request get sent')
        }
    }


    const handleSwitchChats = () => {
        if(chatStatus === 'global') {
            setChatstatus('agency')
        } else {
            setChatstatus('global')
        }
    }


    const handleGCKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // prevents the default newline behavior of the textarea

            handleToast(null, '')
            if(gcInputvalue.length < 1) return

            if(gcInputvalue[0] !== '/') {
                // not a command but global message
                if(gcInputvalue[0] === '#') {
                    const words = gcInputvalue.split(' ')

                    if(words[0].length > 7) {
                        handleToast('not a valid color code', false)
                    } else {
                        var thecc = words[0]
                        var thect = 'check for logic'

                        handleSendGlobal(thecc, thect)
                        
                    }
                } else {
                    handleSendGlobal('', gcInputvalue)
                }
            }

            if(gcInputvalue[0] === '/') {
                const words = gcInputvalue.split(' ')
                console.log(words)

                // now check which commands is user trying to run and run it

                // user command check and run
                if(words[0] === '/create' && words[1] === 'user') {
                    if(!words[2]) {
                        handleToast('enter a username', false)
                    } else {
                        createUserCommands(words[2])
                    }
                }

                if(words[0] === '/login') {
                    if(!words[1]) {
                        handleToast('enter a username', false)
                    } else {
                        createUserCommands(words[1])
                    }
                }

                if(words[0] === '/logout') {
                    handleLogOut()
                }
                
                if(words[0] === '/create' && words[1] === 'agency') {
                    if(!words[2]) {
                        handleToast('enter agencyname', false)
                    } else {
                        handleAgencyCreation(words[2])
                    }
                    
                }

                if(words[0] === '/join' && words[1] === 'agency') {
                    if(!words[2]) {
                        handleToast('enter agencyname', false)
                    } else {
                        handleJoinAgency(words[2])
                    }
                    
                }

                if(words[0] === '/quit' && words[1] === 'agency') {
                    if(!words[2]) {
                        handleToast('enter agencyname', false)
                    } else {
                        handleQuiteAgency(words[2])
                    }
                    
                }

                if(words[0] === '/info' && words[1] === 'agency') {
                    if(!words[2]) {
                        handleToast('enter agencyname', false)
                    } else {
                        handleGetAgency(words[2])
                    }
                    
                }

                if(words[0] === '/agency' && words[1] === 'details') {
                    if(user.agency === '') {
                        handleToast('you have not joined any agency yet', false)
                    } else {
                        handleGetAgency(user.agency)
                    }
                    
                }

                if(words[0] === '/list') {

                    handleListAgencies()

                }

                if(words[0] === '/help') {
                    
                        handleHelpCommands()

                }

                if(words[0] === '/clear') {
                    
                        setGlobalchats(null)
                        setgcInputvalue('')

                }

                if(words[0] === '/welcome' && words[1] === 'off') {
                    handleWelcome()
                }
            }
        }
    }

    const handleACPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // prevents the default newline behavior of the textarea
            handleToast(null, '')
            if(acInputvalue.length < 1) return
            
            if(acInputvalue[0] !== '/') {
                // console.log(acInputvalue)
                // not a command but global message
                if(acInputvalue[0] === '#') {
                    const words = acInputvalue.split(' ')

                    if(words[0].length > 7) {
                        handleToast('not a valid color code', false)
                    } else {
                        var thecc = words[0]
                        var thect = 'check for logic'

                        handleSendAgencyChat(thecc, acInputvalue)
                        
                    }
                } else {
                    handleSendAgencyChat('', acInputvalue)
                }
            }

            if(acInputvalue[0] === '/') {
                // const words = gcInputvalue.split(' ')
                // console.log(words)

                if(acInputvalue === '/clear') {
                    
                    setAgencychats(null)
                    setacInputvalue('')

                }

            }
        }
    }

    const calcLeadIndex = (index) => {
        const realIndex = index + 1
        return realIndex
    }


    return ( 
        <div className="">

            {authError || caError || qaError || gaError || gcError || getgcError || jaError || listError ?
                <ToastGeneral messg={authError || caError || qaError || gaError || gcError || getgcError || jaError || listError} status={false} />
            : null}
            {authSuccess || caSucmessage || qaSucmessage || gaSucmessage ? 
                <ToastGeneral messg={authSuccess || caSucmessage || qaSucmessage || gaSucmessage} status={true} />
            : null}
            {toastmssg ?
                <ToastGeneral messg={toastmssg} status={toaststatus} />
            : null}

            <section id="home" className="home">


                <div className="home-cont flex">

                    <div className={`large-width-cont align-flex-end flex ${windowWidth < 1100 ? 'enlarge' : ''}`}>
                        <div className="large-width-scroll">
                            <div className="online-users-text">
                                <p>{connectedUsers ? 0 : 0} users online</p>
                            </div>
                            {windowWidth < 1100 ?
                                <div className="sidebar-icon">
                                    <img src={showsidebar ? close_icon : menu_icon} className="cursor-pointer" onClick={handleSideBar} alt="" />
                                </div>
                            : null}
                            {chatStatus === 'global' ? 
                            
                                <div className="commands-control-cont">
                                    {welcomestatus ? 
                                        <div className="welcome-item-cont">
                                            <p>You connected.</p>
                                            <p><span>{'>>'}</span> TERMINAL<span>:</span> Welcome to the simulation, human! Glad to see you here</p>
                                            <p>If you're new, please refer to our documentation to learn how to navigate this land, and to learn how to be... useful.</p>
                                            <p><span>docs.quasar.social</span></p>
                                            <p>Have fun! (To turn off this welcome message, do /welcome off)</p>
                                        </div>
                                    : null}
                                    {globalchats ? globalchats.map((terminal, index) => (
                                        <div className={`${terminal.label === 'chat' ? 'cmd-line-item ' : 'cmd-line-item-return'}`} key={index}>
                                            <h2 className="cli-text-format">
                                                {/* {terminal.label === 'chat' ? `${formatISO9075(new Date(terminal.time), { representation: 'time' })} ` : '>> '} */}
                                                {terminal.label === 'chat' ? `${format(new Date(terminal.time), "h:mm" )} ` : '>> '}
                                            </h2>
                                            {user && terminal.label === 'chat' ? 
                                                <h3 className="cli-text-format">
                                                    {terminal.username}.
                                                    <span className="cli-text-format">{terminal.useragency === '' ? 'NONE' : terminal.useragency}</span>
                                                    <span className="cli-text-format column">:</span> 
                                                </h3>
                                            : null}
                                            {terminal.label === 'cmd-return' ? 
                                                <h3 className="cli-text-format"><span className="cli-text-format">System: </span></h3>
                                            : null}
                                            <h4 className="cli-text-format"><pre className="pre-style">{terminal.content} </pre></h4>
                                        </div>
                                    )) : null}
                                    {/* Empty div to mark the end of the chat messages */}
                                    <div ref={chatEndRef} />
                                </div>
                        
                            : 
                            
                                <div className="commands-control-cont">
                                    {welcomestatus ? 
                                        <div className="welcome-item-cont">
                                            <p>You connected.</p>
                                            <p><span>{'>>'}</span> TERMINAL<span>:</span> Welcome to the simulation, human! Glad to see you here</p>
                                            <p>If you're new, please refer to our documentation to learn how to navigate this land, and to learn how to be... useful or type /help to see available commands.</p>
                                            <p><span>docs.quasar.social</span></p>
                                            <p>Have fun! (To turn off this welcome message, do /welcome off)</p>
                                        </div>
                                    : null}
                                    {agencychats ? agencychats.map((terminal, index) => (
                                        <div className={`${terminal.label === 'chat' ? 'cmd-line-item ' : 'cmd-line-item-return'}`} key={index}>
                                            <h2 className="cli-text-format">
                                                {/* {terminal.label === 'chat' ? `${formatISO9075(new Date(terminal.time), { representation: 'time' })} ` : '>> '} */}
                                                {terminal.label === 'chat' ? `${format(new Date(terminal.time), "h:mm" )} ` : '>> '}
                                            </h2>
                                            {user ? 
                                                <h3 className="cli-text-format">
                                                    {terminal.username}.
                                                    <span className="cli-text-format">{terminal.agencyname}</span>
                                                    <span className="cli-text-format column">:</span> 
                                                </h3>
                                            : null}
                                            <h4 className="cli-text-format"><pre className="pre-style">{terminal.content} </pre> </h4>
                                        </div>
                                    )) : null}
                                </div>
                            
                            }


                            <div className="user-info-box">
                                {chatStatus === 'global' ? 
                                    <div className="chat-cont flex gap-5">
                                        <p>: </p>
                                        <textarea type="" 
                                            placeholder="Enter a command or Global message"
                                            onChange={(e) => setgcInputvalue(e.target.value)}
                                            value={gcInputvalue}
                                            onKeyDown={handleGCKeyPress}
                                        />
                                    </div>
                                :
                                    <div className="chat-cont flex gap-5 align-flex-end">
                                        <p>: </p>
                                        <textarea type="" 
                                            placeholder="Chat now"
                                            onChange={(e) => setacInputvalue(e.target.value)}
                                            value={acInputvalue}
                                            onKeyDown={handleACPress}
                                        />
                                    </div>
                                }
                                <div className="">
                                    <h2 className="uib-text-format">
                                        User: <span className="uib-text-format">{user ? user.username : 'NONE'}</span>.
                                        <span className="uib-text-format green">{user ? user.agency === "" ? 'NONE' : user.agency : null} </span> 
                                    </h2>
                                    <h3 className="uib-text-format">| </h3>
                                    <h4 className="uib-text-format">{`${chatStatus === 'global' ? '{ Global Chat }' : '{ Agency Chat }'}`} </h4>
                                    <h5 className="uib-text-format">Menu  - </h5>
                                    <h6 className="uib-text-format">docs how commands colors</h6>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`smaller-width-box ${windowWidth < 1100 ? 'smaller-width' : ''} ${showsidebar ? 'show' : ''}`}>
                        <div className="user-name-box flex align-center justify-center">
                            <p className="sm-rg-text-format">Superluminal v1 | <span className="username sm-rg-text-format">{user ? user.agency !== '' ? user.agency : 'NONE' : 'NONE'}</span></p>
                        </div>

                        <div className="ld-cont">
                            <div className="ld-title-box flex align-center">
                                <p className="sm-rg-text-format">Top Agencies</p>
                            </div>

                            <div className="ld-box">
                                <div className="ld-box-head flex justify-center"><img src={lead_text} alt="" /></div>
                                {!agencies && agenciesLoading ? 
                                    <p className="sm-rg-text-format">loading...</p> 
                                : !agencies && !agenciesLoading ? 
                                    <p className="sm-rg-text-format cursor-pointer" onClick={handleAgenciesReload}>reaload</p> 
                                : agencies ? agencies.length > 0 ? 
                                    agencies.map((agency, index) => (
                                        <p className="sm-rg-text-format" key={agency.name}>
                                            {calcLeadIndex(index)} {agency.name} - {agency.memebers.length} member{agency.memebers.length > 1 ? 's' : null}  - Vault: N/A <span className="sm-rg-text-format purple">SOL</span>
                                        </p>
                                    ))
                                : null : null }
                            </div>
                        </div>

                        <div className="ld-cont">
                            <div className="ld-title-box flex align-center">
                                <p className="sm-rg-text-format">Task Log</p>
                            </div>

                            <div className="ld-box log flex align-flex-end">
                                <div className="ld-ll"></div>

                                <div className="ld-log">
                                    
                                    <div className="ld-log-alt">
                                        <p className="ld-log-text-format">nothing to see here for now...</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="ld-cont">
                            <div className="flex justify-space-between align-flex-end">
                                <div className="flex gap-10 align-center">
                                    <div className="ld-title-box flex align-center">
                                        <p className="sm-rg-text-format">{chatStatus === 'global' ? 'Agency Chat' : 'Global Chat'}</p>
                                    </div>
                                    <div className="switch-chat cursor-pointer">
                                        <p onClick={handleSwitchChats}>{`{ Switch Chats }`}</p>
                                    </div>
                                </div>

                                <div className="user-count"><p>{agmemberscount ? agmemberscount : 0} users</p></div>
                            </div>

                            <div className="ld-box agency flex align-flex-end">
                                <div className="ld-ll"></div>

                                {chatStatus === 'global' ? 
                                    <div className="ld-log">

                                        {agencychats ? agencychats.map((agencychat, index) => (
                                            <div className="cmd-line-item" key={index}>
                                                <h2 className="cli-text-format">
                                                    {/* {`${formatISO9075(new Date(agencychat.time), { representation: 'time' })} `}  */}
                                                    {`${format(new Date(agencychat.time), "h:mm" )}`} 
                                                </h2>
                                                {user ? 
                                                    <h3 className="cli-text-format">
                                                        {agencychat.username}.
                                                        <span className="cli-text-format">{agencychat.agencyname}</span>
                                                        <span className="cli-text-format column">:</span> 
                                                    </h3>
                                                : null}
                                                <h4 className="cli-text-format"><pre className="pre-style">{agencychat.content}</pre> </h4>
                                            </div>
                                        )) :
                                            <div className="alt-agency-text">
                                                <p className="cli-text-format">setup an agency to get access to this panel.</p> <br /><br />
                                                <p className="cli-text-format">to create one, do /create agency {'<agencyname>'}.</p> <br /><br />
                                                <p className="cli-text-format">to visit one, simply do /visit agency {'<agencyname>'}.</p> <br /><br />
                                            </div>
                                        }
                                        
                                        <div className="chat-cont flex gap-5 align-flex-end">
                                            <p>: </p>
                                            <textarea type="" 
                                                placeholder="Chat now"
                                                onChange={(e) => setacInputvalue(e.target.value)}
                                                value={acInputvalue}
                                                onKeyDown={handleACPress}
                                            />
                                        </div>

                                    </div>
                                : 
                                    <div className="ld-log">
                                        <div className="commands-control-cont">
                                            {globalchats ? globalchats.map((terminal, index) => (
                                                <div className={`${terminal.label === 'chat' ? 'cmd-line-item ' : 'cmd-line-item-return'}`} key={index}>
                                                    <h2 className="cli-text-format">
                                                        {/* {terminal.label === 'chat' ? `${formatISO9075(new Date(terminal.time), { representation: 'time' })} ` : '>> '} */}
                                                        {terminal.label === 'chat' ? `${format(new Date(terminal.time), "h:mm" )} ` : '>> '} 
                                                    </h2>
                                                    {user && terminal.label === 'chat' ? 
                                                        <h3 className="cli-text-format">
                                                            {terminal.username}.
                                                            <span className="cli-text-format">{terminal.useragency === '' ? 'NONE' : terminal.useragency}</span>
                                                            <span className="cli-text-format column">:</span> 
                                                        </h3>
                                                    : null}
                                                    {terminal.label === 'cmd-return' ? 
                                                        <h3 className="cli-text-format"><span className="cli-text-format">System: </span></h3>
                                                    : null}
                                                    <h4 className="cli-text-format"><pre className="pre-style">{terminal.content}</pre> </h4>
                                                </div>
                                            )) : null}
                                            {/* Empty div to mark the end of the chat messages */}
                                            <div ref={chatEndRef} />
                                        </div>

                                        <div className="chat-cont flex gap-5">
                                            <p>: </p>
                                            <textarea type="" 
                                                placeholder="Enter a command or Global message"
                                                onChange={(e) => setgcInputvalue(e.target.value)}
                                                value={gcInputvalue}
                                                onKeyDown={handleGCKeyPress}
                                            />
                                        </div>
                                    </div>
                                }

                            </div>
                        </div>

                    </div>

                </div>



            </section>

        </div>
    );
}
 
export default Home;