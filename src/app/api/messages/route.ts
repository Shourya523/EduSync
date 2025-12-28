import { NextResponse } from "next/server";
import dbConnect from "@/src/lib/dbConnect";
import Message from "@/src/model/Message";
import { firebaseAdmin } from "@/src/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    
    const { receiverId, listingId, content } = await req.json();

    await dbConnect();
    await Message.create({
      senderId: decodedToken.uid,
      senderName: decodedToken.name || decodedToken.email?.split("@")[0] || "Student",
      receiverId,
      listingId,
      content,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}