"use client";

import { useForm  , SubmitHandler } from "react-hook-form";
import axios from "axios";
import { SIGNUP_URL } from "@/services/api";
import {useRouter} from 'next/navigation';

type Inputs = {
    email: string,
    password: string,
    confirm_password: string
};

export default function RegisterForm () {

    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = async(data) => {
        console.log('data is ',data);
        if(data.password !== data.confirm_password) return ;
        try {
        const res = await axios.post(SIGNUP_URL,{
            email:data.email,
            password: data.password,
            confirmPassword: data.confirm_password
        });
        console.log('response is ',res);
        router.push('/login');
    }catch(error){
        console.error(error);
    }

    }

    console.log(watch("email"));



    return (
        <div>
            <div>
                <p>SignIn Page</p>
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
                        <input placeholder="12345678" {...register("password",{required:true,minLength:6})}/>
                        {errors.password && <span className="text-red-600 font-md">password is required</span>}
                    </div>

                     <div className="flex flex-col">
                        <label htmlFor="password">confirm password</label>
                        <input placeholder="12345678" {...register("confirm_password",{required:true,minLength:6})}/>
                        {errors.password && <span className="text-red-600 font-md">password is required</span>}
                    </div>
                    <input type="submit" />

                </form>
            </div>
        </div>
    )
};


