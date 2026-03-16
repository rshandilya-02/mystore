"use client";

import axios from "axios";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function CliLogin() {

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/cli/authenticate`;

  const searchParams = useSearchParams();
  const deviceId = searchParams.get("deviceId");

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("mydrive_token");
      if (!token) {
        alert("token not found");
        return;
      }
      const response = await axios.post(
        url,
        {
          device_code: deviceId,
          user_code: code,
        },
        {
          withCredentials: true,
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log("response is ", response);

      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center shadow-xl w-[420px]">

          <div className="text-5xl mb-4">✅</div>

          <h1 className="text-2xl font-bold text-green-400 mb-2">
            Login Successful
          </h1>

          <p className="text-zinc-400">
            You can now return to your CLI.
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl p-8">

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">CLI Authentication</h1>
          <p className="text-zinc-400 text-sm mt-2">
            Enter the code shown in your terminal
          </p>
        </div>

        <div className="flex flex-col gap-3">

          <input
            type="text"
            placeholder="Enter user code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="bg-black border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-yellow-400 transition"
          />

          <button
            onClick={handleClick}
            disabled={loading}
            className="bg-yellow-400 text-black font-semibold py-3 rounded-lg hover:bg-yellow-300 transition disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Authenticate CLI"}
          </button>

        </div>

        <p className="text-xs text-zinc-500 text-center mt-5">
          This allows your CLI tool to securely access your MyDrive account.
        </p>

      </div>
    </div>
  );
}