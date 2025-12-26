import { NextResponse } from "next/server";
import { firebaseAdmin } from "@/src/lib/firebaseAdmin"; // Keep this for security
import dbConnect from "@/src/lib/dbConnect"; // Your MongoDB connection
import mongoose from "mongoose";

// 1. Define the Order Schema (or move to src/model/Order.ts)
const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  items: { type: Array, required: true },
  total: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

// Prevent "OverwriteModelError" in development
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export async function POST(req: Request) {
  try {
    // 2. Connect to MongoDB
    await dbConnect();

    // 3. Verify User (Security Layer)
    const header = req.headers.get("Authorization");
    if (!header || !header.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const idToken = header.split("Bearer ")[1];
    
    // This checks if the token is valid using Firebase
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);

    // 4. Get Data
    const { items, total } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 5. Save to MongoDB
    const newOrder = await Order.create({
      userId: decodedToken.uid,
      userEmail: decodedToken.email,
      items,
      total,
    });

    return NextResponse.json({ 
      success: true, 
      orderId: newOrder._id,
      message: "Order placed successfully via MongoDB" 
    });

  } catch (error: any) {
    console.error("MongoDB Order Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}