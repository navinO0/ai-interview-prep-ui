"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import loginWithCodeFunc from "@/utils/loginWithCodeFunc";
import { encryptObjectValues } from "@/utils/crypto-utils";
import MiniLoader from "@/utils/miniLoader";
import ErroToaster from "@/utils/errorToaster";
import { useSession, signIn, signOut } from "next-auth/react";
import { getDeviceInfo } from "@/utils/getDeviceInfo";
import { useUserContext } from "../app/providers";


export function LoginForm({ className, ...props }) {
  const [deviceInfo, setDeviceInfo] = useState(null);
  const router = useRouter();
  const { data: session } = useSession();
  const { setIsLoggedIn } = useUserContext();

  useEffect(() => {
    async function fetchData() {
      const token = Cookies.get("jwt_token");
      if (!token && session) {
       signOut()
      }
    }
    fetchData();
     const fetchDeviceInfo = async () => {
          const info = await getDeviceInfo();
          setDeviceInfo(info);
        };
    
        fetchDeviceInfo();
  }, [router]);
  async function handleEncrypt(data) {
    return await encryptObjectValues(data, ['username', 'password']);
  }

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isLoading1, setIsLoading1] = useState(false);
  const [error1, setError1] = useState(null);

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
      loginCode: ""
    },
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    setError(null);
    const { loginCode, username, password } = values;
    if (loginCode) {
      const logi = await loginWithCodeFunc(loginCode);
      if (logi !== true) {
        setError1(logi)
      }
      router.push("/")
    }
    const encryptedData = await handleEncrypt({ username, password },);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST || "http://127.0.0.1:3000"}/user/public/login`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...encryptedData,
          device_info : deviceInfo,
        }),
      });

      if (response.ok) {
        const resp = await response.json();
        const token = resp.data.token;
        if (!token || token === 'undefined' || token === 'null' || token === undefined) {
          setError(resp.message || 'An error occurred while logging in.');
          return
        }
        Cookies.set('jwt_token', token, { expires: 1 });
        setIsLoggedIn(true);
        router.push('/');
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
  };

  const codeSubmit = async (values) => {
    setIsLoading1(true);
    setError1(null);
    const { loginCode } = values;
    try {
      if (loginCode) {
        const logi = await loginWithCodeFunc(loginCode);
        if (!logi.status || logi.status === 'false') {
          setError1(logi.message)
          return
        }
        router.push("/")
      }
    } catch (error) {
      setError1('Failed to connect to the server.');
      console.error('Login failed:', error);
    } finally {
      setIsLoading1(false);
    }
  };

 
    const handleLogin = async () => {
      const res = await signIn("google");
      if (res?.error) {
        console.error("Login failed", res.error);
      }
      else {
        Cookies.set("jwt_token", session?.user?.token || null , { expires: 7 });
      }
  };
  
  const enableNextAuth = process.env.NEXT_PUBLIC_AUTH_ENABLE === "true" || false; 

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
  <Card className="overflow-hidden p-0">
    <CardContent className="grid p-0 md:grid-cols-2">
      <form className="p-6 md:p-8 bg-slate-900 text-white" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-muted-foreground text-gray-400">
              Login to your account
            </p>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="username" className="text-white">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Username"
              {...form.register("username")}
              required
              className="bg-slate-800 text-white border border-slate-600 placeholder-gray-500"
            />
          </div>
          <div className="grid gap-3">
            <div className="flex items-center">
              <Label htmlFor="password" className="text-white">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="********"
              {...form.register("password")}
              required
              className="bg-slate-800 text-white border border-slate-600 placeholder-gray-500"
            />
          </div>
          <Button type="submit" className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
            {isLoading ? <MiniLoader /> : "Login"}
          </Button>
          <ErroToaster message={error} />
          <div className="text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <a href="/register" className="underline underline-offset-4 text-blue-400">
              Sign up
            </a>
              </div>
              {enableNextAuth && <div className="flex flex-col gap-6">
            {!session ? (
              <Button onClick={handleLogin} className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700">
                Sign in with Google
              </Button>
            ) : (
              <div>
                <Button onClick={() => signOut()} className="w-full cursor-pointer bg-red-600 hover:bg-red-700">
                  Logout
                </Button>
              </div>
            )}
          </div>}
        </div>
      </form>
      <div className="bg-slate-800 relative hidden md:block flex flex-col justify-center items-center border-l border-slate-700 login-cide-container">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <img
            src={"https://res.cloudinary.com/dzapdxkgc/image/upload/v1742718635/Login-cuate_apeayk.png"}
            alt="Profile Image"
            className="w-full h-full object-cover"
          />
          <Label htmlFor="picture" className="text-white">Have a code ?</Label>
          <Input
            id="loginCode"
            type="text"
            placeholder="********"
            {...form.register("loginCode")}
            required
            className="bg-slate-800 text-white border border-slate-600 placeholder-gray-500"
          />

          <Button type="button" onClick={form.handleSubmit(codeSubmit)} className="w-full cursor-pointer bg-green-600 hover:bg-green-700" disabled={isLoading1}>
            {isLoading1 ? <MiniLoader /> : "Submit"}
          </Button>
          <ErroToaster message={error1} />
        </div>
      </div>
    </CardContent>
  </Card>
</div>

  );
}
