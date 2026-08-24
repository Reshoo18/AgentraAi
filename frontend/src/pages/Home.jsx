import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../utils/firebase";
import api from "../utils/axios";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

import SideBar from "../components/SideBar";
import ChatArea from "../components/ChatArea";
import Artifact from "../components/Artifact";
import BillingDrawer from "../components/BillingDrawer";

const Home = () => {
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.user);

  const [billingOpen, setBillingOpen] = useState(false);

  const handleLogin = async (token) => {
    try {
      await api.post("/api/auth/login", { token });

      const { data } = await api.get("/api/me");

      dispatch(setUserData(data));

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const token = await result.user.getIdToken();

      await handleLogin(token);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen w-full flex bg-black text-white overflow-hidden">

      {/* SIDEBAR */}

      <SideBar
        onBillingOpen={() => setBillingOpen(true)}
      />

      {/* MAIN CHAT */}

      <main className="flex-1 min-w-0 h-full pt-14 md:pt-0 overflow-hidden">
        <ChatArea />
      </main>

      {/* ARTIFACT */}

      <Artifact />

      {/* BILLING DRAWER */}

      <BillingDrawer
        open={billingOpen}
        onClose={() => setBillingOpen(false)}
      />

      {/* LOGIN */}

      {!userData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">

          <div
            className="
              w-[340px]
              max-w-full
              bg-[#13151c]
              border border-white/[0.08]
              rounded-2xl
              p-7
              flex flex-col
              gap-5
            "
          >

            {/* TITLE */}

            <div className="flex flex-col gap-1">

              <h2 className="text-[17px] font-semibold text-slate-100 tracking-tight">
                Welcome to AgentraAi
              </h2>

              <p className="text-[13px] text-slate-500">
                Please login to continue using the app.
              </p>

            </div>

            {/* GOOGLE LOGIN */}

            <button
              onClick={googleLogin}
              className="
                w-full
                flex items-center justify-center gap-3
                py-[11px]
                rounded-xl
                text-sm
                font-medium
                text-black
                bg-white
                hover:bg-gray-200
                transition-all
                duration-150
                cursor-pointer
              "
            >
              <FcGoogle size={18} />

              Continue with Google
            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default Home; 