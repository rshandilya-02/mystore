"use client";

import { useRouter } from "next/navigation";
import { useForm  , SubmitHandler } from "react-hook-form";
import axios from "axios";
import { SIGNIN_URL } from "@/services/api";

type Inputs = {
    email: string,
    password: string
};

export default function LoginForm () {

    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async(data) => {
        console.log('data is ',data);
    
        try {
        const res = await axios.post(SIGNIN_URL,{
            email:data.email,
            password: data.password,
        },{
            withCredentials:true
        });
        console.log('response is ',res);
        const token = res.data.token ; 
        if(!token) {
            throw new Error("invalid registration");
        }
        
        localStorage.setItem("mydrive_token",token);
        router.push('/login');
    }catch(error){
        console.error(error);
    }

    }

    console.log(watch("email"));



    return (
        <div>
            <div>
                <p>Login page</p>
            </div>
            <div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">

                    <div className="flex flex-col ">
                        <label htmlFor="email">email</label>
                        <input placeholder="abc@gmail.com" {...register("email",{required:true})}/>
                         {errors.email && <span className="text-red-600 font-md">email is required</span>}
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="password">password</label>
                        <input placeholder="12345678" {...register("password",{required:true})}/>
                        {errors.password && <span className="text-red-600 font-md">password is required</span>}
                    </div>

                    <input type="submit" />

                </form>
            </div>
        </div>
    )
};



