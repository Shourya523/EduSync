import { NextResponse } from "next/server"
import dbConnect from "@/src/lib/dbConnect"
import { UserModel } from "@/src/model/user.model"
import { firebaseAdmin } from "@/src/lib/firebaseAdmin"

async function getUser(req: Request) {
  const authHeader = req.headers.get("authorization")
  if (!authHeader) throw new Error("Unauthorized")

  const token = authHeader.replace("Bearer ", "")
  const decoded = await firebaseAdmin.auth().verifyIdToken(token)

  await dbConnect()

  const user = await UserModel.findOne({ uid: decoded.uid })
  if (!user) throw new Error("User not found")

  return user
}

function extractYouTubeId(url: string) {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1)
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v') || ''
  } catch (e) {
    return ''
  }
  return ''
}

export async function GET(req: Request) {
  try {
    const user = await getUser(req)
    const videos = (user.youtubeLinks || []).map((v: any) => {
      const id = extractYouTubeId(v.url) || encodeURIComponent(v.url)
      return {
        id,
        title: v.title,
        url: v.url,
        thumbnail: id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : undefined,
        channel: (v as any).channel || null,
        addedAt: v.addedAt,
      }
    })

    return NextResponse.json(videos)
  } catch (err) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    if (!url) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })

    const user = await getUser(req)
    let title = ''
    let channel: string | null = null
    try {
      const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`)
      if (res.ok) {
        const j = await res.json()
        title = j.title || ''
        channel = j.author_name || null
      }
    } catch (e) {
    }
    if (!title) title = url

    user.youtubeLinks.push({ title, url, addedAt: new Date() })
    await user.save()

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { url } = await req.json()
    if (!url) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })

    const user = await getUser(req)

    user.youtubeLinks = user.youtubeLinks.filter((v: any) => v.url !== url)
    await user.save()

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 400 })
  }
}
