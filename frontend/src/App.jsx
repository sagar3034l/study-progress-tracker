import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { useRef } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import StudyPlanPage from './pages/StudyPlanPage'
import { useContext } from 'react'
import { userContext } from './context/UseContext'
import LoginPage from './pages/LoginPage'
import SigninPage from './pages/SigninPage'
import { LoaderIcon } from 'lucide-react'
import DailyStudyLogs from './pages/DailyStudyLogs'


function App() {
  const {currentUser,loading} = useContext(userContext)
  Boolean(currentUser)

  if(loading){
   return (
      <LoaderIcon className='animate-spin size-10' />
   )
  }
  return (
     <div>
       {/* <Headers /> */}
        <Routes>
           <Route path='/' element={currentUser ? <Navigate to="/study" replace /> : <HomePage />}  />
           <Route path='/study' element={currentUser ? <StudyPlanPage /> : <Navigate to="/" replace />}  />
           <Route path='/studychart' element = {<DailyStudyLogs />} />
           <Route path='/login' element={<LoginPage />}/>
           <Route path='/signin' element={<SigninPage />}/>
        </Routes>
     </div>
  )
}

export default App
