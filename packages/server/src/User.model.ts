import mongoose, { Schema, Document, Model, CallbackWithoutResultAndOptionalError } from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "@job-tracker/shared";

// Merge shared interface with Mongoose Document
type UserDocument = User & Document & {
  passwordHash: string;
  refreshTokens: string[];
  comparePassword(password: string): Promise<boolean>;
};

type UserModel = Model<UserDocument> & {
  findByEmail(email: string): Promise<UserDocument | null>;
};

// Preferences sub-document schema
const userPreferencesSchema = new Schema({
  timezone: { type: String, default: 'UTC' },
  defaultBoardView: { type: String, enum: ['board', 'list'], default: 'board' },
  emailReminders: { type: Boolean, default: true },
  reminderDaysBefore: { type: Number, default: 1 },
}, { _id: false });

const userSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  refreshTokens: [{ type: String }],
  preferences: { type: userPreferencesSchema, default: () => ({}) },
}, { timestamps: true });

// Pre-save hook to hash password
userSchema.pre('save', async function(this: UserDocument) {
  if (!this.isModified('passwordHash')) return;
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function(
  this: UserDocument,
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash);
};

// Static method to find user by email
userSchema.statics.findByEmail = function(
  email: string
): Promise<UserDocument | null> {
  return this.findOne({ email: email.toLowerCase() });
};

export const UserModel = mongoose.model<UserDocument, UserModel>(
  'User',
  userSchema
);
