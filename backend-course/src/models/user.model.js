import { randomUUID } from 'node:crypto';
import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    // Prisma: id String @id @default(uuid())
    _id: {
      type: String,
      default: () => randomUUID(),
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    // Prisma: createdAt DateTime @default(now()) — no updatedAt on User
    timestamps: { createdAt: true, updatedAt: false },
    // API output: return "id" instead of MongoDB's "_id" (like Prisma)
    toJSON: {
      transform: (doc, ret) => {
        const { _id, ...rest } = ret;
        return { id: _id, ...rest };
      },
    },
  },
);

export const User = mongoose.model('User', userSchema);
