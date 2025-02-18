import mongoose from "mongoose";

const connect = () => {
    if (mongoose.connections[0].readyState) {
        // console.log("MongoDB already connected");
        return;
    }

    mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.log(error));
}

export default connect;
