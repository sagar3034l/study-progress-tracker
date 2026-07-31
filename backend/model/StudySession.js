import mongoose from 'mongoose';

const StudyProgressSchema = mongoose.Schema({
      user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      subject:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudyModel"
      },
      topic:{
        type: [String],
        lowercase: true,
        trim: true
      },
      createdDay:{
        type: String,
        default: () => new Date().toLocaleString("en-US", {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})
      },
      studyTime:{
        type: Number, // in minutes 👎 hours only
        default: 0
      },
},{timestamps: true})
const studyProgress = new mongoose.model("studyProgress", StudyProgressSchema);


export default studyProgress;





