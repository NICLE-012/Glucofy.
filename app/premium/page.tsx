"use client"

import Sidebar from "../sidebar/page"
import {
    ArrowLeft,
    Bot,
    BarChart3,
    Apple,
    Infinity,
    Check
} from "lucide-react"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function PremiumPage() {

    const router = useRouter()
    const [plan, setPlan] = useState("monthly")

    const features = [
        {
            icon: <Bot className="text-purple-500" />,
            title: "AI Insight",
            desc: "Personalized AI health recommendations."
        },
        {
            icon: <BarChart3 className="text-green-500" />,
            title: "Data Analysis",
            desc: "Advanced analytics for healthier decisions."
        },
        {
            icon: <Apple className="text-red-500" />,
            title: "Food Advice",
            desc: "Smart food and nutrition recommendations."
        },
        {
            icon: <Infinity className="text-blue-500" />,
            title: "Unlimited",
            desc: "Unlimited premium access and features."
        }
    ]

    return (
        <>
            <Sidebar />

            <main className="xl:ml-64 min-h-screen bg-gradient-to-br from-lime-50 via-white to-emerald-50 p-6 lg:p-8">

                <div className="max-w-6xl mx-auto relative">

                    {/* BACKGROUND GLOW */}
                    <div className="absolute top-20 right-20 w-80 h-80 bg-lime-300/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-20 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl" />

                    {/* HERO */}
                    <div className="
                        relative
                        overflow-hidden
                        rounded-[40px]
                        border
                        border-white/70
                        bg-white/70
                        backdrop-blur-xl
                        shadow-[0_8px_32px_rgba(0,0,0,0.08)]
                        p-8
                        lg:p-12
                    ">

                        <button
                            onClick={() => router.back()}
                            className="
                                w-12
                                h-12
                                rounded-2xl
                                bg-white
                                shadow-sm
                                flex
                                items-center
                                justify-center
                            "
                        >
                            <ArrowLeft size={20} />
                        </button>

                        {/* MOBILE LOGO */}
                        <div className="flex justify-center lg:hidden mt-8">

                            <img
                                src="/glucofy-logo.png"
                                alt="Glucofy"
                                className="w-36 object-contain"
                            />

                        </div>

                        <div className="grid lg:grid-cols-2 gap-12 items-center mt-6">

                            {/* LEFT */}
                            <div className="text-center lg:text-left">

                                <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">

                                    <div className="
                                        w-10
                                        h-10
                                        rounded-xl
                                        bg-lime-500
                                        flex
                                        items-center
                                        justify-center
                                        text-white
                                    ">
                                        👑
                                    </div>

                                    <span className="font-bold text-zinc-800">
                                        Health Premium
                                    </span>

                                </div>

                                <h1 className="text-5xl lg:text-6xl font-bold text-zinc-900 leading-tight">
                                    Unlock the best
                                    <br />
                                    for your health
                                </h1>

                                <p className="
                                    mt-6
                                    text-lg
                                    text-zinc-500
                                    leading-relaxed
                                    max-w-xl
                                    mx-auto
                                    lg:mx-0
                                ">
                                    Get personalized AI health recommendations,
                                    advanced insights, nutrition analysis,
                                    and exclusive premium tools designed to
                                    help you build a healthier lifestyle.
                                </p>

                                <div className="flex flex-wrap gap-3 mt-6 justify-center lg:justify-start">

                                    <span className="px-4 py-2 rounded-full bg-lime-100 text-lime-700 text-sm font-medium">
                                        🤖 AI Recommendation
                                    </span>

                                    <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                                        📊 Advanced Analytics
                                    </span>

                                    <span className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                                        🍎 Smart Nutrition
                                    </span>

                                </div>

                            </div>

                            {/* DESKTOP LOGO */}
                            <div className="hidden lg:flex justify-center">

                                <div className="relative">

                                    <div className="absolute inset-0 bg-lime-200/40 blur-3xl rounded-full" />

                                    <img
                                        src="/glucofy-logo.png"
                                        alt="Glucofy"
                                        className="relative w-[320px] object-contain"
                                    />

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* FEATURES */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">

                        {features.map((feature) => (

                            <div
                                key={feature.title}
                                className="
                                    backdrop-blur-xl
                                    bg-white/60
                                    border
                                    border-white/70
                                    rounded-3xl
                                    p-6
                                    shadow-[0_8px_32px_rgba(0,0,0,0.08)]
                                    hover:-translate-y-1
                                    transition-all
                                "
                            >

                                <div className="
                                    w-14
                                    h-14
                                    rounded-2xl
                                    bg-white
                                    flex
                                    items-center
                                    justify-center
                                    mb-4
                                ">
                                    {feature.icon}
                                </div>

                                <h3 className="font-bold text-lg">
                                    {feature.title}
                                </h3>

                                <p className="text-sm text-zinc-500 mt-2">
                                    {feature.desc}
                                </p>

                            </div>

                        ))}

                    </div>

                    {/* PLAN */}
                    <div className="grid md:grid-cols-2 gap-5 mt-8">

                        {/* MONTHLY */}
                        <button
                            onClick={() => setPlan("monthly")}
                            className={`
                                rounded-3xl
                                p-6
                                text-left
                                border-2
                                transition-all
                                duration-300
                                backdrop-blur-xl
                                bg-white/70
                                shadow-[0_8px_32px_rgba(0,0,0,0.08)]

                                ${
                                    plan === "monthly"
                                        ? "border-lime-500 scale-[1.02]"
                                        : "border-white/70 hover:border-lime-200"
                                }
                            `}
                        >

                            <div className="flex justify-between items-center">

                                <span className="text-zinc-500">
                                    Monthly
                                </span>

                                {plan === "monthly" && (
                                    <div className="w-7 h-7 rounded-full bg-lime-500 flex items-center justify-center">
                                        <Check
                                            size={14}
                                            className="text-white"
                                        />
                                    </div>
                                )}

                            </div>

                            <h2 className="text-4xl font-bold mt-3">
                                Rp 19.000
                            </h2>

                            <p className="text-zinc-500">
                                / month
                            </p>

                        </button>

                        {/* YEARLY */}
                        <button
                            onClick={() => setPlan("yearly")}
                            className={`
                                rounded-3xl
                                p-6
                                text-left
                                border-2
                                transition-all
                                duration-300
                                backdrop-blur-xl
                                bg-white/70
                                shadow-[0_8px_32px_rgba(0,0,0,0.08)]

                                ${
                                    plan === "yearly"
                                        ? "border-lime-500 scale-[1.02]"
                                        : "border-white/70 hover:border-lime-200"
                                }
                            `}
                        >

                            <div className="flex justify-between items-center">

                                <span className="text-zinc-500">
                                    Yearly
                                </span>

                                {plan === "yearly" ? (
                                    <div className="w-7 h-7 rounded-full bg-lime-500 flex items-center justify-center">
                                        <Check
                                            size={14}
                                            className="text-white"
                                        />
                                    </div>
                                ) : (
                                    <span className="bg-lime-100 text-lime-700 text-xs font-semibold px-3 py-1 rounded-full">
                                        Save 35%
                                    </span>
                                )}

                            </div>

                            <h2 className="text-4xl font-bold mt-3">
                                Rp 149.000
                            </h2>

                            <p className="text-zinc-500">
                                / year
                            </p>

                        </button>

                    </div>

                    {/* CTA */}
                    <button
                        onClick={() => {

                            localStorage.setItem(
                                "selectedPlan",
                                plan
                            )

                            router.push("/payment")

                        }}
                        className="
                            w-full
                            h-16
                            mt-6
                            rounded-3xl
                            bg-gradient-to-r
                            from-lime-500
                            to-emerald-500
                            text-white
                            text-lg
                            font-bold
                            transition
                            hover:scale-[1.01]
                            shadow-[0_10px_30px_rgba(132,204,22,0.35)]
                        "
                    >
                        Continue to Payment
                    </button>

                </div>

            </main>
        </>
    )
}