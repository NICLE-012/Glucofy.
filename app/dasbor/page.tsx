"use client"

import {
    Bell,
    ShieldAlert,
    Plus,
    ScanLine,
    ImagePlus,
    PenSquare,
} from "lucide-react"

import { AnimatePresence } from "framer-motion"
import { useRef } from "react"
import { motion } from "framer-motion"


import Link from "next/link"
import { useEffect, useState } from "react"
import Sidebar from "../sidebar/page"
import { useRouter } from "next/navigation"

type UserType = {
    name: string
    email: string
    role?: string
}

export default function DashboardPage() {

    const [selectedAction, setSelectedAction] = useState<
        "scan" | "upload" | "manual" | null
    >(null)
    const router = useRouter()

    const [openFab, setOpenFab] = useState(false)

    const fileInputRef =
        useRef<HTMLInputElement>(null)

    const [user, setUser] = useState<UserType>({
        name: "",
        email: "",
    })

    const [selectedDate, setSelectedDate] =
        useState(new Date())

    const [history, setHistory] =
        useState<any[]>([])

    const [elapsedTime, setElapsedTime] =
        useState("00:00:00")

    const [lastProduct, setLastProduct] =
        useState("")

    const [consumedAt, setConsumedAt] =
        useState<string | null>(null)

    useEffect(() => {

        const storedUser =
            localStorage.getItem("user")

        if (storedUser) {

            const parsedUser: UserType =
                JSON.parse(storedUser)

            setUser(parsedUser)
        }

    }, [])

    /* HISTORY BY DATE */


    useEffect(() => {
        const fetchHistory = async () => {
            try {

                const token =
                    localStorage.getItem("token")

                console.log("TOKEN:", token)

                if (!token) {
                    console.log("TOKEN TIDAK ADA")
                    return
                }

                const formattedDate =
                    `${selectedDate.getFullYear()}-${String(
                        selectedDate.getMonth() + 1
                    ).padStart(2, "0")}-${String(
                        selectedDate.getDate()
                    ).padStart(2, "0")}`

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/nutrition/history?date=${formattedDate}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                console.log("STATUS:", response.status)
                console.log("OK:", response.ok)

                const data = await response.json()

                console.log("HISTORY RESPONSE:", data)

                if (Array.isArray(data)) {

                    console.log(
                        "SET HISTORY DARI ARRAY"
                    )

                    setHistory(data)

                } else if (
                    data?.data &&
                    Array.isArray(data.data)
                ) {

                    console.log(
                        "SET HISTORY DARI data.data"
                    )

                    setHistory(data.data)

                } else {

                    console.log(
                        "DATA TIDAK SESUAI FORMAT"
                    )

                    setHistory([])
                }

            } catch (error) {

                console.error(
                    "HISTORY ERROR:",
                    error
                )

                setHistory([])
            }
        }

        fetchHistory()

    }, [selectedDate])

    useEffect(() => {

        if (history.length === 0) {

            setConsumedAt(null)
            setLastProduct("")
            return

        }

        const latestHistory =
            [...history].sort(
                (a, b) =>
                    new Date(b.consumedAt).getTime() -
                    new Date(a.consumedAt).getTime()
            )[0]

        setConsumedAt(
            latestHistory.consumedAt
        )

        setLastProduct(
            latestHistory.productName
        )

    }, [history])

    const container = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.15,
            },
        },
    }

    useEffect(() => {

        if (!consumedAt) return

        const updateTimer = () => {

            const consumedDate =
                new Date(consumedAt)

            const currentDate =
                new Date()

            const isSameDay =
                consumedDate.toDateString() ===
                currentDate.toDateString()

            if (!isSameDay) {

                setElapsedTime("00:00:00")
                return

            }

            const consumed =
                consumedDate.getTime()

            const now =
                Date.now()

            const diff =
                now - consumed

            const hours =
                Math.floor(diff / 3600000)

            const minutes =
                Math.floor(
                    (diff % 3600000) / 60000
                )

            const seconds =
                Math.floor(
                    (diff % 60000) / 1000
                )

            setElapsedTime(
                `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
            )

        }

        updateTimer()


        const interval =
            setInterval(
                updateTimer,
                1000
            )

        return () =>
            clearInterval(interval)

    }, [consumedAt])



    const today1 = new Date()

    const currentMonthYear =
        today1.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric",
            }
        )

    const today = new Date()

    const currentYear =
        today.getFullYear()

    const currentMonth =
        today.getMonth()

    const daysInMonth = new Date(
        currentYear,
        currentMonth + 1,
        0
    ).getDate()

    const dates = Array.from(
        { length: daysInMonth },
        (_, index) => {
            const date = new Date(
                currentYear,
                currentMonth,
                index + 1
            )

            return {
                day: index + 1,
                weekday:
                    date.toLocaleDateString(
                        "en-US",
                        {
                            weekday: "short",
                        }
                    ),
            }
        }
    )

    const DAILY_LIMIT = 25

    const totalSugar =
        history.reduce(
            (total, drink) =>
                total + Number(drink.sugar || 0),
            0
        )

    const sugarProgress =
        Math.min(
            (totalSugar / DAILY_LIMIT) * 100,
            100
        )

    const IDEAL_HOURS = 4

    const [hours, minutes, seconds] =
        elapsedTime.split(":").map(Number)

    const elapsedSeconds =
        hours * 3600 +
        minutes * 60 +
        seconds

    const maxSeconds =
        IDEAL_HOURS * 3600

    const progress =
        Math.max(
            0,
            (maxSeconds - elapsedSeconds) /
            maxSeconds
        )


    useEffect(() => {

        const savedResult =
            localStorage.getItem(
                "scanResult"
            )

        const savedType =
            localStorage.getItem(
                "scanType"
            )

        console.log(
            "SCAN TYPE:",
            savedType
        )

        console.log(
            "SCAN RESULT:",
            savedResult
        )


    }, [])

    return (

        <div className="bg-white rounded-3xl">

            {/* SIDEBAR */}
            <Sidebar />

            {/* MAIN */}
            <motion.main
                variants={container}
                initial="hidden"
                animate="show"
                className="flex-1 p-6 lg:ml-64"
            >
                {/* GREETING */}
                <div className="text-right md:text-left mb-6">

                    <motion.h1
                        className="text-5xl font-bold text-gray-700 flex items-center justify-end md:justify-start gap-2"
                    >
                        Halo,

                        <motion.span
                            className="text-lime-500"
                        >
                            {user.name || "User"}
                        </motion.span>

                    </motion.h1>

                    <motion.p
                        className="text-gray-400 text-lg mt-2"
                    >
                        Selamat datang kembali 👋
                    </motion.p>

                </div>

                {/* GRID */}
                <div className="grid xl:grid-cols-2 gap-8">

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{ duration: 0.8, type: "spring" }}
                        whileHover={{ scale: 1.03, y: -5 }}
                        className="bg-white rounded-[40px] shadow-lg p-10 flex items-center justify-center"
                    >

                        <div
                            className="w-[320px] h-80 rounded-full flex items-center justify-center relative"
                            style={{
                                background: `conic-gradient(
                                  #7ED957 0deg,
                                  #7ED957 ${progress * 360}deg,
                                  #E5E7EB ${progress * 360}deg,
                                  #E5E7EB 360deg
                                )`,
                            }}
                        >

                            <div className="absolute w-60 h-60 bg-white rounded-full" />

                            <div className="relative z-10 text-center">

                                <h1 className="text-5xl lg:text-5xl font-bold text-lime-500 leading-none">
                                    {elapsedTime}
                                </h1>

                                <div className="flex justify-center gap-6 text-sm text-gray-500 mt-4">

                                    <span>Jam</span>
                                    <span>Menit</span>
                                    <span>Detik</span>

                                </div>

                                <p className="text-gray-500 mt-6">
                                    Sejak konsumsi {lastProduct || "-"}
                                </p>

                            </div>

                        </div>

                    </motion.div>

                    {/* SUMMARY */}
                    <motion.div
                        initial={{ opacity: 0, x: 80 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{ duration: 0.7 }}
                        whileHover={{ scale: 1.03, y: -5 }}
                        className="bg-white rounded-[40px] shadow-lg p-8"
                    >
                        <div className="flex justify-between items-start mb-10">

                            <h1 className="text-4xl font-bold text-gray-600">
                                Ringkasan Hari ini
                            </h1>

                            <ShieldAlert className="w-14 h-14 text-orange-500" />

                        </div>

                        <div className="flex justify-between items-center">

                            <div>

                                <p className="text-2xl font-semibold mb-2 text-gray-500">
                                    Total Gula
                                </p>

                                <h2 className="text-[90px] font-bold text-orange-600 leading-none">
                                    {Number(totalSugar).toFixed(1)}g
                                </h2>

                            </div>

                            <div className="w-0.5 h-42.5 bg-gray-200" />

                            <div>

                                <p className="text-2xl font-semibold mb-2 text-gray-500">
                                    Batas Harian
                                </p>

                                <h2 className="text-[90px] font-bold text-lime-500 leading-none">
                                    {DAILY_LIMIT}g
                                </h2>

                            </div>

                        </div>

                        {/* PROGRESS */}
                        <div
                            className="w-full h-6 rounded-full mt-10 relative"
                            style={{
                                background:
                                    "linear-gradient(to right,#4ec000,#8ef000,#ffd84b,#ff9800,#ef5000)",
                            }}
                        >

                            <div
                                className="absolute -top-4 w-10 h-14 rounded-full bg-orange-500 border border-orange-700 shadow-md"
                                style={{
                                    left: `${sugarProgress}%`,
                                    transform: "translateX(-50%)"
                                }}
                            />

                        </div>

                    </motion.div>

                </div>

                {/* WEEK */}
                <div className="bg-white rounded-[30px] shadow-lg p-6 mt-6 overflow-hidden">

                    <div className="flex justify-between items-center mb-6">

                        <h2 className="text-2xl font-bold text-gray-600">
                            {currentMonthYear}
                        </h2>

                        <p className="text-lime-600 font-bold text-lg">
                            Weekly Overview
                        </p>

                    </div>

                    {/* SCROLL AREA */}
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">

                        {dates.map((date) => {

                            const isSelected =
                                date.day === selectedDate.getDate()

                            return (

                                <motion.div
                                    onClick={() =>
                                        setSelectedDate(
                                            new Date(
                                                currentYear,
                                                currentMonth,
                                                date.day
                                            )
                                        )
                                    }
                                    whileHover={{ y: -3 }}
                                    key={date.day}
                                    className={`w-[85px] flex-shrink-0 rounded-2xl border text-center py-4 relative cursor-pointer transition-all ${isSelected
                                        ? "border-2 border-lime-500 bg-lime-50"
                                        : "border-gray-200 bg-white"
                                        }`}
                                >

                                    <p className="text-gray-400 text-sm">
                                        {date.weekday}
                                    </p>

                                    <h3 className="text-3xl font-semibold mt-1">
                                        {date.day}
                                    </h3>

                                    {isSelected && (
                                        <div className="w-3 h-3 rounded-full bg-lime-500 absolute left-1/2 -translate-x-1/2 -bottom-1.5" />
                                    )}

                                </motion.div>


                            )
                        })}


                    </div>

                    {/* HISTORY */}
                    <div className="mt-8">

                        <h1 className="text-4xl font-bold mb-6 text-gray-600">
                            Riwayat Terbaru
                        </h1>

                        <div className="space-y-5">

                            {history.length === 0 ? (

                                <div className="bg-gray-50 rounded-[25px] p-10 text-center">

                                    <h3 className="text-2xl font-semibold text-gray-500">
                                        Belum ada riwayat
                                    </h3>

                                    <p className="text-gray-400 mt-2">
                                        Tidak ada konsumsi pada tanggal ini
                                    </p>

                                </div>

                            ) : (

                                [...history]
                                    .sort(
                                        (a, b) =>
                                            new Date(b.consumedAt).getTime() -
                                            new Date(a.consumedAt).getTime()
                                    )
                                    .map((drink, index) => (

                                        <motion.div
                                            key={index}
                                            whileHover={{ scale: 1.01 }}
                                            className="bg-white rounded-[25px] shadow-md p-6 flex justify-between items-center"
                                        >

                                            <div className="flex items-center gap-5">

                                                <div className="w-16 h-16 rounded-full bg-lime-50 flex items-center justify-center text-3xl">
                                                    🍹
                                                </div>

                                                <div>

                                                    <h2 className="text-2xl font-semibold text-gray-600">
                                                        {drink.productName}
                                                    </h2>

                                                    <p className="text-gray-500">
                                                        {new Date(
                                                            drink.consumedAt
                                                        ).toLocaleTimeString(
                                                            "id-ID",
                                                            {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            }
                                                        )}
                                                    </p>

                                                </div>

                                            </div>

                                            <div className="flex items-center gap-5">

                                                <h3 className="text-2xl font-semibold text-gray-600">
                                                    {drink.sugar}g
                                                </h3>

                                                <div
                                                    className="w-12 h-12 bg-orange-400 text-white font-bold text-xl flex items-center justify-center"
                                                    style={{
                                                        clipPath:
                                                            "polygon(25% 6%,75% 6%,100% 50%,75% 94%,25% 94%,0 50%)",
                                                    }}
                                                >
                                                    {drink.sugarGrade}
                                                </div>

                                            </div>

                                        </motion.div>

                                    ))

                            )}

                        </div>

                    </div>
                </div>

            </motion.main>

            {/* INPUT FILE */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
            />

            {/* BACKDROP */}
            <AnimatePresence>
                {openFab && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpenFab(false)}
                        className="fixed inset-0 bg-black/10 z-40"
                    />
                )}
            </AnimatePresence>

            {/* MENU */}
            <AnimatePresence>
                {openFab && (
                    <>
                        {/* SCAN */}
                        <motion.button
                            initial={{
                                opacity: 0,
                                scale: 0.5,
                            }}
                            animate={{
                                opacity: selectedAction &&
                                    selectedAction !== "scan"
                                    ? 0
                                    : 1,
                                scale:
                                    selectedAction === "scan"
                                        ? 1.25
                                        : 1,
                                x: -95,
                                y: -95,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.5,
                            }}
                            transition={{
                                duration: 0.25,
                            }}
                            onClick={() => {
                                setSelectedAction("scan")

                                setTimeout(() => {
                                    router.push("/scan")
                                }, 600)
                            }}
                            className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center"
                        >
                            <ScanLine className="w-7 h-7 text-lime-600" />
                        </motion.button>

                        {/* UPLOAD */}
                        <motion.button
                            initial={{
                                opacity: 0,
                                scale: 0.5,
                            }}
                            animate={{
                                opacity: selectedAction &&
                                    selectedAction !== "upload"
                                    ? 0
                                    : 1,
                                scale:
                                    selectedAction === "upload"
                                        ? 1.25
                                        : 1,
                                x: -130,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.5,
                            }}
                            transition={{
                                duration: 0.25,
                            }}
                            onClick={() => {
                                setSelectedAction("upload")

                                setTimeout(() => {
                                    router.push("/input")
                                }, 600)
                            }}
                            className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center"
                        >
                            <ImagePlus className="w-7 h-7 text-lime-600" />
                        </motion.button>

                        {/* MANUAL */}
                        <motion.button
                            initial={{
                                opacity: 0,
                                scale: 0.5,
                            }}
                            animate={{
                                opacity: selectedAction &&
                                    selectedAction !== "manual"
                                    ? 0
                                    : 1,
                                scale:
                                    selectedAction === "manual"
                                        ? 1.25
                                        : 1,
                                x: 0,
                                y: -130,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.5,
                            }}
                            transition={{
                                duration: 0.25,
                            }}
                            onClick={() => {
                                setSelectedAction("manual")

                                setTimeout(() => {
                                    router.push("/manual-input")
                                }, 600)
                            }}
                            className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center"
                        >
                            <PenSquare className="w-7 h-7 text-lime-600" />
                        </motion.button>
                    </>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {selectedAction && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 10,
                            scale: 0.8,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        className="
        fixed
        bottom-44
        right-8
        z-[60]
        px-4
        py-2
        rounded-full
        bg-black/80
        text-white
        text-sm
        font-medium
        shadow-xl
      "
                    >
                        {selectedAction === "scan" &&
                            "Opening Scanner..."}

                        {selectedAction === "upload" &&
                            "Opening Gallery..."}

                        {selectedAction === "manual" &&
                            "Opening Manual Input..."}
                    </motion.div>
                )}
            </AnimatePresence>



            {/* MAIN FAB */}
            <motion.button
                onClick={() => setOpenFab(!openFab)}
                animate={{
                    rotate: openFab ? 45 : 0,
                }}
                whileTap={{
                    scale: 0.9,
                }}
                whileHover={{
                    scale: 1.05,
                }}
                className="fixed bottom-8 right-8 z-[60] w-20 h-20 rounded-full bg-lime-500 text-white shadow-2xl flex items-center justify-center"
            >
                <Plus className="w-10 h-10" />
            </motion.button>
        </div >
    )


}