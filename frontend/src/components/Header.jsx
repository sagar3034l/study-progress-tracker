import { useContext } from 'react'
import { Link, useLocation } from 'react-router'
import { ArrowRightIcon, SparklesIcon, TrendingUp } from 'lucide-react'
import { userContext } from '../context/UseContext'
import { LogOutIcon } from 'lucide-react'

const Header = () => {
   const location = useLocation()
   const isInStudyPage = location.pathname === '/study';

   const { Logout} = useContext(userContext)

   async function handleLogout() {
       await Logout()  
   }
   
   return (
      <div className='h-20 z-100 bg-transparent backdrop-blur-xl  border-b-slate-900 shadow-lg border flex items-center p-3 justify-between sticky top-0'>
          <div>
            <Link to={"/"} className='flex items-center justify-center gap-2 z-50'>
               <SparklesIcon className='size-8 text-white' />
               <h1 className='text-2xl font-sans font-bold text-white'>Skillora</h1>
            </Link>
         </div>
         {
            !isInStudyPage ? (
               <>
         <div className='flex items-center justify-between gap-2'>
            <Link to={"/login"}>
               <button className='border-slate-300 mr-1 p-1 cursor-pointer'>
                  login
               </button>
            </Link>
            <Link to={"/signin"}>
               <button className='bg-blue-500 flex justify-center p-1 rounded-lg items-center gap-1 hover:bg-blue-600 group'>
                  <h1 className='text-white p-1 cursor-pointer '>Get started</h1>
                  <ArrowRightIcon className='size-4 mt-1 group-hover:translate-x-0.5' />
               </button>
            </Link>
         </div>
               </>
            ) : (
               <div className='flex items-center gap-3'>
                   <Link to={"/studychart"} className='bg-green-500 text-white p-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer'>
                      <TrendingUp className='size-8'/>
                      <h1 className='-mt-1'>See your study progress</h1>
                     </Link>
                   <button
                    onClick={handleLogout}
                    className='flex items-center p-2.5 rounded-full hover:bg-white/60'>
                     <LogOutIcon className='size-4 text-white' />
                   </button>
               </div>
            )
         }
      </div>
   )
}

export default Header
