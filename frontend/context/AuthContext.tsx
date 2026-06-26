"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
  if (user) {
    router.push("/dashboard");
  }
}, [user]);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      router.push("/dashboard")
    } catch (err) {
      console.error("Google sign-in error:", err)
      throw err
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (err) {
      console.error("Sign-out error:", err)
      throw err
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)