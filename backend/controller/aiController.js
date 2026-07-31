import { analyzeStudyMentor } from '../AIservice/aiService.js';

export async function analyzeStudyMentorController(req, res) {
  try {
    const { schedule, logs } = req.body ?? {};

    if (schedule === undefined || logs === undefined) {
      return res.status(400).json({
        error: 'schedule and logs are required',
      });
    }

    const analysis = await analyzeStudyMentor(schedule, logs);

    return res.status(200).json(analysis);
  } catch (error) {
    console.error('AI analysis failed:', error);

    return res.status(500).json({
      error: 'Failed to analyze study data',
    });
  }
}

