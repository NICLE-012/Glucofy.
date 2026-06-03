"use client"

import Sidebar from "../sidebar/page"
import { CheckCircle, Crown, Download } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { jsPDF } from "jspdf"
import { toPng } from "html-to-image"


export default function PaymentSuccessPage() {
    const router = useRouter()
    const [isDownloading, setIsDownloading] = useState(false)

    const [plan, setPlan] = useState("monthly")
    const [price, setPrice] = useState("Rp19.000")

    const [date, setDate] = useState("")
    const [receiptId, setReceiptId] = useState("")

    useEffect(() => {
        setDate(
            new Date().toLocaleDateString("en-GB")
        )

        setReceiptId(
            `GLC-${Date.now()}`
        )

        const savedPlan =
            localStorage.getItem("premiumPlan")

        if (savedPlan) {
            setPlan(savedPlan)

            setPrice(
                savedPlan === "monthly"
                    ? "Rp19.000"
                    : "Rp149.000"
            )
        }
    }, [])



    const downloadReceipt = async () => {
        const node = document.getElementById("receipt")

        if (!node) return

        try {
            const dataUrl = await toPng(node, {
                cacheBust: true,
                pixelRatio: 3
            })

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4"
            })

            const img = new Image()

            img.src = dataUrl

            img.onload = () => {
                const pageWidth = 210
                const margin = 10

                const pdfWidth = pageWidth - margin * 2

                const pdfHeight =
                    (img.height * pdfWidth) /
                    img.width

                pdf.addImage(
                    dataUrl,
                    "PNG",
                    margin,
                    margin,
                    pdfWidth,
                    pdfHeight
                )

                pdf.save(`Receipt-${receiptId}.pdf`)
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <Sidebar />

            <main className="xl:ml-64 min-h-screen bg-gradient-to-br from-lime-50 via-white to-emerald-50 flex items-center justify-center p-6">

                <div id="receipt" className="max-w-md w-full">

                    {/* RECEIPT */}
                    <div

                        className="
                            bg-white
                            rounded-t-3xl
                            shadow-xl
                            overflow-hidden
                            border
                            border-zinc-100
                            max-w-[380px]
                            mx-auto
                        "
                    >
                        <div className="p-8">

                            <div className="flex justify-center">
                                <div className="relative">

                                    <div
                                        className="
                                            w-20
                                            h-20
                                            rounded-full
                                            bg-lime-100
                                            flex
                                            items-center
                                            justify-center
                                        "
                                    >
                                        <CheckCircle
                                            size={50}
                                            className="text-lime-500"
                                        />
                                    </div>

                                    <div
                                        className="
                                            absolute
                                            -bottom-2
                                            left-1/2
                                            -translate-x-1/2
                                            w-8
                                            h-8
                                            rounded-full
                                            bg-yellow-400
                                            flex
                                            items-center
                                            justify-center
                                            border-2
                                            border-white
                                        "
                                    >
                                        <Crown
                                            size={14}
                                            className="text-white"
                                        />
                                    </div>

                                </div>
                            </div>

                            <h1 className="text-center text-3xl font-bold mt-6">
                                Payment Success 🎉
                            </h1>

                            <p className="text-center text-zinc-500 mt-2">
                                Premium subscription activated
                            </p>

                            <div className="border-t border-dashed my-6" />

                            <div className="space-y-3 text-sm">

                                <div className="flex justify-between">
                                    <span className="text-zinc-500">
                                        Receipt ID
                                    </span>

                                    <span className="font-semibold">
                                        {receiptId}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-zinc-500">
                                        Date
                                    </span>

                                    <span className="font-semibold">
                                        {date}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-zinc-500">
                                        Plan
                                    </span>

                                    <span className="font-semibold">
                                        {plan === "monthly"
                                            ? "Premium Monthly"
                                            : "Premium Yearly"}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-zinc-500">
                                        Status
                                    </span>

                                    <span
                                        className="
                                            px-3
                                            py-1
                                            rounded-full
                                            bg-lime-100
                                            text-lime-700
                                            text-xs
                                            font-bold
                                        "
                                    >
                                        PAID
                                    </span>
                                </div>

                            </div>

                            <div className="border-t border-dashed my-6" />

                            <div className="space-y-3 text-sm">

                                <div className="flex justify-between">
                                    <span>Glucofy Premium Access</span>
                                    <span>{price}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>AI Recommendation</span>
                                    <span>Included</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Advanced Analytics</span>
                                    <span>Included</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Nutrition Insights</span>
                                    <span>Included</span>
                                </div>

                            </div>

                            <div className="border-t border-dashed my-6" />

                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                               <span>{price}</span>
                            </div>

                            <div className="mt-8 text-center">
                                <p className="text-zinc-500 text-sm">
                                    Thank you for upgrading ❤️
                                </p>

                                <p className="text-xs text-zinc-400 mt-2">
                                    Welcome to Glucofy Premium
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* SOBEKAN STRUK */}
                    <div
                        className="
                            h-6
                            bg-[radial-gradient(circle_at_12px_-4px,transparent_12px,white_13px)]
                            bg-[length:24px_24px]
                            drop-shadow-lg
                            max-w-[380px]
                            mx-auto
                        "
                    />

                    {/* BUTTONS */}
                    <div className="space-y-3 mt-5">

                        <button
                            onClick={() => router.push("/HabbitMonitor")}
                            className="
                                w-full
                                py-4
                                rounded-2xl
                                text-white
                                font-semibold
                                bg-gradient-to-r
                                from-lime-500
                                to-emerald-500
                                hover:scale-[1.01]
                                transition-all
                            "
                        >
                            Back to Habit Monitoring
                        </button>

                        <button
                            onClick={downloadReceipt}
                            disabled={isDownloading}
                            className="
        w-full
        py-4
        rounded-2xl
        text-white
        font-semibold
        bg-gradient-to-r
        from-sky-500
        to-cyan-500
        hover:scale-[1.01]
        transition-all
        duration-300
        flex
        items-center
        justify-center
        gap-2
        disabled:opacity-70
    "
                        >
                            <Download size={18} />

                            {isDownloading
                                ? "Generating PDF..."
                                : "Download Receipt"}
                        </button>

                    </div>

                </div>

            </main>
        </>
    )
}