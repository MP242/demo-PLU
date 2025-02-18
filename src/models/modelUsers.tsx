import { Schema, model, models } from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 60 * 1000),
    }
})


userSchema.methods.comparePassword = function (password: string) {
    if (this.password === "waiting") {
        return false;
    }
    const res = bcrypt.compare(password, this.password)
    return res;
}

const Users = models.User || model("User", userSchema);

export default Users;
