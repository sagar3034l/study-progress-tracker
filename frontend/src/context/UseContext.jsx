import { createContext, useEffect, useMemo, useState } from 'react'

import useUser from '../hooks/useUser';
import useStudyHook from '../hooks/useStudyHook';
import { Navigate, useNavigate } from 'react-router'
import useStudyProgress from '../hooks/useStudyProgress';


export const userContext = createContext(null);
const UseContext = ({ children }) => {

    const { userSignin, userLogin, userLogout, getMe } = useUser()

    const { getAllSchedules, makeShedule, makeStudyProgressLog, getDataForChart, analyzeStudyMentor } = useStudyHook();
    const { getAllLogs } = useStudyProgress();


    const [loading, isLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [signin, isSignedIn] = useState(false);
    const [schedule, setScehdule] = useState(null)
    const [currentUser, setCurrentUser] = useState(null);
    const [currentPlan, setCurrentPlan] = useState(null)
    const [logs, setLogs] = useState([])
    const [modalOpen, setModalOpen] = useState(false);
    const [chartData, setChartData] = useState([])
    const navigate = useNavigate()



    async function signinUser({ userName, email, password }) {
        try {
            isLoading(true)
            const data = await userSignin({ name: userName, email, password })
            setUser(data?.user)
            setCurrentUser(data?.user)
            isSignedIn(true)
        } catch (error) {
            console.log(error)
        } finally {
            isLoading(false)
        }
    }

    async function login({ email, password }) {
        try {
            isLoading(true)
            const data = await userLogin({ email, password })
            setUser(data.user)
            setCurrentUser(data.user)
            isSignedIn(true)
        } catch (error) {
            console.log(error)
        } finally {
            isLoading(false)
        }
    }

    async function Logout() {
        await userLogout();
        setCurrentUser(null)
        isSignedIn(false)
        setUser(null)
    }



    useEffect(() => {
        try {
            const getCurrentUser = async () => {
                isLoading(true)
                await getMe().then((res) => {
                    setCurrentUser(res.data)
                    isLoading(false)
                }).catch((e) => {
                    navigate("/")
                    isLoading(false)
                })
            }
            getCurrentUser()
        } catch (error) {
            console.error(error)
        }
    }, [])

    useEffect(() => {
        try {
            const getChartData = async () => {
                isLoading(true);
                const data = await getDataForChart();
                setChartData(data.result)
                isLoading(false);
            }
            getChartData();
        } catch (error) {
            console.error(error)
        }
    }, [])

    useEffect(() => {
        async function getAllShedule() {
            try {
                isLoading(true)
                const data = await getAllSchedules()
                setScehdule(data)
                isLoading(false)
            } catch (error) {
                console.error(error)
                isLoading(false)
            } finally {
                isLoading(false)
            }
        }
        getAllShedule()
    }, [user, signin, currentUser, currentPlan]);

    useEffect(() => {
        const response = async () => {
            isLoading(true)
            const data = await getAllLogs();
            setLogs(data.dailyStudyLogs);
            isLoading(false);
        }

        response().catch(console.error)

    }, [])

    async function generateStudyPlan({ subject, targetHours }) {
        try {
            isLoading(true)
            const data = await makeShedule({ subject, targetHours })
            setCurrentPlan(data)
            return data;
        } catch (error) {
            console.error(error)
            if (error.status === "401") {
                navigate("/")
            }
        } finally {
            isLoading(false)
        }
    }

    async function generateLogs({ topic, time, timeUnit }, id) {
        try {
            const res = await makeStudyProgressLog({ topic, studyTime: time, timeUnit }, id);
            return res
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const contextValue = useMemo(() => ({
        chartData, logs, signinUser, login, Logout, signin, loading, user,
        schedule, currentUser, modalOpen, setModalOpen, generateStudyPlan, generateLogs, analyzeStudyMentor
    }), [chartData, logs, signin, loading, user, schedule, currentUser, modalOpen, analyzeStudyMentor]);


    return (
        <userContext.Provider value={contextValue}>
            {children}
        </userContext.Provider>
    )
}

export default UseContext
