import { Schema, model, models } from "mongoose";

const fileSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    success: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    error: {
        type: Number,
        required: true,
    },
})

const Files = models.File || model("File", fileSchema);

export default Files;
