import React from 'react'
import {signInWithPopup} from 'firebase/auth'
import { auth, googleProvider } from './utils/firebase'
import api from './utils/axios'
import Home from './pages/Home.jsx'
import { useEffect } from 'react'
import getCurrentUser from '../../backend/gateway/controllers/user.controller.js'


const App = () => {
  useEffect(()=>{
    const getUser=async()=>{
      await getCurrentUser()
    }
    getUser()
  },[])

  return (
    <>
     <Home />
    </>
  
  )
}

export default App
