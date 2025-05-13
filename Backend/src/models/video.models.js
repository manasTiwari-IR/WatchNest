

import { Schema } from "mongoose";
import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoFile:{
            type: String, //URL
            required: true,
        },
        thumbnail:{
            type: String, //URL
            required: true,
        },
        keys:{
            type: Array,
            default: [],
        },
        title:{
            type: String,
            required: true,
        },
        description:{
            type: String,
            required: true,
        },
        views:{
            type: Number,
            default: 0
        },
        duration:{
            type: Number,
            required: true,
        },
        isPublished:{
            type: Boolean,
            default: true
        },
        owner:{
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {timestamps: true}
)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema);