"use client"

import { useState } from "react"
import Sidebar from "../sidebar/page"
import { Save, PencilLine } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function ManualInputPage() {
    const router = useRouter()

    const [productName, setProductName] =
        useState("")

    const [sugar, setSugar] =
        useState("")

    const sugarValue =
        Number(sugar) || 0

    const getGrade = () => {

        if (sugarValue <= 1) return "A"
        if (sugarValue <= 5) return "B"
        if (sugarValue <= 10) return "C"
        if (sugarValue <= 20) return "D"

        return "E"
    }

    const grade = getGrade()

    const handleSave = async () => {

        if (!productName.trim()) {

            toast.error(
                "Product name is required"
            )

            return

        }

        if (!sugar.trim()) {

            toast.error(
                "Sugar amount is required"
            )

            return

        }

        try {

            const token =
                localStorage.getItem("token")

            const response =
                await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/nutrition/manual`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                            Authorization:
                                `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            productName,
                            sugar: Number(sugar),
                        }),
                    }
                )

            const data =
                await response.json()

            if (!response.ok) {

                throw new Error(
                    data.message
                )

            }

            toast.success(
                "Consumption saved successfully"
            )

            setTimeout(() => {

                router.push("/dasbor")

            }, 1000)

            setProductName("")
            setSugar("")

        } catch (error: any) {

            console.error(error)

            toast.error(
                error.message ||
                "Failed to save consumption"
            )

        }

    }

    return (

        <div className="min-h-screen bg-gray-50">

            <Sidebar />

            <main
                className=" lg:ml-64 p-4 md:p-6 lg:p-8
            "
            >

                <div
                    className="
                    w-full

                    max-w-md
                    md:max-w-5xl
                    lg:max-w-6xl

                    mx-auto
                "
                >

                    {/* HERO */}
                    <div
                        className="
                        bg-white

                        rounded-[32px]
                        md:rounded-[40px]

                        shadow-lg

                        p-6
                        md:p-10

                        mb-6
                    "
                    >

                        <div
                            className="
                            flex
                            flex-col
                            items-center

                            text-center
                        "
                        >

                            <div
                                className="
                                w-20
                                h-20

                                md:w-28
                                md:h-28

                                rounded-full

                                bg-lime-100

                                flex
                                items-center
                                justify-center
                            "
                            >

                                <PencilLine
                                    className="
                                    w-10
                                    h-10

                                    md:w-14
                                    md:h-14

                                    text-lime-600
                                "
                                />

                            </div>

                            <h1
                                className="
                                mt-5

                                text-3xl
                                md:text-5xl

                                font-bold
                                text-gray-700
                            "
                            >
                                Manual Input
                            </h1>

                            <p
                                className="
                                text-gray-500

                                mt-3

                                text-sm
                                md:text-lg
                            "
                            >
                                Track your sugar intake manually
                            </p>

                        </div>

                    </div>

                    {/* MAIN CARD */}
                    <div
                        className="
                        bg-white

                        rounded-[32px]
                        md:rounded-[40px]

                        shadow-lg

                        p-5
                        md:p-10
                    "
                    >

                        <div
                            className="
                            grid

                            lg:grid-cols-2

                            gap-8
                        "
                        >

                            {/* LEFT */}
                            <div>

                                <div className="mb-6">

                                    <label
                                        className="
                                        block

                                        text-gray-700
                                        font-semibold

                                        mb-3
                                    "
                                    >
                                        Nama Produk
                                    </label>

                                    <input
                                        type="text"
                                        value={productName}
                                        onChange={(e) =>
                                            setProductName(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Contoh: Coca Cola"
                                        className="
                                        w-full

                                        h-14
                                        md:h-16

                                        px-5

                                        border
                                        border-gray-200

                                        rounded-2xl

                                        outline-none

                                        focus:border-lime-500
                                    "
                                    />

                                </div>

                                <div>

                                    <label
                                        className="
                                        block

                                        text-gray-700
                                        font-semibold

                                        mb-3
                                    "
                                    >
                                        Jumlah Gula (g)
                                    </label>

                                    <input
                                        type="number"
                                        value={sugar}
                                        onChange={(e) =>
                                            setSugar(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Contoh: 27"
                                        className="
                                        w-full

                                        h-14
                                        md:h-16

                                        px-5

                                        border
                                        border-gray-200

                                        rounded-2xl

                                        outline-none

                                        focus:border-lime-500
                                    "
                                    />

                                </div>

                            </div>

                            {/* RIGHT */}
                            <div>

                                <div
                                    className="
                                    bg-gray-50

                                    rounded-[28px]

                                    p-6
                                    md:p-8

                                    h-full
                                "
                                >

                                    <h2
                                        className="
                                        text-xl
                                        md:text-2xl

                                        font-bold
                                        text-gray-700

                                        text-center
                                    "
                                    >
                                        Grade Preview
                                    </h2>

                                    <p
                                        className="
                                        text-center
                                        text-gray-500

                                        mt-2
                                    "
                                    >
                                        Estimated sugar grade
                                    </p>

                                    <div
                                        className="
                                        flex
                                        justify-center
                                        gap-3

                                        mt-8

                                        flex-wrap
                                    "
                                    >

                                        {["A", "B", "C", "D", "E"].map(
                                            (item) => (

                                                <div
                                                    key={item}
                                                    className={`
                                                    w-12
                                                    h-12

                                                    rounded-full

                                                    flex
                                                    items-center
                                                    justify-center

                                                    font-bold

                                                    ${item === grade
                                                            ? "bg-lime-500 text-white scale-110"
                                                            : "bg-white text-gray-500"
                                                        }
                                                `}
                                                >
                                                    {item}
                                                </div>

                                            )
                                        )}

                                    </div>

                                    <div
                                        className="
                                        mt-10

                                        bg-white

                                        rounded-3xl

                                        p-6

                                        text-center
                                    "
                                    >

                                        <h3
                                            className="
                                            text-gray-500
                                        "
                                        >
                                            Current Grade
                                        </h3>

                                        <h1
                                            className="
                                            text-6xl

                                            font-bold

                                            text-lime-500

                                            mt-3
                                        "
                                        >
                                            {grade}
                                        </h1>

                                        <p
                                            className="
                                            text-gray-500

                                            mt-3
                                        "
                                        >
                                            {sugarValue}g sugar
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                        <button
                            onClick={handleSave}
                            className="
                            mt-8

                            w-full

                            h-14
                            md:h-16

                            rounded-2xl

                            bg-lime-500
                            hover:bg-lime-600

                            transition-all

                            text-white

                            font-semibold

                            text-base
                            md:text-lg

                            flex
                            items-center
                            justify-center
                            gap-2
                        "
                        >

                            <Save
                                className="
                                w-5
                                h-5
                            "
                            />

                            Simpan Konsumsi

                        </button>

                    </div>

                </div>

            </main>

        </div>
    )


}
