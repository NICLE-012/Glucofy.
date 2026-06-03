"use client"

import { useEffect, useState } from "react"
import Sidebar from "../sidebar/page"
import { CreditCard, Check, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function PaymentPage() {
    const router = useRouter()

    const methods = [
        {
            name: "QRIS",
            logo: "/qris.png"
        },
        {
            name: "DANA",
            logo: "/dana.png"
        },
        {
            name: "GoPay",
            logo: "/gopay.png"
        },
        {
            name: "OVO",
            logo: "/ovo.png"
        }
    ]

    const [selectedPayment, setSelectedPayment] = useState("")
    const [selectedPlan, setSelectedPlan] = useState("monthly")
    const [loading, setLoading] = useState(false)

    useEffect(() => {

        const plan = localStorage.getItem("selectedPlan")

        if (plan) {
            setSelectedPlan(plan)
        }

    }, [])

    const price =
        selectedPlan === "monthly"
            ? "Rp19.000"
            : "Rp149.000"

    const handlePayment = async () => {

        try {

            setLoading(true)

            const token =
                localStorage.getItem("token")

            const response =
                await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/subscription/activate`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            ...(token && {
                                Authorization: `Bearer ${token}`,
                            }),
                        },
                        body: JSON.stringify({
                            plan: selectedPlan,
                        }),
                    }
                )


            const result =
                await response.json()

            if (result.success) {

                toast.success(
                    "Premium activated successfully"
                )

                setTimeout(() => {
                    localStorage.setItem(
                        "premiumPlan",
                        selectedPlan
                    )
                    router.push("/payment-success")
                }, 1000)

            } else {

                toast.error(
                    result.message ||
                    "Failed to activate premium"
                )

            }

        } catch (error) {

            console.error(error)

            toast.error(
                "Something went wrong"
            )

        } finally {

            setLoading(false)

        }

    }

    return (
        <>
            <Sidebar />

            <main className="xl:ml-64 min-h-screen bg-gradient-to-br from-lime-50 via-white to-emerald-50 p-6 lg:p-8">

                <div className="max-w-4xl mx-auto relative">

                    {/* Glow */}
                    <div className="absolute top-0 right-0 w-72 h-72 bg-lime-300/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl" />

                    <div className="
                        relative
                        bg-white/70
                        backdrop-blur-xl
                        border
                        border-white/70
                        rounded-[32px]
                        p-8
                        shadow-[0_8px_32px_rgba(0,0,0,0.08)]
                    ">

                        {/* HEADER */}
                        <div className="flex items-center gap-4 mb-8">

                            <div className="
                                w-14
                                h-14
                                rounded-2xl
                                bg-lime-100
                                flex
                                items-center
                                justify-center
                            ">
                                <CreditCard
                                    size={24}
                                    className="text-lime-600"
                                />
                            </div>

                            <div>

                                <h1 className="text-3xl font-bold text-zinc-900">
                                    Payment
                                </h1>

                                <p className="text-zinc-500">
                                    Complete your premium subscription
                                </p>

                            </div>

                        </div>

                        {/* PLAN */}
                        <div className="
                            bg-gradient-to-r
                            from-lime-50
                            to-emerald-50
                            rounded-3xl
                            p-6
                            border
                            border-lime-100
                            mb-8
                        ">

                            <div className="flex justify-between items-start">

                                <div>

                                    <h2 className="text-2xl font-bold">

                                        {selectedPlan === "monthly"
                                            ? "Premium Monthly"
                                            : "Premium Yearly"}

                                    </h2>

                                    <p className="text-zinc-500 mt-1">

                                        {selectedPlan === "monthly"
                                            ? "Monthly Subscription"
                                            : "Yearly Subscription"}

                                    </p>

                                </div>

                                {selectedPlan === "yearly" && (
                                    <span className="
                                        bg-lime-500
                                        text-white
                                        text-xs
                                        px-3
                                        py-1
                                        rounded-full
                                        font-semibold
                                    ">
                                        Save 35%
                                    </span>
                                )}

                            </div>

                            <h3 className="text-5xl font-bold text-lime-600 mt-5">
                                {price}
                            </h3>

                        </div>

                        {/* PAYMENT METHODS */}
                        <h2 className="font-bold text-xl mb-4">
                            Select Payment Method
                        </h2>

                        <div className="space-y-4">

                            {methods.map((item) => (

                                <button
                                    key={item.name}
                                    type="button"
                                    onClick={() => setSelectedPayment(item.name)}
                                    className={`
                                        w-full
                                        flex
                                        items-center
                                        justify-between
                                        rounded-2xl
                                        p-4
                                        border-2
                                        transition-all
                                        duration-300

                                        ${selectedPayment === item.name
                                            ? "bg-gradient-to-r from-lime-50 to-lime-100 border-lime-500 shadow-lg scale-[1.01]"
                                            : "bg-white border-zinc-200 hover:border-lime-300"
                                        }
                                    `}
                                >

                                    <div className="flex items-center gap-4">

                                        <img
                                            src={item.logo}
                                            alt={item.name}
                                            className="w-12 h-12 object-contain"
                                        />

                                        <span
                                            className={`
                                                font-semibold
                                                text-lg

                                                ${selectedPayment === item.name
                                                    ? "text-lime-700"
                                                    : "text-zinc-700"
                                                }
                                            `}
                                        >
                                            {item.name}
                                        </span>

                                    </div>

                                    {selectedPayment === item.name && (
                                        <div className="
                                            w-8
                                            h-8
                                            rounded-full
                                            bg-lime-500
                                            flex
                                            items-center
                                            justify-center
                                        ">
                                            <Check
                                                size={16}
                                                className="text-white"
                                            />
                                        </div>
                                    )}

                                </button>

                            ))}

                        </div>

                        {/* SUMMARY */}
                        <div className="
                            mt-8
                            rounded-2xl
                            bg-zinc-50
                            p-5
                        ">

                            <div className="flex justify-between mb-3">

                                <span className="text-zinc-500">
                                    Plan
                                </span>

                                <span className="font-semibold">
                                    {selectedPlan === "monthly"
                                        ? "Monthly"
                                        : "Yearly"}
                                </span>

                            </div>

                            <div className="flex justify-between mb-3">

                                <span className="text-zinc-500">
                                    Payment Method
                                </span>

                                <span className="font-semibold">
                                    {selectedPayment || "-"}
                                </span>

                            </div>

                            <div className="border-t pt-3 flex justify-between">

                                <span className="font-bold">
                                    Total
                                </span>

                                <span className="font-bold text-lime-600">
                                    {price}
                                </span>

                            </div>

                        </div>

                        {/* SECURITY */}
                        <div className="
                            flex
                            items-center
                            gap-2
                            mt-5
                            text-sm
                            text-zinc-500
                        ">

                            <ShieldCheck
                                size={18}
                                className="text-lime-600"
                            />

                            Secure payment & protected transaction

                        </div>

                        {/* PAY BUTTON */}
                        <button
                            disabled={!selectedPayment || loading}
                            onClick={handlePayment}
                            className={`
                                w-full
                                mt-8
                                py-4
                                rounded-2xl
                                text-white
                                font-semibold
                                transition-all

                                ${selectedPayment
                                    ? "bg-gradient-to-r from-lime-500 to-emerald-500 hover:scale-[1.01] shadow-[0_10px_30px_rgba(132,204,22,0.35)]"
                                    : "bg-zinc-300 cursor-not-allowed"
                                }
                            `}
                        >
                            {loading
                                ? "Processing..."
                                : "Pay Now"}
                        </button>

                    </div>

                </div>

            </main>
        </>
    )
}