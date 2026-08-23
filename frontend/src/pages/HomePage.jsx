import { ArrowRightIcon } from 'lucide-react'
import { Link } from 'react-router'
import Headers from '../components/Header'


const HomePage = () => {
  return (
  <div className='flex-1 relative'>
    <Headers /> 
    <div className='w-full mt-10 flex items-center'>
      {/* left */}
      <div className='mt-3 p-3'>
        <h1 className='max-w-xl text-md text-white/50 font-sans'>Here the  study progress track website for students , study with ease and keep tracking your progress</h1>
        <h1 className='text-white/45 text-4xl max-w-xl mt-2.5'>A visual progress bar for every subject, topic, and chapter you're working through.</h1>
        
         {/* CTA buttons */}
        <div className='flex items-center mt-10 gap-3'>
          <Link
            to={"/login"}
            className='border-2 text-white border-slate-300 mr-1 inline-flex items-center rounded-xl px-2 py-1 hover:bg-blue-400'
          >
            Login
          </Link>
          <Link
            to={"/signin"}
            className='bg-blue-500 inline-flex items-center gap-1 rounded-lg px-2 py-1 hover:bg-blue-600 group'
          >
            <span className='text-white'>Get started</span>
            <ArrowRightIcon className='size-4 mt-0.5 transition-transform group-hover:translate-x-0.5' />
          </Link>
        </div>

        <div className="mt-8 flex items-center gap-8">
            <div>
               <div className="text-xl lg:text-2xl font-bold font-mono">10K+</div>
               <div className="text-[10px] lg:text-xs text-gray-500 mt-1 uppercase tracking-wider">
                Users
              </div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
               <div className="text-xl lg:text-2xl font-bold font-mono">99.9%</div>
               <div className="text-[10px] lg:text-xs text-gray-500 mt-1 uppercase tracking-wider">
                Uptime
              </div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
               <div className="text-xl lg:text-2xl font-bold font-mono">&lt;50ms</div>
               <div className="text-[10px] lg:text-xs text-gray-500 mt-1 uppercase tracking-wider">
                Latency
              </div>
            </div>
            </div>
      </div>
      <div className='w-175 mt-6 mr-5'>
         <img src="./StudyPhoto.jpg" className='object-fill hover:scale-[1.03] transition-all' alt="" />
      </div>
    </div>
      </div>
  )
}

export default HomePage
