import { NextResponse } from "next/server"
import { firebaseAdmin } from "@/src/lib/firebaseAdmin"
import dbConnect from "@/src/lib/dbConnect"
import { UserModel } from "@/src/model/user.model"

export async function POST(req: Request) {
  try {
    const { idToken, phoneNo } = await req.json()

    if (!idToken || !phoneNo) {
      return NextResponse.json(
        { error: "Missing token or phone number" },
        { status: 400 }
      )
    }
    const phoneRegex = /^[6-9]\d{9}$/
    if (!phoneRegex.test(phoneNo)) {
      return NextResponse.json(
        { error: "Invalid Indian phone number" },
        { status: 400 }
      )
    }

    const decodedToken = await firebaseAdmin
      .auth()
      .verifyIdToken(idToken)

    const { uid } = decodedToken

    await dbConnect()

    const user = await UserModel.findOneAndUpdate(
      { uid },
      { phoneNo },
      { new: true }
    )

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error: any) {
    console.error("Phone update error:", error)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Phone number already in use" },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: "Unauthorized or failed request" },
      { status: 401 }
    )
  }
}
