'use client'

import { cn } from "@/src/lib/utils"
import { Button } from "@/src/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/src/components/ui/field"
import { Input } from "@/src/components/ui/input"

import { auth } from "@/src/lib/firebase"
import { useEffect, useState } from "react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [user, setUser] = useState<any>(null)
  const [phoneNo, setPhoneNo] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const currentUser = auth.currentUser
    if (currentUser) {
      setUser(currentUser)
    }
  }, [])

  const handleSubmit = async () => {
    if (!phoneNo) return

    try {
      setLoading(true)

      const idToken = await user.getIdToken()

      await fetch("/api/auth/firebase/google/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          phoneNo,
        }),
      })

      // redirect after success
      window.location.href = "/dashboard"
    } catch (err) {
      console.error("Phone update failed", err)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Complete your profile</CardTitle>
          <CardDescription>
            Confirm your details and add your phone number
          </CardDescription>
        </CardHeader>

        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input value={user.displayName || ""} disabled />
            </Field>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input value={user.email || ""} disabled />
            </Field>

            <Field>
              <FieldLabel>Phone Number</FieldLabel>
              <Input
                placeholder="10-digit mobile number"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
              />
              <FieldDescription>
                Required so other students can contact you
              </FieldDescription>
            </Field>

            <Field>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Saving..." : "Continue"}
              </Button>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  )
}
