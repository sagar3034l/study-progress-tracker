import './App.css'
import { Navigate, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import StudyPlanPage from './pages/StudyPlanPage'
import { useContext } from 'react'
import { userContext } from './context/UseContext'
import LoginPage from './pages/LoginPage'
import SigninPage from './pages/SigninPage'
import { LoaderIcon } from 'lucide-react'
import DailyStudyLogs from './pages/DailyStudyLogs'
import { useLocation } from 'react-router'


function App() {
  const { currentUser, authReady,loading } = useContext(userContext)
  const location = useLocation()
  const protectedRoute = location.pathname === '/study' || location.pathname === '/studychart'


  if (protectedRoute && !authReady) {
    return <LoaderIcon className='animate-spin text-center relative top-[260px] left-[620px] size-24 text-amber-400' />
  }

  return (
     <div>
        <Routes>
           <Route path='/login' element={<LoginPage />}/>
           <Route path='/signin' element={<SigninPage />}/>
           <Route path='/' element={currentUser ? <Navigate to="/study" replace /> : <HomePage />}  />
           <Route path='/study' element={currentUser ? <StudyPlanPage /> : <Navigate to="/" replace />}  />
           <Route path='/studychart' element = {<DailyStudyLogs />} />
        </Routes>
     </div>
  )
}


export default App
