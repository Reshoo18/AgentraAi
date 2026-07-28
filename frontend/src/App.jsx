import React from 'react'
import {signInWithPopup} from 'firebase/auth'
import { auth, googleProvider } from './utils/firebase'

const googleLogin =async ()=>{
 const data= await signInWithPopup(auth,googleProvider)
}
const App = () => {
  return (
    <div className=' bg-black h-screen w-full flex items-center justify-center'>
     <button className='w-50 bg-white h-24 ' onClick={googleLogin}>continue with google</button>
    </div>
  )
}

export default App
