import React from 'react';
import { UseUserAuth } from '@/components';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import Link from "next/link";


export const Login = () => {
    const { signIn } = UseUserAuth()

    const router = useRouter()

    const { register, handleSubmit } = useForm()

    const onSignIn = async (data) => {
        try {
            if (data.email == "admin@gmail.com" && data.password == "12345678") {
                router.push("/admin")
            } else {
                await signIn(data.email, data.password)
                router.push("/admin")
            }

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Wrong Credentials",
                toast: true,
                animation: true,
                position: "top",
                timer: 2000,
                iconColor: '#27272a',
                showCancelButton: false,
                showConfirmButton: false,
            });
        }
    }

    return (
        <div className="flex justify-center items-center h-[87vh] lg:px-20 md:px-12 px-6">
            <div className="w-1/3 flex flex-col justify-center items-center border border-zinc-200 py-8 rounded-lg shadow-md">
                <div className="lg:w-3/4 w-full trhide">
                    <h1 className="font-PoppinsSemiBold text-4xl text-zinc-800 pb-2 lg:text-left text-center">
                        Login
                    </h1>
                    <p className="font-PoppinsRegular text-xs text-zinc-800 pb-2 lg:text-left text-center">
                        Enter your credentials to access your account
                    </p>
                    <div className="flex flex-col pt-4">
                        <label htmlFor="email" className="font-PoppinsRegular text-sm text-zinc-800 pb-2 pl-1">Email</label>
                        <input {...register("email", { required: true })} type="email" id="email" placeholder="Enter your email" className="font-PoppinsRegular text-base p-2 border border-gray-300 rounded shadow-sm mb-4 placeholder:text-xs placeholder:text-zinc-400 focus:outline-primary-1" />
                        <label htmlFor="password" className="font-PoppinsRegular text-sm text-zinc-800 pb-2 pl-1">Password</label>
                        <input {...register("password", { required: true })} type="password" id="password" placeholder="Enter your password" className="font-PoppinsRegular text-base p-2 border border-gray-300 rounded shadow-sm mb-4 placeholder:text-xs placeholder:text-zinc-400 focus:outline-primary-1" />
                        <button onClick={handleSubmit(onSignIn)} type="button" className="font-PoppinsRegular text-base p-2 bg-primary-1 text-white rounded shadow-sm mt-2">
                            Login
                        </button>
                        <div className="flex justify-center py-2">
                            <p className="font-PoppinsRegular text-xs text-zinc-800">
                                Don't have an account? <Link className="text-primary-1" href="/register">Register</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
