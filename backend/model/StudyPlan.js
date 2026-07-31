import mongoose from 'mongoose';

const studyPlanSchema = mongoose.Schema({
   subject: {
      type: String,
      required: [true, "Study plan is required"],
      trim: true,
   },  
   category:{
      type: String,
      trim: true,
      default: "tech",
      lowercase: true
   },
   targetHours:{
      type: Number, // in hours
      required: true,
      trim: true,
      lowercase: true
   },
   progressTillNow:{
      type: Number,
      trim: true,
      lowercase: true,
      default: 0
   },
   plannedBy:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
   },
   isCompleted:{
      type: Boolean,
      default: false
   } 
},{timestamps: true})

const StudyModel = mongoose.model("StudyModel",studyPlanSchema);

export default StudyModel;

