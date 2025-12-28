import mongoose, { Schema, model, models } from "mongoose";

const MessageSchema = new Schema(
  {
    senderId: { type: String, required: true },
    senderName: { type: String, required: true },
    receiverId: { type: String, required: true }, // Seller's UID
    listingId: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Message = models.Message || model("Message", MessageSchema);
export default Message;