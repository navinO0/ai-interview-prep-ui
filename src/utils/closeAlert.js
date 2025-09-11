"use client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import clearToken from "@/utils/removeToken"
import { signOut } from "next-auth/react";

export function CloseAlert() {
  const clearTokenBtn = () => {
    signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_HOST_QR}/login` });
    clearToken()
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-500 rounded-md">
          Logout
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[400px] rounded-lg bg-white shadow-lg p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold text-gray-800">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-600">
            Want to logout?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-end space-x-4">
          <AlertDialogCancel className="px-4 py-2 bg-gray-300 text-gray-700 hover:bg-gray-400 rounded-md">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={clearTokenBtn}
            className="px-6 py-2 bg-red-600 text-white hover:bg-red-500 rounded-md">
            Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}