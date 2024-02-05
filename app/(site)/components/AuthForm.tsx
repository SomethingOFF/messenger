"use client"
import axios from "axios";
import Button from "@/app/components/Button"
import AuthSocialButton from "./AuthSocialButton"
import Input from "@/app/components/inputs/Input"
import React, { useCallback, useEffect, useState } from "react"
import { FieldValues, useForm, SubmitHandler } from "react-hook-form"
import { BsGithub, BsGoogle } from "react-icons/bs"
import toast from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation"
type varient = "LOGIN" | "REGISTER"

const AuthForm = () => {

    const [varient, setVarient] = useState<varient>("LOGIN")
    const [loading, setLoading] = useState(false)
    const session = useSession()
    const router = useRouter()
    const toggleVariant = useCallback(() => {
        if (varient === 'LOGIN') {
            setVarient('REGISTER');
        } else {
            setVarient('LOGIN');
        }
    }, [varient]);

    useEffect(() => {
        if (session?.status === "authenticated") {
            console.log("Authenticated")
            router.push("/users")
        }
    }, [session?.status, router])

    const {
        register,
        handleSubmit,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
              name: '',
            email: '',
            password: ''
        }
    });
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setLoading(true);

        if (varient === 'REGISTER') {
            axios.post('/api/register', data).then(() => 
                signIn("credentials", {
                    ...data,
                    redirect: false
                })).then((callback) => {
                if (callback?.error) {
                    toast.error("Invalid Credentials")
                }
                if (callback?.ok && !callback.error) {
                    toast.success("Logged in Successfully!")
                    router.push("/users")
                }
            }).catch(() => {
                toast.error("something went wrong")
            }).finally(() => setLoading(false))
        }

        if (varient === 'LOGIN') {
            signIn("credentials", {
                ...data,
                redirect: false
            }).then((callback) => {
                if (callback?.error) {
                    toast.error("Invalid Credentials")
                }
                if (callback?.ok && !callback.error) {
                    toast.success("Logged in Successfully!")
                    router.push("/users")
                }
            }).finally(() => setLoading(false))
        }
    }
    const socialACtion = (action: string) => {
        setLoading(true)
        signIn(action, {
            redirect: false
        }).then((callback) => {
            if (callback?.error) {
                toast.error("Invalid Credentials!")
            }
            if (callback?.ok && !callback.error) {
                toast.success("logged with social media")
            }
        }).finally(() => setLoading(false))
    }
    return (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className=" bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

                    {varient === 'REGISTER' && (
                        <Input
                            disabled={loading}
                            register={register}
                            errors={errors}
                            required
                            id="name"
                            label="Name"
                        />
                    )}
                    <Input
                        disabled={loading}
                        register={register}
                        errors={errors}
                        required
                        id="email"
                        label="Email address"
                        type="email"
                    />
                    <Input
                        disabled={loading}
                        register={register}
                        errors={errors}
                        required
                        id="password"
                        label="Password"
                        type="Password"
                    />

                    <div>
                        <Button disabled={loading} fullWidth type="submit">{varient === "LOGIN" ? "sign in" : "register"}</Button>
                    </div>
                </form>
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">
                                or Continue with
                            </span>
                        </div>
                    </div>
                    <div className="mt-6 flex gap-2">
                        <AuthSocialButton
                            icon={BsGithub}
                            onClick={() => socialACtion('github')}
                        />
                        <AuthSocialButton
                            icon={BsGoogle}
                            onClick={() => socialACtion('google')}
                        />
                    </div>
                </div>
                <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
                    <div>{varient === "LOGIN" ? "New to Messenger" : "already had account"}</div>
                    <div onClick={toggleVariant} className=" underline cursor-pointer">
                        {
                            varient === "LOGIN" ? "create an account" : "Login Here"
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthForm