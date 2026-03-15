"use client";

import { useState } from "react";
import axios from "axios";
import { UPLOAD_URL } from "@/services/api";
import UploadAnimation from "@/components/UploadAnimation";
import { useRouter } from "next/navigation";

export default function FileUpload() {
  const [file, setFile] = useState<File>();
  const [uploading, setUploading] = useState(false);

  const router = useRouter();
    const [success, setSuccess] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) {
      console.log("file not uploaded");
      return;
    }

    const file_ = files[0];
    setFile(file_);

    console.log(await file_.arrayBuffer());
  };

  const handleSubmit = async () => {
    setUploading(true);
    if (!file || !file.type) {
      return;
    }

    try {
      const file_name = file?.name;
      const file_type = file?.type;
      const file_size = file?.size;

      const token = localStorage.getItem("mydrive_token");
      if (!token) {
        alert("token not found");
        return;
      }

      const presigned_url = await axios.post(
        UPLOAD_URL,
        {
          file_name,
          file_type,
          file_size,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      const url = presigned_url?.data.url;
      
      if (!url) {
          setUploading(false);
        console.log("url not available");
        return;
      }
      const file_upload = await axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
          "x-amz-server-side-encryption": "AES256"
        },
      });
          setUploading(false);
setSuccess(true);
console.log("file_upload ", file_upload);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 w-[420px] shadow-xl">
        
        <h1 className="text-3xl font-bold mb-2 text-center">
          Upload File
        </h1>

        <p className="text-gray-400 text-sm text-center mb-8">
          Push your files directly to S3
        </p>

        <div className="flex flex-col gap-6">
          
          <input
            type="file"
            onChange={handleUpload}
            className="block w-full text-sm text-gray-300
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-yellow-400 file:text-black
            hover:file:bg-yellow-300
            cursor-pointer"
          />

          {file && (
            <div className="text-xs text-green-400 font-mono">
              selected: {file.name}
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="bg-yellow-400 text-black font-semibold py-2 rounded-lg hover:bg-yellow-300 transition"
          >
            Upload File
          </button>

        </div>
      </div>
          {uploading && <UploadAnimation />}
          {success && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur z-50">

    <div className="bg-zinc-900 border border-zinc-700 p-8 rounded-2xl w-[360px] text-center shadow-xl relative">

      {/* close button */}
      <button
        onClick={() => router.push("/files")}
        className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
      >
        ✕
      </button>

      <div className="text-green-400 text-5xl mb-4">
        ✓
      </div>

      <h2 className="text-xl font-semibold mb-2">
        Upload Successful
      </h2>

      <p className="text-gray-400 text-sm">
        Your file has been uploaded to S3 successfully.
      </p>

    </div>
  </div>
)}
    </div>
  );
}