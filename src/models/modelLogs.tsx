import { Schema, model, models } from "mongoose";

const logSchema = new Schema({
    code: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    data: {
        type: Schema.Types.Mixed,
        required: true,
    },
    isLast: {
        type: Boolean,
        required: true
    }
})

let LogModel;

try{
    LogModel = model("Log");
}catch(e){
    LogModel = model("Log", logSchema)
}

const Logs = models.Logs || LogModel ;

export default Logs;
