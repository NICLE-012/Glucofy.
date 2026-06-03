"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

import {
    ArrowLeft,
    Bell,
    ChevronRight,
    BarChart3,
    BadgeCheck,
} from "lucide-react"

export default function ResultPage() {

    const router = useRouter()

    const [result, setResult] =
        useState<any>(null)

    const [showModal, setShowModal] =
        useState(false)

    const [productInput, setProductInput] =
        useState("")

    const [scanType, setScanType] =
        useState("")

    useEffect(() => {

        try {

            const savedResult =
                localStorage.getItem(
                    "scanResult"
                )

            const savedType =
                localStorage.getItem(
                    "scanType"
                )

            if (
                savedResult &&
                savedResult !== "undefined"
            ) {

                setResult(
                    JSON.parse(savedResult)
                )

            } else {

                router.push("/input")
                return

            }

            if (savedType) {

                setScanType(savedType)

            }

        } catch (error) {

            console.error(
                "Invalid scanResult",
                error
            )

            localStorage.removeItem(
                "scanResult"
            )

            router.push("/input")

        }

    }, [router])


    const sugar = result?.sugar || 0

    let grade: "A" | "B" | "C" | "D" = "A"
    let status = "Excellent"

    if (sugar < 1) {
        grade = "A"
        status = "Excellent"
    }
    else if (sugar < 5) {
        grade = "B"
        status = "Good"
    }
    else if (sugar < 10) {
        grade = "C"
        status = "Moderate"
    }
    else {
        grade = "D"
        status = "High Sugar"
    }

    const gradeColors = {
        A: {
            main: "bg-lime-500",
            light: "bg-lime-100",
            text: "text-lime-600"
        },
        B: {
            main: "bg-emerald-500",
            light: "bg-emerald-100",
            text: "text-emerald-600"
        },
        C: {
            main: "bg-yellow-500",
            light: "bg-yellow-100",
            text: "text-yellow-600"
        },
        D: {
            main: "bg-red-500",
            light: "bg-red-100",
            text: "text-red-600"
        }
    }

    const gradeColor = gradeColors[grade]

    const summary =
        result?.aiSummary || "-"

    const productName =
        result?.productName || "-"

    const handleRecap = () => {

        if (scanType === "scan") {

            setProductInput(
                productName
            )

            setShowModal(true)

            return

        }

        router.push("/dasbor")

    }

    const spoonCount =
        Math.max(
            1,
            Math.ceil(sugar / 4)
        )

    return (
        <div className="min-h-screen bg-[#f5f5f5] overflow-hidden">

            {/* TOPBAR */}
            <div className="flex items-center justify-between px-10 py-8">

                {/* LEFT */}
                <button className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-105 transition">

                    <ArrowLeft className="w-8 h-8 text-black" />

                </button>


            </div>

            {/* CONTENT */}
            <div className="px-10 pb-10 grid lg:grid-cols-2 gap-10 items-center">

                {/* LEFT SIDE */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >

                    {/* CIRCLE */}
                    <div className="flex justify-center">

                        <div className="relative w-90 h-90 flex items-center justify-center">

                            <div className={`absolute w-full h-full rounded-full ${gradeColor.light}`} />

                            <div className={`absolute w-75 h-75 rounded-full ${gradeColor.light} opacity-80`} />

                            <div className={`absolute w-60 h-60 rounded-full ${gradeColor.light} opacity-60`} />

                            <div className="relative w-[380px] h-[380px] flex items-center justify-center">

                                <div
                                    className={`absolute w-[380px] h-[380px] rounded-full ${gradeColor.light} opacity-20`}
                                />

                                <div
                                    className={`absolute w-[310px] h-[310px] rounded-full ${gradeColor.light} opacity-35`}
                                />

                                <div
                                    className={`absolute w-[240px] h-[240px] rounded-full ${gradeColor.light} opacity-55`}
                                />

                                <div
                                    className={`absolute w-[170px] h-[170px] rounded-full ${gradeColor.main}
        shadow-[0_25px_50px_rgba(0,0,0,0.15)]
        flex items-center justify-center`}
                                >
                                    <span className="text-white text-[90px] font-black">
                                        {grade}
                                    </span>
                                </div>

                            </div>
                        </div>

                    </div>

                    {/* TITLE */}
                    <h1
                        className={`
            text-[110px]
            font-bold
            text-center
            leading-none
            mt-10
            ${gradeColor.text}
        `}
                    >
                        {productName}
                    </h1>

                    {/* DESCRIPTION */}
                    <p
                        className="
        text-gray-600
        text-base
        md:text-xl
        xl:text-[28px]
        leading-relaxed
        mt-6
        max-w-3xl
        mx-auto
        text-justify
    "
                    >                        {summary}
                    </p>

                </motion.div>

                {/* RIGHT SIDE */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-8"
                >

                    {/* SUGAR CARD */}
                    <div className="bg-white rounded-[40px] shadow-xl p-10">

                        <div className="flex items-center justify-between">

                            <h2 className="text-[52px] font-medium text-gray-700">
                                Kadar Gula
                            </h2>

                            <div className="flex-1 border-b-2 border-dashed border-gray-400 mx-6 mt-5" />

                            <h2 className="text-[70px] font-semibold text-gray-800">
                                {sugar} g
                            </h2>

                        </div>

                        <p className="text-3xl text-gray-500 mt-8">
                            setara dengan :
                        </p>

                        {/* SPOON */}
                        <div
                            className="
        grid
        grid-cols-5
        gap-4
        mt-8
    "
                        >

                            {Array.from({
                                length: spoonCount
                            }).map((_, index) => (

                                <motion.div
                                    key={index}
                                    initial={{
                                        opacity: 0,
                                        scale: 0.8
                                    }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1
                                    }}
                                    transition={{
                                        delay: index * 0.05
                                    }}
                                    className="
                aspect-square
                rounded-[25px]
                bg-orange-50
                border
                border-orange-200
                flex
                items-center
                justify-center
                text-5xl
            "
                                >
                                    🥄
                                </motion.div>

                            ))}

                        </div>

                    </div>

                    {/* STATUS */}
                    <div className="grid grid-cols-2 gap-6">

                        {/* CARD */}
                        <div className="bg-white rounded-[35px] shadow-xl p-8 flex flex-col justify-between min-h-65">

                            <h3 className="text-3xl text-gray-700">
                                Status
                            </h3>

                            <h1
                                className={`
        text-4xl
        md:text-6xl
        xl:text-[70px]
        font-bold
        break-words
        ${gradeColor.text}
    `}
                            >
                                {status}
                            </h1>

                            <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center self-end">

                                <BarChart3
                                    className={`w-10 h-10 ${gradeColor.text}`}
                                />
                            </div>

                        </div>

                        {/* CARD */}
                        <div className="bg-white rounded-[35px] shadow-xl p-8 flex flex-col justify-between min-h-65">

                            <h3 className="text-3xl text-gray-700">
                                Nutri Grade
                            </h3>

                            <h1 className={`text-[70px] font-bold ${gradeColor.text}`}>
                                {grade}
                            </h1>

                            <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center self-end">

                                <BadgeCheck
                                    className={`w-10 h-10 ${gradeColor.text}`}
                                />
                            </div>

                        </div>

                    </div>

                    {/* BUTTON */}

                    <motion.button
                        onClick={handleRecap}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full h-24 rounded-[30px] bg-lime-500 text-white text-4xl font-bold shadow-2xl flex items-center justify-center gap-5"
                    >

                        Click For Recap

                        <ChevronRight className="w-10 h-10" />

                    </motion.button>


                </motion.div>


                {
                    showModal && (

                        <div className="
        fixed
        inset-0
        bg-black/50
        z-50
        flex
        items-center
        justify-center
    ">

                            <div className="
            bg-white
            rounded-3xl
            p-8
            w-[500px]
        ">

                                <h2 className="
                text-3xl
                font-bold
                text-gray-700
            ">
                                    Product Name
                                </h2>

                                <p className="
                text-gray-500
                mt-2
            ">
                                    Confirm product name
                                    before saving
                                </p>

                                <input
                                    value={productInput}
                                    onChange={(e) =>
                                        setProductInput(
                                            e.target.value
                                        )
                                    }
                                    className="
                    mt-6
                    w-full
                    h-14
                    px-4
                    border
                    rounded-2xl
                "
                                />

                                <div className="
                flex
                gap-4
                mt-6
            ">

                                    <button
                                        onClick={() =>
                                            setShowModal(false)
                                        }
                                        className="
                        flex-1
                        h-14
                        rounded-2xl
                        bg-gray-200
                    "
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={() => {

                                            const updated =
                                            {
                                                ...result,
                                                productName:
                                                    productInput
                                            }

                                            localStorage.setItem(
                                                "scanResult",
                                                JSON.stringify(
                                                    updated
                                                )
                                            )

                                            router.push(
                                                "/dasbor"
                                            )

                                        }}
                                        className="
                        flex-1
                        h-14
                        rounded-2xl
                        bg-lime-500
                        text-white
                    "
                                    >
                                        Save
                                    </button>

                                </div>

                            </div>

                        </div>

                    )
                }

            </div >

        </div >
    )
}