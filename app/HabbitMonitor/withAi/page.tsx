"use client"

import Sidebar from "@/app/sidebar/page"
import {
    ArrowLeft,
    Sparkles,
    Clock3,
    Droplets,
    ShieldCheck,
    Trophy,
    User,
    Target,
    ListChecks
} from "lucide-react"


import { useEffect, useState } from "react"

export default function WithAiPage() {

    const [authorized, setAuthorized] =
        useState(false)

    useEffect(() => {

        const checkPremium = async () => {

            const token =
                localStorage.getItem("token")

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/subscription/status`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            const result =
                await response.json()

            if (!result.premium) {

                window.location.replace("/premium")
                return

            }

            setAuthorized(true)

        }

        checkPremium()

    }, [])


    const [summary, setSummary] = useState("")
    const [totalSugar, setTotalSugar] = useState(0)
    const [totalScans, setTotalScans] = useState(0)

    const [history, setHistory] =
        useState<any[]>([])

    const [loading, setLoading] =
        useState(true)

    /* SUMMARY */

    useEffect(() => {

        const fetchSummary = async () => {

            try {

                const token =
                    localStorage.getItem("token")

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/summarize`,
                    {
                        method: "GET",
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                )

                const data =
                    await response.json()

                setSummary(data.summary || "")
                setTotalSugar(
                    Number(data.totalSugar || 0)
                )
                setTotalScans(
                    Number(data.totalScans || 0)
                )

            } catch (error) {

                console.error(error)

            } finally {

                setLoading(false)

            }

        }

        fetchSummary()

    }, [])

    /* HISTORY */

    useEffect(() => {

        const fetchHistory = async () => {

            try {

                const token =
                    localStorage.getItem("token")

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/nutrition/history`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                )

                const data =
                    await response.json()

                setHistory(data.data || [])

            } catch (error) {

                console.error(error)

            }

        }

        fetchHistory()

    }, [])

    const [weight, setWeight] = useState(60)
    const [height, setHeight] = useState(165)
    /* USER */
    useEffect(() => {

        const profile =
            JSON.parse(
                localStorage.getItem(
                    "healthProfile"
                ) || "{}"
            )

        if (profile.weight) {
            setWeight(Number(profile.weight))
        }

        if (profile.height) {
            setHeight(Number(profile.height))
        }

    }, [])

    /* BMI */

    const bmi =
        weight / ((height / 100) ** 2)

    const bmiLabel =
        bmi < 18.5
            ? "Underweight"
            : bmi < 25
                ? "Normal"
                : bmi < 30
                    ? "Overweight"
                    : "Obese"

    /* SUGAR BY TIME */

    const morningSugar =
        history
            .filter(item => {

                const hour =
                    new Date(
                        item.createdAt
                    ).getHours()

                return (
                    hour >= 6 &&
                    hour < 10
                )

            })
            .reduce(
                (sum, item) =>
                    sum +
                    Number(item.sugar || 0),
                0
            )

    const afternoonSugar =
        history
            .filter(item => {

                const hour =
                    new Date(
                        item.createdAt
                    ).getHours()

                return (
                    hour >= 12 &&
                    hour < 15
                )

            })
            .reduce(
                (sum, item) =>
                    sum +
                    Number(item.sugar || 0),
                0
            )

    const nightSugar =
        history
            .filter(item => {

                const hour =
                    new Date(
                        item.createdAt
                    ).getHours()

                return hour >= 18

            })
            .reduce(
                (sum, item) =>
                    sum +
                    Number(item.sugar || 0),
                0
            )

    /* DOMINANT HABIT */

    const highestTime =
        Math.max(
            morningSugar,
            afternoonSugar,
            nightSugar
        )

    let dominantTime = "Morning"

    if (
        highestTime === nightSugar &&
        nightSugar > 0
    ) {

        dominantTime = "Evening"

    }
    else if (
        highestTime === afternoonSugar &&
        afternoonSugar > 0
    ) {

        dominantTime = "Afternoon"

    }

    /* ALERT */

    let timingAlert = ""

    if (
        highestTime === nightSugar &&
        nightSugar > 20
    ) {

        timingAlert =
            "⚠️ Most of your sugar is consumed at night. This may increase blood sugar spikes before sleep."

    }
    else if (
        highestTime === morningSugar
    ) {

        timingAlert =
            "✅ Most sugar is consumed in the morning. Better energy utilization detected."

    }
    else {

        timingAlert =
            "⚠️ Afternoon sweet-snack pattern detected."

    }

    /* STATUS */

    let status = "Excellent"

    if (
        totalSugar > 75
    ) {

        status = "High"

    }
    else if (
        totalSugar > 50
    ) {

        status = "Warning"

    }
    else if (
        totalSugar > 25
    ) {

        status = "Good"

    }

    if (
        bmi >= 30
    ) {

        status = "Weight Risk"

    }

    /* TARGET */

    let targetSugar = 25

    if (
        totalSugar > 75
    ) {

        targetSugar = 20

    }
    else if (
        totalSugar > 50
    ) {

        targetSugar = 22

    }
    else if (
        totalSugar > 25
    ) {

        targetSugar = 25

    }
    else {

        targetSugar =
            Math.max(
                10,
                Math.round(
                    totalSugar + 5
                )
            )

    }

    if (
        bmi >= 30
    ) {

        targetSugar = 20

    }

    /* AI TEXT */

    const aiAnalysis =
        summary
            ? summary
                .replace(/\*\*/g, "")
                .replace(/\\n/g, "\n")
            : "Generating AI recommendation..."

    /* RISK LEVEL */

    const riskLevel =
        totalSugar > 75
            ? "Very High Risk"
            : totalSugar > 50
                ? "High Risk"
                : totalSugar > 25
                    ? "Moderate Risk"
                    : "Low Risk"

    /* TIMING CARD */

    const timingCards = [
        {
            title: "Pagi",
            time: "06.00 - 10.00",
            description:
                morningSugar > 15
                    ? "High sugar intake detected. Choose protein-rich breakfast."
                    : "Balanced morning intake.",
            active:
                dominantTime === "Morning"
        },

        {
            title: "Siang",
            time: "12.00 - 15.00",
            description:
                afternoonSugar > 15
                    ? "Frequent sweet snacks detected."
                    : "Balanced afternoon consumption.",
            active:
                dominantTime === "Afternoon"
        },

        {
            title: "Malam",
            time: "Setelah 18.00",
            description:
                nightSugar > 15
                    ? "Avoid sugary drinks before sleep."
                    : "Good evening sugar control.",
            active:
                dominantTime === "Evening"
        }
    ]

    /* RECOMMENDATION */

    const actionableRecommendations:
        string[] = []

    if (
        nightSugar > 15
    ) {

        actionableRecommendations.push(
            "🌙 Reduce sugary drinks after 6 PM"
        )

    }

    if (
        totalSugar > 25
    ) {

        actionableRecommendations.push(
            "🚨 Daily sugar exceeds WHO recommendation"
        )

    }

    if (
        bmi >= 25
    ) {

        actionableRecommendations.push(
            "🏃 Add 20-30 minutes of daily activity"
        )

    }

    if (
        morningSugar < 5
    ) {

        actionableRecommendations.push(
            "🍳 Prioritize balanced breakfast"
        )

    }

    if (
        actionableRecommendations.length === 0
    ) {

        actionableRecommendations.push(
            "🎉 Keep maintaining your healthy habits"
        )

    }

    /* ACTION PLAN */

    const actionPlan:
        string[] = []

    if (
        nightSugar > 15
    ) {

        actionPlan.push(
            "No sweet drinks after 18:00"
        )

    }

    if (
        totalSugar > 25
    ) {

        actionPlan.push(
            "Reduce sugar intake by 20% this week"
        )

    }

    if (
        bmi >= 25
    ) {

        actionPlan.push(
            "Walk 6000-8000 steps daily"
        )

    }

    actionPlan.push(
        "Continue scanning before consumption"
    )

        const hasScanData =
    history.length > 0 &&
    totalScans > 0

    if (!authorized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Checking subscription...
            </div>
        )
    }

    return (

        <main className="min-h-screen bg-[#F8F8F8] px-4 md:px-6 py-8">
            <Sidebar />
            <button
                onClick={() => window.history.back()}
                className="
                w-14 h-14
                rounded-full
                bg-white
                shadow-md
                flex
                items-center
                justify-center
            "
            >
                <ArrowLeft size={28} />
            </button>

            <div className=" max-w-5xl mx-auto mt-10">

                <div className="max-w-5xl mx-auto mt-10">

                    {/* HEADER */}

                    <div className="
        flex
        flex-col
        md:flex-row
        items-center
        justify-center
        gap-6
        mb-12
    ">
                        ...
                    </div>

                    {/* BODY PROFILE SELALU MUNCUL */}

                    <div className="
        mt-8
        grid
        md:grid-cols-3
        gap-4
    ">

                        {/* BODY PROFILE */}

                        <div className="
            bg-white
            rounded-[32px]
            p-6
            shadow-sm
        ">
                            ...
                        </div>

                        {/* PERSONAL TARGET */}

                        <div className="
            bg-white
            rounded-[32px]
            p-6
            shadow-sm
        ">
                            ...
                        </div>

                        {/* ACTION PLAN */}

                        <div className="
            bg-white
            rounded-[32px]
            p-6
            shadow-sm
        ">
                            ...
                        </div>

                    </div>

                    {/* KALAU BELUM ADA SCAN */}

                    {!hasScanData && (

                        <div
                            className="
                mt-8
                bg-white
                rounded-[32px]
                p-8
                text-center
                shadow-sm
            "
                        >

                            <Sparkles
                                className="
                    mx-auto
                    mb-4
                    text-lime-500
                "
                                size={42}
                            />

                            <h3
                                className="
                    text-2xl
                    font-bold
                    text-zinc-700
                "
                            >
                                No Scan Data Yet
                            </h3>

                            <p
                                className="
                    mt-3
                    text-zinc-500
                "
                            >
                                Scan your first nutrition label to
                                unlock AI recommendation,
                                health score,
                                behavior pattern,
                                and smart timing insights.
                            </p>

                        </div>

                    )}

                    {/* KALAU SUDAH ADA SCAN */}

                    {hasScanData && (

                        <>

                            {/* AI ANALYSIS */}

                            <div className="
                mt-10
                bg-lime-50
                rounded-[32px]
                p-6
                md:p-8
            ">
                                ...
                            </div>

                            {/* BEHAVIOR */}

                            <div className="
                mt-8
                bg-white
                rounded-[32px]
                p-6
                md:p-8
                shadow-sm
            ">
                                ...
                            </div>

                            {/* HEALTH SCORE */}

                            <div
                                className="
                    mt-8
                    bg-white
                    rounded-[32px]
                    p-6
                    shadow-sm
                "
                            >
                                ...
                            </div>

                            {/* SMART TIMING */}

                            <div
                                className="
                    mt-8
                    bg-white
                    rounded-[32px]
                    p-6
                    md:p-8
                    shadow-sm
                "
                            >
                                ...
                            </div>

                            {/* FOOTER */}

                            <div className="
                mt-8
                bg-lime-50
                rounded-3xl
                p-6
                flex
                gap-4
            ">
                                ...
                            </div>

                        </>

                    )}

                </div>
                </div>
        </main>

    )
}