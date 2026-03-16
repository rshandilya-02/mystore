"use client"

import { useState } from "react"
import { Copy, Terminal, Upload, Folder, LogIn } from "lucide-react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Image from "next/image"


const sections = [
  { id: "install", label: "Install CLI", icon: Terminal },
  { id: "login", label: "Login", icon: LogIn },
  { id: "file", label: "Upload File", icon: Upload },
  { id: "folder", label: "Upload Folder", icon: Folder },
  { id: "fileActions", label: "Download/Delete", icon: Folder },

]

function Command({ cmd }: { cmd: string }) {
  const copy = () => {
    navigator.clipboard.writeText(cmd)
    toast.success("Copied!")
  }

  return (
    <div className="bg-black border border-zinc-800 rounded-lg flex justify-between items-center p-4 font-mono text-green-400">
      <span>{cmd}</span>
      <button
        onClick={copy}
        className="hover:text-yellow-400 transition cursor-pointer"
      >
        <Copy size={18} />
      </button>
    </div>
  )
}

export default function DocsPage() {
  const [active, setActive] = useState("install")
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white flex ">

      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 p-6  pt-16 hidden md:block sticky  top-0 h-screen overflow-y-auto">

            <hr/>
        <h2 className="text-xl font-semibold text-yellow-400 mb-8 mt-8">
          CLI Docs
        </h2>

        <nav className="space-y-3">
          {sections.map((s) => {
            const Icon = s.icon
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setActive(s.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
                  active === s.id
                    ? "bg-zinc-900 text-yellow-400"
                    : "hover:bg-zinc-900 text-gray-400"
                }`}
              >
                <Icon size={18} />
                {s.label}
              </a>
            )
          })}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 px-8 py-16 max-w-4xl mx-auto space-y-20 overflow-y-auto">

        {/* Header */}
        <section>
          <h1 className="text-4xl font-bold text-yellow-400">
            CLI Documentation
          </h1>
          <p className="text-gray-400 mt-4">
            Push files and folders directly to S3 using the CLI.
          </p>
        </section>

        {/* Install */}
        <section id="install" className="space-y-4">
          <h2 className="text-2xl font-semibold text-green-400">
            Install CLI
          </h2>

          <p className="text-gray-400">
            Install the CLI globally using npm.
          </p>

          <Command cmd="npm install -g mydrive-cli" />
        </section>

        {/* Login */}
        <section id="login" className="space-y-4">
          <h2 className="text-2xl font-semibold text-green-400">
            Login
          </h2>

          <p className="text-gray-400">
            Authenticate the CLI with your account.
          </p>
          <p className="text-gray-400">
           **Before Cli Authentication , make sure to be logged in the UI
          </p>


          <Command cmd="mydrive login" />
          <div className="flex justify-center items-center mt-8 bg-zinc-950 rounded-lg p-3 ">
         <Image src="/login1.jpeg"
  alt="CLI login screen"
  width={600}
  height={300} className="rounded-xl  shadow-lg "></Image>
  </div>
        </section>

        {/* Upload File */}
        {/* List Files */}
        <section id="folder" className="space-y-4">
          <h2 className="text-2xl font-semibold text-green-400">
            List Uploaded Files
          </h2>

          <p className="text-gray-400">
            Recursively upload an entire folder.
          </p>

          <Command cmd="mydrive listFiles" />

          <div className="flex justify-center items-center mt-8 bg-black rounded-sm p-3 ">
          <Image src="/flist-2.jpeg"
                alt="cli filelist"
                width={600}
                height={300} className="rounded-sm  shadow-lg ">

                </Image>
                </div>
        </section>
        <section id="file" className="space-y-4">
          <h2 className="text-2xl font-semibold text-green-400">
            Upload File
          </h2>

          <p className="text-gray-400">
            Upload a single file to S3 bucket.
          </p>

          <Command cmd="mydrive upload <file_path>" />

          <div className="flex justify-center items-center mt-8 bg-black rounded-sm p-3 ">
          <Image src="/fupload1.jpeg"
                alt="CLI file Upload screen"
                width={600}
                height={300} className="rounded-sm  shadow-lg ">

                </Image>
                </div>
        </section>


        {/* Upload Folder */}
        <section id="folder" className="space-y-4">
          <h2 className="text-2xl font-semibold text-green-400">
            Upload Folder
          </h2>

          <p className="text-gray-400">
            Recursively upload an entire folder.
          </p>

          <Command cmd="mydrive upload -d <folder_path>" />

          <div className="flex justify-center items-center mt-8 bg-black rounded-sm p-3 ">
          <Image src="/folderUpload.jpeg"
                alt="CLI file Upload screen"
                width={600}
                height={300} className="rounded-sm  shadow-lg ">

                </Image>
                </div>
        </section>

        {/* Deletion and Downloads */}
        <section id="fileActions" className="space-y-4">
          <h2 className="text-2xl font-semibold text-green-400">
            Delete/Download Files
          </h2>

          <p className="text-gray-400">
            Visit files page on ui and perform the respective actions
          </p>
          <Button variant="secondary" onClick={()=>router.push('/files')}>Go to Files Page</Button>
        </section>

      </main>
    </div>
  )
}