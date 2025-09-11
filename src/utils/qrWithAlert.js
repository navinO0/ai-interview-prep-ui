'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { MdOutlineQrCode2 } from "react-icons/md";
import { Button } from "@/components/ui/button"
import Cookies from "js-cookie"
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Qr_gen from './qr_generator';
import clearToken from "./removeToken";
import os from "os";
import QrLoader from "./qrLoader";
import ErroToaster from "./errorToaster";
import { useRouter } from "next/navigation";

const QRTimerInMints = process.env.NEXT_PUBLIC_QR_TIMER || 1;

function getHost(req = null) {
  if (typeof window !== "undefined") {
    // Client-side: Get the protocol and hostname
    return `${window.location.protocol}//${window.location.host}`;
  } else {
    // Server-side: Get VM IP
    const networkInterfaces = os.networkInterfaces();
    let vmIP = "127.0.0.1"; // Default localhost

    // Loop through network interfaces to find the first valid non-internal IP
    for (const interfaceKey in networkInterfaces) {
      for (const net of networkInterfaces[interfaceKey]) {
        if (!net.internal && net.family === "IPv4") {
          vmIP = net.address;
          break;
        }
      }
    }

    // If Next.js API request is provided, use request host
    const host = req?.headers?.host || `${vmIP}:3000`;
    return `http://${host}`;
  }
}

export function QrWithAlert() {
  const [isLoading, setIsLoading] = useState(false);
  const [qrLoginCode, setQrLoginCode] = useState('');
  const [error, setError] = useState(null);
  const [hostName, setHost] = useState(getHost());
  const router = useRouter();

  const [timeLeft, setTimeLeft] = useState(QRTimerInMints * 60);
  const [isTimerExpired, setIsTimerExpired] = useState(false);


  const timerRef = useRef(null);


  const fetchQrCode = useCallback(async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setIsLoading(true);
    const token = Cookies.get('jwt_token');

    setTimeLeft(QRTimerInMints * 60);
    setIsTimerExpired(false);

    if (!token || token === 'undefined') {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST || "http://127.0.0.1:3000"}/user/get/code`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ token: token }),
      });

      if (response.status === 401) {
        Cookies.remove('jwt_token');
        router.push("/session-expired");
        // clearToken()
      }
      if (response.ok) {
        const resp = await response.json();
        const loginCode = resp.data.code;
        if (!loginCode || loginCode === 'undefined') {
          setError('No login code found');
          setIsLoading(false);
          return;
        }
        setQrLoginCode(loginCode);

        timerRef.current = setInterval(() => {
          setTimeLeft((prevTime) => {
            if (prevTime <= 0) {
              clearInterval(timerRef.current);
              setIsTimerExpired(true);
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'An error occurred while logging in.');
      }
    } catch (error) {
      setError('Failed to connect to the server.');
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleOpenModal = () => {
    fetchQrCode();
  };


  const formatTimeLeft = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };


  const handleRefresh = () => {
    setTimeLeft(QRTimerInMints * 60);
    setIsTimerExpired(false);
    fetchQrCode();
  };

  const handleCloseModal = () => {
    clearInterval(timerRef.current);
  };

  const host = getHost();


  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <span
          onClick={handleOpenModal}
          className="cursor-pointer flex items-center justify-center space-x-2 text-white hover:text-gray-200 transition-all"
        >
          <span className="hidden md:inline">Scan to add device</span>
          {/* <img
            alt="Scan QR Code"
            src="https://res.cloudinary.com/dzapdxkgc/image/upload/v1742564270/qrcode-scan-svgrepo-com_lcxjjd.svg"
            className="h-7 w-7"
                    /> */}
          <MdOutlineQrCode2 className="h-7 w-7" />
        </span>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-slate-900 text-white rounded-xl shadow-xl p-6 space-y-4 max-w-lg mx-auto">
        {/* Timer Display */}
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl text-center">Scan to add device</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-gray-400">
            <div className="flex flex-col items-center justify-center space-y-4">
              {isLoading ? (
                <QrLoader /> // Loader when QR is being generated or fetched
              ) : error ? (
                <ErroToaster message={error} /> // Show error message if there is any
              ) : (
                qrLoginCode && (
                  <Qr_gen
                    qr_link={{
                      link: `${process.env.NEXT_PUBLIC_HOST_QR || hostName}/login/${qrLoginCode}`,
                      code: qrLoginCode,
                      time: timeLeft,
                    }}
                  />
                )
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex justify-between">
          {/* Show refresh button if timer has expired */}
          {isTimerExpired && (
            <Button
              onClick={handleRefresh}
              className="bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
            >
              Refresh
            </Button>
          )}
          <AlertDialogAction
            onClick={handleCloseModal}
            className="bg-red-600 hover:bg-red-700 transition-colors duration-300"
          >
            Close
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
