"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

export default function VerifyOtp() {

  const router = useRouter()

  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(60)

  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {

    if (countdown <= 0) return

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)

  }, [countdown])

  const handleChange = (
    value: string,
    index: number
  ) => {

    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]

    newOtp[index] = value.slice(-1)

    setOtp(newOtp)

    if (
      value &&
      index < 5
    ) {
      inputsRef.current[index + 1]?.focus()
    }

  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {

    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputsRef.current[index - 1]?.focus()
    }

  }

  const handleVerify = async () => {

    const code = otp.join("")

    if (code.length !== 6) {
      toast.error("Please enter all 6 OTP digits")
      return
    }

    try {

      setLoading(true)

      const email =
        localStorage.getItem("resetEmail")

      if (!email) {
        toast.error("Email not found")
        return
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/otp/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            code
          })
        }
      )

      const data =
        await response.json()

      if (!response.ok) {

        toast.error(
          data.message ||
          "Invalid OTP code"
        )

        return

      }

      localStorage.setItem(
        "resetToken",
        data.reset_token
      )

      toast.success(
        "OTP verified successfully"
      )

      router.push(
        "/reset-password"
      )

    } catch (error) {

      console.error(error)

      toast.error(
        "Something went wrong"
      )

    } finally {

      setLoading(false)

    }

  }

  const handleResendOtp = async () => {

    const email =
      localStorage.getItem("resetEmail")

    if (!email) {

      toast.error(
        "Email not found"
      )

      return

    }

    try {

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/otp/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      )

      if (!response.ok) {

        toast.error(
          "Failed to resend OTP"
        )

        return

      }

      setCountdown(60)

      toast.success(
        "OTP sent successfully"
      )

    } catch (error) {

      console.error(error)

      toast.error(
        "Failed to resend OTP"
      )

    }

  }


  return (
    <div className="min-h-screen flex">

      {/* LEFT */}
      <div className="hidden lg:flex w-1/2 bg-black relative overflow-hidden items-center justify-center">

        <div className="absolute w-[500px] h-[500px] rounded-full bg-lime-500/20 blur-[120px]" />

        <div className="relative z-10 flex flex-col items-center px-12">

          <img
            src="/glucofy-logo.png"
            alt="Glucofy"
            className="w-80"
          />

          <h1 className="text-white text-5xl font-bold mt-8">
            Verify OTP
          </h1>

          <p className="text-zinc-400 text-xl mt-4 text-center">
            Enter the verification code
            sent to your email.
          </p>

        </div>

      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/2 bg-[#f8fafc] flex items-center justify-center px-6">

        <motion.div
          initial={{
            opacity: 0,
            y: 40
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.7
          }}
          className="w-full max-w-lg"
        >

          <div className="bg-white rounded-[32px] border border-zinc-200 shadow-xl p-10">

            <div className="text-center mb-8">

              <h1 className="text-4xl font-bold">
                Verify OTP
              </h1>

              <p className="text-zinc-500 mt-3">
                Enter the 6 digit code
              </p>

            </div>

            {/* OTP BOXES */}
            <div className="flex justify-center gap-3 mb-8">

              {otp.map((digit, index) => (

                <input
                  key={index}
                  ref={(el) => {
                    inputsRef.current[index] = el
                  }}
                  value={digit}
                  maxLength={1}
                  onChange={(e) =>
                    handleChange(
                      e.target.value,
                      index
                    )
                  }
                  onKeyDown={(e) =>
                    handleKeyDown(
                      e,
                      index
                    )
                  }
                  className="
                  w-14
                  h-14
                  rounded-xl
                  border
                  border-zinc-200
                  text-center
                  text-xl
                  font-bold
                  focus:border-lime-500
                  focus:ring-4
                  focus:ring-lime-100
                  outline-none
                "
                />

              ))}

            </div>

            {/* VERIFY BUTTON */}
            <motion.button
              whileHover={{
                scale: 1.02
              }}
              whileTap={{
                scale: 0.98
              }}
              onClick={handleVerify}
              disabled={loading}
              className="
              w-full
              h-14
              rounded-xl
              bg-lime-500
              hover:bg-lime-600
              text-white
              font-semibold
              flex
              items-center
              justify-center
              gap-2
            "
            >

              {loading ? (

                <div
                  className="
                  w-5
                  h-5
                  border-2
                  border-white
                  border-t-transparent
                  rounded-full
                  animate-spin
                "
                />

              ) : (

                <>
                  Verify OTP
                  <ArrowRight size={18} />
                </>

              )}

            </motion.button>

            {/* RESEND */}
            <div className="mt-6 text-center">

              {countdown > 0 ? (

                <p className="text-zinc-500">

                  Resend OTP in{" "}
                  <span className="font-semibold text-lime-600">
                    {countdown}s
                  </span>

                </p>

              ) : (

                <button
                  onClick={handleResendOtp}
                  className="
                  text-lime-600
                  font-semibold
                  hover:text-lime-700
                "
                >
                  Resend OTP
                </button>

              )}

            </div>

          </div>

        </motion.div>

      </div>

    </div>
  )
}