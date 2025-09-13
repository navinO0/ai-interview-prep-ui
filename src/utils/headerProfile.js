"use client";
import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import parseToken from "./parseJson";
import ErroToaster from "./errorToaster";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const UserHeader = () => {
    const [imageSrc, setImageSrc] = useState(null);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState({});
    const { data: session } = useSession();
    const router = useRouter();
    const [token, setToken] = useState(null);
    useEffect(() => {
        setToken(Cookies.get("jwt_token"));
    }, []);

    const fetchImage = useCallback(async () => {
        if (!token || token === "undefined") return;

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_HOST || "http://127.0.0.1:3000"}/user/get/image`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 401) {
                Cookies.remove("jwt_token");
                router.push("/session-expired");
                setError("Unauthorized: Token expired.");
                return;
            }

            if (response.ok) {
                const resp = await response.json();
                setImageSrc(resp?.data?.image || null);
            } else {
                setError("Failed to fetch image.");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to connect to server.");
        }
    }, [router]);

    useEffect(() => {
        // setMounted(true); // mark client mounted
        if (!(session?.user?.image)) {
            if (token) setUserData(parseToken(token));
            fetchImage();
        }
    }, [fetchImage, session]);


    return (
        <div className="w-full flex items-center justify-between p-4 text-white">
            {error && <ErroToaster message={error} />}
            <div className="flex items-center gap-3">
                <img
                    src={
                        imageSrc ||
                        session?.user?.image ||
                        "https://res.cloudinary.com/dzapdxkgc/image/upload/v1742595352/download_ykpnl5.png"
                    }
                    alt="Profile"
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border border-gray-500 object-cover"
                />
                <span className="text-xs sm:text-sm md:text-base lg:text-lg font-medium">
                    {`${userData.first_name || session?.user?.name || ""}`.trim()}
                </span>

            </div>
        </div>
    );
};

export default UserHeader;
