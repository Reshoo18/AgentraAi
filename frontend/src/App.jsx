import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./utils/firebase";

import Home from "./pages/Home.jsx";

import { useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice.js";

import getCurrentUser from "./features/getCurrentUser.js";


const App = () => {

  const dispatch = useDispatch();

  const [authLoading, setAuthLoading] = useState(true);


  useEffect(() => {

    let mounted = true;

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {

        // ==========================================
        // FIREBASE LOGGED OUT
        // ==========================================

        if (!firebaseUser) {

          if (mounted) {

            dispatch(setUserData(null));

            setAuthLoading(false);

          }

          return;
        }


        // ==========================================
        // FIREBASE LOGGED IN
        // ==========================================

        try {

          const data = await getCurrentUser();


          if (!mounted) return;


          if (data) {

            dispatch(
              setUserData(data)
            );

          } else {

            dispatch(
              setUserData(null)
            );

          }

        } catch (error) {

          console.error(
            "GET CURRENT USER ERROR:",
            error
          );

          if (mounted) {

            dispatch(
              setUserData(null)
            );

          }

        } finally {

          if (mounted) {

            setAuthLoading(false);

          }

        }

      }
    );


    return () => {

      mounted = false;

      unsubscribe();

    };

  }, [dispatch]);


  // ==========================================
  // AUTH CHECK LOADING
  // ==========================================

  if (authLoading) {

    return (
      <div
        className="
          h-screen
          w-full
          bg-black
          flex
          items-center
          justify-center
          text-white
        "
      >

        <div
          className="
            flex
            flex-col
            items-center
            gap-3
          "
        >

          <div
            className="
              w-8
              h-8
              rounded-full
              border-2
              border-white/20
              border-t-indigo-500
              animate-spin
            "
          />

          <p
            className="
              text-sm
              text-slate-500
            "
          >
            Loading...
          </p>

        </div>

      </div>
    );

  }


  return <Home />;

};


export default App;