import { BookOpenCheckIcon, CalendarClock, Plus } from "lucide-react";
import { useContext } from "react";
import { userContext } from "../context/UseContext";

export default function EmptyStudySchedule({ onCreate = () => {} }) {
  const {modalOpen,setModalOpen} = useContext(userContext);
  return (
    <div className="flex items-center justify-center min-h-[420px] w-full px-4">
      <div className="w-full max-w-sm rounded-2xl px-8 py-10 text-center shadow-sm">
          <div className="flex justify-center items-center mx-auto">
             <BookOpenCheckIcon className="size-24 text-teal-600" strokeWidth={1.75} />
          </div>

        <h3 className="text-base font-semibold text-slate-900">
          No study schedule yet
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
          Block out your study sessions and they'll show up here, organized by day.
        </p>

        <button
          onClick={()=>setModalOpen(true)}
          className="mt-6 cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Create a schedule
        </button>
      </div>
    </div>
  );
}