"use client";

import { useState, useEffect } from "react";
import { Calendar, Home, Inbox, Search, Settings, Pencil, UserRoundPen } from "lucide-react";
import Cookies from "js-cookie";
import { useUserContext } from "../app/providers";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

// Menu items
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "White Board",
    url: "/white-board",
    icon: Pencil,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: UserRoundPen,
  },
];

export function AppSidebar() {
  const { isLoggedIn } = useUserContext();
  // useEffect(() => {
  //   const checkToken = () => {
  //     const token = Cookies.get("jwt_token");
  //     setVisible(!!token && token !== "undefined");
  //   };

  //   checkToken(); // Check token on mount

  //   const interval = setInterval(checkToken, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  if (!isLoggedIn) return null;
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarContent className="h-full bg-gray-800 text-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg text-gray-400 py-4 px-6">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="hover:bg-gray-700 rounded-md">
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2 px-6 py-2">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;