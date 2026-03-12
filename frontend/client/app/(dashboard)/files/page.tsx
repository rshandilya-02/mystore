"use client";

import { FILE_LIST } from '@/services/api';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { DataTable } from './data-table';
import {columns} from './columns.tsx'


export default function FileList() {

    const [files,setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
  const fetchFiles = async () => {
    try {
      console.log("file fetching");

      const token = localStorage.getItem("mydrive_token");

      const res = await axios.get(FILE_LIST, {
        headers: {
          authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setFiles(res.data.files);
      console.log("corresponding files are ", res);
    } catch (error) {
      console.log("error occured during file fetching", error);
    } finally {
      setLoading(false);
    }
  };

  fetchFiles();
}, []);

  return (
  <div className="min-h-screen bg-black text-white px-10 py-12">

    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-10">

        <div>
          <h1 className="text-3xl font-bold">Your Files</h1>
          <p className="text-gray-400 text-sm">
            Files stored in your S3 bucket
          </p>
        </div>

        <a
          href="/upload"
          className="bg-emerald-400 text-black px-5 py-2 rounded-lg font-semibold hover:bg-emerald-300 transition"
        >
          Upload File
        </a>

      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-32">

          <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mb-6"></div>

          <p className="text-gray-400 text-sm">
            Fetching your files from cloud...
          </p>

        </div>
      )}

      {/* Empty state */}
      {!loading && files.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center">

          <div className="text-7xl mb-6">📂</div>

          <h2 className="text-2xl font-semibold mb-2">
            No files yet
          </h2>

          <p className="text-gray-400 mb-6">
            Upload your first file to start using cloud storage
          </p>

          <a
            href="/upload"
            className="bg-emerald-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-emerald-300 transition"
          >
            Upload File
          </a>

        </div>
      )}

      {/* Table */}
      {!loading && files.length > 0 && (
        <div className="bg-emerald-900 border border-zinc-800 rounded-xl shadow-lg p-4">
          <DataTable columns={columns} data={files} />
        </div>
      )}

    </div>

  </div>
);
}