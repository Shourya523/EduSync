import mongoose, { Schema, Document } from "mongoose"

export interface YouTubeLink {
  title: string
  url: string
  addedAt: Date
}

const YouTubeLinkSchema = new Schema<YouTubeLink>({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
})

export interface User extends Document {
  uid: string
  name?: string
  email?: string
  avatar?: string
  phoneNo: {
    type: String,
    unique: true,
    sparse: true,
  },

  youtubeLinks: YouTubeLink[]
  createdAt: Date
  updatedAt: Date

}


const UserSchema = new Schema<User>(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    avatar: { type: String },
    phoneNo: {
      type: String,
      unique: true,
      sparse: true,
    },
    youtubeLinks: {
      type: [YouTubeLinkSchema],
      default: [],
    },
  },
  { timestamps: true }
)


export const UserModel =
  mongoose.models.User ||
  mongoose.model<User>("User", UserSchema)
