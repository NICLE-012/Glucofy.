"use client"
import Sidebar from "../sidebar/page"
import { useRouter } from "next/navigation"

import {
    Bell,
    Flame,
    Trophy,
    Lightbulb,
    TrendingUp,
    ChevronRight,
    Scale,
    Ruler,
} from "lucide-react"

import { useEffect, useState } from "react"


export default function HabitMonitoringPage() {

    const router = useRouter()
    const [weight, setWeight] = useState("")
    const [height, setHeight] = useState("")
    const [profileError, setProfileError] = useState("")
    const [showPremiumModal, setShowPremiumModal] = useState(false)

    const [history, setHistory] = useState<any[]>([])
    const [isPremium, setIsPremium] = useState(false)

    useEffect(() => {

        checkPremiumStatus()

    }, [])

    useEffect(() => {

        const fetchHistory = async () => {

            try {

                const token =
                    localStorage.getItem("token")

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/nutrition/history`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                const data = await response.json()

                console.log("HABIT HISTORY:", data)

                setHistory(
                    Array.isArray(data)
                        ? data
                        : data.data || []
                )
            } catch (error) {

                console.error(error)

            }

        }

        fetchHistory()

    }, [])

    const checkPremiumStatus = async () => {

        try {

            const token = localStorage.getItem("token")

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/subscription/status`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            const result = await response.json()

            setIsPremium(result.premium === true)

        } catch (error) {

            console.error(error)

        }

    }

    const DAILY_LIMIT = 25

    const today = new Date()

    const todayString =
        `${today.getFullYear()}-${String(
            today.getMonth() + 1
        ).padStart(2, "0")}-${String(
            today.getDate()
        ).padStart(2, "0")}`

    const todayHistory = history.filter(
        item => {

            const date =
                new Date(item.consumedAt)

            const itemDate =
                `${date.getFullYear()}-${String(
                    date.getMonth() + 1
                ).padStart(2, "0")}-${String(
                    date.getDate()
                ).padStart(2, "0")}`

            return itemDate === todayString

        }
    )

    console.log("HISTORY:", history)
    const totalSugar =
        todayHistory.reduce(
            (total, item) =>
                total + Number(item.sugar || 0),
            0
        )

    let averageSugar = 0

    if (todayHistory.length > 0) {
        averageSugar = Number(
            (
                totalSugar /
                todayHistory.length
            ).toFixed(1)
        )
    }

    let grade = "A"

    if (averageSugar >= 10) {
        grade = "D"
    }
    else if (averageSugar >= 5) {
        grade = "C"
    }
    else if (averageSugar >= 1) {
        grade = "B"
    }

    const insight =
        grade === "A"
            ? "Excellent sugar control 🎉"
            : grade === "B"
                ? "Good consistency 👍"
                : grade === "C"
                    ? "Need improvement ⚠️"
                    : "High sugar intake 🚨"


    {/* apii */ }
    const getLocalDate = (date: string) => {
        const d = new Date(date)

        return `${d.getFullYear()}-${String(
            d.getMonth() + 1
        ).padStart(2, "0")}-${String(
            d.getDate()
        ).padStart(2, "0")}`
    }

    const trackedDays = [
        ...new Set(
            history.map(item =>
                getLocalDate(item.createdAt)
            )
        )
    ].sort(
        (a, b) =>
            new Date(b).getTime() -
            new Date(a).getTime()
    )

    let streak = 0

    for (let i = 0; i < trackedDays.length; i++) {

        const current = new Date(trackedDays[i])

        const expected = new Date(trackedDays[0])

        expected.setDate(
            expected.getDate() - i
        )

        const currentDate = trackedDays[i]

        const expectedDate =
            `${expected.getFullYear()}-${String(
                expected.getMonth() + 1
            ).padStart(2, "0")}-${String(
                expected.getDate()
            ).padStart(2, "0")}`

        if (currentDate === expectedDate) {
            streak++
        } else {
            break
        }

    }

    const weekDays = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ]

    const weeklyTrackedDays = [
        ...new Set(
            history.map(item =>
                getLocalDate(item.createdAt)
            )
        )
    ]


    const currentWeek = weekDays.map((day, index) => {

        const today = new Date()

        const startOfWeek = new Date(today)

        startOfWeek.setDate(
            today.getDate() - today.getDay()
        )

        const currentDate = new Date(startOfWeek)

        currentDate.setDate(
            startOfWeek.getDate() + index
        )

        const dateString =
            currentDate.toISOString().split("T")[0]

        return {
            day,
            active: weeklyTrackedDays.includes(dateString)
        }

    })

    const weeklyActiveDays =
        currentWeek.filter(
            day => day.active
        ).length

    const consistency =
        Math.round(
            (weeklyActiveDays / 7) * 100
        )


    return (
        <>
            <Sidebar />

            <main className="xl:ml-64 min-h-screen bg-white">
                <div className="p-6 lg:p-8">
                    <div className="w-full space-y-6">

                        {/* HEADER */}
                        <div className="flex justify-end md:justify-start">
                            <div>
                                <h1 className="
            text-3xl
            md:text-4xl
            font-bold
            text-zinc-900
            text-right
            md:text-left
        ">
                                    Habit Monitoring
                                </h1>

                                <p className="
            text-zinc-500
            mt-2
            text-right
            md:text-left
        ">
                                    Track your sugar habits and build a healthier lifestyle
                                </p>
                            </div>
                        </div>
                        {/* HERO SECTION */}
                        <div className="grid md:grid-cols-2 gap-6">

                            {/* STREAK */}
                            <div className="bg-white border border-orange-100 rounded-[32px] p-8 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="px-4 py-2 bg-orange-50 text-orange-500 rounded-full text-sm font-semibold">
                                        Keep it up!
                                    </span>
                                </div>

                                <div className="flex flex-row items-center gap-8">

                                    <div className="w-52 h-52 rounded-full bg-orange-50 flex items-center justify-center">
                                        <Flame
                                            className="w-28 h-28 text-orange-500"
                                            fill="currentColor"
                                        />
                                    </div>

                                    <div>
                                        <h2 className="text-8xl font-bold text-orange-500">
                                            {streak}
                                        </h2>

                                        <h3 className="text-4xl font-bold text-zinc-900">
                                            Days Streak
                                        </h3>

                                        <p className="text-zinc-500 mt-3 text-lg">
                                            You're doing amazing!
                                        </p>

                                        <p className="text-zinc-400">
                                            Consistency is the key ✨
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* WEEKLY */}
                            <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm">

                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold text-zinc-900">
                                        This Week
                                    </h2>

                                    <div className="px-4 py-2 rounded-full bg-lime-100 text-lime-700 text-sm font-semibold">
                                        {consistency}% consistency
                                    </div>
                                </div>

                                <div className="grid grid-cols-7 gap-3">
                                    {currentWeek.map((item) => (
                                        <div
                                            key={item.day}
                                            className="flex flex-col items-center gap-3"
                                        >
                                            <span className="text-zinc-600 font-medium">
                                                {item.day}
                                            </span>

                                            <div
                                                className={`w-16 h-16 rounded-2xl border flex items-center justify-center ${item.active
                                                    ? "bg-orange-50 border-orange-100"
                                                    : "bg-white border-zinc-200"
                                                    }`}
                                            >
                                                <Flame
                                                    className={`w-8 h-8 ${item.active
                                                        ? "text-orange-500"
                                                        : "text-zinc-400"
                                                        }`}
                                                    fill={item.active ? "currentColor" : "none"}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-10">
                                    <div className="h-3 bg-zinc-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-lime-500 rounded-full"
                                            style={{
                                                width: `${consistency}%`
                                            }}
                                        />
                                    </div>
                                    <div className="flex justify-end mt-2 text-zinc-500 text-sm">
                                        {weeklyActiveDays} of 7 days
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* STATS */}
                        <div className="grid grid-cols-2 gap-6">

                            {/* SUGAR */}
                            <div className="bg-white border border-zinc-100 rounded-[28px] p-6 shadow-sm">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-lime-50 flex items-center justify-center">
                                        <TrendingUp className="w-8 h-8 text-lime-500" />
                                    </div>

                                    <div>
                                        <p className="text-zinc-500">
                                            Avg Daily Sugar
                                        </p>

                                        <h2 className="text-6xl font-bold text-lime-500">
                                            {averageSugar}g
                                        </h2>
                                    </div>
                                </div>

                                <p className="text-zinc-500">
                                    This week average
                                </p>
                            </div>

                            {/* GRADE */}
                            <div className="bg-white border border-zinc-100 rounded-[28px] p-6 shadow-sm">
                                <div className="inline-flex px-3 py-1 rounded-full bg-orange-50 text-orange-500 text-xs font-semibold mb-4">
                                    High Sugar Level
                                </div>

                                <h2 className="text-7xl font-bold text-orange-500">
                                    {grade}
                                </h2>

                                <p className="text-zinc-500 text-xl font-semibold">
                                    Current Grade
                                </p>

                                <div className="flex mt-6 rounded-full overflow-hidden h-3">
                                    <div className="flex-1 bg-lime-500" />
                                    <div className="flex-1 bg-lime-300" />
                                    <div className="flex-1 bg-yellow-300" />
                                    <div className="flex-1 bg-orange-300" />
                                    <div className="flex-1 bg-orange-600" />
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* SUGAR INSIGHT */}
                    <div
                        onClick={() => {

                            localStorage.setItem(
                                "healthProfile",
                                JSON.stringify({
                                    weight,
                                    height
                                })
                            )

                            if (isPremium) {
                                window.location.href =
                                    "/HabbitMonitor/withAi"
                            } else {
                                setShowPremiumModal(true)
                            }

                        }}
                        className="
        mt-8
        bg-[#FFF4E8]
        border
        border-orange-100
        rounded-3xl
        px-6
        py-5
        shadow-sm
        flex
        items-center
        justify-between
        cursor-pointer
        hover:shadow-md
        transition
    "
                    >
                        <div className="flex items-center gap-4">

                            <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                                <Lightbulb className="w-7 h-7 text-orange-500" />
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-zinc-700 leading-tight">
                                    {insight}
                                </h3>

                                <p className="text-zinc-500 text-lg leading-tight mt-1">
                                    Let's keep improving for a healthier you!
                                </p>
                            </div>

                        </div>

                        <ChevronRight className="w-6 h-6 text-zinc-400 shrink-0 ml-4" />
                    </div>

                    {/* RECOMMENDATION */}
                    <div className="mt-8 bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm">

                        <h2 className="text-3xl font-bold text-zinc-900">
                            Personal Insight & Recommendation
                        </h2>

                        <p className="text-zinc-500 mt-2">
                            Get personalized recommendations based on your profile.
                        </p>

                        <div className="grid xl:grid-cols-[1fr_1fr_320px] gap-6 mt-8">

                            <div>
                                <label className="block text-sm text-zinc-500 mb-2">
                                    Weight (kg)
                                </label>

                                <div className="h-14 border border-zinc-200 rounded-2xl px-4 flex items-center gap-3">
                                    <Scale className="w-5 h-5 text-lime-500" />
                                    <input
                                        value={weight}
                                        onChange={(e) => {
                                            setWeight(e.target.value)
                                            setProfileError("")
                                        }}
                                        placeholder="60"
                                        className="w-full outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-zinc-500 mb-2">
                                    Height (cm)
                                </label>

                                <div className="h-14 border border-zinc-200 rounded-2xl px-4 flex items-center gap-3">
                                    <Ruler className="w-5 h-5 text-lime-500" />
                                    <input
                                        value={height}
                                        onChange={(e) => {
                                            setHeight(e.target.value)
                                            setProfileError("")
                                        }}
                                        placeholder="167"
                                        className="w-full outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col justify-end">

                                {profileError && (
                                    <p className="
            text-red-500
            text-sm
            mb-3
            text-center
        ">
                                        Please fill in your weight and height first.
                                    </p>
                                )}

                                <button
                                    onClick={() => {

                                        if (!weight || !height) {

                                            setProfileError(
                                                "Please fill in your weight and height first."
                                            )

                                            return

                                        }

                                        if (isPremium) {

                                            console.log(
                                                "SAVE PROFILE",
                                                {
                                                    weight,
                                                    height
                                                }
                                            )

                                            localStorage.setItem(
                                                "healthProfile",
                                                JSON.stringify({
                                                    weight,
                                                    height
                                                })
                                            )

                                            window.location.href =
                                                "/HabbitMonitor/withAi"

                                            return

                                        }
                                        setShowPremiumModal(true)

                                    }}
                                    className="
            w-full
            h-14
            bg-lime-500
            hover:bg-lime-600
            transition
            text-white
            font-semibold
            rounded-2xl
        "
                                >
                                    Get Smart Recommendation
                                </button>

                            </div>
                        </div>
                    </div>
                </div>


                {showPremiumModal && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

                        <div className="w-full max-w-2xl bg-white rounded-[32px] overflow-hidden shadow-2xl">

                            {/* HEADER */}
                            <div className="bg-gradient-to-r from-lime-400 to-lime-500 px-8 py-8">

                                <div className="flex items-center gap-5">

                                    <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center text-6xl">
                                        👑
                                    </div>

                                    <div className="text-white">

                                        <h2 className="text-3xl font-bold">
                                            Premium Feature
                                        </h2>

                                        <p className="mt-2 text-white/90 text-base">
                                            Smart Recommendation hanya tersedia
                                            untuk Premium Member.
                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* CONTENT */}
                            <div className="p-8">

                                <div className="space-y-5">

                                    <div className="flex items-center gap-4 pb-4 border-b border-zinc-100">

                                        <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-2xl">
                                            🤖
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-bold text-zinc-900">
                                                AI Personalized Insight
                                            </h3>

                                            <p className="text-sm text-zinc-500">
                                                Rekomendasi cerdas sesuai kebutuhanmu.
                                            </p>
                                        </div>

                                    </div>

                                    <div className="flex items-center gap-4 pb-4 border-b border-zinc-100">

                                        <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-2xl">
                                            📊
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-bold text-zinc-900">
                                                Nutrition Analysis
                                            </h3>

                                            <p className="text-sm text-zinc-500">
                                                Analisis nutrisi lengkap dan akurat.
                                            </p>
                                        </div>

                                    </div>

                                    <div className="flex items-center gap-4 pb-4 border-b border-zinc-100">

                                        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-2xl">
                                            🍎
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-bold text-zinc-900">
                                                Food Recommendation
                                            </h3>

                                            <p className="text-sm text-zinc-500">
                                                Saran makanan sehat yang tepat.
                                            </p>
                                        </div>

                                    </div>

                                    <div className="flex items-center gap-4">

                                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl">
                                            ♾️
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-bold text-zinc-900">
                                                Unlimited Access
                                            </h3>

                                            <p className="text-sm text-zinc-500">
                                                Akses semua fitur premium tanpa batas.
                                            </p>
                                        </div>

                                    </div>

                                </div>

                                {/* BUTTONS */}
                                <div className="mt-8 space-y-3">

                                    <button
                                        onClick={() => {
                                            router.push("/premium")

                                        }}
                                        className="
                            w-full
                            h-14
                            rounded-2xl
                            bg-gradient-to-r
                            from-lime-500
                            to-green-500
                            text-white
                            text-lg
                            font-semibold
                            hover:opacity-90
                            transition
                        "
                                    >
                                        👑 Upgrade to Premium
                                    </button>

                                    <button
                                        onClick={() => setShowPremiumModal(false)}
                                        className="
                            w-full
                            h-14
                            rounded-2xl
                            border
                            border-lime-500
                            text-lime-600
                            font-semibold
                            hover:bg-lime-50
                            transition
                        "
                                    >
                                        Maybe Later
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>
                )}

            </main >
        </>
    )
}