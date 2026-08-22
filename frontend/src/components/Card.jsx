import { useEffect, useState } from 'react';
import { Progress, VStack } from 'rsuite';
import 'rsuite/dist/rsuite-no-reset.css';
import { useContext } from 'react';
import { userContext } from '../context/UseContext';
import { BadgeCheck, BookOpenText, Clock3, Sparkles, Tag, X } from 'lucide-react';
import { createPortal } from 'react-dom';

const Card = (s) => {

  const {generateLogs} = useContext(userContext)

  const [modalOpen, setModalOpen] = useState(false);
  const [time, setTime] = useState(0)
  const [topic, setTopic] = useState("")
  const [timeUnit,setTimeUnit] = useState("Hours")
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const createdDate = s.createdAt
  const DateInString = createdDate.split("T")[0]

  const date = new Date(DateInString)
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const actualDate = date.toLocaleString("en-US", options)
  const modalRoot = typeof document !== "undefined" ? document.body : null;

  const topicList = topic
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  function closeModal() {
    setModalOpen(false)
    setTime(0);
    setTopic("");
    setTimeUnit("Hours");
    setSubmitError("");
  }

  useEffect(() => {
    if (!modalOpen) {
      return;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [modalOpen])

  async function handleAddStudyTime(e) {
    e.preventDefault();
    if (!topicList.length || Number(time) <= 0) {
      return;
    }
    try {
      setSubmitError("");
      setIsSubmitting(true);
      await generateLogs({ topic: topicList, time, timeUnit }, s._id);
      closeModal();
    } catch (error) {
      console.error(error);
      setSubmitError("We could not save this log. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const percentage = (s.progressTillNow/s.targetHours)*100;

  let remainingHours = s.targetHours-s.progressTillNow

  return (
    <div className='w-full rounded-2xl border border-white/10 bg-slate-900/70 p-3 mt-2 mb-3 shadow-lg transition hover:-translate-y-0.5 hover:border-amber-400/20 hover:bg-slate-900/90'>
      <div className='flex w-full items-start justify-between gap-3'>
        <div className='inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-xs text-amber-200'>
          <Sparkles className='size-3.5' />
          <span>Study card</span>
        </div>
        <h1 className='text-xs text-white/45'>Created on {actualDate}</h1>
      </div>

      <div className='mt-3 flex flex-col gap-4'>
        <div className='flex items-start justify-between gap-3'>
          <div>
            <h1 className='text-xl font-bold text-white'>{s.subject}</h1>
            <p className='mt-1 text-sm text-white/60'>
              Target to complete in {s.targetHours} hours, {remainingHours.toFixed(1)} hours remaining
            </p>
          </div>
          <button
            onClick={()=> setModalOpen(true)}
            className='inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-3 py-2 text-sm font-semibold text-black transition hover:bg-emerald-300'
          >
            <BookOpenText className='size-4' />
            Log study
          </button>
        </div>

        <VStack spacing={20} className='mt-2 z-10'>
        <Progress
          percent={percentage.toFixed(1)}
          trailColor="rgba(255,255,255,0.08)"
          status='active'
          strokeWidth={14}
          radius={20}
          renderInfo={percent => (
            <span className='text-xl font-bold text-white'>
              {percent}% completed
            </span>
          )}
          striped
        />
      </VStack>

      {
        modalOpen && modalRoot ? createPortal(
          <div
            className='fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md'
            onClick={closeModal}
          >
            <div
              role='dialog'
              aria-modal='true'
              aria-labelledby={`study-log-title-${s._id}`}
              className='relative w-full max-w-2xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 shadow-[0_30px_100px_rgba(0,0,0,0.6)]'
              onClick={(e) => e.stopPropagation()}
            >
              <div className='max-h-[calc(100dvh-2rem)] overflow-y-auto'>
                <div className='sticky top-0 z-10 border-b border-white/10 bg-slate-950/90 px-5 py-4 backdrop-blur-xl'>
                  <div className='absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-emerald-400' />
                  <div className='flex items-start justify-between gap-4'>
                    <div>
                      <div className='inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-xs font-medium text-amber-200'>
                        <Sparkles className='size-3.5' />
                        <span>Study log modal</span>
                      </div>
                      <h2 id={`study-log-title-${s._id}`} className='mt-3 text-2xl font-semibold text-white'>
                        Add today&apos;s progress
                      </h2>
                      <p className='mt-1 text-sm text-white/60'>
                        Record the topics you covered and how long you studied for <span className='font-medium text-amber-200'>{s.subject}</span>.
                      </p>
                    </div>

                    <button
                      type='button'
                      onClick={closeModal}
                      className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10'
                      aria-label='Close modal'
                    >
                      <X className='size-4' />
                    </button>
                  </div>
                </div>

                <div className='grid gap-4 border-b border-white/10 px-5 py-4 md:grid-cols-3'>
                  <div className='rounded-2xl border border-white/10 bg-white/5 p-3'>
                    <p className='text-xs uppercase tracking-[0.18em] text-white/45'>Subject</p>
                    <p className='mt-2 text-lg font-semibold text-white'>{s.subject}</p>
                  </div>
                  <div className='rounded-2xl border border-white/10 bg-white/5 p-3'>
                    <p className='text-xs uppercase tracking-[0.18em] text-white/45'>Logged so far</p>
                    <p className='mt-2 text-lg font-semibold text-emerald-300'>{s.progressTillNow?.toFixed?.(1) ?? s.progressTillNow ?? 0}h</p>
                  </div>
                  <div className='rounded-2xl border border-white/10 bg-white/5 p-3'>
                    <p className='text-xs uppercase tracking-[0.18em] text-white/45'>Remaining</p>
                    <p className='mt-2 text-lg font-semibold text-amber-200'>{remainingHours.toFixed(1)}h</p>
                  </div>
                </div>

                <form
                  onSubmit={(e) => handleAddStudyTime(e)}
                  className='space-y-5 px-5 py-5'
                >
                  {submitError && (
                    <div className='rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100'>
                      {submitError}
                    </div>
                  )}

                  <div>
                    <label htmlFor={`topic-${s._id}`} className='mb-2 flex items-center gap-2 text-sm font-semibold text-white'>
                      <Tag className='size-4 text-amber-300' />
                      Topics studied
                    </label>
                    <input
                      id={`topic-${s._id}`}
                      type='text'
                      value={topic}
                      onChange={(e) => { setTopic(e.target.value) }}
                      className='w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-amber-400/50 focus:bg-white/8 focus:ring-2 focus:ring-amber-400/20'
                      placeholder='Separate multiple topics with commas, for example: arrays, hooks, recursion'
                      autoComplete='off'
                    />
                    <p className='mt-2 text-xs text-white/45'>
                      Tip: you can add one topic or a comma-separated list.
                    </p>
                    {topicList.length > 0 && (
                      <div className='mt-3 flex flex-wrap gap-2'>
                        {topicList.map((item, index) => (
                          <span
                            key={`${item}-${index}`}
                            className='rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200'
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor={`time-${s._id}`} className='mb-2 flex items-center gap-2 text-sm font-semibold text-white'>
                      <Clock3 className='size-4 text-cyan-300' />
                      Study time
                    </label>
                    <input
                      id={`time-${s._id}`}
                      type='number'
                      min='0'
                      step='0.25'
                      value={time}
                      onChange={(e) => { setTime(e.target.value) }}
                      className='w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-cyan-400/50 focus:bg-white/8 focus:ring-2 focus:ring-cyan-400/20'
                      placeholder='Enter the time you studied today'
                    />
                  </div>

                  <div>
                    <label htmlFor={`timeUnit-${s._id}`} className='mb-2 text-sm font-semibold text-white'>
                      Time unit
                    </label>
                    <select
                      id={`timeUnit-${s._id}`}
                      value={timeUnit}
                      onChange={(e)=>setTimeUnit(e.target.value)}
                      className='w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20'
                    >
                      <option value="Hour">Hour</option>
                      <option value="Hours">Hours</option>
                      <option value="minutes">Minutes</option>
                    </select>
                    <p className='mt-2 text-xs text-white/45'>
                      Minutes will be converted into hours automatically.
                    </p>
                  </div>

                  <div className='flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end'>
                    <button
                      type='button'
                      onClick={closeModal}
                      className='rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10'
                    >
                      Cancel
                    </button>
                    <button
                      disabled={!topicList.length || Number(time) <= 0 || isSubmitting}
                      type='submit'
                      className='inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                      <BadgeCheck className='size-4' />
                      {isSubmitting ? 'Saving...' : 'Save log'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>,
          modalRoot
        ) : null
      }

      </div>
    </div>
  )
}

export default Card
