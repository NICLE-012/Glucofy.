"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Webcam from "react-webcam"
import Tesseract from "tesseract.js"
import { motion } from "framer-motion"
import { toast } from "sonner"

import {
    ArrowLeft,
    Zap,
    Image as ImageIcon,
    CircleHelp,
} from "lucide-react"
import Link from "next/link"

export default function GlucofyScanner() {
    const webcamRef = useRef<Webcam | null>(null)

    const router = useRouter()

    const [loading, setLoading] = useState(false)

    const capture = async () => {
        const imageSrc = webcamRef.current?.getScreenshot()

        if (!imageSrc) return

        setLoading(true)

        try {
            const {
                data: { text },
            } = await Tesseract.recognize(imageSrc, "eng")


            const sugarMatch =
                text.match(/Sugar\s?(\d+(\.\d+)?)/i)

            const sugar =
                sugarMatch
                    ? Number(
                        Number(
                            sugarMatch[1]
                        ).toFixed(1)
                    )
                    : null

            if (sugar === null) {

                toast.error(
                    "Nutrition table could not be detected. Please retake the photo."
                )

                setLoading(false)

                return
            }

            localStorage.setItem(
                "scanType",
                "scan"
            )

            console.log("OCR TEXT:", text)
            console.log("SUGAR:", sugar)

            localStorage.setItem(
                "scanResult",
                JSON.stringify({
                    productName: "Scanned Product",
                    sugar,
                    sugarGrade: "B",
                    sugarStatus: "Low Sugar",
                    aiSummary: text,
                })
            )


            router.push("/result")

        } catch (error) {
            console.error(error)
            alert("Gagal scan gambar 😭")
        }

        setLoading(false)
    }

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden">

            {/* CAMERA */}
            <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/40" />

            {/* TOPBAR */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 pt-8">

                <Link href="/dasbor">
                    <button className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg hover:bg-gray-200 shadow-xl">

                        <ArrowLeft className="text-black" />

                    </button>
                </Link>

                <div className="flex items-center gap-3">

                    <button className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg">

                        <CircleHelp className="text-black" />

                    </button>

                    <button className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg">

                        <ImageIcon className="text-black" />

                    </button>

                    {/* <button className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg">

            <Zap className="text-black" />

          </button> */}

                </div>

            </div>

            {/* SCAN BOX */}
            <div className="absolute inset-0 flex items-center justify-center">

                <div className="w-[320px] h-80 border-4 border-dashed border-white rounded-[40px] relative">

                    <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-2xl" />

                    <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-2xl" />

                    <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-2xl" />

                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-2xl" />

                </div>

            </div>

            {/* BUTTON */}
            <div className="absolute bottom-20 left-0 right-0 px-6 z-30">

                <motion.button
                    whileTap={{ scale: 0.96 }}
                    whileHover={{ scale: 1.01 }}
                    onClick={capture}
                    className="w-full h-16 rounded-3xl bg-white text-black font-bold text-lg shadow-2xl"
                >

                    {loading ? "Scanning..." : "Scan Tabel Gizi"}

                </motion.button>

            </div>

        </div>
    )
}