"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Check
} from "lucide-react"

import {
    motion,
    AnimatePresence
} from "framer-motion"

export default function ResetPassword() {

    const router = useRouter()

    const [newPassword, setNewPassword] =
        useState("")

    const [confirmPassword, setConfirmPassword] =
        useState("")

    const [showPassword, setShowPassword] =
        useState(false)

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false)

    const [loading, setLoading] =
        useState(false)

    const handleResetPassword = async () => {

        if (!newPassword.trim()) {

            toast.error(
                "Please enter a new password"
            )

            return

        }

        if (
            !passwordChecks.length ||
            !passwordChecks.lowercase ||
            !passwordChecks.uppercase ||
            !passwordChecks.number ||
            !passwordChecks.special
        ) {

            toast.error(
                "Password does not meet requirements"
            )

            return

        }

        if (newPassword !== confirmPassword) {

            toast.error(
                "Passwords do not match"
            )

            return

        }

        try {

            setLoading(true)

            const token =
                localStorage.getItem(
                    "resetToken"
                )

            if (!token) {

                toast.error(
                    "Reset session not found"
                )

                return

            }

            const response =
                await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            token,
                            newPassword,
                            confirmPassword
                        })
                    }
                )

            const data =
                await response.json()

            console.log(
                "RESET RESPONSE:",
                data
            )

            if (!response.ok) {

                toast.error(
                    data.message ||
                    "Failed to reset password"
                )

                return

            }

            localStorage.removeItem(
                "resetEmail"
            )

            localStorage.removeItem(
                "resetOtp"
            )

            localStorage.removeItem(
                "resetToken"
            )

            toast.success(
                "Password changed successfully"
            )

            setTimeout(() => {

                router.push(
                    "/sign-in"
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

    const Requirement = ({
        valid,
        text
    }: {
        valid: boolean
        text: string
    }) => (

        <div className="flex items-center gap-3">

            <div
                className={`
                w-5
                h-5
                rounded
                border
                flex
                items-center
                justify-center
                transition-all
                duration-300
                ${valid
                        ? "bg-lime-500 border-lime-500"
                        : "border-zinc-300"
                    }
            `}
            >

                <AnimatePresence>

                    {valid && (

                        <motion.div
                            initial={{
                                scale: 0
                            }}
                            animate={{
                                scale: 1
                            }}
                            exit={{
                                scale: 0
                            }}
                            transition={{
                                duration: 0.15
                            }}
                        >

                            <Check
                                size={12}
                                className="text-white"
                            />

                        </motion.div>

                    )}

                </AnimatePresence>

            </div>

            <span
                className={`
                text-sm
                transition-all
                ${valid
                        ? "text-zinc-800"
                        : "text-zinc-400"
                    }
            `}
            >
                {text}
            </span>

        </div>
    )

    const passwordChecks = {
        length: newPassword.length >= 8,
        lowercase: /[a-z]/.test(newPassword),
        uppercase: /[A-Z]/.test(newPassword),
        number: /[0-9]/.test(newPassword),
        special: /[^A-Za-z0-9]/.test(newPassword)
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
                        Create New Password
                    </h1>

                    <p className="text-zinc-400 text-xl mt-4 text-center">
                        Secure your account with a
                        stronger password.
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

                            <h1 className="text-4xl font-bold">
                                Reset Password
                            </h1>

                            <p className="text-zinc-500 mt-3">
                                Enter your new password
                            </p>

                        </div>

                        {/* NEW PASSWORD */}
                        <div className="relative mb-5">

                            <Lock
                                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-zinc-400
                "
                            />

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(
                                        e.target.value
                                    )
                                }
                                className="
                  w-full
                  h-14
                  border
                  border-zinc-200
                  rounded-xl
                  pl-12
                  pr-12
                  focus:border-lime-500
                  focus:ring-4
                  focus:ring-lime-100
                  outline-none
                "
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                "
                            >

                                {showPassword
                                    ? <Eye />
                                    : <EyeOff />}

                            </button>

                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div className="relative mb-5">

                            <Lock
                                className="
        absolute
        left-4
        top-1/2
        -translate-y-1/2
        text-zinc-400
    "
                            />

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                                className="
        w-full
        h-14
        border
        border-zinc-200
        rounded-xl
        pl-12
        pr-12
        focus:border-lime-500
        focus:ring-4
        focus:ring-lime-100
        outline-none
    "
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                                className="
        absolute
        right-4
        top-1/2
        -translate-y-1/2
    "
                            >
                                {showConfirmPassword
                                    ? <Eye />
                                    : <EyeOff />}
                            </button>

                        </div>

                        {/* PASSWORD REQUIREMENTS */}
                        <div className="space-y-3 mb-8">

                            <Requirement
                                valid={passwordChecks.length}
                                text="At least 8 characters"
                            />

                            <Requirement
                                valid={
                                    passwordChecks.uppercase &&
                                    passwordChecks.lowercase
                                }
                                text="Upper and lowercase letters"
                            />

                            <Requirement
                                valid={passwordChecks.number}
                                text="At least one number"
                            />

                            <Requirement
                                valid={passwordChecks.special}
                                text="At least one special character"
                            />

                            <Requirement
                                valid={
                                    confirmPassword.length > 0 &&
                                    confirmPassword === newPassword
                                }
                                text="Passwords match"
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
                            onClick={
                                handleResetPassword
                            }
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
              "
                        >

                            <AnimatePresence mode="wait">

                                {loading ? (

                                    <div
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

                                    <>
                                        Reset Password
                                        <ArrowRight
                                            size={18}
                                        />
                                    </>

                                )}

                            </AnimatePresence>

                        </motion.button>

                    </div>

                </motion.div>

            </div>

        </div>
    )
}