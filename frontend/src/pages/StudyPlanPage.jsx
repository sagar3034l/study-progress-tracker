import Card from '../components/Card';
import { userContext } from '../context/UseContext'
import { useContext, useEffect, useState } from 'react'
import { Loader2Icon, LoaderCircleIcon, PlusIcon, Search } from 'lucide-react'
import Header from '../components/Header'
import PlanList from '../components/PlanList';


const StudyPlanPage = () => {
  const {schedule, modalOpen, setModalOpen, generateStudyPlan, loading, getSheduleLoad } = useContext(userContext);
  const [subject, setSubject] = useState("")
  const [time, setTime] = useState(undefined)
  const [role, setRole] = useState(undefined)
  const [search, setSearch] = useState("")
  const [sheduleLoad,setSheduleLoad] = useState(false);

  useEffect(() => {
    if (!modalOpen) {
      return;
    }

    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [modalOpen])

  async function handleAddSubject(e) {
    e.preventDefault();
    try {
      setSheduleLoad(true)
      await generateStudyPlan({ subject, targetHours: time })
      setSubject("");
      setTime("")
      setModalOpen(false);
    } catch {
      alert("Could not create the study plan. Please try again.")
    }finally{
      setSheduleLoad(false)
    }
  }

  const filteredData = schedule?.Plans?.filter((el) => el.subject.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <Header />
      <div className='p-4 flex justify-between'>
        <div>
          <h1 className='text-5xl mt-3 font-bold text-amber-500'>Your shedules:</h1>
          <div className='w-xl p-2'>
            <form className='border-2 flex rounded-xl p-2 w-full border-amber-300 text-white'>
              <input type="text" placeholder='search here' value={search} onChange={(e) => { setSearch(e.target.value) }} className='w-full outline-none placeholder:text-white' />
              <button type='button'>
                <Search className='size-6 text-white' />
              </button>
            </form>
          </div>
        </div>
        <button
          onClick={() => { setModalOpen(true) }}
          className='flex h-9 p-1 items-center gap-1.5 bg-blue-400 rounded-md cursor-pointer'>
          <PlusIcon className='size-4' />
          Add a new subject
        </button>
      </div>
      {
        modalOpen && (
          <div className='fixed inset-0 inset-y-0 z-50 overflow-x-auto overflow-y-auto border-4 bg-black/40 flex justify-center items-center'>
            <div className='w-125 h-87.5 rounded-xl bg-gray-700 z-30'>
              <form
                onSubmit={(e) => handleAddSubject(e)}
                className='w-full p-3 mt-3 flex flex-col gap-4 relative'>
                <label className='text-xl font-serif font-semibold text-white'>Add a Subject you want to start with:</label>
                <input type="text" value={subject} onChange={(e) => { setSubject(e.target.value) }} className='p-3 outline-none border-2 border-blue-700 focus:ring-2 placeholder:font-sans focus:ring-blue-800 rounded-xl' placeholder='Enter a subject (physics,chemistry,math,react js ...)' />
                <label className='text-xl font-serif font-semibold text-white'>Add in how many hours you want to complete:</label>
                <input type="number" value={time} onChange={(e) => { setTime(e.target.value) }} className='p-3 outline-none border-2 border-blue-700 focus:ring-2 focus:ring-blue-800 rounded-xl' placeholder='Enter a time range in hours' />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
                <div className='flex items-center gap-2.5 mt-5 absolute right-10 bottom-0 top-full'>
                  <button type="submit" className={`p-1.5 px-3 rounded-xl ${sheduleLoad ? "bg-blue-300" : "bg-blue-500"}`}
                    disabled={sheduleLoad}
                  >
                    {
                      sheduleLoad ? "Adding...." : "Add"
                    }
                  </button>
                  <button
                    type='button'
                    className='hover:bg-gray-500 p-1.5 px-3 rounded-xl'
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }
      <div>
         <PlanList sheduleLoad={getSheduleLoad} data={filteredData} schedule={schedule} />
      </div>
    </div>
  )
}

export default StudyPlanPage


