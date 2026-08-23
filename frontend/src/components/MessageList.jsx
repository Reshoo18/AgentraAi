// import React, { useEffect,useRef } from "react";
// import { useSelector } from "react-redux";
// import MessageBubble from "./MessageBubble";
// import LoadingAnimation from "./LoadingAnimation";

// const MessageList = () => {
//   const { selectedConversation } = useSelector((state) => state.conversation);
//   const { messages ,isLoading} = useSelector((state) => state.message);
//   const bottomRef=useRef(null)
   
//  useEffect(() => {
//   requestAnimationFrame(() => {
//     bottomRef.current?.scrollIntoView({
//       behavior: "smooth",
//       block: "end",
//     });
//   });
// }, [messages?.length, isLoading]);

//   return (
//     <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
//       {messages.length == 0 || !selectedConversation ? (
//         <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
//           <div className="flex flex-col gap-1.5">
//             <h1 className="text-[20px] font-semibold text-slate-200 tracking-tight">
//               AgentraAi
//             </h1>
//             <p className="text-[15px] font-semibold text-slate-200 tracking-tight">
//               How Can I Help You?
//             </p>
//             <p className="text-[13px] text-slate-600 max-w-[260px] leading relaxed">
//               Ask me Anything - codes, ideas , explaination , or just a quick
//               question.
//             </p>
//           </div>

//           <div className="flex flex-wrap justify-center gap-2 mt-1">
//             {[
//               "Write a Netflix clone",
//               "Explain Redis",
//               "Build a dashboard",
//             ].map((s) => (
//               <button
//                 key={s}
//                 className="text-[12px] text-slate-400 bg-white/[0.04] border border-white/[0.07] px-3 py-1.5 rounded-lg hover:bg-white/[0.08] hover:text-slate-200 transition-colors duration-150 cursor-pointer"
//               >
//                 {s}
//               </button>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <div className="space-y-5">
//   {messages.map((msg, i) => (
//     <div key={msg._id || i}>
//       <MessageBubble
//         role={msg.role}
//         content={msg.content}
//           images={msg.images}
        
//       />
//     </div>
//   ))}
//  {isLoading &&  <LoadingAnimation/>}
// </div>
//       )}
//       <div ref={bottomRef}/>
//     </div>
//   );
// };

// export default MessageList;

import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import {
  Sparkles,
  Code2,
  Brain,
  Search,
  FileText,
  ArrowUpRight,
} from "lucide-react";

import MessageBubble from "./MessageBubble";
import LoadingAnimation from "./LoadingAnimation";

const MessageList = () => {
  const { selectedConversation } = useSelector(
    (state) => state.conversation
  );

  const { messages, isLoading } = useSelector((state) => state.message);

  const bottomRef = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    });
  }, [messages?.length, isLoading]);

  const quickActions = [
    {
      icon: Code2,
      title: "Build something",
      description: "Create an app or solve a coding problem",
      prompt: "Help me build a modern web application",
    },
    {
      icon: Brain,
      title: "Understand a concept",
      description: "Break down complex technical topics",
      prompt: "Explain a complex technical concept simply",
    },
    {
      icon: Search,
      title: "Research & explore",
      description: "Find useful information and insights",
      prompt: "Help me research a topic",
    },
    {
      icon: FileText,
      title: "Work with files",
      description: "Analyze documents, data and content",
      prompt: "Help me analyze a document",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {messages.length === 0 || !selectedConversation ? (
        <div className="relative min-h-full flex flex-col items-center justify-center text-center px-4 overflow-hidden">
          {/* Ambient background glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-[20%] left-[42%] w-[260px] h-[260px] rounded-full bg-indigo-600/[0.07] blur-[100px]" />

            <div className="absolute bottom-[20%] right-[25%] w-[220px] h-[220px] rounded-full bg-cyan-500/[0.04] blur-[100px]" />
          </div>

          {/* Animated Agentra orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative mb-6"
          >
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.35, 0.55, 0.35],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-[-12px] rounded-2xl bg-indigo-500/20 blur-xl"
            />

            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-600 to-cyan-500 p-[1px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full rounded-2xl bg-[#0b0d12] flex items-center justify-center">
                <Sparkles
                  size={24}
                  className="text-indigo-300"
                  strokeWidth={1.8}
                />
              </div>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <p className="text-[11px] uppercase tracking-[0.28em] text-indigo-400/80 font-medium mb-3">
              Your intelligent workspace
            </p>

            <h1 className="text-3xl md:text-[36px] font-semibold tracking-[-0.03em] text-white">
              Think. Build. Create.
            </h1>

            <p className="mt-3 text-[14px] leading-6 text-slate-500 max-w-[460px]">
              Meet AgentraAI — your workspace for coding, research,
              ideas, documents and everything in between.
            </p>
          </motion.div>

          {/* Quick action cards */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 w-full max-w-[620px]">
            {quickActions.map((action, index) => {
              const Icon = action.icon;

              return (
                <motion.button
                  key={action.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: 0.18 + index * 0.08,
                  }}
                  whileHover={{
                    y: -3,
                    scale: 1.01,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className="group text-left p-4 rounded-xl border border-white/[0.07] bg-white/[0.025] hover:bg-white/[0.055] hover:border-indigo-500/30 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-400/10 flex items-center justify-center">
                      <Icon
                        size={17}
                        className="text-indigo-400"
                        strokeWidth={1.8}
                      />
                    </div>

                    <ArrowUpRight
                      size={15}
                      className="text-slate-700 group-hover:text-indigo-400 transition-colors"
                    />
                  </div>

                  <h3 className="mt-3 text-[13px] font-medium text-slate-200">
                    {action.title}
                  </h3>

                  <p className="mt-1 text-[11px] leading-5 text-slate-600">
                    {action.description}
                  </p>
                </motion.button>
              );
            })}
          </div>

          {/* Bottom branding */}
       <motion.div
  initial={{ opacity: 0, y: 6 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.7, duration: 0.4 }}
  className="relative mt-7 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.07] bg-white/[0.025] text-[11px] text-slate-400"
>
  <span className="relative flex w-1.5 h-1.5">
    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40 animate-ping" />
    <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-400" />
  </span>

  <span className="text-slate-300 font-medium">
    AgentraAI is ready
  </span>

  <span className="text-slate-600">•</span>

  <span className="text-slate-400">
    Ask anything
  </span>
</motion.div>
        </div>
      ) : (
        <div className="space-y-5">
          {messages.map((msg, i) => (
            <div key={msg._id || i}>
              <MessageBubble
                role={msg.role}
                content={msg.content}
                images={msg.images}
              />
            </div>
          ))}

          {isLoading && <LoadingAnimation />}
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;