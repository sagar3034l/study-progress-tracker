import { useCallback } from 'react'
import {api} from '../lib/axios'


const useStudyHook = () => {
    const getAllSchedules = useCallback(async function getAllSchedules() {
        try {
            const res = await api.get('/study')
            return res.data
        } catch (error) {
            console.error(error)
        }
    }, [])

    const makeShedule = useCallback(async function makeShedule({subject,targetHours,role}) {
         try {
            const res = await api.post("/study",{
                subject,targetHours,...(role && { role }) 
            })
            return res.data;
         } catch (error) {
            console.error(error)
         }   
    }, [])

    const getDataForChart = useCallback(async function getDataForChart() {
        try {
            const res = await api.get("subject/chart-data")
            console.log("study chart data",res.data)
            return res.data
        } catch (error) {
            console.error(error)
        }
    }, [])

    const analyzeStudyMentor = useCallback(async function analyzeStudyMentor({ schedule, logs }) {
        try {
            const res = await api.post("/ai/analyze", {
                schedule,
                logs
            })
            return res.data;
        } catch (error) {
            console.error(error)
            throw error;
        }
    }, [])

    const makeStudyProgressLog = useCallback(async function makeStudyProgressLog({topic,studyTime,timeUnit},id) {
        try {
           const res = await api.post(`subject/${id}`,{
              topic,studyTime,timeUnit
           }) 
           console.log(res.data)
           return res.data;
        } catch (error) {
            console.error(error)
            throw error;
        }
    }, [])

    const updateStudyPlan = useCallback(async function updateStudyPlan(id, payload) {
        try {
            const res = await api.put(`/study/${id}`, payload)
            return res.data;
        } catch (error) {
            console.error(error)
            throw error;
        }
    }, [])

    const deleteStudyPlan = useCallback(async function deleteStudyPlan(id) {
        try {
            const res = await api.delete(`/study/${id}`)
            return res.data;
        } catch (error) {
            console.error(error)
            throw error;
        }
    }, [])
    return {
        getAllSchedules,
        makeShedule,
        makeStudyProgressLog,
        getDataForChart,
        analyzeStudyMentor,
        updateStudyPlan,
        deleteStudyPlan
    }
}

export default useStudyHook

