"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"

import {
    Mail,
    ArrowRight
} from "lucide-react"

import {
    motion,
    AnimatePresence
} from "framer-motion"

export default function ForgotPassword() {

    const router = useRouter()

    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSendOtp = async () => {

        if (!email.trim()) {

            toast.error(
                "Please enter your email"
            )

            return

        }

        try {

            setLoading(true)

            const response =
                await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/otp/send`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            email
                        })
                    }
                )

            const data =
                await response.json()

            if (!response.ok) {

                toast.error(
                    data.message ||
                    "Failed to send OTP"
                )

                return

            }

            localStorage.setItem(
                "resetEmail",
                email
            )

            toast.success(
                "OTP sent successfully"
            )

            setTimeout(() => {

                router.push(
                    "/verify-otp"
                )

            }, 800)

        } catch (error) {

            console.error(error)

            toast.error(
                "Something went wrong"
            )

        } finally {

            setLoading(false)

        }

    }
    return (
        <div className="min-h-screen flex">

            {/* LEFT */}
            <div className="hidden lg:flex w-1/2 bg-black relative overflow-hidden items-center justify-center">

                <div className="absolute w-[500px] h-[500px] rounded-full bg-lime-500/20 blur-[120px]" />

                <div className="relative z-10 flex flex-col items-center px-12">

                    <img
                        src="/glucofy-logo.png"
                        alt="Glucofy"
                        className="w-80"
                    />

                    <h1 className="text-white text-5xl font-bold mt-8">
                        Forgot Password
                    </h1>

                    <p className="text-zinc-400 text-xl mt-4 text-center">
                        Don't worry, we'll help you recover your account.
                    </p>

                </div>

            </div>

            {/* RIGHT */}
            <div className="w-full lg:w-1/2 bg-[#f8fafc] flex items-center justify-center px-6">

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 40
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    transition={{
                        duration: 0.7
                    }}
                    className="w-full max-w-lg"
                >

                    <div className="bg-white rounded-[32px] border border-zinc-200 shadow-xl p-10">

                        {/* HEADER */}
                        <div className="text-center mb-8">

                            <h1 className="text-4xl font-bold text-zinc-900">
                                Forgot Password
                            </h1>

                            <p className="text-zinc-500 mt-3">
                                Enter your email to receive an OTP code
                            </p>

                        </div>

                        {/* EMAIL */}
                        <div className="relative mb-6">

                            <Mail
                                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-zinc-400
                "
                            />

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                className="
                  w-full
                  h-14
                  bg-white
                  border
                  border-zinc-200
                  rounded-xl
                  pl-12
                  pr-4
                  outline-none
                  focus:border-lime-500
                  focus:ring-4
                  focus:ring-lime-100
                "
                            />

                        </div>

                        {/* BUTTON */}
                        <motion.button
                            whileHover={{
                                scale: 1.02
                            }}
                            whileTap={{
                                scale: 0.98
                            }}
                            onClick={handleSendOtp}
                            disabled={loading}
                            className="
                w-full
                h-14
                rounded-xl
                bg-lime-500
                hover:bg-lime-600
                text-white
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                transition
              "
                        >

                            <AnimatePresence mode="wait">

                                {loading ? (

                                    <motion.div
                                        key="loading"
                                        className="
                      w-5
                      h-5
                      border-2
                      border-white
                      border-t-transparent
                      rounded-full
                      animate-spin
                    "
                                    />

                                ) : (

                                    <motion.div
                                        key="text"
                                        className="
                      flex
                      items-center
                      gap-2
                    "
                                    >
                                        Send OTP
                                        <ArrowRight
                                            className="w-4 h-4"
                                        />
                                    </motion.div>

                                )}

                            </AnimatePresence>

                        </motion.button>

                        {/* BACK */}
                        <div className="mt-6 text-center">

                            <Link
                                href="/sign-in"
                                className="
                  text-zinc-500
                  hover:text-lime-600
                  transition
                "
                            >
                                Back to Login
                            </Link>

                        </div>

                    </div>

                </motion.div>

            </div>

        </div>
    )
}