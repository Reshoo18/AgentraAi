import { Code2, Copy, Eye, PanelRightClose, PanelRightOpen } from "lucide-react";
import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { easeInOut, motion } from "motion/react";

const Artifact = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { artifacts } = useSelector((state) => state.message);
  const [tab,setTab]=useState("code")
  const [activeFile,setActiveFile]=useState(0)

    if (!artifacts || artifacts.length === 0) {
    return null;
  }


  const file=artifacts[0]?.file?.[activeFile]?.content
  const htmlFile=artifacts[0]?.files?.find(f=>f.name==="index.html")
    const cssFile=artifacts[0]?.files?.find(f=>f.name==="style.css")
      const jsFile=artifacts[0]?.files?.find(f=>f.name==="script.js")

      const canPreview=Boolean(htmlFile)

  const prviewDoc=`
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
   ${cssFile?.content || ""}
  </style>
</head>
<body>
  <script>
    ${jsFile?.content || ""}
  </script>
</body>
</html>
  
  
  `


  return (
    <motion.div
      initial={{ width: 350 }}
      animate={{ width: collapsed ? 48 : 350 }}
      transition={{ duration: 0.25, ease: easeInOut }}
      className="hidden lg:flex h-full flex-col overflow-hidden shrink-0 w-[250px]"
    >
      {!collapsed ? (
        <div className="flex flex-col h-full bg-[#0d0f14]">
          <div className="h-14 px-4 border-b border-white/[0.06] flex items-center gap-3 shrink-0">
            <button
              className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200
         hover:bg-white/0.05 transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0"
              onClick={() => setCollapsed(true)}
            >
              <PanelRightClose size={16} />
            </button>

            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 shrink-0">
                <Code2 className="text-indigo-400" size={12} />
              </div>
              <div className="text-[13px] font-medium text-slate-200 truncate">
                {artifacts[0]?.title}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] rounded-lg transition-colors duration-150 bg-transparent border-none cursor-pointer">
                <Copy size={15} />
              </button>
            </div>
            {canPreview && 
           <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] p-1 rounded-lg">
  <button
    onClick={() => setTab("code")}
    className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors duration-150 ${
      tab === "code"
        ? "bg-indigo-500 text-white"
        : "text-slate-500 hover:text-slate-200"
    }`}
  >
    <Code2 size={11} /> Code
  </button>

  <button
    onClick={() => setTab("preview")}
    className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors duration-150 ${
      tab === "preview"
        ? "bg-indigo-500 text-white"
        : "text-slate-500 hover:text-slate-200"
    }`}
  >
    <Eye size={11} /> Preview
  </button>
</div>}
          </div>
            
        {tab==="code" &&       <div className="flex h-auto border-b border-white/[0.06] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0">
  {artifacts?.[0]?.files?.map((f, index) => (
    <button
      onClick={() => setActiveFile(index)}
      className={`px-4 py-2.5 text-[11px] font-medium whitespace-nowrap transition-colors duration-150 border-r border-white/[0.05] relative cursor-pointer bg-transparent ${
        activeFile === index
          ? "text-indigo-400"
          : "text-slate-500 hover:text-slate-300"
      }`}
    >
      {f?.name}

      {activeFile === index && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500 rounded-t-full" />
      )}
    </button>
  ))}
</div>}    

  
       
         <div className="flex-1 overflow-hidden">
      { (tab==="preview" && canPreview)  ? <motion.div 
           initial={{opacity:0}}
           animate={{opacity:1}}
           transition={{duration:0.5}}
          >
              
          </motion.div>:<motion.div 
           initial={{}}
           animate={{}}
           transition={{}}
          >
            
            </motion.div>}
         </div>

        </div>
      ) : (
        <div className="hidden lg:flex h-full border-l border-white/[0.06] bg-[#0d0f14] flex-col items-center py-4 gap-3 shrink-0">
          <button
            className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200
         hover:bg-white/0.05 transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0"
            onClick={() => setCollapsed(false)}
          >
            <PanelRightOpen size={16} />
          </button>

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div
              className="text-[10px] font-medium text-slate-600  tracking-widest uppercase whitespace-nowrap"
              style={{
                writingMode: "vertical-lr",
                transform: "rotate(180deg)",
              }}
            >
              {artifacts[0]?.title}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Artifact;
