"use client";

import Cookies from 'js-cookie';
import { getDeviceInfo } from './getDeviceInfo';

const loginWithCodeFunc = async (loginCode) => {
    if (!loginCode) {
        console.error('No login code provided');
        return { status: false, message: 'No login code provided' };
    }

    try {
        const deviceInfo = await getDeviceInfo();

        const response = await fetch(`${process.env.NEXT_PUBLIC_HOST || "http://127.0.0.1:3000"}/user/login/code/${loginCode}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ device_info: deviceInfo }),
        });

        const resp = await response.json();

        if (response.ok) {
            const token = resp?.data?.token;

            if (token) {
                Cookies.set('jwt_token', token, { expires: 1 });
                return { status: true, message: 'Login success' };
            } else {
                return { status: false, message: 'Token missing in response' };
            }
        } else {
            return { status: false, message: resp?.message || 'Login failed' };
        }
    } catch (error) {
        console.error('Login failed:', error);
        return { status: false, message: "Login failed due to an error" };
    }
};

export default loginWithCodeFunc;
