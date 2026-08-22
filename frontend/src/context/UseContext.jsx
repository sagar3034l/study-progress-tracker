import { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import useUser from '../hooks/useUser';
import useStudyHook from '../hooks/useStudyHook';
import { useNavigate } from 'react-router'
import useStudyProgress from '../hooks/useStudyProgress';


// eslint-disable-next-line react-refresh/only-export-components -- this context is shared app-wide
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



    const signinUser = useCallback(async ({ userName, email, password }) => {
        try {
            isLoading(true)
            const data = await userSignin({ name: userName, email, password })
            setUser(data?.user)
            setCurrentUser(data?.user)
            isSignedIn(true)
        } catch (error) {
            console.log(error)
            throw error
        } finally {
            isLoading(false)
        }
    }, [userSignin])

    const login = useCallback(async ({ email, password }) => {
        try {
            isLoading(true)
            const data = await userLogin({ email, password })
            setUser(data.user)
            setCurrentUser(data.user)
            isSignedIn(true)
        } catch (error) {
            console.log(error)
            throw error
        } finally {
            isLoading(false)
        }
    }, [userLogin])

    const Logout = useCallback(async () => {
        await userLogout();
        setCurrentUser(null)
        isSignedIn(false)
        setUser(null)
    }, [userLogout])



    useEffect(() => {
        try {
            const getCurrentUser = async () => {
                isLoading(true)
                await getMe().then((res) => {
                    setCurrentUser(res.data)
                    isLoading(false)
                }).catch(() => {
                    navigate("/")
                    isLoading(false)
                })
            }
            getCurrentUser()
        } catch (error) {
            console.error(error)
        }
    }, [getMe, navigate])

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
    }, [getDataForChart])

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
    }, [getAllSchedules, currentUser, currentPlan, signin, user]);

    useEffect(() => {
        const response = async () => {
            isLoading(true)
            const data = await getAllLogs();
            setLogs(data.dailyStudyLogs);
            isLoading(false);
        }

        response().catch(console.error)

    }, [getAllLogs])

    const generateStudyPlan = useCallback(async ({ subject, targetHours }) => {
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
            throw error
        } finally {
            isLoading(false)
        }
    }, [makeShedule, navigate])

    const generateLogs = useCallback(async ({ topic, time, timeUnit }, id) => {
        try {
            const res = await makeStudyProgressLog({ topic, studyTime: time, timeUnit }, id);
            return res
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [makeStudyProgressLog])

    const contextValue = useMemo(() => ({
        chartData, logs, signinUser, login, Logout, signin, loading, user,
        schedule, currentUser, modalOpen, setModalOpen, generateStudyPlan, generateLogs, analyzeStudyMentor
    }), [chartData, logs, signinUser, login, Logout, signin, loading, user, schedule, currentUser, modalOpen, generateStudyPlan, generateLogs, analyzeStudyMentor]);


    return (
        <userContext.Provider value={contextValue}>
            {children}
        </userContext.Provider>
    )
}

export default UseContext
