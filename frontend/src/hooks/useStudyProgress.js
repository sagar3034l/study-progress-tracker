import { useCallback } from 'react'
import { api } from '../lib/axios'

const useStudyProgress = () => {
   const getAllLogs = useCallback(async function getAllLogs() {
       try {
          const res = await api.get(`subject/logs`)
          return res.data 
       } catch (error) {
          console.log(error)
       }
   }, [])
   return {
     getAllLogs
   }
}

export default useStudyProgress
