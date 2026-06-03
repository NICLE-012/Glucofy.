// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { toast } from "sonner"

// import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion"

// import {
//     User,
//     Mail,
//     Lock,
//     Eye,
//     EyeOff,
//     ArrowRight,
// } from "lucide-react"

// const Input = ({
//     className = "",
//     ...props
// }: React.InputHTMLAttributes<HTMLInputElement>) => {
//     return (
//         <input
//             {...props}
//             className={`w-full h-11 bg-white/5 border border-white/10 rounded-lg pl-10 pr-10 text-white placeholder:text-white/40 outline-none focus:border-white/30 transition ${className}`}
//         />
//     )
// }

// export default function SignUpPage() {
//     const router = useRouter()

//     const [name, setName] = useState("")
//     const [email, setEmail] = useState("")
//     const [password, setPassword] = useState("")

//     const [showPassword, setShowPassword] =
//         useState(false)

//     const [isLoading, setIsLoading] =
//         useState(false)

//     const [focusedInput, setFocusedInput] =
//         useState<string | null>(null)

//     const rotateX = useSpring(0)
//     const rotateY = useSpring(0)

//     const handleMouseMove = (
//         e: React.MouseEvent<HTMLDivElement>
//     ) => {
//         const rect =
//             e.currentTarget.getBoundingClientRect()

//         const x =
//             e.clientX - rect.left - rect.width / 2

//         const y =
//             e.clientY - rect.top - rect.height / 2

//         rotateY.set(x / 25)
//         rotateX.set(-(y / 25))
//     }

//     const handleMouseLeave = () => {
//         rotateX.set(0)
//         rotateY.set(0)
//     }

//    async function handleSignUp(
//     e: React.FormEvent
//   ) {
//     e.preventDefault()

//     if (!name || !email || !password) {
//       alert("Semua field wajib diisi")
//       return
//     }

//     try {
//       setIsLoading(true)

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type":
//               "application/json",
//           },
//           body: JSON.stringify({
//             name,
//             email,
//             password,
//           }),
//         }
//       )

//       const text = await response.text()

//       let data = {}

//       try {
//         data = text ? JSON.parse(text) : {}
//       } catch {
//         throw new Error(
//           "Response server tidak valid"
//         )
//       }

//       if (!response.ok) {
//         throw new Error(
//           (data as any).message ||
//             "Registrasi gagal"
//         )
//       }

//       alert(
//         (data as any).message ||
//           "Registrasi berhasil"
//       )

//       setName("")
//       setEmail("")
//       setPassword("")

//       router.push("/sign-in")
//     } catch (error: any) {
//       console.error(error)

//       alert(
//         error.message ||
//           "Server tidak dapat dihubungi"
//       )
//     } finally {
//       setIsLoading(false)
//     }
//   }
//     return (
//         <div className="min-h-screen w-full bg-black relative overflow-hidden flex items-center justify-center px-4">
//             <div className="absolute inset-0 bg-linear-to-b from-purple-500/40 via-purple-700/50 to-black" />

//             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-purple-400/20 blur-[80px]" />

//             <motion.div
//                 className="w-full max-w-sm relative z-10"
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.7 }}
//                 style={{ perspective: 1500 }}
//             >
//                 <motion.div
//                     style={{ rotateX, rotateY }}
//                     onMouseMove={handleMouseMove}
//                     onMouseLeave={handleMouseLeave}
//                     className="relative"
//                 >
//                     <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl overflow-hidden">
//                         <div className="text-center mb-6">
//                             <div className="mx-auto w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
//                                 <span className="text-xl font-bold text-white">
//                                     S
//                                 </span>
//                             </div>

//                             <h1 className="text-2xl font-bold text-white mt-4">
//                                 Create Account
//                             </h1>

//                             <p className="text-white/60 text-sm mt-1">
//                                 Register to continue
//                             </p>
//                         </div>

//                         <form
//                             onSubmit={handleSignUp}
//                             className="space-y-4"
//                         >
//                             <div className="relative">
//                                 <User
//                                     className={`absolute left-3 top-3.5 w-4 h-4 ${focusedInput === "name"
//                                         ? "text-white"
//                                         : "text-white/40"
//                                         }`}
//                                 />

//                                 <Input
//                                     type="text"
//                                     placeholder="Full Name"
//                                     value={name}
//                                     onChange={(e) =>
//                                         setName(e.target.value)
//                                     }
//                                     onFocus={() =>
//                                         setFocusedInput("name")
//                                     }
//                                     onBlur={() =>
//                                         setFocusedInput(null)
//                                     }
//                                 />
//                             </div>

//                             <div className="relative">
//                                 <Mail
//                                     className={`absolute left-3 top-3.5 w-4 h-4 ${focusedInput === "email"
//                                         ? "text-white"
//                                         : "text-white/40"
//                                         }`}
//                                 />

//                                 <Input
//                                     type="email"
//                                     placeholder="Email Address"
//                                     value={email}
//                                     onChange={(e) =>
//                                         setEmail(e.target.value)
//                                     }
//                                     onFocus={() =>
//                                         setFocusedInput("email")
//                                     }
//                                     onBlur={() =>
//                                         setFocusedInput(null)
//                                     }
//                                 />
//                             </div>

//                             <div className="relative">
//                                 <Lock
//                                     className={`absolute left-3 top-3.5 w-4 h-4 ${focusedInput === "password"
//                                         ? "text-white"
//                                         : "text-white/40"
//                                         }`}
//                                 />

//                                 <Input
//                                     type={
//                                         showPassword
//                                             ? "text"
//                                             : "password"
//                                     }
//                                     placeholder="Password"
//                                     value={password}
//                                     onChange={(e) =>
//                                         setPassword(e.target.value)
//                                     }
//                                     onFocus={() =>
//                                         setFocusedInput(
//                                             "password"
//                                         )
//                                     }
//                                     onBlur={() =>
//                                         setFocusedInput(null)
//                                     }
//                                 />


//                                 <button
//                                     type="button"
//                                     onClick={() =>
//                                         setShowPassword(
//                                             !showPassword
//                                         )
//                                     }
//                                     className="absolute right-3 top-3"
//                                 >
//                                     {showPassword ? (
//                                         <Eye className="w-4 h-4 text-white/40" />
//                                     ) : (
//                                         <EyeOff className="w-4 h-4 text-white/40" />
//                                     )}
//                                 </button>
//                             </div>
                           
//                                 <motion.button
//                                     type="submit"
//                                     disabled={isLoading}
//                                     whileHover={{
//                                         scale: 1.02,
//                                     }}
//                                     whileTap={{
//                                         scale: 0.97,
//                                     }}
//                                     className="w-full h-11 rounded-lg bg-white text-black font-semibold flex items-center justify-center gap-2"
//                                 >
//                                     <AnimatePresence mode="wait">
//                                         {isLoading ? (
//                                             <motion.div
//                                                 key="loading"
//                                                 className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"
//                                             />
//                                         ) : (
//                                             <motion.div
//                                                 key="text"
//                                                 className="flex items-center gap-2"
//                                             >
//                                                 Sign Up
//                                                 <ArrowRight className="w-4 h-4" />
//                                             </motion.div>
//                                         )}
//                                     </AnimatePresence>
//                                 </motion.button>
                            

//                             <p className="text-center text-white/60 text-sm pt-2">
//                                 Already have an account?{" "}
//                                 <Link
//                                     href="/sign-in"
//                                     className="text-white hover:underline"
//                                 >
//                                     Sign In
//                                 </Link>
//                             </p>
//                         </form>
//                     </div>
//                 </motion.div>
//             </motion.div>
//         </div>
//     )
// }