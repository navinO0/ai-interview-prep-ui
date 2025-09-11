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

import React from 'react';
import Qr_gen from './qr_generator';
import QrLoader from "./qrLoader";
import ErroToaster from "./errorToaster";


const Qr_component = (props) => {
    const roomId = props.roomId || "sampleRoom123"
    return (
        <div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <span className="cursor-pointer flex items-end gap-2 justify-end text-white">
                        <MdOutlineQrCode2 />
                        <span className="hidden md:inline">Colloborate</span>
                    </span>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    {/* Timer Display */}
                    <AlertDialogHeader>
                        <AlertDialogTitle>Scan to collaborat</AlertDialogTitle>
                        <AlertDialogDescription>
                            <span className="content w-full h-full flex flex-col items-center justify-center">

                                <Qr_gen qr_link={{ link: `${process.env.NEXT_PUBLIC_HOST_QR || hostName}/white-board/${roomId}` }} />

                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction>Close</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default Qr_component