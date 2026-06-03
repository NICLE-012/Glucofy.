"use client"

import React, { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { useGoogleLogin } from "@react-oauth/google"
import { GoogleLogin } from "@react-oauth/google"
import { jwtDecode } from "jwt-decode"


import {
    motion,
    AnimatePresence,
    useMotionValue,
    useTransform
} from "framer-motion"

import {
    User,
    Lock,
    Eye,
    EyeOff,
    ArrowRight
} from "lucide-react"

type GoogleUser = {
    email: string
    name: string
    picture: string
}

export interface LoginResponse {
    success: boolean
    message: string
    access_token: string
    user: {
        id: string
        name: string
        email: string
        profileImage?: string
    }
}

function Input({
    className = "",
    type,
    ...props
}: React.ComponentProps<"input">) {

    return (

        <input
            type={type}
            className={`w-full h-14 bg-white border border-zinc-200 rounded-xl pl-12 pr-12 text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-lime-500 focus:ring-4 focus:ring-lime-100 transition ${className}`}
            {...props}
        />

    )
}

export default function SignIn() {

    const router = useRouter()

    const [showPassword, setShowPassword] =
        useState(false)

    const [email, setEmail] =
        useState("")

    const [password, setPassword] =
        useState("")

    const [isLoading, setIsLoading] =
        useState(false)

    const [focusedInput, setFocusedInput] =
        useState<string | null>(null)

    const mouseX =
        useMotionValue(0)

    const mouseY =
        useMotionValue(0)

    const rotateX =
        useTransform(
            mouseY,
            [-300, 300],
            [10, -10]
        )

    const rotateY =
        useTransform(
            mouseX,
            [-300, 300],
            [-10, 10]
        )

    const handleMouseMove = (
        e: React.MouseEvent<HTMLDivElement>
    ) => {

        const rect =
            e.currentTarget.getBoundingClientRect()

        mouseX.set(
            e.clientX -
            rect.left -
            rect.width / 2
        )

        mouseY.set(
            e.clientY -
            rect.top -
            rect.height / 2
        )

    }

    const handleMouseLeave = () => {

        mouseX.set(0)

        mouseY.set(0)

    }

    const handleSignIn = async (
        event: FormEvent
    ) => {

        try {

            event.preventDefault()

            if (
                !email ||
                !password
            ) {

                toast.error(
                    "Please enter your email and password"
                )

                return

            }

            setIsLoading(true)

            const url =
                `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`

            const requestData = {
                email,
                password
            }

            console.log(
                "Request URL:",
                url
            )

            const response =
                await fetch(
                    url,
                    {
                        method: "POST",
                        body: JSON.stringify(
                            requestData
                        ),
                        headers: {
                            "Content-Type":
                                "application/json",
                        }
                    }
                )

            const text =
                await response.text()

            console.log(
                "Response:",
                text
            )

            let data

            try {

                data =
                    JSON.parse(text)

            } catch {

                toast.error(
                    "Invalid server response"
                )

                return

            }

            if (!response.ok) {

                toast.error(
                    data.message ||
                    "Invalid email or password"
                )

                return

            }

            localStorage.setItem(
                "token",
                data.access_token
            )

            const userData = {
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                profileImage:
                    data.user.profileImage || ""
            }

            localStorage.setItem(
                "user",
                JSON.stringify(userData)
            )

            toast.success(
                "Welcome back!"
            )

            setTimeout(() => {

                router.push(
                    "/dasbor"
                )

            }, 800)

        } catch (error) {

            console.error(error)

            toast.error(
                "Unable to connect to server"
            )

        } finally {

            setIsLoading(false)

        }

    }
    return (
        <div className="min-h-screen flex">

            {/* LEFT */}
            <div className="hidden lg:flex w-1/2 bg-black relative overflow-hidden items-center justify-center">

                <div className="absolute w-[500px] h-[500px] rounded-full bg-lime-500/25 blur-[120px]" />

                <div className="relative z-10 flex flex-col items-center px-12">

                    <img
                        src="/glucofy-logo.png"
                        alt="Glucofy"
                        className="w-80"
                    />

                    <h1 className="text-white text-5xl font-bold mt-8">
                        Welcome Back
                    </h1>

                    <p className="text-zinc-400 text-xl mt-4 text-center">
                        Know Your Sugar, Control Your Future.
                    </p>

                </div>

            </div>

            {/* RIGHT */}
            <div className="w-full lg:w-1/2 bg-[#f8fafc] flex items-center justify-center px-6">

                <motion.div
                    className="w-full max-w-lg relative z-10"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    style={{ perspective: 1500 }}
                >

                    <motion.div
                        style={{ rotateX, rotateY }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        className="relative"
                    >

                        <div className="bg-white rounded-[32px] border border-zinc-200 shadow-xl p-10 w-full">

                            {/* HEADER */}
                            <div className="text-center mb-8">

                                <h1 className="text-4xl font-bold text-zinc-900">
                                    Welcome Back
                                </h1>

                                <p className="text-zinc-500 mt-3 text-base">
                                    Sign in to continue your Glucofy journey
                                </p>

                            </div>

                            {/* FORM */}
                            <form
                                onSubmit={handleSignIn}
                                className="space-y-5"
                            >

                                {/* EMAIL */}
                                <div className="relative">

                                    <User
                                        className={`absolute left-4 top-4 w-5 h-5 ${focusedInput === "email"
                                            ? "text-lime-500"
                                            : "text-zinc-400"
                                            }`}
                                    />

                                    <Input
                                        type="text"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        onFocus={() =>
                                            setFocusedInput("email")
                                        }
                                        onBlur={() =>
                                            setFocusedInput(null)
                                        }
                                    />

                                </div>

                                {/* PASSWORD */}
                                <div className="relative">

                                    <Lock
                                        className={`absolute left-4 top-4 w-5 h-5 ${focusedInput === "password"
                                            ? "text-lime-500"
                                            : "text-zinc-400"
                                            }`}
                                    />

                                    <Input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        onFocus={() =>
                                            setFocusedInput("password")
                                        }
                                        onBlur={() =>
                                            setFocusedInput(null)
                                        }
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-4 top-4"
                                    >
                                        {showPassword ? (
                                            <Eye className="w-5 h-5 text-zinc-400" />
                                        ) : (
                                            <EyeOff className="w-5 h-5 text-zinc-400" />
                                        )}
                                    </button>

                                </div>

                                {/* FORGOT PASSWORD */}
                                <div className="flex justify-end">

                                    <Link
                                        href="/forgot-password"
                                        className="text-sm text-zinc-500 hover:text-lime-600 transition"
                                    >
                                        Forgot password?
                                    </Link>

                                </div>

                                {/* BUTTON */}
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isLoading}
                                    className="w-full h-14 rounded-xl bg-lime-500 hover:bg-lime-600 text-white font-semibold flex items-center justify-center gap-2 transition"
                                >

                                    <AnimatePresence mode="wait">

                                        {isLoading ? (
                                            <motion.div
                                                key="loading"
                                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                                            />
                                        ) : (
                                            <motion.div
                                                key="text"
                                                className="flex items-center gap-2"
                                            >
                                                Sign In
                                                <ArrowRight className="w-4 h-4" />
                                            </motion.div>
                                        )}

                                    </AnimatePresence>

                                </motion.button>

                                {/* DIVIDER */}
                                <div className="flex items-center gap-4">

                                    <div className="flex-1 h-px bg-zinc-200" />

                                    <span className="text-zinc-400 text-sm">
                                        or
                                    </span>

                                    <div className="flex-1 h-px bg-zinc-200" />

                                </div>

                                {/* GOOGLE */}
                                <GoogleLogin
                                    onSuccess={(credentialResponse) => {

                                        if (!credentialResponse.credential)
                                            return

                                        const user =
                                            jwtDecode<GoogleUser>(
                                                credentialResponse.credential
                                            )

                                        setEmail(user.email)

                                        toast.success(
                                            "Email loaded from Google"
                                        )
                                    }}

                                    onError={() => {

                                        toast.error(
                                            "Google Login Failed"
                                        )

                                    }}
                                />

                                {/* SIGNUP */}
                                <p className="text-center text-zinc-500 text-sm">

                                    Don't have an account?{" "}

                                    <Link
                                        href="/sign-up"
                                    >
                                        Sign Up
                                    </Link>

                                </p>

                            </form>

                        </div>

                    </motion.div>

                </motion.div>

            </div>

        </div>
    )
}