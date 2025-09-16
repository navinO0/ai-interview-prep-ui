"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const useProtectedRoute = () => {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            const token = Cookies.get("jwt_token");
            if (!token || token === "undefined" || token === null || token === undefined) {
                router.push("/login");
            }
        }, 3000);
    }, []);
};

export default useProtectedRoute;
