import { NextResponse } from "next/server"
import { firebaseAdmin } from "@/src/lib/firebaseAdmin"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const idToken = authHeader.split("Bearer ")[1]
    const decoded = await firebaseAdmin.auth().verifyIdToken(idToken)
    const uid = decoded.uid

    const formData = await req.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as "pdf" | "note"

    if (!file || !type) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const MAX_SIZE_MB = 20
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 413 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const baseName = file.name.replace(/\.[^/.]+$/, "")
    const folder = `edusync/users/${uid}/${type}s`

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: baseName,
          resource_type: "raw",
          use_filename: true,
          unique_filename: false,
          overwrite: true,
        },
        (err, res) => (err ? reject(err) : resolve(res))
      ).end(buffer)
    })

    return NextResponse.json({
      success: true,
      id: result.public_id,
      url: result.secure_url,
      name: file.name,
      type,
    })
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
