import mongoose from "mongoose";
import { required } from "zod/mini";

const marketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    creatorId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    expiry: {
        type: Date,
        required: true,
    },
    initialWager: {
        type: Number,
        required: true
    },

    side: {
        type: String,
        enum: ["yes", "no"],
        required: true
    },
    resolution: {
        type: String,
        enum: ["yes", "no", "null"],
        default: "null"
    },
});

export const Market = mongoose.model('Market', marketSchema);