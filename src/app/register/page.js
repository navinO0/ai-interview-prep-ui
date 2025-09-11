"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "@/components/ui/input";
import { React, useState } from "react";
import { encryptObjectValues } from "@/utils/crypto-utils";
import { router, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import ErroToaster from "@/utils/errorToaster";
import MiniLoader from "@/utils/miniLoader";
import { getDeviceInfo } from "@/utils/getDeviceInfo";



const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null)
  const formSchema = z.object({
    username: z.string().min(2).max(50),
    password: z.string().min(6),
    email: z.string().email(),
    mobile: z.string().min(10).max(15),
    first_name: z.string().min(1),
    middle_name: z.string().optional(),
    last_name: z.string().optional(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      mobile: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      profile_picture: z.optional(),
    },
  });
  const handleFileChange = (event) => {
    setError(null);
    const file = event.target.files[0];

    if (!file) return;


    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPEG, PNG, and WEBP formats are allowed.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("File size must be less than 2MB.");
      return;
    }

    setError(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setProfilePicture(reader.result);
    };

    reader.onerror = () => {
      setError("Failed to read file. Please try again.");
    };
  };

  const router = useRouter();


  async function onSubmit(values) {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    const requestData = {
      username: values.username,
      password: values.password,
      email: values.email,
      mobile: values.mobile,
      first_name: values.first_name,
      middle_name: values.middle_name || "",
      last_name: values.last_name,
      profile_photo: profilePicture,
      device_info: await getDeviceInfo(),
    };

    const encData = await encryptObjectValues(requestData, ['username', 'email', 'mobile', 'first_name', 'middle_name', "password", 'last_name']);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST || "http://127.0.0.1:3000"}/user/public/create`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(encData),
      });
      const resp = await response.json();

      if (response.ok) {
        const token = resp?.data?.token;

        if (!token || token === "undefined") {
          setError(resp.message || "Invalid token received");
          return { status: false, message: resp.message };
        }
        if(!token || token === "null" || token === undefined) {
           Cookies.set('jwt_token', token, { expires: 1 });
        }
       
        setSuccessMessage('User registered successfully!');
        router.push("/");
      } else {
        setError(resp.message || 'Something went wrong');
      }
    } catch (error) {
      setError(`An error occurred while trying to register: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  }
  const redirectToLogin = () => {
    router.push("/login");
  }

  const handleFileBlur = () => {
    setError(null);
  };


  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-slate-900 p-6 md:p-10">

      <div className="max-w-3xl mx-auto p-8 bg-slate-800 rounded-lg shadow-lg space-y-6">
        <h2 className="text-3xl font-semibold text-center text-white mb-8">User Registration</h2>

        {successMessage && (
          <div className="">
            <ErroToaster message={successMessage} success={true} />
          </div>
        )}

        {error && (
          <div className="">
            <ErroToaster message={error} />
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Username<span className="text-red-500 font-bold">*</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Username"
                        className="w-full p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-slate-700"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Password<span className="text-red-500 font-bold">*</span></FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-slate-700"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email<span className="text-red-500 font-bold">*</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email"
                        className="w-full p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-slate-700"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Mobile<span className="text-red-500 font-bold">*</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Mobile"
                        className="w-full p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-slate-700"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">First Name<span className="text-red-500 font-bold">*</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="First Name"
                        className="w-full p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-slate-700"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="middle_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Middle Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Middle Name"
                        className="w-full p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-slate-700"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Last Name"
                        className="w-full p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-slate-700"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="profile_picture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Profile Picture</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onClick={handleFileBlur}
                        onChange={handleFileChange}
                        className="bg-slate-700 text-white"
                      />
                    </FormControl>
                    <FormLabel className="text-gray-500 opacity-50 mt-2">*Image size should not exceed 2MB</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full py-3 mt-6 text-white bg-black hover:bg-gray-600 rounded-md focus:outline-none cursor-pointer"
              disabled={loading}
            >
              {loading ? <MiniLoader text='Registering...' /> : 'Register'}
            </Button>
          </form>
        </Form>

        <Button
          className="w-full py-3 mt-0 text-white bg-black hover:bg-gray-600 rounded-md focus:outline-none cursor-pointer"
          onClick={redirectToLogin}
        >
          Already Registered? Login
        </Button>
      </div>
    </div>

  );
};

export default Register;
