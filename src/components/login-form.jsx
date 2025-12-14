"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MiniLoader from "@/utils/miniLoader";
import ErroToaster from "@/utils/errorToaster";
import { useSession, signIn, signOut } from "next-auth/react";
import { useUserContext } from "../app/providers";
import { useAuth } from "../../../server/user-management-ui"; // Using submodule

export function LoginForm({ className, ...props }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { setIsLoggedIn } = useUserContext();
  const { login, loginWithCode, loginWithGoogle, isAuthenticated, loading: authLoading, error: authError } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [codeError, setCodeError] = useState(null);

  useEffect(() => {
    if (isAuthenticated()) {
      setIsLoggedIn(true);
      router.push("/");
    } else if (session && !isAuthenticated()) {
      // If we have a session but no token, we might need to sync with backend
       // Or handle session logout if token is invalid
       // For now, let's leave as is or sign out
       // signOut(); // Logic from original
    }
  }, [isAuthenticated, router, session, setIsLoggedIn]);

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
    setCodeError(null);
    const { loginCode, username, password } = values;

    try {
      if (loginCode) {
        // QR Code Login
        const result = await loginWithCode(loginCode, process.env.NEXT_PUBLIC_HOST_QR || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3000");
        if (result.success) {
           setIsLoggedIn(true);
           router.push("/");
           return;
        } else {
           setCodeError(result.message);
        }
      }

      if (username && password) {
         // Standard Login
         const result = await login(
             username, 
             password, 
             process.env.NEXT_PUBLIC_HOST_QR || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3000"
         );

         if (result.success) {
            setIsLoggedIn(true);
            router.push("/");
         } else {
            setError(result.message);
         }
      }
    } catch (error) {
       setError("An unexpected error occurred");
    } finally {
       setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await signIn("google");
      
      if (res?.error) {
        setError("Google sign-in failed");
        return;
      }
      
      // Wait a bit for session to be available
      setTimeout(async () => {
        if (session?.user) {
            const result = await loginWithGoogle({
                email: session.user.email,
                name: session.user.name,
                google_id: session.user.id
            }, process.env.NEXT_PUBLIC_HOST_QR || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3000");

            if (result.success) {
                setIsLoggedIn(true);
                router.push('/');
            } else {
                setError(result.message || "Backend authentication failed");
            }
        }
      }, 1000);
    } catch (error) {
      console.error("Google login error:", error);
      setError("Google sign-in failed");
    }
  };
  
  const enableNextAuth = process.env.NEXT_PUBLIC_AUTH_ENABLE === "true" || false; 

  return (
    <div className={cn("flex flex-col gap-6 animate-fadeIn", className)} {...props}>
  <Card className="overflow-hidden p-0 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">
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
              className="bg-slate-800 text-white border border-slate-600 placeholder-gray-500 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:scale-[1.02]"
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
              className="bg-slate-800 text-white border border-slate-600 placeholder-gray-500 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:scale-[1.02]"
            />
          </div>
          <Button type="submit" className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50" disabled={isLoading || authLoading}>
            {isLoading || authLoading ? <MiniLoader /> : "Login"}
          </Button>
          <ErroToaster message={error || authError} />
          <div className="text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <a href="/register" className="underline underline-offset-4 text-blue-400">
              Sign up
            </a>
              </div>
              {enableNextAuth && <div className="flex flex-col gap-6">
            {!session ? (
              <Button type="button" onClick={handleGoogleLogin} className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700">
                Sign in with Google
              </Button>
            ) : (
              <div>
                <Button type="button" onClick={() => signOut()} className="w-full cursor-pointer bg-red-600 hover:bg-red-700">
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
          <Label htmlFor="loginCode" className="text-white">Have a code ?</Label>
          <Input
            id="loginCode"
            type="text"
            placeholder="Enter Code"
            {...form.register("loginCode")}
            className="bg-slate-800 text-white border border-slate-600 placeholder-gray-500"
          />

          <Button type="button" onClick={form.handleSubmit(onSubmit)} className="w-full cursor-pointer bg-green-600 hover:bg-green-700" disabled={isLoading || authLoading}>
            {isLoading || authLoading ? <MiniLoader /> : "Submit Code"}
          </Button>
          <ErroToaster message={codeError} />
        </div>
      </div>
    </CardContent>
  </Card>
</div>
  );
}
