"use client";
import {
  Menubar,
  MenubarMenu,
} from "@/components/ui/menubar";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { CloseAlert } from "./closeAlert";
import { QrWithAlert } from "./qrWithAlert";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { FcMultipleDevices } from "react-icons/fc";
import { PopoverDemo } from "./popover";
// import ChatUI from "./chatUi";
// import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
// import { CardContent, Popover } from "@mui/material";
// import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import DeviceManager from "./deviceManager";
import { useUserContext } from "../app/providers";
import UserHeader from "./headerProfile";

const Header = () => {
  const [visible, setVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
 const { isLoggedIn } = useUserContext();
  useEffect(() => {
    const checkToken = () => {
      const token = Cookies.get("jwt_token");
      setVisible(!!token && token !== "undefined");
    };

    checkToken(); 

    const interval = setInterval(checkToken, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!isLoggedIn) return (
    <div className="flex-1 flex justify-between items-center relative gap-4 pl-2 bg-gradient-to-r from-slate-900 to-slate-800"></div>
  );

  const handleOpenChange = () => setIsOpen(() => !isOpen);

  return (
    <div className="flex-1 flex justify-between items-center relative gap-4 pl-2 bg-gradient-to-r from-slate-900 to-slate-800">
      {/* <h1 className="text-3xl md:text-4xl  text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 ml-5 drop-shadow-lg tracking-tight">
  Hello User 👋
</h1> */}
      {/* <div>
        <UserHeader />
        </div> */}

      <Menubar className="flex justify-end border-none shadow-none space-x-6 p-7 border-b flex-shrink-0 bg-transparent text-white">
        <MenubarMenu>
          <QrWithAlert />
        </MenubarMenu>
        <MenubarMenu>
          <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
              <div className="relative cursor-pointer">
                <span className="text-black cursor-pointer">
                  <FcMultipleDevices fontSize={30} />
                </span>
              </div>
            </PopoverTrigger>

            <PopoverContent
              side="top"
              align="end"
              className="!bg-white !shadow-none !border-none !p-0 !m-0 w-auto h-auto"
            >
              <div className="flex p-1 my-1 w-full justify-start">
                <div className="relative flex flex-col items-center justify-center max-w-full self-center">
                  <p className="flex w-full text-[10px] font-semibold text-gray-500 justify-center">
                    Manage Devices
                  </p>
                  <div className="rounded-lg p-0 min-w-[100px] text-sm break-words relative">
                    <CardContent className="p-2 flex flex-col gap-1">
                      <DeviceManager />
                    </CardContent>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

        </MenubarMenu>
        <MenubarMenu>
          {/* Close Alert Button */}
          <CloseAlert />
        </MenubarMenu>
      </Menubar>
    </div>
  );
};

export default Header;
