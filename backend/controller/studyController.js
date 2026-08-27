import StudyModel from "../model/StudyPlan.js";

function buildAttributesForUpdate(body){
    const data = {}
    if(body.subject !== undefined) data.subject = body.subject;
    if(body.Subject !== undefined) data.subject = body.Subject;
    if(body.category !== undefined) data.category = body.category;
    if(body.targetHours !== undefined) data.targetHours = body.targetHours;
    if(body.isCompleted !== undefined) data.isCompleted = body.isCompleted;

    return data;
}

export async function generateStudyPlan(req,res){
    try {
        const {subject,targetHours,category} = req.body;

        const userId = req.user._id;

        if(!userId){
            res.status(401).json({error: "Unauthorized"});
            return;
        }
 
        if(!subject || !targetHours){
            res.status(400).json({
                error: "All field is required"
            })
            return;
        }

        const StudyPlan = await StudyModel.create({
            subject,
            targetHours,
            category,
            plannedBy: userId
        })

        res.json({
            StudyPlan
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal server error"})
    }
}

export async function updateStudySchema(req,res){
    try {
        const updatedData = buildAttributesForUpdate(req.body);
        const {id} = req.params;
        const userId = req.user?._id;
        
        if(Object.keys(updatedData).length === 0){
            res.status(400).json({error:"No fields to update"})
            return;
        }

        const updatedStudySchema = await StudyModel.findOneAndUpdate(
            { _id: id, plannedBy: userId },
            updatedData,
            { new: true, runValidators: true }
        );

        if(!updatedStudySchema){
            res.status(404).json({error:"Study plan not found"})
            return;
        }

        res.json({
            updatedStudySchema,
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal server error"})
    }
}

export async function getAllStudyPlans(req,res){
    try {
        const user = req.user;
        
        if(!user){
            res.status(401).json({error: "Unauthorized"})
            return;
        }

        const Plans = await StudyModel.find({plannedBy:user._id })
        res.json({
            Plans
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal server error"})
    }
}

export async function deletePlan(req,res) {
    try {
        const {id} = req.params;
        const userId = req.user?._id;
        const deletedPlan = await StudyModel.findOneAndDelete({ _id: id, plannedBy: userId });

        if(!deletedPlan){
            res.status(404).json({error:"Study plan not found"})
            return;
        }

        res.json({
            success: true,
            message:"Shedule deleted"
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({error: "Internal server error"})
    }
}
