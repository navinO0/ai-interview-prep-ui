"use client"

import Cookies from "js-cookie";



export default function parseToken() {
        const token = Cookies.get('jwt_token');
        if (!token) { return; }
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));

}