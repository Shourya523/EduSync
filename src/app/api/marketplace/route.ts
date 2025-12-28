import { NextResponse } from "next/server";
import dbConnect from "@/src/lib/dbConnect";
import Listing from "@/src/model/Listing";
import cloudinary from "@/src/lib/cloudinary"; 
import { firebaseAdmin } from "@/src/lib/firebaseAdmin";

// Helper to upload file to Cloudinary
async function uploadToCloudinary(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "edusync/marketplace" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result?.secure_url || "");
      }
    ).end(buffer);
  });
}

// GET: Fetch all listings
export async function GET() {
  try {
    await dbConnect();
    // Sort by newest first
    const listings = await Listing.find().sort({ createdAt: -1 });
    return NextResponse.json(listings);
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
  }
}

// POST: Create a new listing (Protected)
export async function POST(req: Request) {
  try {
    // 1. Verify User
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    
    const sellerId = decodedToken.uid;
    const sellerName = decodedToken.name || decodedToken.email?.split("@")[0] || "Student";

    // 2. Parse Form Data
    const formData = await req.formData();
    const title = formData.get("title");
    const price = formData.get("price");
    const category = formData.get("category");
    const location = formData.get("location");
    const description = formData.get("description");
    const imageFile = formData.get("image") as File;

    if (!imageFile || !title || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 3. Upload Image & Save DB
    const imageUrl = await uploadToCloudinary(imageFile);
    
    await dbConnect();
    const newListing = await Listing.create({
      title,
      price,
      category,
      location,
      description,
      image: imageUrl,
      sellerName,
      sellerId,
      sellerJoined: new Date().getFullYear().toString()
    });

    return NextResponse.json(newListing, { status: 201 });

  } catch (error) {
    console.error("Create Listing Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const { id } = await req.json();

    await dbConnect();
    
    // Check if listing exists and belongs to user
    const listing = await Listing.findById(id);
    
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (listing.sellerId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete image from Cloudinary (Optional, but good practice)
    if (listing.image.includes("cloudinary")) {
      // You would extract public_id here and delete, skipping for brevity
    }

    await Listing.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Listing Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}