
import { api } from '../lib/axios';


const useUser = () => {
    async function userSignin({ name, email, password }) {
        console.log(name,email,password)
        const res = await api.post("user/signin", {
            name, email, password
        })
        return res.data
    }

    async function userLogin({ email, password }) {
        const res = await api.post("user/login", {
            email, password
        })
        return res.data
    }

    async function userLogout() {
        console.log("Request reached")
        return await api.get("user/logout")
    }

    async function getMe(){
        return await api.get("user/me")
    }

    return {
        userSignin, userLogin, userLogout,getMe
    }

}

export default useUser