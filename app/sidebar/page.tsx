"use client"

import {
    Home,
    BarChart3,
    Notebook,
    LogOut,
    Menu,
    X,
} from "lucide-react"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"


type UserType = {
    name: string
    email: string
    profileImage?: string
}

export default function Sidebar() {
    const router = useRouter()
    const pathname = usePathname()

    const [user, setUser] = useState<UserType>({
        name: "",
        email: "",
    })

    const [isOpen, setIsOpen] = useState(false)
    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    useEffect(() => {

        const loadUser = () => {
            console.log("Sidebar update")

            const storedUser = localStorage.getItem("user")

            if (storedUser) {
                const parsedUser: UserType = JSON.parse(storedUser)
                setUser(parsedUser)
            }

        }

        loadUser()

        window.addEventListener("userUpdated", loadUser)

        return () => {
            window.removeEventListener("userUpdated", loadUser)
        }

    }, [])

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")

        router.push("/sign-in")
    }

    return (
        <>
            {/* HAMBURGER */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 bg-white shadow-md rounded-xl p-2 lg:hidden"
            >
                <div
                    className={`
            transition-all
            duration-300
            ${isOpen ? "rotate-90 scale-110" : "rotate-0 scale-100"}
        `}
                >
                    {isOpen ? (
                        <X size={24} />
                    ) : (
                        <Menu size={24} />
                    )}
                </div>
            </button>

            {/* OVERLAY */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
            <aside
                className={` fixed bg-white z-50 transition-all duration-200

        top-16
        left-4
        w-64
        rounded-[28px]
        shadow-xl

        ${isOpen
                        ? "opacity-100 scale-100 pointer-events-auto"
                        : "opacity-0 scale-95 pointer-events-none"
                    }

        lg:top-0
        lg:left-0
        lg:h-screen
        lg:w-64
        lg:border-r
        lg:border-gray-200
        lg:rounded-none
        lg:shadow-none
        lg:flex
        lg:flex-col
        lg:justify-between
        lg:opacity-100
        lg:scale-100
        lg:pointer-events-auto
    `}
            >

                {/* ATAS */}
                <div className="p-4">


                    {/* LOGO */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                            <img
                                src="/glucofy-logo.png"
                                alt="Logo"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-lime-500">
                                Glucofy
                            </h1>

                            <p className="text-sm text-gray-500">
                                Your Daily Sugar Tracker
                            </p>
                        </div>
                    </div>

                    {/* MENU */}
                    <div className="space-y-2">

                        <Link
                            href="/dasbor"
                            onClick={() => setIsOpen(false)}
                            className={`rounded-2xl px-4 py-4 flex items-center gap-3 font-medium transition ${pathname === "/dasbor"
                                ? "bg-lime-50 text-lime-600"
                                : "hover:bg-lime-50 hover:text-lime-600"
                                }`}
                        >
                            <Home size={20} />
                            Dashboard
                        </Link>

                        <Link
                            href="/YourReport"
                            onClick={() => setIsOpen(false)}
                            className={`rounded-2xl px-4 py-4 flex items-center gap-3 transition ${pathname === "/YourReport"
                                ? "bg-lime-50 text-lime-600"
                                : "hover:bg-lime-50 hover:text-lime-600"
                                }`}
                        >
                            <BarChart3 size={20} />
                            History
                        </Link>

                        <Link
                            href="/HabbitMonitor"
                            onClick={() => setIsOpen(false)}
                            className={`rounded-2xl px-4 py-4 flex items-center gap-3 transition ${pathname === "/HabbitMonitor"
                                ? "bg-lime-50 text-lime-600"
                                : "hover:bg-lime-50 hover:text-lime-600"
                                }`}
                        >
                            <Notebook size={20} />
                            Report
                        </Link>

                    </div>
                </div>

                {/* PROFILE BAWAH */}
                <div className="border-t border-gray-200 p-4 lg:mt-auto">
                    <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="bg-white border border-gray-200 rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm hover:bg-gray-200 transition"
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-14 h-14 shrink-0 rounded-2xl overflow-hidden bg-lime-500 flex items-center justify-center">
                                {user.profileImage ? (
                                    <img
                                        src={user.profileImage}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span>
                                        {user.name ? user.name.charAt(0) : "U"}
                                    </span>
                                )}

                            </div>

                            <div className="flex flex-col overflow-hidden">
                                <span className="text-gray-800 font-semibold text-sm truncate">
                                    {user.name || "Username"}
                                </span>

                                <span className="text-gray-500 text-xs truncate">
                                    {user.email || "email@gmail.com"}
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault()
                                handleLogout()
                            }}
                            className="text-gray-400 hover:text-lime-600 transition"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </Link>
                </div>

            </aside>
        </>
    )
}