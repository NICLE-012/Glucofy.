"use client"

import Sidebar from "@/app/sidebar/page"
import { ArrowLeft, Lightbulb, Search } from "lucide-react"
import { useEffect, useState } from "react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts"


export default function NoAiPage() {


    const [history, setHistory] = useState([])

    useEffect(() => {

        const fetchHistory = async () => {

            const token =
                localStorage.getItem("token")

            const today = new Date()

            const formattedDate =
                `${today.getFullYear()}-${String(
                    today.getMonth() + 1
                ).padStart(2, "0")}-${String(
                    today.getDate()
                ).padStart(2, "0")}`

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/nutrition/history?date=${formattedDate}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            const data = await response.json()

            setHistory(
                Array.isArray(data)
                    ? data
                    : data.data || []
            )
        }

        fetchHistory()

    }, [])


    const todayHistory = history

    const sugarByTime = {
        morning: 0,
        afternoon: 0,
        evening: 0,
        night: 0
    }



    todayHistory.forEach((item: any) => {

        const hour = new Date(
            item.consumedAt
        ).getHours()

        const sugar = Number(
            item.sugar || 0
        )

        if (hour >= 5 && hour < 11) {
            sugarByTime.morning += sugar
        }

        else if (hour >= 11 && hour < 15) {
            sugarByTime.afternoon += sugar
        }

        else if (hour >= 15 && hour < 19) {
            sugarByTime.evening += sugar
        }

        else {
            sugarByTime.night += sugar
        }

    })

    const chartData = [
        {
            time: "Morning",
            sugar: sugarByTime.morning
        },
        {
            time: "Afternoon",
            sugar: sugarByTime.afternoon
        },
        {
            time: "Evening",
            sugar: sugarByTime.evening
        },
        {
            time: "Night",
            sugar: sugarByTime.night
        }
    ]

    const colors = [
        "#56C000",
        "#98E24A",
        "#EFD547",
        "#F79431"
    ]

    const highestPeriod = Object.entries(
        sugarByTime
    ).sort(
        (a, b) => Number(b[1]) - Number(a[1])
    )[0]

    const dominantTime =
        highestPeriod?.[0] || "morning"

    const totalSugarToday =
        todayHistory.reduce(
            (total: number, item: any) =>
                total +
                Number(item.sugar || 0),
            0
        )

    const dominantPercentage =
        totalSugarToday === 0
            ? 0
            : Math.round(
                (Number(highestPeriod?.[1] || 0) /
                    totalSugarToday) *
                100
            )

    const totalSugar = history.reduce(
        (total: number, item: any) =>
            total + Number(item.sugar || 0),
        0
    )

    const averageSugar =
        history.length === 0
            ? 0
            : Number(
                (
                    totalSugar /
                    history.length
                ).toFixed(1)
            )

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

    let quickTips: string[] = []

    if (grade === "A") {
        quickTips = [
            "🌟 Excellent sugar control",
            "💧 Keep choosing water",
            "🥗 Maintain your healthy habits"
        ]
    }
    else if (grade === "B") {
        quickTips = [
            "👍 Good consistency",
            "🍎 Reduce sweet snacks occasionally",
            "🚶 Stay active daily"
        ]
    }
    else if (grade === "C") {
        quickTips = [
            "⚠️ Reduce sugary drinks",
            "🍇 Choose fruits instead of candy",
            "💧 Increase water intake"
        ]
    }
    else {
        quickTips = [
            "🚨 High sugar intake detected",
            "❌ Avoid sweet beverages today",
            "🥗 Focus on low-sugar foods"
        ]
    }

    if (dominantTime === "night") {
        quickTips.push(
            "🌙 Avoid sugary snacks before sleep"
        )
    }

    if (dominantTime === "evening") {
        quickTips.push(
            "🌇 Consider lighter evening snacks"
        )
    }

    if (dominantTime === "afternoon") {
        quickTips.push(
            "☀️ Watch sugar intake during lunch"
        )
    }

    const periodLabel: Record<string, string> = {
        morning: "Morning",
        afternoon: "Afternoon",
        evening: "Evening",
        night: "Night"
    }

    const keyFinding =
        totalSugarToday === 0
            ? "No sugar intake recorded today."
            : `${dominantPercentage}% of today's sugar intake happened during ${periodLabel[dominantTime]}.`

   return (
    <>
        <Sidebar />

        <main className="xl:ml-64 min-h-screen bg-[#F8F8F8] px-6 py-8">

            <button
                onClick={() => window.history.back()}
                className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center"
            >
                <ArrowLeft size={28} />
            </button>

            <div className="max-w-4xl mx-auto mt-12">

                <div className="flex items-center gap-6">
                    <img
                        src="/glucofy-logo.png"
                        alt="logo"
                        className="w-24 h-24"
                    />

                    <div>
                        <h1 className="text-5xl font-bold text-zinc-700">
                            Your Sugar
                        </h1>

                        <h1 className="text-5xl font-bold text-zinc-700">
                            Intake Analysis
                        </h1>
                    </div>
                </div>

                <p className="mt-6 text-xl text-zinc-500 max-w-2xl">
                    Konsumsi gula kamu dalam beberapa hari terakhir menunjukkan
                    kecenderungan mendekati batas harian.
                </p>

                {/* KEY FINDING */}

                <div className="mt-12 bg-white rounded-[32px] p-8 shadow-sm">

                    <div className="flex items-center gap-4 mb-6">
                        <Search className="text-orange-500 w-10 h-10" />

                        <h2 className="text-4xl font-bold text-zinc-700">
                            Key Finding
                        </h2>
                    </div>

                    <p className="text-zinc-500 text-xl">
                        {keyFinding}
                    </p>
                    <div className="mt-10 w-full h-[300px]">

                        <ResponsiveContainer
                            width="99%"
                            height={300}
                        >
                            <BarChart data={chartData}>

                                <XAxis dataKey="time" />

                                <YAxis />

                                <Tooltip />

                                <Bar
                                    dataKey="sugar"
                                    radius={[12, 12, 0, 0]}
                                >

                                    {chartData.map((entry, index) => (

                                        <Cell
                                            key={index}
                                            fill={
                                                colors[
                                                index %
                                                colors.length
                                                ]
                                            }
                                        />

                                    ))}

                                </Bar>
                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </div>

                {/* QUICK TIPS */}

                <div className="mt-10 bg-white rounded-[32px] p-8 shadow-sm">

                    <div className="flex items-center gap-4 mb-8">

                        <Lightbulb className="text-lime-500 w-10 h-10" />

                        <h2 className="text-4xl font-bold text-zinc-700">
                            Quick Tips
                        </h2>

                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {quickTips.map((tip, index) => (
                            <div
                                key={index}
                                className={`
                rounded-2xl
                p-5
                ${index % 2 === 0
                                        ? "bg-lime-50"
                                        : "bg-orange-50"
                                    }
            `}
                            >
                                {tip}
                            </div>
                        ))}
                    </div>

                </div>

            </div>

        </main>
        </>
    )
}