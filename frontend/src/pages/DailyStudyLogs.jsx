import { useContext, useState } from 'react';
import { userContext } from '../context/UseContext';
import { ArrowLeft, CircleCheck, Sparkles, BookOpenText, Target, Clock3, BadgeCheck } from 'lucide-react'
import { Link } from 'react-router';
import { getLogOfsubject, getProgressPercentage } from '../lib/getSubjectLogs';
import { ProgressCircle, HStack, VStack } from 'rsuite'
import { LineChart } from '@mui/x-charts/LineChart';
import 'rsuite/dist/rsuite-no-reset.css';
import { studiedData, getStandardChartData } from '../lib/studyData';


const DailyStudyLogs = () => {
    const { schedule, logs, chartData, analyzeStudyMentor} = useContext(userContext)
    const [subject, setSubject] = useState("");
    const [analysis, setAnalysis] = useState(null);
    const [analysisLoading, setAnalysisLoading] = useState(false);
    const [analysisError, setAnalysisError] = useState("");

    const data = getLogOfsubject(subject, logs);

    const progressPercentage = getProgressPercentage(schedule, subject)
    const chart = getStandardChartData(chartData);
    const selectedPlan = schedule?.Plans?.find(
        (plan) => (plan.subject || '').toLowerCase() === subject.toLowerCase()
    );
    const completedHours = selectedPlan?.progressTillNow ?? 0;
    const targetHours = selectedPlan?.targetHours ?? 0;
    const remainingHours = Math.max(targetHours - completedHours, 0);
    const selectedTopics = data.flatMap((entry) => entry.topic || []);
    const latestEntry = data[0];
    const planCount = schedule?.Plans?.length ?? 0;
    const totalCompletedHours = schedule?.Plans?.reduce((sum, plan) => sum + (plan.progressTillNow || 0), 0) ?? 0;
    const totalTargetHours = schedule?.Plans?.reduce((sum, plan) => sum + (plan.targetHours || 0), 0) ?? 0;

    async function handleAnalyze() {
        try {
            setAnalysisError("");
            setAnalysisLoading(true);
            const result = await analyzeStudyMentor({ schedule, logs });
            setAnalysis(result);
        } catch (error) {
            console.error(error);
            setAnalysisError("Unable to generate AI analysis right now.");
        } finally {
            setAnalysisLoading(false);
        }
    }

    return (
        <div className='p-4 md:p-6'>
            <div className='flex flex-wrap items-center gap-3'>
                <Link to={"/study"} className='-mt-1'>
                    <span className='flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10'>
                        <ArrowLeft className='size-5' />
                    </span>
                </Link>
                <div>
                    <p className='text-xs uppercase tracking-[0.3em] text-amber-300/70'>Study chart</p>
                    <h1 className='text-2xl font-bold text-amber-400 md:text-3xl'>Progress across every subject</h1>
                </div>
            </div>
            <div className='mt-4 grid gap-4 md:grid-cols-3'>
                <div className='rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-lg'>
                    <p className='text-sm text-white/55'>Subjects</p>
                    <div className='mt-2 flex items-end gap-2'>
                        <span className='text-3xl font-bold text-white'>{planCount}</span>
                        <span className='pb-1 text-sm text-emerald-300'>active plans</span>
                    </div>
                </div>
                <div className='rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-lg'>
                    <p className='text-sm text-white/55'>Completed hours</p>
                    <div className='mt-2 flex items-end gap-2'>
                        <span className='text-3xl font-bold text-white'>{totalCompletedHours.toFixed(1)}</span>
                        <span className='pb-1 text-sm text-emerald-300'>hours logged</span>
                    </div>
                </div>
                <div className='rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-lg'>
                    <p className='text-sm text-white/55'>Target hours</p>
                    <div className='mt-2 flex items-end gap-2'>
                        <span className='text-3xl font-bold text-white'>{totalTargetHours.toFixed(1)}</span>
                        <span className='pb-1 text-sm text-emerald-300'>goal set</span>
                    </div>
                </div>
            </div>

            <div className='mt-4 overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 shadow-2xl'>
                <div className='border-b border-white/10 px-4 py-4 md:px-6'>
                    <p className='text-xs uppercase tracking-[0.24em] text-amber-300/60'>Daily momentum</p>
                    <h2 className='mt-1 text-lg font-semibold text-white'>How much you studied over time</h2>
                </div>
                <div className='bg-amber-600/10'>
                    <LineChart
                        height={360}
                        dataset={chart.length > 0 ? chart : studiedData}
                        xAxis={[
                            {
                                scaleType: "point",
                                dataKey: "date",
                            },
                        ]}
                        series={[
                            {
                                dataKey: "hours",
                                label: "Study Hours",
                                curve: "monotoneX",
                                showMark: true,
                                area: true,
                                color: "#f59e0b",
                            },
                        ]}
                        grid={{ horizontal: true }}
                    />
                </div>
            </div>

            <div className='mt-4 rounded-2xl border border-amber-500/20 bg-slate-950/90 p-4 shadow-xl md:p-5'>
                <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
                    <div>
                        <h2 className='text-xl font-semibold text-amber-300'>AI Study Mentor</h2>
                        <p className='text-sm text-white/70'>
                            Get a personalized summary of your consistency, weak subjects, next topics, and study advice.
                        </p>
                    </div>
                    <button
                        type='button'
                        onClick={handleAnalyze}
                        disabled={analysisLoading || !schedule || !logs}
                        className='inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2 font-semibold text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60'
                    >
                        <Sparkles className='size-4' />
                        {analysisLoading ? 'Analyzing...' : 'Analyze with AI'}
                    </button>
                </div>

                {analysisError && (
                    <p className='mt-3 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200'>
                        {analysisError}
                    </p>
                )}

                {analysis && (
                    <div className='mt-4 grid gap-4 md:grid-cols-2'>
                        <div className='rounded-lg bg-white/5 p-4'>
                            <h3 className='mb-2 font-semibold text-emerald-300'>Summary</h3>
                            <p className='text-sm leading-6 text-white/85'>{analysis.summary || 'No summary returned.'}</p>
                        </div>
                        <div className='rounded-lg bg-white/5 p-4'>
                            <h3 className='mb-2 font-semibold text-emerald-300'>Motivation</h3>
                            <p className='text-sm leading-6 text-white/85'>{analysis.motivation || 'Keep going - your progress is being tracked.'}</p>
                        </div>

                        <div className='rounded-lg bg-white/5 p-4'>
                            <h3 className='mb-2 font-semibold text-emerald-300'>Strengths</h3>
                            <ul className='list-disc space-y-1 pl-5 text-sm text-white/85'>
                                {(analysis.strengths || []).map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>

                        <div className='rounded-lg bg-white/5 p-4'>
                            <h3 className='mb-2 font-semibold text-emerald-300'>Weaknesses</h3>
                            <ul className='list-disc space-y-1 pl-5 text-sm text-white/85'>
                                {(analysis.weaknesses || []).map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>

                        <div className='rounded-lg bg-white/5 p-4'>
                            <h3 className='mb-2 font-semibold text-emerald-300'>Recommendations</h3>
                            <ul className='list-disc space-y-1 pl-5 text-sm text-white/85'>
                                {(analysis.recommendations || []).map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>

                        <div className='rounded-lg bg-white/5 p-4'>
                            <h3 className='mb-2 font-semibold text-emerald-300'>Next Topics</h3>
                            <ul className='list-disc space-y-1 pl-5 text-sm text-white/85'>
                                {(analysis.nextTopics || []).map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                            <p className='mt-3 text-sm text-amber-200'>
                                Estimated completion: {analysis.estimatedCompletion || 'Not enough data yet.'}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className='mt-5'>
                <div className='mb-3 flex items-center justify-between'>
                    <div>
                        <p className='text-xs uppercase tracking-[0.24em] text-white/45'>Your subjects</p>
                        <h2 className='text-2xl font-semibold text-amber-300'>Pick a subject to review topics and progress</h2>
                    </div>
                    <div className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/70'>
                        Click any subject to inspect its progress
                    </div>
                </div>

                <div className='grid gap-4 lg:grid-cols-[360px,1fr]'>
                    <div className='rounded-2xl border border-white/10 bg-slate-900/90 p-3 shadow-lg'>
                        <div className='mb-3 flex items-center gap-2 px-1'>
                            <BookOpenText className='size-4 text-amber-300' />
                            <span className='text-sm font-medium uppercase tracking-[0.2em] text-white/45'>Subjects</span>
                        </div>
                        <ul className='invisible-scrollbar max-h-[28rem] space-y-2 overflow-y-auto pr-1'>
                            {schedule?.Plans?.map((plan) => {
                                const isActive = subject.toLowerCase() === plan.subject.toLowerCase();
                                const subjectLogs = getLogOfsubject(plan.subject, logs);
                                const latestTopics = subjectLogs.flatMap((entry) => entry.topic || []).slice(-2);
                                const currentProgress = plan.targetHours > 0 ? Math.round(((plan.progressTillNow || 0) / plan.targetHours) * 100) : 0;

                                return (
                                    <li key={plan._id}>
                                        <button
                                            type='button'
                                            onClick={() => setSubject(plan.subject)}
                                            className={`w-full rounded-2xl border p-3 text-left transition duration-200 ${
                                                isActive
                                                    ? 'border-amber-400/50 bg-amber-500/15 shadow-[0_0_0_1px_rgba(251,191,36,0.2)]'
                                                    : 'border-white/10 bg-white/5 hover:border-amber-400/30 hover:bg-white/10'
                                            }`}
                                        >
                                            <div className='flex items-start justify-between gap-3'>
                                                <div>
                                                    <h3 className='text-base font-semibold text-white'>{plan.subject}</h3>
                                                    <p className='mt-1 text-xs text-white/55'>
                                                        {plan.progressTillNow?.toFixed?.(1) ?? plan.progressTillNow ?? 0}h of {plan.targetHours}h
                                                    </p>
                                                </div>
                                                <div className='rounded-full bg-amber-400/15 px-2 py-1 text-xs font-semibold text-amber-300'>
                                                    {currentProgress}%
                                                </div>
                                            </div>

                                            <div className='mt-3 h-2 rounded-full bg-white/10'>
                                                <div
                                                    className='h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500'
                                                    style={{ width: `${Math.min(currentProgress, 100)}%` }}
                                                />
                                            </div>

                                            <div className='mt-3 flex flex-wrap gap-2'>
                                                {latestTopics.length > 0 ? (
                                                    latestTopics.map((topicItem, index) => (
                                                        <span
                                                            key={`${plan._id}-${index}`}
                                                            className='rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] text-emerald-200'
                                                        >
                                                            {topicItem}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className='rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/45'>
                                                        No topics yet
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className='rounded-2xl border border-white/10 bg-slate-900/90 p-4 shadow-lg md:p-5'>
                        {subject ? (
                            <div className='space-y-5'>
                                <div className='flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between'>
                                    <div>
                                        <p className='text-xs uppercase tracking-[0.2em] text-emerald-300/70'>Selected subject</p>
                                        <h3 className='text-2xl font-semibold text-white'>{subject}</h3>
                                        <p className='mt-1 text-sm text-white/60'>
                                            Track your completed topics and current completion at a glance.
                                        </p>
                                    </div>
                                    <div className='flex items-center gap-4'>
                                        <HStack>
                                            <ProgressCircle
                                                w={150}
                                                h={150}
                                                percent={progressPercentage || 0}
                                                strokeColor='yellow'
                                                renderInfo={percent => (
                                                    <VStack align="center">
                                                        <h1 className='text-xl font-bold text-white'>{percent}%</h1>
                                                        <span className='text-xs uppercase tracking-[0.2em] text-white/50'>done</span>
                                                    </VStack>
                                                )}
                                            />
                                        </HStack>
                                        <div className='grid gap-2 text-sm text-white/70'>
                                            <div className='flex items-center gap-2'>
                                                <Target className='size-4 text-amber-300' />
                                                <span>Target: {targetHours}h</span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <BadgeCheck className='size-4 text-emerald-300' />
                                                <span>Completed: {completedHours.toFixed(1)}h</span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <Clock3 className='size-4 text-cyan-300' />
                                                <span>Remaining: {remainingHours.toFixed(1)}h</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='grid gap-4 lg:grid-cols-[1.2fr,0.8fr]'>
                                    <div className='rounded-2xl border border-white/10 bg-white/5 p-4'>
                                        <div className='mb-3 flex items-center gap-2'>
                                            <CircleCheck className='size-4 text-emerald-300' />
                                            <h4 className='font-semibold text-white'>Completed topics</h4>
                                        </div>

                                        {data.length > 0 ? (
                                            <div className='space-y-3'>
                                                {data.map((entry) => (
                                                    <div
                                                        key={entry._id}
                                                        className='rounded-xl border border-white/10 bg-slate-950/50 p-3'
                                                    >
                                                        <div className='mb-2 flex items-center justify-between gap-2'>
                                                            <span className='text-sm font-medium text-amber-200'>
                                                                {entry.createdDay || 'Recent log'}
                                                            </span>
                                                            <span className='text-xs text-white/45'>
                                                                {entry.studyTime ? `${entry.studyTime}h studied` : 'Logged session'}
                                                            </span>
                                                        </div>

                                                        <div className='flex flex-wrap gap-2'>
                                                            {(entry.topic || []).map((val, i) => (
                                                                <span
                                                                    key={i}
                                                                    className='inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-100'
                                                                >
                                                                    {val}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className='rounded-xl border border-dashed border-white/15 bg-white/5 p-5 text-center'>
                                                <p className='text-lg font-semibold text-white'>No study logs yet</p>
                                                <p className='mt-1 text-sm text-white/55'>
                                                    Once you log topics here, they will appear in this panel.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className='rounded-2xl border border-white/10 bg-gradient-to-br from-amber-500/10 to-transparent p-4'>
                                        <h4 className='mb-3 font-semibold text-white'>Subject snapshot</h4>
                                        <div className='space-y-3 text-sm text-white/75'>
                                            <div className='rounded-xl border border-white/10 bg-slate-950/50 p-3'>
                                                <p className='text-white/50'>Progress</p>
                                                <p className='mt-1 text-lg font-semibold text-white'>
                                                    {completedHours.toFixed(1)}h / {targetHours}h
                                                </p>
                                            </div>
                                            <div className='rounded-xl border border-white/10 bg-slate-950/50 p-3'>
                                                <p className='text-white/50'>Topics completed now</p>
                                                <p className='mt-1 font-medium text-emerald-200'>
                                                    {selectedTopics.length > 0 ? selectedTopics.join(', ') : 'No topics logged yet'}
                                                </p>
                                            </div>
                                            <div className='rounded-xl border border-white/10 bg-slate-950/50 p-3'>
                                                <p className='text-white/50'>Latest update</p>
                                                <p className='mt-1 font-medium text-white'>
                                                    {latestEntry?.createdDay || 'No recent update'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className='flex min-h-[24rem] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-center'>
                                <div>
                                    <BookOpenText className='mx-auto size-10 text-amber-300/80' />
                                    <h3 className='mt-3 text-xl font-semibold text-white'>Select a subject</h3>
                                    <p className='mt-2 max-w-md text-sm text-white/55'>
                                        Choose a subject from the left to see its completed topics, current progress, and remaining hours.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DailyStudyLogs



//   Live Demo: streamify-8-t9a8.onrender.com