"use client"
import Cookies from "js-cookie"
const clearToken = () => {
    Cookies.remove('jwt_token')
    if (!process.env.NEXT_PUBLIC_AUTH_ENABLE === "true" || false) {
        window.location.reload()
    }
}

export default clearToken