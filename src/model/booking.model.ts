import mongoose, { Schema, Document, Types } from "mongoose";
type BookingProps = {
  destination: {
    lat: number
    lng: number
    placeName:string
  }
};

export interface BookingDocument extends BookingProps, Document {
  user: Types.ObjectId;
  status: "open" | "contacted";
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<BookingDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    destination: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
      placeName:{
        type:String,
        required:true,
      }
    },

    status: {
      type: String,
      enum: ["open", "contacted"],
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

export const BookingModel =
  mongoose.models.Booking ||
  mongoose.model<BookingDocument>("Booking", BookingSchema);
