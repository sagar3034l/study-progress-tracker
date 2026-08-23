import { LoaderCircleIcon } from "lucide-react"
import Card from "./Card"
import EmptyStudySchedule from "./EmptyStudySchedule"


function PlanList({ sheduleLoad, data, schedule }) {
    return (
        <div>
            {
                sheduleLoad ? (
                    <div className='relative mx-auto flex flex-col justify-center items-center w-full'>
                        <LoaderCircleIcon className='size-24 animate-spin text-amber-300' />
                        <h1 className="text-lg text-gray-500">Loading plans...</h1>
                    </div>
                ): 
                    (
                        schedule && schedule.Plans?.length > 0 ? (
                            <div className='p-4 mb-4'>
                                {
                                    data?.map((s) => (
                                        <Card key={s._id} {...s} />
                                    ))
                                    
                                }
                            </div>
                        ) : (
                           <EmptyStudySchedule /> 
                        )
                    )
            }
        </div>
    )
}

export default PlanList