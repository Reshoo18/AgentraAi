import React, { useEffect, useState } from "react";

import {
  MessageSquare,
  Plus,
  X,
  PanelLeft,
  Sparkles,
  LogOut,
  Coins,
  Menu,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import {
  removeConversation,
  setConversations,
  setSelectedConversation,
} from "../redux/conversationSlice";

import {
  setMessages,
  setArtifacts,
} from "../redux/messageSlice";

import { setUserData } from "../redux/userSlice";

import { getConversation } from "../features/getConversation";
import { deleteConversation } from "../features/deleteConversation";

import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";


const SideBar = ({ onBillingOpen }) => {

  const dispatch = useDispatch();

  const [mobileOpen, setMobileOpen] = useState(false);

  const {
    conversations = [],
    selectedConversation,
  } = useSelector((state) => state.conversation);

  const { userData } = useSelector((state) => state.user);


  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  const profileImage =
    userData?.photoURL ||
    userData?.profileImage ||
    userData?.avatar ||
    userData?.picture ||
    userData?.image ||
    userData?.imageUrl ||
    userData?.photo ||
    userData?.photoUrl ||
    userData?.googlePhotoURL ||
    null;


  // =====================================================
  // LOAD CONVERSATIONS
  // =====================================================

  useEffect(() => {

    if (!userData) return;

    let cancelled = false;

    const loadConversations = async () => {

      try {

        const data = await getConversation();

        if (cancelled) return;

        if (Array.isArray(data)) {

          dispatch(setConversations(data));

        } else {

          dispatch(setConversations([]));

        }

      } catch (error) {

        console.error(
          "GET CONVERSATIONS ERROR:",
          error
        );

      }

    };

    loadConversations();

    return () => {
      cancelled = true;
    };

  }, [userData, dispatch]);


  // =====================================================
  // NEW CHAT
  // =====================================================

  const handleNewChat = () => {

    dispatch(setSelectedConversation(null));

    dispatch(setMessages([]));

    dispatch(setArtifacts([]));

    setMobileOpen(false);

  };


  // =====================================================
  // SELECT CONVERSATION
  // =====================================================

  const handleSelectConversation = (conversation) => {

    dispatch(setSelectedConversation(conversation));

    setMobileOpen(false);

  };


  // =====================================================
  // DELETE CONVERSATION
  // =====================================================

  const handleDeleteConversation = async (conversationId) => {

    try {

      const data =
        await deleteConversation(conversationId);

      if (!data) return;

      dispatch(
        removeConversation(conversationId)
      );

      if (
        selectedConversation?._id ===
        conversationId
      ) {

        dispatch(
          setSelectedConversation(null)
        );

        dispatch(
          setMessages([])
        );

        dispatch(
          setArtifacts([])
        );

      }

    } catch (error) {

      console.error(
        "DELETE CONVERSATION ERROR:",
        error
      );

    }

  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {

    try {

      console.log("Logging out...");


      // -----------------------------------------
      // Firebase logout
      // -----------------------------------------

      await signOut(auth);


      // -----------------------------------------
      // CLEAR REDUX USER
      // IMPORTANT
      // -----------------------------------------

      dispatch(
        setUserData(null)
      );


      // -----------------------------------------
      // CLEAR CONVERSATIONS
      // -----------------------------------------

      dispatch(
        setSelectedConversation(null)
      );

      dispatch(
        setMessages([])
      );

      dispatch(
        setArtifacts([])
      );

      dispatch(
        setConversations([])
      );


      // -----------------------------------------
      // CLEAR STORAGE
      // -----------------------------------------

      localStorage.clear();

      sessionStorage.clear();


      // -----------------------------------------
      // GO LOGIN
      // replace prevents back button
      // -----------------------------------------

      window.location.replace("/login");

    } catch (error) {

      console.error(
        "LOGOUT ERROR:",
        error
      );

    }

  };


  // =====================================================
  // USER INITIAL
  // =====================================================

  const getUserInitial = () => {

    const name =
      userData?.name ||
      userData?.displayName ||
      userData?.username ||
      userData?.email ||
      "R";

    return (
      name
        ?.charAt(0)
        ?.toUpperCase() || "R"
    );

  };


  // =====================================================
  // UI
  // =====================================================

  return (
    <>

      {/* =================================================
          MOBILE TOP BAR
      ================================================= */}

      <div
        className="
          md:hidden
          fixed
          top-0
          left-0
          right-0
          z-40
          h-14
          bg-[#0b0d12]
          border-b
          border-white/[0.07]
          px-3
          flex
          items-center
          justify-between
        "
      >

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="
            w-9
            h-9
            rounded-lg
            flex
            items-center
            justify-center
            text-slate-400
            hover:text-white
            hover:bg-white/[0.05]
            transition
            cursor-pointer
          "
        >
          <Menu size={19} />
        </button>


        <div className="flex items-center gap-2">

          <div
            className="
              w-7
              h-7
              rounded-lg
              bg-indigo-500/10
              border
              border-indigo-500/30
              flex
              items-center
              justify-center
            "
          >

            <Sparkles
              size={14}
              className="text-indigo-400"
            />

          </div>


          <span
            className="
              text-sm
              font-semibold
              text-white
            "
          >
            AgentraAI
          </span>

        </div>


        <button
          type="button"
          onClick={handleNewChat}
          className="
            w-9
            h-9
            rounded-lg
            flex
            items-center
            justify-center
            text-slate-400
            hover:text-white
            hover:bg-white/[0.05]
            transition
            cursor-pointer
          "
        >

          <Plus size={18} />

        </button>

      </div>


      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {mobileOpen && (

        <div
          onClick={() => setMobileOpen(false)}
          className="
            md:hidden
            fixed
            inset-0
            z-40
            bg-black/60
            backdrop-blur-[2px]
          "
        />

      )}


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`
          fixed
          md:relative
          z-50
          left-0
          top-0
          h-full
          w-[262px]
          bg-[#0b0d12]
          border-r
          border-white/[0.07]
          flex
          flex-col
          transition-transform
          duration-200

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >


        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            h-[72px]
            px-4
            flex
            items-center
            justify-between
            border-b
            border-white/[0.06]
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                w-9
                h-9
                rounded-xl
                border
                border-indigo-500/40
                bg-indigo-500/10
                flex
                items-center
                justify-center
                shadow-[0_0_20px_rgba(99,102,241,0.12)]
              "
            >

              <Sparkles
                size={18}
                className="text-indigo-400"
              />

            </div>


            <div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                <h1
                  className="
                    text-[15px]
                    font-semibold
                    text-white
                  "
                >
                  AgentraAI
                </h1>


                <span
                  className="
                    px-1.5
                    py-[2px]
                    rounded-md
                    bg-indigo-500/10
                    border
                    border-indigo-500/20
                    text-[8px]
                    font-semibold
                    text-indigo-400
                    uppercase
                  "
                >
                  {userData?.plan || "free"}
                </span>

              </div>


              <p
                className="
                  text-[9px]
                  text-slate-600
                  mt-[2px]
                "
              >
                Intelligent workspace
              </p>

            </div>

          </div>


          {/* Mobile close */}

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            title="Close"
            className="
              md:hidden
              w-8
              h-8
              rounded-lg
              flex
              items-center
              justify-center
              text-slate-500
              hover:text-white
              hover:bg-white/[0.05]
              transition
              cursor-pointer
            "
          >

            <X size={17} />

          </button>


          {/* Desktop sidebar icon */}

          <button
            type="button"
            title="Sidebar"
            className="
              hidden
              md:flex
              w-8
              h-8
              rounded-lg
              items-center
              justify-center
              text-slate-600
              hover:text-slate-300
              hover:bg-white/[0.05]
              transition
              cursor-pointer
            "
          >

            <PanelLeft size={16} />

          </button>

        </div>


        {/* =================================================
            NEW CHAT
        ================================================= */}

        <div className="px-3 pt-4">

          <button
            type="button"
            onClick={handleNewChat}
            className="
              w-full
              h-10
              rounded-xl
              bg-gradient-to-r
              from-indigo-500
              to-violet-600
              hover:from-indigo-400
              hover:to-violet-500
              text-white
              flex
              items-center
              justify-center
              gap-2
              text-sm
              font-medium
              shadow-[0_6px_25px_rgba(99,102,241,0.18)]
              transition-all
              duration-200
              cursor-pointer
            "
          >

            <Plus size={17} />

            New Chat

          </button>

        </div>


        {/* =================================================
            RECENT
        ================================================= */}

        <div
          className="
            px-3
            pt-5
            flex-1
            overflow-y-auto
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
              px-2
              mb-3
            "
          >

            <span
              className="
                text-[10px]
                font-medium
                tracking-[0.16em]
                text-slate-600
                uppercase
              "
            >
              Recent
            </span>


            {conversations.length > 0 && (

              <span
                className="
                  min-w-[18px]
                  h-[17px]
                  px-1
                  rounded-md
                  bg-white/[0.05]
                  text-[9px]
                  text-slate-500
                  flex
                  items-center
                  justify-center
                "
              >
                {conversations.length}
              </span>

            )}

          </div>


          {/* EMPTY STATE */}

          {conversations.length === 0 ? (

            <div
              className="
                mx-1
                mt-2
                rounded-xl
                border
                border-dashed
                border-white/[0.08]
                bg-white/[0.015]
                py-7
                px-4
                text-center
              "
            >

              <div
                className="
                  w-9
                  h-9
                  mx-auto
                  mb-3
                  rounded-lg
                  bg-white/[0.04]
                  flex
                  items-center
                  justify-center
                "
              >

                <MessageSquare
                  size={16}
                  className="text-slate-600"
                />

              </div>


              <p className="text-[11px] text-slate-500">
                No conversations yet
              </p>

              <p className="text-[9px] text-slate-700 mt-1">
                Start a new chat to begin
              </p>

            </div>

          ) : (

            <div className="space-y-1">

              {conversations.map((conv) => {

                const isActive =
                  selectedConversation?._id ===
                  conv?._id;


                return (

                  <div
                    key={conv._id}
                    className={`
                      group
                      relative
                      w-full
                      h-10
                      rounded-xl
                      flex
                      items-center
                      transition-all
                      duration-200

                      ${
                        isActive
                          ? "bg-indigo-500/10 border border-indigo-500/15"
                          : "border border-transparent hover:bg-white/[0.035]"
                      }
                    `}
                  >

                    {isActive && (

                      <span
                        className="
                          absolute
                          left-0
                          top-1/2
                          -translate-y-1/2
                          w-[2px]
                          h-5
                          rounded-r-full
                          bg-indigo-400
                        "
                      />

                    )}


                    <button
                      type="button"
                      onClick={() =>
                        handleSelectConversation(conv)
                      }
                      title={
                        conv?.title ||
                        "New Chat"
                      }
                      className="
                        flex-1
                        min-w-0
                        h-full
                        flex
                        items-center
                        gap-3
                        px-3
                        text-left
                        cursor-pointer
                      "
                    >

                      <div
                        className={`
                          w-7
                          h-7
                          rounded-lg
                          flex-shrink-0
                          flex
                          items-center
                          justify-center

                          ${
                            isActive
                              ? "bg-indigo-500/15 text-indigo-400"
                              : "bg-white/[0.04] text-slate-600 group-hover:text-slate-400"
                          }
                        `}
                      >

                        <MessageSquare size={14} />

                      </div>


                      <span
                        className={`
                          text-[12px]
                          truncate

                          ${
                            isActive
                              ? "text-slate-200"
                              : "text-slate-400 group-hover:text-slate-300"
                          }
                        `}
                      >

                        {conv?.title ||
                          "New Chat"}

                      </span>

                    </button>


                    <button
                      type="button"
                      onClick={(e) => {

                        e.stopPropagation();

                        handleDeleteConversation(
                          conv._id
                        );

                      }}
                      title="Delete conversation"
                      className="
                        mr-2
                        w-7
                        h-7
                        flex-shrink-0
                        rounded-lg
                        flex
                        items-center
                        justify-center
                        text-slate-600
                        hover:text-red-400
                        hover:bg-red-500/10
                        opacity-0
                        group-hover:opacity-100
                        transition-all
                        duration-150
                        cursor-pointer
                      "
                    >

                      <X size={14} />

                    </button>

                  </div>

                );

              })}

            </div>

          )}

        </div>


        {/* =================================================
            USER FOOTER
        ================================================= */}

        <div
          className="
            p-3
            border-t
            border-white/[0.06]
          "
        >

          <div
            className="
              min-h-[58px]
              rounded-xl
              px-2
              flex
              items-center
              gap-2
              hover:bg-white/[0.035]
              transition
            "
          >

            {/* PROFILE */}

            <div
              className="
                w-9
                h-9
                rounded-full
                overflow-hidden
                bg-indigo-500/10
                border
                border-white/[0.08]
                flex-shrink-0
              "
            >

              {profileImage ? (

                <img
                  src={profileImage}
                  alt="profile"
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                  referrerPolicy="no-referrer"
                  onError={(e) => {

                    e.currentTarget.style.display =
                      "none";

                  }}
                />

              ) : (

                <div
                  className="
                    w-full
                    h-full
                    flex
                    items-center
                    justify-center
                    text-indigo-400
                    text-xs
                    font-semibold
                  "
                >
                  {getUserInitial()}
                </div>

              )}

            </div>


            {/* USER INFO */}

            <div
              className="
                flex-1
                min-w-0
              "
            >

              <p
                className="
                  text-[11px]
                  font-semibold
                  text-slate-200
                  truncate
                "
              >
                {userData?.name ||
                  userData?.displayName ||
                  "User"}
              </p>


              <p
                className="
                  text-[9px]
                  text-slate-600
                  truncate
                  mt-0.5
                "
              >
                {userData?.plan || "free"} plan
              </p>

            </div>


            {/* BILLING */}

            <button
              type="button"
              title="Plans & Credits"
              onClick={() => {

                if (onBillingOpen) {
                  onBillingOpen();
                }

              }}
              className="
                w-8
                h-8
                rounded-lg
                flex
                items-center
                justify-center
                text-yellow-500
                hover:text-yellow-400
                hover:bg-yellow-500/10
                transition
                cursor-pointer
              "
            >

              <Coins size={17} />

            </button>


            {/* LOGOUT */}

            <button
              type="button"
              title="Logout"
              onClick={handleLogout}
              className="
                w-8
                h-8
                rounded-lg
                flex
                items-center
                justify-center
                text-slate-500
                hover:text-red-400
                hover:bg-red-500/10
                transition
                cursor-pointer
              "
            >

              <LogOut size={15} />

            </button>

          </div>

        </div>

      </aside>

    </>
  );
};


export default SideBar;