import Cookies from "js-cookie";
import { encryptObjectValues } from "./crypto-utils";
import { getDeviceInfo } from "./getDeviceInfo";

const registerUser = async (userData, encryptKeys, device_info) => {
    async function onSubmit() {
        const requestData = {
            device_info,
            username: userData.name,
            email: userData.email,
            first_name: userData.first_name,
            profile_photo: userData.image
        };
        // const requestData = {...userData};
        const encData = await encryptObjectValues(requestData, [...encryptKeys]);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST || "http://127.0.0.1:3000"}/user/public/register`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(encData),
            });
            if (response.ok) {
                const respData = await response.json();
                if(respData?.data?.token) {
                    Cookies.set('jwt_token', respData?.data?.token, { expires: 1 });
                }
                return { status: true, message: `welcome user ${userData.username}` };
            } else {
                return { status: true, message: `uable to register the user` }
            }
        } catch (error) {
            return { status: true, message: `uable to register the user` }
        } finally {
            return { status: true, message: `welcome user ${userData.username}` };
        }
    }
    onSubmit()
}

export default registerUser