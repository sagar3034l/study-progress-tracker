import StudyModel from "../model/StudyPlan.js";
import studyProgress from "../model/StudySession.js";

function normalizeTopicList(topic) {
    if (Array.isArray(topic)) {
        return topic.map((item) => String(item).trim()).filter(Boolean);
    }

    if (typeof topic === "string") {
        return topic
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return [];
}

export async function createProgressController(req, res) {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const { topic, studyTime, timeUnit } = req.body;
        const topicList = normalizeTopicList(topic);

        const { id } = req.params;

        if (topicList.length === 0 || !studyTime) {
            res.status(400).json({ error: "All field is required" });
            return;
        }

        let newStudyTime = studyTime;

        if ((timeUnit || "").trim() === "minutes") {
            newStudyTime = studyTime / 60
        }

        const update = {
            $inc: {
                progressTillNow: newStudyTime,
            }
        };

        const result = await StudyModel.findByIdAndUpdate(id, update, { returnDocument: true })

        const currentDate = new Date(Date.now());

        const createdDay = currentDate.toLocaleString("en-US", {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        })

        const existedSheduleHistory = await studyProgress.updateOne({ createdDay: createdDay, subject: id }, {
            $inc: {
                studyTime: newStudyTime
            },
            $push: {
                topic: {
                    $each: topicList
                }
            },
        });

        if (existedSheduleHistory.modifiedCount !== 0) {
            res.json({
                data: {
                    subject: id,
                    topic: topicList,
                    studyTime,
                    date: createdDay
                }
            })
            return;
        }
        await studyProgress.create({
            user: user._id ,subject: id, topic: topicList, studyTime, createdDay
        })

        res.json({
            data: {
                topic: topicList,
                studyTime,
                date: createdDay
            }
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" })
    }
}

export async function getSubjectLogs(req, res) {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        let dailyStudyLogs = [];

        const AllStudyLogs = await studyProgress.find().populate("subject", "plannedBy subject");

        AllStudyLogs.map((item) => {
            if (item.subject.plannedBy.toString() === user._id.toString()) {
                dailyStudyLogs.push(item)
            }
        })

        res.json({
            dailyStudyLogs
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" })
    }
}

export async function getDataForStudyChart(req, res) {
    try {
        const user = req.user;
        
        if (!user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const userId = user._id

        const result = await studyProgress.aggregate([
            {
                $match:{
                    user:userId
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt",
                        },
                    },
                    totalStudyHour: {
                        $sum: "$studyTime",
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    totalStudyHour: 1,
                },
            },
            {
                $sort: {
                    date: 1,
                },
            },
        ]);

        res.json({
            result
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" })
    }
}



