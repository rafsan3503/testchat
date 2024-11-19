import { useState } from "react";
import { useDispatch } from "react-redux";
import { initializeApp } from "firebase/app";
import { 
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
} from "firebase/auth";

import { setUser } from "../redux/action";


const firebaseConfig = {
    apiKey: "AIzaSyANYwkXmh2SqzPf2cZUF0Ne3L8CjHG1E-o",
    authDomain: "quasarid.firebaseapp.com",
    projectId: "quasarid",
    storageBucket: "quasarid.appspot.com",
    messagingSenderId: "468240254391",
    appId: "1:468240254391:web:77985c5734e62017d21432",
    measurementId: "G-WV222WYTT1"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const googleprovider = new GoogleAuthProvider()

export const useAuth = () => {
    const dispatch = useDispatch()
    const [error, setError] = useState(null)
    const [loadingState, setLoadingState] = useState(false)
    const [succmesg, setSucmsg] = useState(null)

    const signInWithGoogle = async (username) => {
        try {
            const response = await signInWithPopup(auth, googleprovider)
            const user = response.user
            console.log(user.email, username)
    
            const fetchres = await fetch(`${process.env.REACT_APP_API_URL}/user/handleauth`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email: user.email, username })
            })
            const json = await fetchres.json()

            if(!fetchres.ok) {
                setLoadingState(false)
                setError(json.error)
                setTimeout(() => { setError(null) }, 3000)
                console.log(fetchres)
            }

            if(fetchres.ok) {
                // save the user to local storage
                // console.log(json)
                localStorage.setItem('superluminaluser', JSON.stringify({username: json.username, token: json.token}))
                const userData = { username: json.username, useremail: json.useremail, agency: json.agency, agDate: json.agDate }
                dispatch(setUser(userData))
                setLoadingState(false)
                setSucmsg('auth success')
                setTimeout(() => { setSucmsg(null) }, 3000)
            }
    
        } catch (err) {
            console.log('try catch error: ', err.message)
            setError('An error occured while processing your request. Please check your internet connection and try again')
            setTimeout(() => { setError(null) }, 3000)
            setLoadingState(false)
        }
    }


    return { signInWithGoogle, loadingState, error, succmesg } 
}