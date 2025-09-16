"use client";
import {
  Menubar,
  MenubarMenu,
} from "@/components/ui/menubar";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { CloseAlert } from "./closeAlert";
import { QrWithAlert } from "./qrWithAlert";
import { FcMultipleDevices } from "react-icons/fc";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CardContent } from "@/components/ui/card";
import DeviceManager from "./deviceManager";
import { useUserContext } from "../app/providers";
import UserHeader from "./headerProfile";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn } = useUserContext();

  // No need for setInterval – just check token once on mount
  useEffect(() => {
    const token = Cookies.get("jwt_token");
    if (!token || token === "undefined") {
      // could even update user context here instead of local state
      console.warn("No valid token found");
    }
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="flex-1 flex justify-between items-center relative gap-4 pl-2 bg-gradient-to-r from-slate-900 to-slate-800 max-h-[8vh]" />
    );
  }

  return (
    <div className="flex-1 flex justify-between items-center relative gap-4 pl-2 bg-gradient-to-r from-slate-900 to-slate-800 max-h-[8vh]">
      <div>
        <UserHeader />
      </div>

      <Menubar className="flex justify-end border-none shadow-none space-x-6 p-7 flex-shrink-0 bg-transparent text-white">
        <MenubarMenu>
          <QrWithAlert />
        </MenubarMenu>

        <MenubarMenu>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
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
          <CloseAlert />
        </MenubarMenu>
      </Menubar>
    </div>
  );
};

export default Header;
