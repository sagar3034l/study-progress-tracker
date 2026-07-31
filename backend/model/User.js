import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: [true,"Email is required"],
        unique: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
        trim: true
    },
    role:{
       type: String,
       default: "Student",
       trim: true
    },
},{timestamps: true})

const User = mongoose.model("User", UserSchema);

export default User;
