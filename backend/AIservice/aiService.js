import { getGroqClient, groqModel } from './ai.js';

const MAX_PROMPT_LOGS = 40;

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function asSubjectName(subject) {
  if (!subject) {
    return '';
  }

  if (typeof subject === 'string') {
    return subject.trim();
  }

  return (
    subject.subject ||
    subject.name ||
    subject.title ||
    subject._id?.toString?.() ||
    ''
  )   
    .toString()
    .trim();
}

function asLogSubjectName(log) {
  return asSubjectName(log?.subject || log?.plan || log?.studyPlan);
}

function getTopicList(log) {
  if (Array.isArray(log?.completedTopics)) {
    return log.completedTopics.filter(Boolean).map(String);
  }

  if (Array.isArray(log?.topic)) {
    return log.topic.filter(Boolean).map(String);
  }

  if (typeof log?.topic === 'string' && log.topic.trim()) {
    return [log.topic.trim()];
  }

  return [];
}

function getLogDateValue(log) {
  const rawDate = log?.studyDate || log?.date || log?.createdDay || log?.createdAt || log?.updatedAt;
  if (!rawDate) {
    return null;
  }

  const parsed = new Date(rawDate);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getLogHours(log) {
  const rawValue = toNumber(log?.studyHours ?? log?.studyTime ?? log?.hours, 0);
  const unit = String(log?.timeUnit || log?.unit || '').toLowerCase();

  if (unit.startsWith('min')) {
    return rawValue / 60;
  }

  return rawValue;
}

function buildRecentLogs(logs) {
  return logs
    .map((log) => {
      const dateValue = getLogDateValue(log);
      return {
        subject: asLogSubjectName(log),
        completedTopics: getTopicList(log),
        studyHours: getLogHours(log),
        studyDate: dateValue ? dateValue.toISOString() : log?.studyDate || log?.date || log?.createdDay || '',
      };
    })
    .sort((left, right) => {
      const leftTime = left.studyDate ? new Date(left.studyDate).getTime() : 0;
      const rightTime = right.studyDate ? new Date(right.studyDate).getTime() : 0;
      return rightTime - leftTime;
    })
    .slice(0, MAX_PROMPT_LOGS);
}

function buildSubjectStats(plans, logs) {
  const logsBySubject = new Map();

  logs.forEach((log) => {
    const subjectName = asLogSubjectName(log).toLowerCase();
    if (!subjectName) {
      return;
    }

    const current = logsBySubject.get(subjectName) || [];
    current.push(log);
    logsBySubject.set(subjectName, current);
  });

  const subjectStats = plans.map((plan) => {
    const subjectName = asSubjectName(plan.subject);
    const normalizedName = subjectName.toLowerCase();
    const relatedLogs = logsBySubject.get(normalizedName) || [];
    const targetHours = toNumber(plan.targetHours, 0);
    const completedHours = toNumber(plan.progressTillNow, 0);
    const remainingHours = Math.max(targetHours - completedHours, 0);
    const completionRate = targetHours > 0 ? Math.round((completedHours / targetHours) * 100) : 0;

    const uniqueTopics = [...new Set(relatedLogs.flatMap(getTopicList))].filter(Boolean);
    const latestLogDate = relatedLogs
      .map(getLogDateValue)
      .filter(Boolean)
      .sort((left, right) => right.getTime() - left.getTime())[0];

    return {
      subject: subjectName,
      category: plan.category || '',
      targetHours,
      completedHours,
      remainingHours,
      completionRate,
      isCompleted: Boolean(plan.isCompleted),
      logCount: relatedLogs.length,
      uniqueTopics: uniqueTopics.slice(0, 15),
      lastStudyDate: latestLogDate ? latestLogDate.toISOString() : null,
      estimatedDaysRemaining: null,
    };
  });

  const uniqueStudyDates = [
    ...new Set(
      logs
        .map(getLogDateValue)
        .filter(Boolean)
        .map((date) => date.toISOString().slice(0, 10))
    ),
  ];

  const totalTargetHours = subjectStats.reduce((sum, subject) => sum + subject.targetHours, 0);
  const totalCompletedHours = subjectStats.reduce((sum, subject) => sum + subject.completedHours, 0);
  const remainingHours = Math.max(totalTargetHours - totalCompletedHours, 0);
  const completionRate = totalTargetHours > 0 ? Math.round((totalCompletedHours / totalTargetHours) * 100) : 0;
  const averageHoursPerStudyDay =
    uniqueStudyDates.length > 0 ? Number((totalCompletedHours / uniqueStudyDates.length).toFixed(2)) : 0;

  const enrichedSubjectStats = subjectStats.map((subject) => {
    const estimatedDaysRemaining =
      averageHoursPerStudyDay > 0 && subject.remainingHours > 0
        ? Number((subject.remainingHours / averageHoursPerStudyDay).toFixed(1))
        : null;

    return {
      ...subject,
      estimatedDaysRemaining,
    };
  });

  return {
    subjectStats: enrichedSubjectStats,
    overall: {
      totalSubjects: plans.length,
      totalTargetHours,
      totalCompletedHours,
      remainingHours,
      completionRate,
      studyDays: uniqueStudyDates.length,
      averageHoursPerStudyDay,
    },
    neglectedSubjects: enrichedSubjectStats
      .filter((subject) => subject.completedHours <= 0 || subject.logCount === 0)
      .map((subject) => subject.subject),
  };
}

function buildAnalysisPayload(schedule, logs) {
  const plans = Array.isArray(schedule?.Plans)
    ? schedule.Plans
    : Array.isArray(schedule?.plans)
      ? schedule.plans
      : Array.isArray(schedule)
        ? schedule
        : [];
  const normalizedPlans = plans.map((plan) => ({
    subject: asSubjectName(plan?.subject),
    category: plan?.category || '',
    targetHours: toNumber(plan?.targetHours, 0),
    progressTillNow: toNumber(plan?.progressTillNow, 0),
    isCompleted: Boolean(plan?.isCompleted),
    createdAt: plan?.createdAt || null,
    updatedAt: plan?.updatedAt || null,
  }));

  const normalizedLogs = toArray(logs).map((log) => ({
    subject: asLogSubjectName(log),
    completedTopics: getTopicList(log),
    studyHours: getLogHours(log),
    studyDate: getLogDateValue(log)?.toISOString() || log?.studyDate || log?.date || log?.createdDay || '',
  }));

  const stats = buildSubjectStats(normalizedPlans, normalizedLogs);
  const recentLogs = buildRecentLogs(normalizedLogs);

  return {
    schedule: {
      Plans: normalizedPlans,
    },
    logs: recentLogs,
    analytics: stats,
  };
}

function buildPrompt(payload) {
  return [
    {
      role: 'system',
      content:
        "You are an experienced study coach and academic mentor. Analyze the student's study schedule and logs. Return only valid JSON with exactly these keys: summary, strengths, weaknesses, recommendations, nextTopics, estimatedCompletion, motivation. The array fields must contain strings only. Do not use markdown, code fences, or any extra keys. Use the analytics provided to judge study consistency, completed hours vs target hours, strengths, neglected subjects, learning pace, recommended next topics, personalized study advice, and an estimated completion based on current pace.",
    },
    {
      role: 'user',
      content: JSON.stringify(payload),
    },
  ];
}

function normalizeAnalysis(result) {
  const safeArray = (value) => {
    if (Array.isArray(value)) {
      return value
        .map((item) => (typeof item === 'string' ? item.trim() : String(item ?? '').trim()))
        .filter(Boolean);
    }

    if (typeof value === 'string' && value.trim()) {
      return [value.trim()];
    }

    return [];
  };

  return {
    summary: typeof result?.summary === 'string' ? result.summary.trim() : '',
    strengths: safeArray(result?.strengths),
    weaknesses: safeArray(result?.weaknesses),
    recommendations: safeArray(result?.recommendations),
    nextTopics: safeArray(result?.nextTopics),
    estimatedCompletion:
      typeof result?.estimatedCompletion === 'string' ? result.estimatedCompletion.trim() : '',
    motivation: typeof result?.motivation === 'string' ? result.motivation.trim() : '',
  };
}

function safeParseJson(content) {
  if (typeof content !== 'string') {
    throw new Error('AI response was not a string');
  }

  try {
    return JSON.parse(content);
  } catch (firstError) {
    const startIndex = content.indexOf('{');
    const endIndex = content.lastIndexOf('}');

    if (startIndex >= 0 && endIndex > startIndex) {
      const sliced = content.slice(startIndex, endIndex + 1);
      return JSON.parse(sliced);
    }

    throw firstError;
  }
}

export async function analyzeStudyMentor(schedule, logs) {
  const client = getGroqClient();
  const payload = buildAnalysisPayload(schedule, logs);

  const completion = await client.chat.completions.create({
    model: process.env.GROQ_MODEL || groqModel,
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: buildPrompt(payload),
  });

  const content = completion?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('Groq returned an empty response');
  }

  const parsed = safeParseJson(content);
  return normalizeAnalysis(parsed);
}
