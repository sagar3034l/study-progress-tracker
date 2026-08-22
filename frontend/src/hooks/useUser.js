
import { useCallback } from 'react';
import { api } from '../lib/axios';


const useUser = () => {
    const userSignin = useCallback(async ({ name, email, password }) => {
        console.log(name,email,password)
        const res = await api.post("user/signin", {
            name, email, password
        })
        return res.data
    }, [])

    const userLogin = useCallback(async ({ email, password }) => {
        const res = await api.post("user/login", {
            email, password
        })
        return res.data
    }, [])

    const userLogout = useCallback(async () => {
        console.log("Request reached")
        return await api.get("user/logout")
    }, [])

    const getMe = useCallback(async () => {
        return await api.get("user/me")
    }, [])

    return {
        userSignin, userLogin, userLogout,getMe
    }

}

export default useUser
