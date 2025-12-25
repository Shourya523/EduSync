import { NextResponse } from "next/server"
import { firebaseAdmin } from "@/src/lib/firebaseAdmin"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type") as "pdf" | "note"

    if (!type) {
      return NextResponse.json([], { status: 400 })
    }

    const authHeader = req.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json([], { status: 401 })
    }

    const idToken = authHeader.split("Bearer ")[1]
    const decoded = await firebaseAdmin.auth().verifyIdToken(idToken)
    const uid = decoded.uid

    const folder = `edusync/users/${uid}/${type}s`

    const result = await cloudinary.search
      .expression(`folder:${folder}`)
      .sort_by("created_at", "desc")
      .max_results(50)
      .execute()

    const files = result.resources.map((r: any) => ({
      id: r.public_id,
      name: r.filename,
      url: r.secure_url,
    }))

    return NextResponse.json(files)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id, type } = await req.json()

    if (!id || !type) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const authHeader = req.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const idToken = authHeader.split("Bearer ")[1]
    const decoded = await firebaseAdmin.auth().verifyIdToken(idToken)
    const uid = decoded.uid

    const expectedPrefix = `edusync/users/${uid}/${type}s/`
    if (!id.startsWith(expectedPrefix)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const result = await cloudinary.uploader.destroy(id, {
      resource_type: "raw",
    })

    return NextResponse.json({ success: true, result })
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
