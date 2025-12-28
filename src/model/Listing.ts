import mongoose, { Schema, model, models } from "mongoose";

const ListingSchema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }, // Cloudinary URL
    sellerName: { type: String, required: true },
    sellerId: { type: String, required: true }, // Firebase UID
    sellerJoined: { type: String, default: "2024" },
  },
  { timestamps: true }
);

const Listing = models.Listing || model("Listing", ListingSchema);
export default Listing;