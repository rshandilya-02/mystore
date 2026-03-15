"use client";

import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { SIGNIN_URL } from "@/services/api";

type Inputs = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const res = await axios.post(
        SIGNIN_URL,
        {
          email: data.email,
          password: data.password,
        },
        {
          withCredentials: true,
        }
      );

      const token = res.data.token;

      if (!token) {
        throw new Error("invalid login");
      }

      localStorage.setItem("mydrive_token", token);
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">

      
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl p-8">

       
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">
            Login to <span className="text-yellow-400">MyDrive</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-2">
            Access your files from anywhere
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >

         
          <div className="flex flex-col gap-2">
            <label className="text-sm text-zinc-400">Email</label>

            <input
              type="email"
              placeholder="abc@gmail.com"
              {...register("email", { required: true })}
              className="bg-black border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-yellow-400 transition"
            />

            {errors.email && (
              <span className="text-red-500 text-sm">
                Email is required
              </span>
            )}
          </div>

         
          <div className="flex flex-col gap-2">
            <label className="text-sm text-zinc-400">Password</label>

            <input
              type="password"
              placeholder="********"
              {...register("password", { required: true })}
              className="bg-black border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-yellow-400 transition"
            />

            {errors.password && (
              <span className="text-red-500 text-sm">
                Password is required
              </span>
            )}
          </div>

        
          <button
            type="submit"
            className="bg-yellow-400 text-black font-semibold py-3 rounded-lg hover:bg-yellow-300 transition"
          >
            Login
          </button>

          
          <p className="text-center text-sm text-zinc-400 mt-2">
            Don’t have an account?{" "}
            <span
              onClick={() => router.push("/register")}
              className="text-yellow-400 cursor-pointer hover:underline"
            >
              Sign up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}