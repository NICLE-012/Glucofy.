"use client"

import {
    Camera,
    Mail,
    User,
    Lock,
    Settings,
    ImageIcon,
    ShieldCheck,
} from "lucide-react"

import Sidebar from "../sidebar/page"
import { useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"

type UserType = {
    name: string
    email: string
    profileImage?: string
}

export default function SettingsPage() {

    const [activeTab, setActiveTab] = useState("profile")
    const [profileImage, setProfileImage] = useState("")

    const [user, setUser] = useState<UserType>({
        name: "",
        email: "",
    })

    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")

    useEffect(() => {

        const storedUser = localStorage.getItem("user")

        if (storedUser) {

            const parsedUser: UserType = JSON.parse(storedUser)

            setUser(parsedUser)
            setName(parsedUser.name)

            if (parsedUser.profileImage) {
                setProfileImage(parsedUser.profileImage)
            }

        }

    }, [])

    const handleUpdateUsername = async () => {

        if (!name.trim()) {

            toast.error(
                "Username cannot be empty"
            )

            return

        }

        try {

            setLoading(true)

            const token =
                localStorage.getItem("token")

            const response =
                await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/user/username`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type":
                                "application/json",
                            ...(token && {
                                Authorization:
                                    `Bearer ${token}`,
                            }),
                        },
                        body: JSON.stringify({
                            name,
                        }),
                    }
                )

            const data =
                await response.json()

            if (response.ok) {

                const updatedUser = {
                    ...user,
                    name,
                }

                setUser(updatedUser)

                localStorage.setItem(
                    "user",
                    JSON.stringify(updatedUser)
                )

                window.dispatchEvent(
                    new Event("userUpdated")
                )

                toast.success(
                    data.message ||
                    "Username updated successfully"
                )

            } else {

                toast.error(
                    data.message ||
                    "Failed to update username"
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
    const handleChangePassword = async () => {

        if (
            !oldPassword ||
            !newPassword
        ) {

            toast.error(
                "Please fill in all fields"
            )

            return

        }

        try {

            setLoading(true)

            const token =
                localStorage.getItem("token")

            const response =
                await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/user/change-password`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type":
                                "application/json",
                            ...(token && {
                                Authorization:
                                    `Bearer ${token}`,
                            }),
                        },
                        body: JSON.stringify({
                            oldPassword,
                            newPassword,
                        }),
                    }
                )

            const data =
                await response.json()

            if (response.ok) {

                toast.success(
                    data.message ||
                    "Password changed successfully"
                )

                setOldPassword("")
                setNewPassword("")

            } else {

                toast.error(
                    data.message ||
                    "Failed to change password"
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

    const handleProfileImage = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const file =
            e.target.files?.[0]

        if (!file) return

        const formData =
            new FormData()

        formData.append(
            "image",
            file
        )

        try {

            setLoading(true)

            const token =
                localStorage.getItem("token")

            const response =
                await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/user/profile-image`,
                    {
                        method: "PATCH",
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        },
                        body: formData
                    }
                )

            const data =
                await response.json()

            if (response.ok) {

                const updatedUser = {
                    ...user,
                    profileImage:
                        data.data.profileImage
                }

                setUser(updatedUser)

                setProfileImage(
                    data.data.profileImage
                )

                localStorage.setItem(
                    "user",
                    JSON.stringify(updatedUser)
                )

                window.dispatchEvent(
                    new Event("userUpdated")
                )

                toast.success(
                    "Profile photo updated successfully"
                )

            } else {

                toast.error(
                    data.message ||
                    "Failed to update profile photo"
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

        <div className="min-h-screen bg-[#f5f5f5] flex">

            {/* SIDEBAR */}
            <Sidebar />

            {/* MAIN */}
            <main className="flex-1 lg:ml-64 px-4 md:px-6 lg:px-8 py-6 lg:py-10">
                {/* HEADER */}
                <div className="flex items-start gap-5">

                    <div className="w-20 h-20 rounded-[28px] bg-lime-50 border border-lime-100 flex items-center justify-center">

                        <Settings className="w-10 h-10 text-lime-500" />

                    </div>

                    <div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900">
                            Pengaturan
                        </h1>

                        <p className="text-zinc-500 text-lg mt-2">
                            Kelola profil dan keamanan akun Anda
                        </p>

                    </div>

                </div>

                {/* CONTENT */}
                <div className="grid grid-cols-1 lg:grid-cols-[680px_1fr] gap-8 mt-10">

                    {/* LEFT CARD */}
                    <div className="bg-white rounded-[40px] border border-zinc-100 shadow-[0_10px_35px_rgba(0,0,0,0.04)] overflow-hidden">

                        {/* TOP */}
                        <div className="h-40 bg-white" />

                        {/* PROFILE */}
                        <div className="px-8 pb-20 -mt-20 flex flex-col items-center">

                            <div className="relative">

                                <div className="w-40 h-40 rounded-full bg-lime-50 border-[6px] border-white shadow-xl flex items-center justify-center overflow-hidden">

                                    {profileImage ? (

                                        <img
                                            src={profileImage}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />

                                    ) : (

                                        <span className="text-7xl font-bold text-lime-500 uppercase">

                                            {user.name
                                                ? user.name.charAt(0)
                                                : "U"}

                                        </span>

                                    )}

                                </div>

                                <label className="absolute bottom-2 right-2 w-14 h-14 rounded-full bg-lime-400 hover:bg-lime-500 transition flex items-center justify-center shadow-lg cursor-pointer">

                                    <Camera className="w-7 h-7 text-white" />

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfileImage}
                                        className="hidden"
                                    />

                                </label>

                            </div>

                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-zinc-900 mt-6">

                                {user.name || "Username"}

                            </h2>

                            <p className="text-center text-zinc-500 mt-3 leading-relaxed break-all">

                                {user.email || "email@gmail.com"}

                            </p>

                            <div className="mt-5 px-6 py-2 rounded-full bg-lime-100 text-lime-700 font-semibold">
                                USER
                            </div>

                            <div className="w-full h-px bg-zinc-100 my-8" />

                            <div className="flex items-center gap-4 w-full">

                                <div className="w-16 h-16 rounded-2xl bg-lime-50 border border-lime-100 flex items-center justify-center">

                                    <ImageIcon className="w-8 h-8 text-lime-500" />

                                </div>

                                <div>

                                    <p className="font-semibold text-zinc-800 text-lg">
                                        Tipe file
                                    </p>

                                    <p className="text-zinc-500">
                                        JPG, PNG, WebP • maks. 3 MB
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* RIGHT */}
                    <div className="space-y-7">

                        {/* TAB */}
                        <div className="bg-zinc-50 rounded-[30px] p-2 border border-zinc-100 flex flex-col sm:flex-row gap-2 w-full sm:w-fit">

                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`w-full sm:w-auto px-6 md:px-10 py-4 rounded-2xl font-semibold flex items-center gap-3 transition ${activeTab === "profile"
                                    ? "bg-lime-400 text-white shadow-md"
                                    : "text-zinc-500 hover:bg-white"
                                    }`}
                            >
                                <User className="w-5 h-5" />

                                Profil

                            </button>

                            <button
                                onClick={() => setActiveTab("password")}
                                className={`w-full sm:w-auto px-6 md:px-10 py-4 rounded-2xl font-semibold flex items-center gap-3 transition ${activeTab === "password"
                                    ? "bg-lime-400 text-white shadow-md"
                                    : "text-zinc-500 hover:bg-white"
                                    }`}
                            >
                                <Lock className="w-5 h-5" />

                                Kata Sandi

                            </button>
                        </div>

                        {activeTab === "profile" && (
                            <div className="bg-white rounded-[40px] border border-zinc-100 shadow-[0_10px_35px_rgba(0,0,0,0.04)] p-5 md:p-8 lg:p-10">

                                {/* TITLE */}
                                <div className="flex items-start gap-5">

                                    <div className="w-16 h-16 rounded-2xl bg-lime-50 border border-lime-100 flex items-center justify-center">

                                        <ShieldCheck className="w-8 h-8 text-lime-500" />

                                    </div>

                                    <div>

                                        <h2 className="text-4xl font-bold text-zinc-900">
                                            Informasi Profil
                                        </h2>

                                        <p className="text-zinc-500 text-lg mt-1">
                                            Perbarui nama lengkap dan email Anda
                                        </p>

                                    </div>

                                </div>

                                {/* INPUT */}
                                <div className="mt-10 space-y-7">

                                    {/* USERNAME */}
                                    <div>

                                        <label className="block text-lg font-semibold text-zinc-700 mb-3">
                                            Username
                                        </label>

                                        <div className="h-16 md:h-20 rounded-3xl border border-zinc-200 bg-zinc-50 px-6 flex items-center gap-4">

                                            <div className="w-12 h-12 rounded-2xl bg-lime-100 flex items-center justify-center">

                                                <User className="w-6 h-6 text-lime-600" />

                                            </div>

                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="bg-transparent outline-none text-2xl font-semibold text-zinc-800 w-full"
                                            />

                                        </div>

                                    </div>

                                    {/* EMAIL */}
                                    <div>

                                        <label className="block text-lg font-semibold text-zinc-700 mb-3">
                                            Email
                                        </label>

                                        <div className="h-16 md:h-20 rounded-3xl border border-zinc-200 bg-zinc-50 px-6 flex items-center gap-4">

                                            <div className="w-12 h-12 rounded-2xl bg-lime-100 flex items-center justify-center">

                                                <Mail className="w-6 h-6 text-lime-600" />

                                            </div>

                                            <input
                                                type="email"
                                                value={user.email}
                                                readOnly
                                                className="bg-transparent outline-none text-xl font-medium text-zinc-800 w-full"
                                            />

                                        </div>

                                        <p className="text-sm text-zinc-500 mt-2">
                                            Email belum dapat diubah
                                        </p>

                                    </div>

                                    <button
                                        onClick={handleUpdateUsername}
                                        disabled={loading}
                                        className="w-full h-16 md:h-20 rounded-3xl bg-lime-400 hover:bg-lime-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-white text-lg md:text-2xl font-bold flex items-center justify-center gap-4 shadow-[0_10px_25px_rgba(132,204,22,0.25)]"
                                    >

                                        <ShieldCheck className="w-7 h-7" />

                                        {loading ? "Menyimpan..." : "Simpan Perubahan"}

                                    </button>

                                </div>

                            </div>
                        )}

                        {activeTab === "password" && (
                            <div className="bg-white rounded-[40px] border border-zinc-100 shadow-[0_10px_35px_rgba(0,0,0,0.04)] p-5 md:p-8 lg:p-10">

                                <div className="flex items-start gap-5">

                                    <div className="w-16 h-16 rounded-2xl bg-lime-50 border border-lime-100 flex items-center justify-center">

                                        <Lock className="w-8 h-8 text-lime-500" />

                                    </div>

                                    <div>

                                        <h2 className="text-4xl font-bold text-zinc-900">
                                            Ubah Password
                                        </h2>

                                        <p className="text-zinc-500 text-lg mt-1">
                                            Perbarui password akun Anda
                                        </p>

                                    </div>

                                </div>

                                <div className="mt-10 space-y-7">

                                    <div>

                                        <label className="block text-lg font-semibold text-zinc-700 mb-3">
                                            Password Lama
                                        </label>

                                        <div className="h-16 md:h-20 rounded-3xl border border-zinc-200 bg-zinc-50 px-6 flex items-center gap-4">

                                            <div className="w-12 h-12 rounded-2xl bg-lime-100 flex items-center justify-center">

                                                <Lock className="w-6 h-6 text-lime-600" />

                                            </div>

                                            <input
                                                type="password"
                                                value={oldPassword}
                                                onChange={(e) => setOldPassword(e.target.value)}
                                                placeholder="Masukkan password lama"
                                                className="bg-transparent outline-none text-xl font-medium text-zinc-800 w-full"
                                            />

                                        </div>

                                    </div>

                                    {/* PASSWORD BARU */}
                                    <div>

                                        <label className="block text-lg font-semibold text-zinc-700 mb-3">
                                            Password Baru
                                        </label>

                                        <div className="h-16 md:h-20 rounded-3xl border border-zinc-200 bg-zinc-50 px-6 flex items-center gap-4">

                                            <div className="w-12 h-12 rounded-2xl bg-lime-100 flex items-center justify-center">

                                                <Lock className="w-6 h-6 text-lime-600" />

                                            </div>

                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Masukkan password baru"
                                                className="bg-transparent outline-none text-xl font-medium text-zinc-800 w-full"
                                            />

                                        </div>

                                    </div>

                                    {/* BUTTON */}
                                    <button
                                        onClick={handleChangePassword}
                                        disabled={loading}
                                        className="w-full h-16 md:h-20 rounded-3xl bg-lime-400 hover:bg-lime-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-white text-lg md:text-2xl font-bold flex items-center justify-center gap-4 shadow-[0_10px_25px_rgba(132,204,22,0.25)]"
                                    >

                                        <ShieldCheck className="w-7 h-7" />

                                        {loading ? "Menyimpan..." : "Simpan Perubahan"}

                                    </button>

                                </div>
                            </div>
                        )}

                    </div>
                </div>

            </main>

        </div>
    )
}