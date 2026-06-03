"use client"

import { useRef, useState } from "react"
import Sidebar from "../sidebar/page"
import { UploadCloud, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function InputPage() {

    const router = useRouter()

    const fileInputRef =
        useRef<HTMLInputElement>(null)

    const [preview, setPreview] =
        useState<string | null>(null)

    const [productName, setProductName] =
        useState("")

    const [loading, setLoading] =
        useState(false)

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const file =
            e.target.files?.[0]

        if (!file) return

        setPreview(
            URL.createObjectURL(file)
        )
    }

    const handleAnalyze = async () => {



        if (!fileInputRef.current?.files?.[0]) {

            toast.error(
                "Please select an image first"
            )

            return

        }
        if (!productName.trim()) {

            toast.error(
                "Please enter product name"
            )

            return

        }

        try {

            setLoading(true)

            const file =
                fileInputRef.current.files[0]

            const formData =
                new FormData()

            formData.append(
                "image",
                file
            )

            formData.append(
                "productName",
                productName
            )

            console.log(
                "Ready to upload:",
                file.name
            )

            toast.success(
                "Image uploaded successfully"
            )
            const token =
                localStorage.getItem("token")

            const response =
                await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/nutrition/scan`,
                    {
                        method: "POST",
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                        body: formData,
                    }
                )

            const data =
                await response.json()

            console.log("API RESULT:", data)

            if (
                !response.ok ||
                !data?.data
            ) {

                toast.error(
                    "Nutrition facts could not be detected. Please take a clearer photo."
                )

                return
            }

            localStorage.setItem(
                "scanResult",
                JSON.stringify(data.data)
            )

            router.push("/result")
        } catch (error) {

            console.error(error)

            toast.error(
                "Failed to analyze image"
            )

        } finally {

            setLoading(false)

        }

    }
    return (

        <div className="min-h-screen bg-gray-50">

            <Sidebar />

            <main
                className="
                lg:ml-64
                p-4
                md:p-6
                lg:p-8
            "
            >

                <div
                    className="
                    max-w-md
                    md:max-w-4xl
                    lg:max-w-6xl
                    mx-auto
                "
                >

                    {/* HEADER */}
                    <div
                        className="
                        bg-white
                        rounded-[32px]
                        shadow-lg

                        p-6
                        md:p-8
                        lg:p-10

                        mb-6
                    "
                    >

                        <div
                            className="
                            flex
                            flex-col

                            md:flex-row
                            md:items-center

                            gap-4
                        "
                        >

                            <img
                                src="/glucofy-logo.png"
                                alt="Glucofy"
                                className="
                                w-20
                                h-20

                                md:w-14
                                md:h-14

                                object-contain

                                mx-auto
                                md:mx-0
                            "
                            />

                            <div
                                className="
                                text-center
                                md:text-left
                            "
                            >

                                <h1
                                    className="
                                    text-3xl
                                    md:text-4xl
                                    lg:text-5xl

                                    font-bold
                                    text-gray-700
                                "
                                >
                                    Upload Food Image
                                </h1>

                                <p
                                    className="
                                    text-gray-500
                                    mt-2
                                "
                                >
                                    Upload photo of your food or drink
                                    to analyze sugar content
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* MAIN CARD */}
                    <div
                        className="
                        bg-white
                        rounded-[32px]
                        shadow-lg

                        p-5
                        md:p-8
                        lg:p-10
                    "
                    >

                        {/* DROPZONE */}
                        <div
                            onClick={() =>
                                fileInputRef.current?.click()
                            }
                            className="
                            border-2
                            border-dashed
                            border-lime-300

                            rounded-[28px]

                            h-[280px]
                            md:h-[400px]
                            lg:h-[450px]

                            flex
                            flex-col
                            items-center
                            justify-center

                            text-center

                            cursor-pointer
                            overflow-hidden

                            px-6
                        "
                        >

                            {preview ? (

                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="
                                    w-full
                                    h-full
                                    object-cover
                                "
                                />

                            ) : (

                                <>
                                    <UploadCloud
                                        className="
                                        w-16
                                        h-16

                                        md:w-20
                                        md:h-20

                                        text-lime-500
                                    "
                                    />

                                    <h3
                                        className="
                                        mt-5

                                        font-semibold
                                        text-gray-700

                                        text-lg
                                        md:text-2xl
                                    "
                                    >
                                        Drag & drop your image here
                                    </h3>

                                    <p
                                        className="
                                        text-gray-500
                                        mt-2

                                        text-sm
                                        md:text-base
                                    "
                                    >
                                        or click to browse
                                    </p>

                                    <button
                                        type="button"
                                        className="
                                        mt-6

                                        bg-lime-100
                                        text-lime-600

                                        rounded-2xl

                                        px-5
                                        py-3

                                        font-semibold
                                    "
                                    >
                                        Choose Image
                                    </button>
                                </>
                            )}

                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {/* INFO */}
                        <div
                            className="
                            mt-6

                            bg-lime-50

                            rounded-3xl

                            p-4
                            md:p-5

                            flex
                            gap-3
                            items-start
                        "
                        >

                            <div
                                className="
                                w-10
                                h-10

                                rounded-full
                                bg-white

                                flex
                                items-center
                                justify-center
                            "
                            >
                                🛡️
                            </div>

                            <div>

                                <p
                                    className="
                                    text-lime-700
                                    font-semibold
                                "
                                >
                                    We only analyze your image.
                                </p>

                                <p
                                    className="
                                    text-lime-600
                                    text-sm
                                    mt-1
                                "
                                >
                                    Your data is safe and secure
                                    with Glucofy.
                                </p>

                            </div>

                        </div>

                        <div className="mt-6">

                            <label
                                className="
        block
        text-gray-700
        font-semibold
        mb-3
    "
                            >
                                Product Name
                            </label>

                            <input
                                type="text"
                                value={productName}
                                onChange={(e) =>
                                    setProductName(
                                        e.target.value
                                    )
                                }
                                placeholder="Example: Nabati Biscuit"
                                className="
        w-full
        h-14

        px-5

        border
        border-gray-200

        rounded-2xl

        outline-none

        focus:border-lime-500
    "
                            />

                        </div>

                        {/* BUTTON */}
                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="
                            mt-6

                            w-full

                            h-14
                            md:h-16

                            rounded-2xl

                            bg-lime-500
                            hover:bg-lime-600

                            disabled:bg-gray-300

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

                            <Sparkles
                                className="w-5 h-5"
                            />

                            {loading
                                ? "Analyzing..."
                                : "Analyze Image"}

                        </button>

                    </div>

                </div>

            </main>

        </div>
    )


}
