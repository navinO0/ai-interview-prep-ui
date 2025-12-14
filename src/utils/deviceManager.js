import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";
import { ScrollArea } from "@/components/ui/scroll-area"
import { IoLogOutOutline } from "react-icons/io5";
import { useEffect, useState, useCallback } from "react";
import { useApi } from "./useApi";
import { getDeviceInfo } from "./getDeviceInfo";
import { SlScreenDesktop } from "react-icons/sl";
import { CiMobile3 } from "react-icons/ci";
import { Loader } from "lucide-react";
import { useUserContext } from "../app/providers";




const DeviceManager = () => {
  const { setError, setSuccess } = useUserContext();
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(null);

  const { request } = useApi();

  const fetchData = useCallback(async () => {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      const { data, error, response } = await request('/user/get/devices', {}, true);
    if (!error && data?.data?.devices) {
        setSuccess(data.message);
        setDevices(data.data.devices);
        setIsLoading(false);
        
      } else {
        setIsLoading(false);
        console.error("Failed to fetch devices", error);
        setError(error);
      }
    }, [request, setError, setSuccess]);

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      const info = await getDeviceInfo();
      setDeviceInfo(info);
    }
    fetchDeviceInfo();
    fetchData();
  }, [fetchData]);


  const handleLogout = async (fingerprint, remove_all_devices = false) => {
    setError(null);
    setSuccess(null);
    const { error, response, data } = await request('/user/delete/devices', {
      method: "POST", body: {
        is_remove_all_devices: remove_all_devices,
        device_fingerprint: fingerprint
      }
    }, true);
    // fetchData();
    setSuccess(data.data.message);
    setTimeout(fetchData, 3000);
    if (error) {
      console.error("Failed to logout", error);
      setError(error);
    }
  }

  return (
    <div>
      <div className="mw-100">
        <ScrollArea className="h-60 w-80 p-2">
          {isLoading ? <> {<div className=" h-60 w-80 p-2  flex items-center justify-center flex-col">
            <Loader />
          </div>} </> : <> {
            devices.map((device, index) => {
              const onClickLogout = () => {
                handleLogout(device.fingerprint);
              }
              return (<div key={index}>
                <div>
                  {device.deviceType === "desktop" ? <SlScreenDesktop fontSize={25} /> : <CiMobile3 fontSize={25} />}
                  <div className="flex align-center justify-between gap-2">
                    <>
                      <p className="text-muted-foreground text-sm">
                        {device.browser + " - " + device.os}
                        <p>{device.city}</p>
                        {deviceInfo?.fingerprint === device.fingerprint ? <p className="text-sm text-green-500 text-[12px] [text-shadow:0_0_8px_#22c55e]">This device</p> : ""}
                      </p>
                    </>
                    <IoLogOutOutline className="text-red-500 cursor-pointer text-[25px] [text-shadow:0_0_8px_#22c55e" onClick={onClickLogout} />
                  </div>
                </div>
                <Separator className={cn(
                  " mt-3 bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px"
                )} />
              </div>)
            })
          }
            <p 
              className="mt-2 text-center text-md transition-all duration-300 text-muted-foreground hover:text-red-500 hover:[text-shadow:0_0_8px_#ef4444] cursor-pointer"
              onClick={() => handleLogout(null, true)}
            >
              logout from all the devices
            </p>
          </>}
          {/* <h4 className="text-sm leading-none font-medium">Radix Primitives</h4>
        <p className="text-muted-foreground text-sm">
          An open-source UI component library.
        </p> */}
        </ScrollArea>
      </div>
    </div>
  )
};

export default DeviceManager