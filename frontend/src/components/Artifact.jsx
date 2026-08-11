import { Check, Code2, Copy, Eye, PanelRightOpen } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { easeInOut, motion } from "motion/react";
import Editor from "@monaco-editor/react";

const Artifact = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState("code");
  const [activeFile, setActiveFile] = useState(0);
  const [copied,setCopied]=useState(false)

  const { artifacts } = useSelector((state) => state.message);

  if (!artifacts || artifacts.length === 0) {
    return null;
  }


  const artifact = artifacts[0];

  const files = artifact?.files || [];

  const file = files[activeFile];

  const htmlFile = files.find((f) => f?.name === "index.html");
  const cssFile = files.find((f) => f?.name === "style.css");
  const jsFile = files.find((f) => f?.name === "script.js");

  const canPreview = Boolean(htmlFile);

  const previewDoc = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <style>
    ${cssFile?.content || ""}
  </style>
</head>

<body>

  ${
    htmlFile?.content
      ?.replace(/<link[^>]*href=["']style\.css["'][^>]*>/gi, "")
      ?.replace(/<script[^>]*src=["']script\.js["'][^>]*><\/script>/gi, "") ||
    ""
  }

  <script>
    ${jsFile?.content || ""}
  </script>

</body>
</html>
`;


  const handleCopy=async()=>{
       await navigator.clipboard.writeText(file?.content || "")
  setCopied(true)
  setTimeout(() => {
    setCopied(false)
  }, 2000);
  }

const detectLanguage = (fileName = "") => {
  const name = fileName.toLowerCase();

  if (name.endsWith(".html"))
    return "html";

  if (name.endsWith(".css"))
    return "css";

  if (name.endsWith(".js"))
    return "javascript";

  if (name.endsWith(".jsx"))
    return "javascript";

  if (name.endsWith(".ts"))
    return "typescript";

  if (name.endsWith(".tsx"))
    return "typescript";

  if (name.endsWith(".json"))
    return "json";

  if (name.endsWith(".py"))
    return "python";

  if (name.endsWith(".java"))
    return "java";

  if (name.endsWith(".cpp"))
    return "cpp";

  if (name.endsWith(".c"))
    return "c";

  return "plaintext";
};

  const copyCode = async () => {
    if (file?.content) {
      await navigator.clipboard.writeText(file.content);
    }
  };

  return (
    <motion.div
      initial={{ width: 350 }}
      animate={{ width: collapsed ? 48 : 350 }}
      transition={{
        duration: 0.25,
        ease: easeInOut,
      }}
      className="hidden lg:flex h-full flex-col overflow-hidden shrink-0 border-l border-white/[0.06] bg-[#0d0f14]"
    >
      {!collapsed ? (
        <>
          {/* HEADER */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.06] shrink-0">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 shrink-0">
                <Code2 className="text-indigo-400" size={12} />
              </div>

              <div className="text-[13px] font-medium text-slate-200 truncate">
                {artifact?.title}
              </div>
            </div>

            {/* COPY */}
            <button
              onClick={handleCopy}
              className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-colors bg-transparent border-none cursor-pointer"
            >
              {copied?<Check size={15}/>:<Copy size={15} />}
            </button>

            {/* COLLAPSE */}
            <button
              onClick={() => setCollapsed(true)}
              className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-colors bg-transparent border-none cursor-pointer"
            >
              <PanelRightOpen size={15} />
            </button>
          </div>

          {/* CODE / PREVIEW TABS */}
          {canPreview && (
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06] shrink-0">
              {/* FILE TABS */}
              <div className="flex h-auto overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {files.map((f, index) => (
                  <button
                    key={f?.name || index}
                    onClick={() => {
                      setActiveFile(index);
                      setTab("code");
                    }}
                    className={`px-3 py-2 text-[11px] font-medium whitespace-nowrap transition-colors duration-150 border-r border-white/[0.05] relative cursor-pointer bg-transparent ${
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
              </div>

              {/* CODE / PREVIEW */}
              <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] p-1 rounded-lg shrink-0">
                <button
                  onClick={() => setTab("code")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors duration-150 ${
                    tab === "code"
                      ? "bg-indigo-500 text-white"
                      : "text-slate-500 hover:text-slate-200"
                  }`}
                >
                  <Code2 size={11} />
                  Code
                </button>

                <button
                  onClick={() => setTab("preview")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors duration-150 ${
                    tab === "preview"
                      ? "bg-indigo-500 text-white"
                      : "text-slate-500 hover:text-slate-200"
                  }`}
                >
                  <Eye size={11} />
                  Preview
                </button>
              </div>
            </div>
          )}

          {/* CONTENT */}
          <div className="flex-1 overflow-hidden">
            {tab === "preview" && canPreview ? (
              /* PREVIEW */
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full bg-white"
              >
                <iframe
                  title="artifact-preview"
                  srcDoc={previewDoc}
                  sandbox="allow-scripts allow-modals"
                  className="w-full h-full border-0"
                />
              </motion.div>
            ) : (
              /* CODE */
              <motion.div
                key="code"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full overflow-auto"
              >
            <Editor
  theme="vs-dark"
  language={detectLanguage(file?.name)}
  value={file?.content}
  options={{
    readOnly: true,
    minimap: { enabled: false },
    fontSize: 13,
    wordWrap: "on",
    automaticLayout: true,
    scrollBeyondLastLine: false,
    padding: { top: 16 },
    lineNumbers: "on",
    renderLineHighlight: "none",
  }}
/>
              </motion.div>
            )}
          </div>
        </>
      ) : (
        /* COLLAPSED */
        <div className="flex h-full flex-col items-center py-4 gap-3">
          <button
            onClick={() => setCollapsed(false)}
            className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors bg-transparent border-none cursor-pointer"
          >
            <PanelRightOpen size={16} />
          </button>

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div
              className="text-[10px] font-medium text-slate-600 tracking-widest uppercase whitespace-nowrap"
              style={{
                writingMode: "vertical-lr",
                transform: "rotate(180deg)",
              }}
            >
              {artifact?.title}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Artifact;
