import { initializeApp } from "firebase/app";
import { 
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut
} from "firebase/auth";
import { 
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc 
} from "firebase/firestore";



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
const db = getFirestore(app)
const googleprovider = new GoogleAuthProvider()

const signInWithGoogle = async () => {
    try {
        const response = await signInWithPopup(auth, googleprovider)
        const user = response.user
        const qry = query(collection(db, "users"), where("uid", "==",user.uid))
        const docs = await getDocs(qry)
        if(docs.docs.length === 0) {
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email
            })
        }
    } catch (err) {
        console.log(err.message)
    }
}

const loginWithEmailAndPassword = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
        console.log(err.message)
    }
}

const registerWithEmailAndPassword = async (name, email, password) => {
    try {
        const response = await createUserWithEmailAndPassword(auth, email, password)
        const user = response.user
        await addDoc(collection(db, "users"), {
            uid: user.uid,
            name,
            authProvider: 'locally',
            email
        })
    } catch (err) {
        console.log(err.message)
    }
}

const sendPasswordReset = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email)
        alert('please check your email. password reset link is sent')
    } catch (err) {
        console.log(err.message)
    }
}

const logOut = () => {
    signOut(auth)
}


export {
    auth, db,
    signInWithGoogle,
    loginWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logOut
}
