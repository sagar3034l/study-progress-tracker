
import { api } from '../lib/axios'

const useStudyProgress = () => {
   async function getAllLogs() {
       try {
          const res = await api.get(`subject/logs`)
          return res.data 
       } catch (error) {
          console.log(error)
       }
   }
   return {
     getAllLogs
   }
}

export default useStudyProgress