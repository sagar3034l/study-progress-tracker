import { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import useUser from '../hooks/useUser';
import useStudyHook from '../hooks/useStudyHook';
import { useNavigate } from 'react-router'
import useStudyProgress from '../hooks/useStudyProgress';


// eslint-disable-next-line react-refresh/only-export-components -- this context is shared app-wide
export const userContext = createContext(null);
const UseContext = ({ children }) => {

    const { userSignin, userLogin, userLogout, getMe } = useUser()

    const { getAllSchedules, makeShedule, makeStudyProgressLog, getDataForChart, analyzeStudyMentor, updateStudyPlan, deleteStudyPlan } = useStudyHook();
    const { getAllLogs } = useStudyProgress();


    const [loading, isLoading] = useState(false);
    const [authReady, setAuthReady] = useState(false);
    const [user, setUser] = useState(null);
    const [signin, isSignedIn] = useState(false);
    const [schedule, setScehdule] = useState(null)
    const [currentUser, setCurrentUser] = useState(null);
    const [currentPlan, setCurrentPlan] = useState(null)
    const [logs, setLogs] = useState([])
    const [modalOpen, setModalOpen] = useState(false);
    const [chartData, setChartData] = useState([]);
    const [sheduleLoad,setSheduleLoad] = useState(false);
    const [getSheduleLoad,setGetSheduleLoad] = useState(false);

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
        const getCurrentUser = async () => {
            try {
                isLoading(true)
                const res = await getMe()
                setCurrentUser(res.data)
            } catch (error) {
                setCurrentUser(null)
                console.error(error)
            } finally {
                isLoading(false)
                setAuthReady(true)
            }
        }

        getCurrentUser()
    }, [getMe])

    useEffect(() => {
        if (!currentUser) {
            return;
        }

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
    }, [getDataForChart, currentUser])

    useEffect(() => {
        if (!currentUser) {
            return;
        }

        async function getAllShedule() {
            try {
                setGetSheduleLoad(true)
                const data = await getAllSchedules()
                setScehdule(data)
                isLoading(false)
            } catch (error) {
                console.error(error)
                isLoading(false)
            } finally {
                setGetSheduleLoad(false)
            }
        }
        getAllShedule()
    }, [getAllSchedules, currentUser, currentPlan, signin, user]);

    useEffect(() => {
        if (!currentUser) {
            return;
        }

        const response = async () => {
            isLoading(true)
            const data = await getAllLogs();
            setLogs(data.dailyStudyLogs);
            isLoading(false);
        }

        response().catch(console.error)

    }, [getAllLogs, currentUser])

    const generateStudyPlan = useCallback(async ({ subject, targetHours }) => {
        try {
            setSheduleLoad(true)
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
            setSheduleLoad(false)
        }
    }, [makeShedule, navigate])

    const generateLogs = useCallback(async ({ topic, time, timeUnit }, id) => {
        try {
            const res = await makeStudyProgressLog({ topic, studyTime: time, timeUnit }, id);
            refreshSchedule()
            return res
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [makeStudyProgressLog])

    const refreshSchedule = useCallback(() => {
        setCurrentPlan({ refreshedAt: Date.now() })
    }, [])

    const editStudyPlan = useCallback(async (id, payload) => {
        try {
            const res = await updateStudyPlan(id, payload)
            refreshSchedule()
            return res
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [refreshSchedule, updateStudyPlan])

    const removeStudyPlan = useCallback(async (id) => {
        try {
            const res = await deleteStudyPlan(id)
            refreshSchedule()
            return res
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [deleteStudyPlan, refreshSchedule])

    const contextValue = useMemo(() => ({
        chartData, sheduleLoad, getSheduleLoad, logs, signinUser, login, Logout, signin, loading, authReady, user,
        schedule, currentUser, modalOpen, setModalOpen, generateStudyPlan, generateLogs, analyzeStudyMentor,
        editStudyPlan, removeStudyPlan, refreshSchedule
    }), [chartData, logs, signinUser, login, Logout, signin, loading, authReady, user, schedule, currentUser, modalOpen, generateStudyPlan, generateLogs, analyzeStudyMentor, editStudyPlan, removeStudyPlan, refreshSchedule]);


    return (
        <userContext.Provider value={contextValue}>
            {children}
        </userContext.Provider>
    )
}

export default UseContext
