"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { SIGNUP_URL } from "@/services/api";
import { useRouter } from "next/navigation";

type Inputs = {
  email: string;
  password: string;
  confirm_password: string;
};

export default function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const password = watch("password");

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (data.password !== data.confirm_password) return;

    try {
      const res = await axios.post(SIGNUP_URL, {
        email: data.email,
        password: data.password,
        confirmPassword: data.confirm_password,
      });

      console.log("response is ", res);

      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      
      {/* Card */}
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl p-8">

        {/* Title */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">
            Create your <span className="text-yellow-400">MyDrive</span> account
          </h1>
          <p className="text-zinc-400 text-sm mt-2">
            Start uploading files in seconds
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

          {/* Email */}
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

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-zinc-400">Password</label>

            <input
              type="password"
              placeholder="Minimum 6 characters"
              {...register("password", { required: true, minLength: 6 })}
              className="bg-black border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-yellow-400 transition"
            />

            {errors.password && (
              <span className="text-red-500 text-sm">
                Password must be at least 6 characters
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-zinc-400">Confirm Password</label>

            <input
              type="password"
              placeholder="Repeat password"
              {...register("confirm_password", {
                required: true,
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className="bg-black border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-yellow-400 transition"
            />

            {errors.confirm_password && (
              <span className="text-red-500 text-sm">
                {errors.confirm_password.message}
              </span>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="bg-yellow-400 text-black font-semibold py-3 rounded-lg hover:bg-yellow-300 transition"
          >
            Create Account
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-zinc-400 mt-2">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-yellow-400 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>

        </form>
      </div>
    </div>
  );
}