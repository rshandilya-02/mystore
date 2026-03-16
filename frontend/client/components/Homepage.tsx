"use client"

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Terminal, CloudUpload, Folder, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import DemoTerminal from "./cliDemo";
import { toast } from "react-toastify";
import { TerminalIcon } from "lucide-react";
import { MyDriveLogo } from "./ui/icon";

export default function HomePage({loggedIn}:{loggedIn:boolean}) {

  const router = useRouter();

  const copyTextToClipboard = () => {
    navigator.clipboard.writeText("npm install -g mydrive-cli");
    toast.success("copied");
  }

  return (
    <div className="min-h-screen bg-black text-white">

      <nav className="justify-between mr-[1%] flex w-full gap-3 p-[1%]">
        <div >
        </div>
        <div>
        {!loggedIn && <div className="flex gap-4">
        <div><Button className="bg-yellow-400 text-black hover:text-white hover:bg-yellow-600" onClick={()=>router.push("/register")}>SignUp</Button></div>
        <div><Button variant={"secondary"} className="text-black" onClick={()=>router.push("/login")}>Login</Button></div>
        </div>
        }
       {loggedIn && <div className="flex gap-4">
        <div><Button className="bg-yellow-400 text-black hover:text-white hover:bg-yellow-600" onClick={()=>router.push("/files")}>Files</Button></div>
        <div><Button variant={"secondary"} className="text-black" onClick={()=>router.push("/upload")}>Upload</Button></div>
        </div>
        }
        </div>
      </nav>
     
      <section className="px-8 py-24 max-w-6xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold tracking-tight"
        >
          Upload Anything.
          <span className="text-yellow-400"> From Anywhere.</span>
        </motion.h1>

        <p className="text-gray-400 mt-6 text-lg max-w-2xl mx-auto">
          A lightning fast way to push files and folders to S3. Use the web UI
          or install the CLI and upload directly from your terminal.
        </p>

        <div className="flex justify-center gap-4 mt-10">
          <Button className="bg-yellow-400 text-black hover:bg-yellow-300 hover:cursor-pointer " onClick={()=>router.push('/upload')}>
            Get Started
          </Button>

          <Button variant="outline" className="border-green-400 text-emerald-800 hover:cursor-pointer" onClick={()=>router.push('/docs')}>
            View Docs
          </Button>
        </div>
      </section>
      {/* <div className="flex justify-center items-center ">
        <DemoTerminal></DemoTerminal>
      </div> */}
      
      <section className="max-w-4xl mx-auto px-8 pb-24 text-center">
      <div className="relative p-[1px] rounded-xl overflow-hidden group">
        
       {/* moving beam */}
 <div className="pointer-events-none absolute inset-0 rounded-xl overflow-hidden">

  {/* TOP */}
  <div className="absolute top-0 left-0 w-full h-[2px] overflow-hidden">
    <div className="h-full w-[80%] bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-[beam-top_2s_linear_infinite]" />
  </div>


  {/* BOTTOM */}
  <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
    <div className="h-full w-[80%] bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-[beam-bottom_2s_linear_infinite]" />
  </div>

</div>
       <Card className="bg-zinc-900 border border-zinc-800 relative z-10 
shadow-[0_0_30px_rgba(34,197,94,0.05)] 
hover:shadow-[0_0_60px_rgba(34,197,94,0.15)]
transition-all duration-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-green-400 font-mono">CLI → S3 Transfer</div>
              <motion.div
                className="flex items-center gap-2 text-yellow-400"
                animate={{ x: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                
                <span> {">"} ••••••</span>
                <span className="text-xs"></span>
                <CloudUpload size={16} />
              </motion.div>
            </div>
            <p className="text-green-400 mb-4">Install CLI</p>
            <div className="bg-black w-full flex justify-between text-green-400 text-center font-mono p-4 rounded-xl text-sm mx-auto overflow-x-auto">
<div className="font-bold text-md"><span>npm install -g mydrive-cli</span>
</div>
<div ><button
  className="cursor-pointer hover:text-yellow-400 transition"
  onClick={copyTextToClipboard}
>
  <Copy size={18} />
</button></div>
            </div>
          </CardContent>
        </Card>
      </div>
      </section>
      
      <section className="max-w-6xl mx-auto px-8 pb-32 grid md:grid-cols-3 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6 space-y-4">
            <CloudUpload className="text-yellow-400" />
            <h3 className="text-xl font-semibold text-emerald-400">Direct S3 Upload</h3>
            <p className="text-gray-400">
              Upload files and folders directly to S3 without complex setup.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6 space-y-4">
            <Terminal className="text-green-400" />
            <h3 className="text-xl font-semibold text-emerald-400">Powerful CLI</h3>
            <p className="text-gray-400">
              Login once and push files instantly from your terminal.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6 space-y-4">
            <Folder className="text-yellow-400" />
            <h3 className="text-xl font-semibold text-emerald-400">Folder Upload</h3>
            <p className="text-gray-400">
              Recursively upload entire folders with a single command.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-10 text-center text-gray-500 flex gap-5 justify-center items-center">
        Built for developers who love the terminal. <span className="text-yellow-400"><Terminal className=""></Terminal></span>
      </footer>
    </div>
  );
}
