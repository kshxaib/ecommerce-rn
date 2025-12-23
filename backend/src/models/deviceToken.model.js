import mongoose from "mongoose";

const deviceTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    token: {    // push token
        type: String,
        required: true,
        unique: true,
    },
    platform: {
        type: String, // expo | fcm
    },
}, { timestamps: true });

export const DeviceToken = mongoose.model("DeviceToken", deviceTokenSchema);