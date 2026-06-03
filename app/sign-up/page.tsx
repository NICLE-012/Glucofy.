"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { GoogleLogin } from "@react-oauth/google"
import { jwtDecode } from "jwt-decode"

import {
    motion,
    AnimatePresence,
    useMotionValue,
    useSpring
} from "framer-motion"

import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Check,
} from "lucide-react"

type GoogleUser = {
    email: string
    name: string
    picture: string
}

type InputProps =
    React.InputHTMLAttributes<HTMLInputElement>

const Input = ({
    className = "",
    ...props
}: InputProps) => {
    return (
        <input
            {...props}
            className={`w-full h-12 bg-white border border-zinc-200 rounded-xl pl-12 pr-12 text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-lime-500 focus:ring-4 focus:ring-lime-100 transition ${className}`}
        />
    )
}

export default function SignUpPage() {

    const router = useRouter()

    const [name, setName] =
        useState("")

    const [email, setEmail] =
        useState("")

    const [password, setPassword] =
        useState("")

    const passwordChecks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    }

    const [showPassword, setShowPassword] =
        useState(false)

    const [isLoading, setIsLoading] =
        useState(false)

    const [focusedInput, setFocusedInput] =
        useState<string | null>(null)

    const rotateX =
        useSpring(0)

    const rotateY =
        useSpring(0)

    const handleMouseMove = (
        e: React.MouseEvent<HTMLDivElement>
    ) => {

        const rect =
            e.currentTarget.getBoundingClientRect()

        const x =
            e.clientX -
            rect.left -
            rect.width / 2

        const y =
            e.clientY -
            rect.top -
            rect.height / 2

        rotateY.set(x / 25)
        rotateX.set(-(y / 25))

    }

    const handleMouseLeave = () => {

        rotateX.set(0)
        rotateY.set(0)

    }

    async function handleSignUp(
        e: React.FormEvent
    ) {

        e.preventDefault()

        if (!name || !email || !password) {
            toast.error("Please fill in all fields")
            return
        }

        if (
            !passwordChecks.length ||
            !passwordChecks.lowercase ||
            !passwordChecks.uppercase ||
            !passwordChecks.number ||
            !passwordChecks.special
        ) {
            toast.error("Password does not meet requirements")
            return
        }

        try {

            setIsLoading(true)

            const response =
                await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            name,
                            email,
                            password,
                        }),
                    }
                )

            const text =
                await response.text()

            let data = {}

            try {

                data =
                    text
                        ? JSON.parse(text)
                        : {}

            } catch {

                throw new Error(
                    "Invalid server response"
                )

            }

            if (!response.ok) {

                throw new Error(
                    (data as any).message ||
                    "Registration failed"
                )

            }

            toast.success(
                (data as any).message ||
                "Account created successfully"
            )

            setName("")
            setEmail("")
            setPassword("")

            setTimeout(() => {

                router.push(
                    "/sign-in"
                )

            }, 800)

        } catch (error: any) {

            console.error(error)

            toast.error(
                error.message ||
                "Unable to connect to server"
            )

        } finally {

            setIsLoading(false)

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
                w-4
                h-4
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

                {valid && (
                    <Check
                        size={10}
                        className="text-white"
                    />
                )}

            </div>

            <span
                className={`
                text-xs
                ${valid
                        ? "text-zinc-700"
                        : "text-zinc-500"
                    }
            `}
            >
                {text}
            </span>

        </div>
    )

    return (
        <div className="min-h-screen flex">

            {/* LEFT */}
            <div className="hidden lg:flex w-1/2 bg-black relative overflow-hidden items-center justify-center">

                <div className="absolute w-96 h-96 rounded-full bg-lime-500/20 blur-3xl" />

                <div className="relative z-10 flex flex-col items-center px-12">

                    <img
                        src="/glucofy-logo.png"
                        alt="Glucofy"
                        className="w-96"
                    />
                    <h1 className="text-white text-5xl font-bold mt-8">
                        Join Glucofy
                    </h1>

                    <p className="text-zinc-400 text-xl mt-4 text-center max-w-lg">
                        Know Your Sugar, Control Your Future.
                    </p>

                </div>

            </div>

            {/* RIGHT */}
            <div className="w-full lg:w-1/2 bg-[#f8fafc] flex items-center justify-center px-6">

                <motion.div
                    className="w-full max-w-xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >

                    <motion.div
                        style={{ rotateX, rotateY }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    >

                        <div className="bg-white rounded-4xl border border-zinc-200 shadow-xl p-12 w-full">

                            <div className="text-center mb-8">

                                <div className="lg:hidden flex justify-center mb-4">
                                    <img
                                        src="/glucofy-logo.png"
                                        alt="Glucofy"
                                        className="w-20"
                                    />
                                </div>

                                <h1 className="text-3xl font-bold text-zinc-900">
                                    Create Account
                                </h1>

                                <p className="text-zinc-500 mt-2">
                                    Create your Glucofy account
                                </p>

                            </div>

                            <form
                                onSubmit={handleSignUp}
                                className="space-y-5"
                            >

                                {/* NAME */}
                                <div className="relative">

                                    <User
                                        className={`absolute left-4 top-4 w-5 h-5 ${focusedInput === "name"
                                            ? "text-lime-500"
                                            : "text-zinc-400"
                                            }`}
                                    />

                                    <Input
                                        type="text"
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        onFocus={() =>
                                            setFocusedInput("name")
                                        }
                                        onBlur={() =>
                                            setFocusedInput(null)
                                        }
                                    />

                                </div>

                                {/* EMAIL */}
                                <div className="relative">

                                    <Mail
                                        className={`absolute left-4 top-4 w-5 h-5 ${focusedInput === "email"
                                            ? "text-lime-500"
                                            : "text-zinc-400"
                                            }`}
                                    />

                                    <Input
                                        type="email"
                                        placeholder="Email Address"
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

                                <div className="space-y-2 -mt-1">

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

                                </div>

                                {/* BUTTON */}
                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full h-12 rounded-xl bg-lime-500 hover:bg-lime-600 text-white font-semibold flex items-center justify-center gap-2 transition"
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
                                                Sign Up
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

                                        setName(user.name)

                                        toast.success(
                                            "Google account loaded"
                                        )
                                    }}

                                    onError={() => {

                                        toast.error(
                                            "Google Login Failed"
                                        )

                                    }}
                                />

                                <p className="text-center text-zinc-500 text-sm">

                                    Already have an account?{" "}

                                    <Link
                                        href="/sign-in"
                                        className="text-lime-600 font-semibold hover:text-lime-700"
                                    >
                                        Sign In
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