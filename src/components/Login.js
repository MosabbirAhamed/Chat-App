import React from 'react'
import { auth } from '../utils/firebase';
import firebase from 'firebase/app';
import { FcGoogle } from 'react-icons/fc';


const Login = () => {

    const continueWithGoogle = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).catch(err => alert(err.massage));
    }

    return (
        <div className="flex flex-col items-center">
            <div className="capitalize text-xl font-semibold text-center pb-4 text-gray-500">
                to continue chat , you need to sign in.
            </div>
            <button onClick={continueWithGoogle} type="button" className="bg-[#abdfffbd]  flex items-center gap-4 justify-center w-fit text-center p-2 border border-gray-400 rounded-md" >
                <span><FcGoogle size={26} /> </span>   <span className="font-semibold text-gray-800">Continue with Google</span>
            </button>
        </div>
    )
}

export default Login