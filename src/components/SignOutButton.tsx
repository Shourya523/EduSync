'use client'

import { LogOut } from "lucide-react"
import { signOut } from "firebase/auth"
import { auth } from "@/src/lib/firebase"
import { useRouter } from "next/navigation"
import "./SignOutButton.css"

export default function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut(auth)
    router.replace("/home")
  }

  return (
    <button
      onClick={handleSignOut}
      className="signout-btn"
      aria-label="Sign out"
    >
      <LogOut size={18} className="signout-icon" />
      <span>Sign out</span>
    </button>
  )
}
